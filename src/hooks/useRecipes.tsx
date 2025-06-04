
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../integrations/supabase/client';
import { useToast } from './use-toast';

// Move interface and helper function outside the hook
export interface SupabaseRecipe {
  id: string;
  name: string;
  description: string;
  full_description?: string;
  image: string;
  rating: number;
  reviews: number;
  medium_price: number;
  large_price: number;
  ingredients: string[];
  cooking_time?: string;
  spice_level: 'Mild' | 'Medium' | 'Hot';
  created_at: string;
  updated_at: string;
}

const toSupabaseRecipe = (recipe: any): SupabaseRecipe => {
  let spiceLevel: 'Mild' | 'Medium' | 'Hot' = 'Medium';
  const spiceInput = (recipe.spice_level || '').toString().trim().toLowerCase();
  
  if (spiceInput === 'hot') spiceLevel = 'Hot';
  else if (spiceInput === 'mild') spiceLevel = 'Mild';

  let ingredients: string[] = [];
  if (Array.isArray(recipe.ingredients)) {
    ingredients = recipe.ingredients.map((i: any) => i.toString());
  } else if (typeof recipe.ingredients === 'string') {
    try {
      ingredients = JSON.parse(recipe.ingredients);
    } catch {
      ingredients = [recipe.ingredients];
    }
  }

  const parseNumber = (value: any, defaultValue: number = 0): number => {
    if (typeof value === 'number') return value;
    const num = parseFloat(value);
    return isNaN(num) ? defaultValue : num;
  };

  return {
    id: recipe.id?.toString() || '',
    name: recipe.name?.toString() || 'Unnamed Recipe',
    description: recipe.description?.toString() || '',
    full_description: recipe.full_description?.toString(),
    image: recipe.image?.toString() || '',
    rating: parseNumber(recipe.rating, 4.5),
    reviews: parseNumber(recipe.reviews, 0),
    medium_price: parseNumber(recipe.medium_price),
    large_price: parseNumber(recipe.large_price),
    ingredients,
    cooking_time: recipe.cooking_time?.toString(),
    spice_level: spiceLevel,
    created_at: recipe.created_at?.toString() || new Date().toISOString(),
    updated_at: recipe.updated_at?.toString() || new Date().toISOString(),
  };
};

// Cache management
const CACHE_KEY = 'recipes_cache';
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

interface CacheData {
  recipes: SupabaseRecipe[];
  timestamp: number;
}

const getCachedRecipes = (): SupabaseRecipe[] | null => {
  try {
    const cached = localStorage.getItem(CACHE_KEY);
    if (!cached) return null;
    
    const data: CacheData = JSON.parse(cached);
    const isExpired = Date.now() - data.timestamp > CACHE_DURATION;
    
    if (isExpired) {
      localStorage.removeItem(CACHE_KEY);
      return null;
    }
    
    return data.recipes;
  } catch {
    localStorage.removeItem(CACHE_KEY);
    return null;
  }
};

const setCachedRecipes = (recipes: SupabaseRecipe[]) => {
  try {
    const data: CacheData = {
      recipes,
      timestamp: Date.now()
    };
    localStorage.setItem(CACHE_KEY, JSON.stringify(data));
  } catch (error) {
    console.warn('Failed to cache recipes:', error);
  }
};

