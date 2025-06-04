
import { SupabaseRecipe } from './recipeTypes';

const CACHE_KEY = 'recipes_cache';
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

interface CacheData {
  recipes: SupabaseRecipe[];
  timestamp: number;
}

export const getCachedRecipes = (): SupabaseRecipe[] | null => {
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

export const setCachedRecipes = (recipes: SupabaseRecipe[]) => {
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
