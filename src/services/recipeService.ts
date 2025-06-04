
import { supabase } from '../integrations/supabase/client';
import { SupabaseRecipe, toSupabaseRecipe } from '../utils/recipeTypes';
import { setCachedRecipes } from '../utils/recipeCache';

export const fetchRecipesFromSupabase = async (): Promise<SupabaseRecipe[]> => {
  console.log('Fetching recipes from Supabase...');
  
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
  setCachedRecipes(processedRecipes);
  
  return processedRecipes;
};

export const addRecipeToSupabase = async (recipeData: Omit<SupabaseRecipe, 'id' | 'created_at' | 'updated_at'>) => {
  console.log('Adding recipe:', recipeData);
  
  if (!recipeData.name || !recipeData.description || !recipeData.image) {
    throw new Error('Name, description, and image are required');
  }
  
  if (!recipeData.medium_price || !recipeData.large_price) {
    throw new Error('Both medium and large prices are required');
  }
  
  const { data, error } = await supabase
    .from('recipes')
    .insert({
      ...recipeData,
      ingredients: recipeData.ingredients
    })
    .select()
    .single();

  if (error) {
    console.error('Supabase insert error:', error);
    throw new Error(`Database error: ${error.message}`);
  }
  
  return toSupabaseRecipe(data);
};

export const updateRecipeInSupabase = async (id: string, recipeData: Partial<SupabaseRecipe>) => {
  const updateData = { ...recipeData };

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
  
  return toSupabaseRecipe(data);
};

export const deleteRecipeFromSupabase = async (id: string) => {
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
};