// Main hook function
export const useRecipes = () => {
  const [recipes, setRecipes] = useState<SupabaseRecipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasInitialLoad, setHasInitialLoad] = useState(false);
  const { toast } = useToast();

  // Load cached recipes immediately
  useEffect(() => {
    const cached = getCachedRecipes();
    if (cached && cached.length > 0) {
      console.log('Loading recipes from cache');
      setRecipes(cached);
      setLoading(false);
      setHasInitialLoad(true);
      // Still fetch fresh data in background
      fetchRecipes(true);
    } else {
      fetchRecipes();
    }
  }, []);

  const fetchRecipes = useCallback(async (isBackgroundUpdate = false) => {
    try {
      if (!isBackgroundUpdate) {
        setLoading(true);
      }
      console.log('Fetching recipes from Supabase...');
      
      // Optimized query - only fetch necessary fields initially
      const { data, error } = await supabase
        .from('recipes')
        .select(`
          id,
          name,
          description,
          image,
          rating,
          reviews,
          medium_price,
          large_price,
          spice_level,
          cooking_time,
          ingredients,
          created_at,
          updated_at
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      const processedRecipes = (data || []).map(toSupabaseRecipe);
      setRecipes(processedRecipes);
      setError(null);
      
      // Cache the results
      setCachedRecipes(processedRecipes);
      
      // Only show success toast for manual refreshes, not background updates
      if (!isBackgroundUpdate && hasInitialLoad) {
        toast({
          title: "Recipes updated",
          description: `Loaded ${processedRecipes.length} recipes`,
        });
      }
    } catch (err: any) {
      console.error('Error fetching recipes:', err);
      const errorMessage = err.message || 'Failed to load recipes';
      setError(errorMessage);
      
      // Only show error toast if we don't have cached data
      if (!hasInitialLoad) {
        toast({
          title: "Error",
          description: `Failed to load recipes: ${errorMessage}`,
          variant: "destructive"
        });
      }
    } finally {
      setLoading(false);
      setHasInitialLoad(true);
    }
  }, [toast, hasInitialLoad]);

  const addRecipe = useCallback(async (recipeData: Omit<SupabaseRecipe, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      console.log('Adding recipe:', recipeData);
      
      // Validate required fields
      if (!recipeData.name || !recipeData.description || !recipeData.image) {
        throw new Error('Name, description, and image are required');
      }
      
      if (!recipeData.medium_price || !recipeData.large_price) {
        throw new Error('Both medium and large prices are required');
      }
      
      const { data, error } = await supabase
        .from('recipes')
        .insert([{
          ...recipeData,
          ingredients: `{${recipeData.ingredients.join(',')}}`
        }])
        .select()
        .single();

      if (error) {
        console.error('Supabase insert error:', error);
        throw new Error(`Database error: ${error.message}`);
      }
      
      const newRecipe = toSupabaseRecipe(data);
      setRecipes(prev => [newRecipe, ...prev]);
      
      // Update cache
      const updatedRecipes = [newRecipe, ...recipes];
      setCachedRecipes(updatedRecipes);
      
      toast({
        title: "Success",
        description: "Recipe added successfully",
      });
      return { success: true, data: newRecipe };
    } catch (err) {
      console.error('Error adding recipe:', err);
      const errorMessage = err.message || 'Unknown error occurred';
      toast({
        title: "Error",
        description: `Failed to add recipe: ${errorMessage}`,
        variant: "destructive"
      });
      return { success: false, error: err };
    }
  }, [toast, recipes]);

  const updateRecipe = useCallback(async (id: string, recipeData: Partial<SupabaseRecipe>) => {
    try {
      const updateData = { ...recipeData };
      
      if (updateData.ingredients) {
        updateData.ingredients = `{${updateData.ingredients.join(',')}}`;
      }

      const { data, error } = await supabase
        .from('recipes')
        .update({ 
          ...updateData, 
          updated_at: new Date().toISOString() 
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      
      const updatedRecipe = toSupabaseRecipe(data);
      setRecipes(prev => prev.map(recipe => 
        recipe.id === id ? updatedRecipe : recipe
      ));
      
      // Update cache
      const updatedRecipes = recipes.map(recipe => 
        recipe.id === id ? updatedRecipe : recipe
      );
      setCachedRecipes(updatedRecipes);
      
      toast({
        title: "Success",
        description: "Recipe updated successfully",
      });
      return { success: true, data: updatedRecipe };
    } catch (err) {
      console.error('Error updating recipe:', err);
      const errorMessage = err.message || 'Unknown error occurred';
      toast({
        title: "Error",
        description: `Failed to update recipe: ${errorMessage}`,
        variant: "destructive"
      });
      return { success: false, error: err };
    }
  }, [toast, recipes]);

  const deleteRecipe = useCallback(async (id: string) => {
    try {
      console.log('Deleting recipe:', id);
      
      if (!id) {
        throw new Error('Recipe ID is required');
      }
      
      const { error } = await supabase
        .from('recipes')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Supabase delete error:', error);
        throw new Error(`Database error: ${error.message}`);
      }
      
      console.log('Recipe deleted successfully');
      setRecipes(prev => prev.filter(recipe => recipe.id !== id));
      
      // Update cache
      const updatedRecipes = recipes.filter(recipe => recipe.id !== id);
      setCachedRecipes(updatedRecipes);
      
      toast({
        title: "Success",
        description: "Recipe deleted successfully",
      });
      return { success: true };
    } catch (err: any) {
      console.error('Error deleting recipe:', err);
      const errorMessage = err.message || 'Unknown error occurred';
      toast({
        title: "Error",
        description: `Failed to delete recipe: ${errorMessage}`,
        variant: "destructive"
      });
      return { success: false, error: err };
    }
  }, [toast, recipes]);

  // Set up realtime subscription
  useEffect(() => {
    const channel = supabase
      .channel('recipes_changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'recipes' },
        (payload) => {
          console.log('Realtime update received:', payload);
          // Only fetch if we have initial data to avoid loading loops
          if (hasInitialLoad) {
            fetchRecipes(true);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchRecipes, hasInitialLoad]);

  // Return stable object reference
  return {
    recipes,
    loading: loading && !hasInitialLoad, // Don't show loading if we have cached data
    error,
    addRecipe,
    updateRecipe,
    deleteRecipe,
    refetch: () => fetchRecipes(false)
  };
};
