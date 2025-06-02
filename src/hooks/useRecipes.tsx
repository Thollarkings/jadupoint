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

// Main hook function
export const useRecipes = () => {
  const [recipes, setRecipes] = useState<SupabaseRecipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  // Memoize fetchRecipes to prevent unnecessary recreations
  const fetchRecipes = useCallback(async () => {
    try {
      setLoading(true);
      console.log('Fetching recipes from Supabase...');
      
      const { data, error } = await supabase
        .from('recipes')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      setRecipes((data || []).map(toSupabaseRecipe));
      setError(null);
    } catch (err: any) {
      console.error('Error fetching recipes:', err);
      const errorMessage = err.message || 'Failed to load recipes';
      setError(errorMessage);
      toast({
        title: "Error",
        description: `Failed to load recipes: ${errorMessage}`,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

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
      
      setRecipes(prev => [toSupabaseRecipe(data), ...prev]);
      toast({
        title: "Success",
        description: "Recipe added successfully",
      });
      return { success: true, data: toSupabaseRecipe(data) };
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
  }, [toast]);

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
      
      setRecipes(prev => prev.map(recipe => 
        recipe.id === id ? toSupabaseRecipe(data) : recipe
      ));
      toast({
        title: "Success",
        description: "Recipe updated successfully",
      });
      return { success: true, data: toSupabaseRecipe(data) };
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
  }, [toast]);

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
  }, [toast]);

  useEffect(() => {
    fetchRecipes();

    const channel = supabase
      .channel('recipes_changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'recipes' },
        () => fetchRecipes()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchRecipes]);

  // Return stable object reference
  return {
    recipes,
    loading,
    error,
    addRecipe,
    updateRecipe,
    deleteRecipe,
    refetch: fetchRecipes
  };
};