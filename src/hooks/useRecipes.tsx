
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

// Helper function to convert raw Supabase data to typed recipe
const convertSupabaseRecipe = (rawRecipe: any): SupabaseRecipe => ({
  id: rawRecipe.id,
  name: rawRecipe.name,
  description: rawRecipe.description,
  full_description: rawRecipe.full_description,
  image: rawRecipe.image,
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

  // Fetch recipes from Supabase
  const fetchRecipes = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('recipes')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      const typedRecipes = (data || []).map(convertSupabaseRecipe);
      setRecipes(typedRecipes);
      setError(null);
    } catch (err) {
      console.error('Error fetching recipes:', err);
      setError('Failed to load recipes');
      toast({
        title: "Error",
        description: "Failed to load recipes",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  // Add new recipe
  const addRecipe = async (recipeData: Omit<SupabaseRecipe, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data, error } = await supabase
        .from('recipes')
        .insert([recipeData])
        .select()
        .single();

      if (error) throw error;
      
      const typedRecipe = convertSupabaseRecipe(data);
      setRecipes(prev => [typedRecipe, ...prev]);
      toast({
        title: "Success",
        description: "Recipe added successfully",
      });
      return { success: true, data: typedRecipe };
    } catch (err) {
      console.error('Error adding recipe:', err);
      toast({
        title: "Error",
        description: "Failed to add recipe",
        variant: "destructive"
      });
      return { success: false, error: err };
    }
  };

  // Update recipe
  const updateRecipe = async (id: string, recipeData: Partial<SupabaseRecipe>) => {
    try {
      const { data, error } = await supabase
        .from('recipes')
        .update({ ...recipeData, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      
      const typedRecipe = convertSupabaseRecipe(data);
      setRecipes(prev => prev.map(recipe => recipe.id === id ? typedRecipe : recipe));
      toast({
        title: "Success",
        description: "Recipe updated successfully",
      });
      return { success: true, data: typedRecipe };
    } catch (err) {
      console.error('Error updating recipe:', err);
      toast({
        title: "Error",
        description: "Failed to update recipe",
        variant: "destructive"
      });
      return { success: false, error: err };
    }
  };

  // Delete recipe
  const deleteRecipe = async (id: string) => {
    try {
      const { error } = await supabase
        .from('recipes')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      setRecipes(prev => prev.filter(recipe => recipe.id !== id));
      toast({
        title: "Success",
        description: "Recipe deleted successfully",
      });
      return { success: true };
    } catch (err) {
      console.error('Error deleting recipe:', err);
      toast({
        title: "Error",
        description: "Failed to delete recipe",
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
