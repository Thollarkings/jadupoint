
import { useState, useEffect } from 'react';
import { Recipe } from '../data/recipes';
import { supabase } from '../integrations/supabase/client';

interface UseRecipesOptimizedOptions {
  pageSize?: number;
  enableInfiniteScroll?: boolean;
}

export const useRecipesOptimized = (options: UseRecipesOptimizedOptions = {}) => {
  const { pageSize = 8, enableInfiniteScroll = true } = options;
  
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(0);

  // Load initial recipes
  useEffect(() => {
    loadRecipes(0, true);
  }, []);

  const loadRecipes = async (pageNum: number = 0, isInitial: boolean = false) => {
    try {
      if (isInitial) {
        setLoading(true);
        setError(null);
      }

      const from = pageNum * pageSize;
      const to = from + pageSize - 1;

      const { data, error: fetchError } = await supabase
        .from('recipes')
        .select('*')
        .order('created_at', { ascending: false })
        .range(from, to);

      if (fetchError) {
        throw fetchError;
      }

      const formattedRecipes: Recipe[] = (data || []).map(recipe => ({
        id: recipe.id,
        name: recipe.name,
        description: recipe.description,
        fullDescription: recipe.full_description || recipe.description,
        image: recipe.image,
        rating: recipe.rating || 4.5,
        reviews: recipe.reviews || 0,
        cookingTime: recipe.cooking_time || '30 min',
        spiceLevel: recipe.spice_level as 'Mild' | 'Medium' | 'Hot',
        ingredients: recipe.ingredients || [],
        prices: {
          medium: Number(recipe.medium_price),
          large: Number(recipe.large_price)
        }
      }));

      if (isInitial) {
        setRecipes(formattedRecipes);
      } else {
        setRecipes(prev => [...prev, ...formattedRecipes]);
      }

      // Check if there are more recipes
      setHasMore(formattedRecipes.length === pageSize);
      setPage(pageNum);

    } catch (err) {
      console.error('Error loading recipes:', err);
      setError('Failed to load recipes');
    } finally {
      if (isInitial) {
        setLoading(false);
      }
    }
  };

  const loadMore = () => {
    if (hasMore && !loading) {
      loadRecipes(page + 1, false);
    }
  };

  const refresh = () => {
    setPage(0);
    loadRecipes(0, true);
  };

  return {
    recipes,
    loading,
    error,
    hasMore,
    loadMore,
    refresh
  };
};
