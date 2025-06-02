
import { useState, useEffect } from 'react';
import { supabase } from '../integrations/supabase/client';
import { useToast } from './use-toast';

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

// Helper function to ensure spice_level is properly typed
const normalizeSpiceLevel = (spiceLevel: string): 'Mild' | 'Medium' | 'Hot' => {
  if (spiceLevel === 'Mild' || spiceLevel === 'Medium' || spiceLevel === 'Hot') {
    return spiceLevel;
  }
  return 'Medium'; // Default fallback
};

// Helper function to convert relative image paths to full URLs
const normalizeImageUrl = (imagePath: string): string => {
  // If it's already a full URL, return as is
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return imagePath;
  }
  
  // If it starts with /, it's already a proper path from root
  if (imagePath.startsWith('/')) {
    return imagePath;
  }
  
  // If it's a relative path without /, add / prefix
  return `/${imagePath}`;
};

// Helper function to convert raw Supabase data to typed recipe
const convertSupabaseRecipe = (rawRecipe: any): SupabaseRecipe => ({
  id: rawRecipe.id,
  name: rawRecipe.name,
  description: rawRecipe.description,
  full_description: rawRecipe.full_description,
  image: normalizeImageUrl(rawRecipe.image),
  rating: rawRecipe.rating || 4.5,
  reviews: rawRecipe.reviews || 0,
  medium_price: rawRecipe.medium_price,
  large_price: rawRecipe.large_price,
  ingredients: rawRecipe.ingredients || [],
  cooking_time: rawRecipe.cooking_time,
  spice_level: normalizeSpiceLevel(rawRecipe.spice_level),
  created_at: rawRecipe.created_at,
  updated_at: rawRecipe.updated_at,
});

export const useRecipes = () => {
  const [recipes, setRecipes] = useState<SupabaseRecipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  // Fetch recipes from Supabase (public access)
  const fetchRecipes = async () => {
    try {
      setLoading(true);
      console.log('Fetching recipes from Supabase...');
      
      const { data, error } = await supabase
        .from('recipes')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Supabase fetch error:', error);
        throw error;
      }
      
      console.log('Fetched recipes:', data);
      const typedRecipes = (data || []).map(convertSupabaseRecipe);
      setRecipes(typedRecipes);
      setError(null);
    } catch (err: any) {
      console.error('Error fetching recipes:', err);
      setError('Failed to load recipes');
      toast({
        title: "Error",
        description: "Failed to load recipes. Please check your connection.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  // Add new recipe
  const addRecipe = async (recipeData: Omit<SupabaseRecipe, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      console.log('Adding recipe:', recipeData);
      
      const { data, error } = await supabase
        .from('recipes')
        .insert([{
          name: recipeData.name,
          description: recipeData.description,
          full_description: recipeData.full_description,
          image: recipeData.image,
          rating: recipeData.rating,
          reviews: recipeData.reviews,
          medium_price: recipeData.medium_price,
          large_price: recipeData.large_price,
          ingredients: recipeData.ingredients,
          cooking_time: recipeData.cooking_time,
          spice_level: recipeData.spice_level
        }])
        .select()
        .single();

      if (error) {
        console.error('Supabase insert error:', error);
        throw error;
      }
      
      console.log('Recipe added successfully:', data);
      const typedRecipe = convertSupabaseRecipe(data);
      setRecipes(prev => [typedRecipe, ...prev]);
      toast({
        title: "Success",
        description: "Recipe added successfully",
      });
      return { success: true, data: typedRecipe };
    } catch (err: any) {
      console.error('Error adding recipe:', err);
      toast({
        title: "Error",
        description: `Failed to add recipe: ${err.message}`,
        variant: "destructive"
      });
      return { success: false, error: err };
    }
  };

  // Update recipe
  const updateRecipe = async (id: string, recipeData: Partial<SupabaseRecipe>) => {
    try {
      console.log('Updating recipe:', id, recipeData);
      
      const updateData = {
        ...recipeData,
        updated_at: new Date().toISOString()
      };
      
      // Remove id, created_at from update data if present
      delete updateData.id;
      delete updateData.created_at;
      
      const { data, error } = await supabase
        .from('recipes')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Supabase update error:', error);
        throw error;
      }
      
      if (!data) {
        throw new Error('No recipe found with the given ID');
      }
      
      console.log('Recipe updated successfully:', data);
      const typedRecipe = convertSupabaseRecipe(data);
      setRecipes(prev => prev.map(recipe => recipe.id === id ? typedRecipe : recipe));
      toast({
        title: "Success",
        description: "Recipe updated successfully",
      });
      return { success: true, data: typedRecipe };
    } catch (err: any) {
      console.error('Error updating recipe:', err);
      toast({
        title: "Error",
        description: `Failed to update recipe: ${err.message}`,
        variant: "destructive"
      });
      return { success: false, error: err };
    }
  };

  // Delete recipe
  const deleteRecipe = async (id: string) => {
    try {
      console.log('Deleting recipe:', id);
      
      const { error } = await supabase
        .from('recipes')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Supabase delete error:', error);
        throw error;
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
      toast({
        title: "Error",
        description: `Failed to delete recipe: ${err.message}`,
        variant: "destructive"
      });
      return { success: false, error: err };
    }
  };

  // Set up real-time subscription
  useEffect(() => {
    fetchRecipes();

    // Subscribe to real-time changes
    const channel = supabase
      .channel('recipes_changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'recipes' },
        (payload) => {
          console.log('Real-time update:', payload);
          // Refetch data when changes occur
          fetchRecipes();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

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
