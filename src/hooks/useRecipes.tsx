import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../integrations/supabase/client';
import { useToast } from './use-toast';
import { SupabaseRecipe } from '../utils/recipeTypes';
import { getCachedRecipes, setCachedRecipes } from '../utils/recipeCache';
import { 
  fetchRecipesFromSupabase, 
  addRecipeToSupabase, 
  updateRecipeInSupabase, 
  deleteRecipeFromSupabase 
} from '../services/recipeService';

export type { SupabaseRecipe } from '../utils/recipeTypes';

export const useRecipes = () => {
  const [recipes, setRecipes] = useState<SupabaseRecipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasInitialLoad, setHasInitialLoad] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const cached = getCachedRecipes();
    if (cached && cached.length > 0) {
      console.log('Loading recipes from cache');
      setRecipes(cached);
      setLoading(false);
      setHasInitialLoad(true);
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
      
      const processedRecipes = await fetchRecipesFromSupabase();
      setRecipes(processedRecipes);
      setError(null);
      
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
      const newRecipe = await addRecipeToSupabase(recipeData);
      setRecipes(prev => [newRecipe, ...prev]);
      
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
      const updatedRecipe = await updateRecipeInSupabase(id, recipeData);
      setRecipes(prev => prev.map(recipe => 
        recipe.id === id ? updatedRecipe : recipe
      ));
      
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
      await deleteRecipeFromSupabase(id);
      setRecipes(prev => prev.filter(recipe => recipe.id !== id));
      
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

  useEffect(() => {
    const channel = supabase
      .channel('recipes_changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'recipes' },
        (payload) => {
          console.log('Realtime update received:', payload);
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

  return {
    recipes,
    loading: loading && !hasInitialLoad,
    error,
    addRecipe,
    updateRecipe,
    deleteRecipe,
    refetch: () => fetchRecipes(false)
  };
};
