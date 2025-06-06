
import { useEffect, useRef } from 'react';
import { Recipe } from '../data/recipes';
import RecipeCard from './RecipeCard';
import RecipeCardSkeleton from './RecipeCardSkeleton';
import { useRecipesOptimized } from '../hooks/useRecipesOptimized';

interface RecipeGridProps {
  onRecipeClick: (recipe: Recipe) => void;
}

const RecipeGrid = ({ onRecipeClick }: RecipeGridProps) => {
  const { recipes, loading, hasMore, loadMore } = useRecipesOptimized({
    pageSize: 8,
    enableInfiniteScroll: true
  });
  
  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  // Set up infinite scroll observer
  useEffect(() => {
    if (observerRef.current) {
      observerRef.current.disconnect();
    }

    observerRef.current = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loading) {
          loadMore();
        }
      },
      { threshold: 0.1 }
    );

    if (loadMoreRef.current) {
      observerRef.current.observe(loadMoreRef.current);
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [hasMore, loading, loadMore]);

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {recipes.map((recipe) => (
          <RecipeCard 
            key={recipe.id} 
            recipe={recipe} 
            onClick={onRecipeClick}
          />
        ))}
        
        {loading && (
          // Show skeleton cards while loading
          Array.from({ length: 4 }).map((_, index) => (
            <RecipeCardSkeleton key={`skeleton-${index}`} />
          ))
        )}
      </div>

      {/* Infinite scroll trigger */}
      {hasMore && !loading && (
        <div ref={loadMoreRef} className="h-10 flex items-center justify-center">
          <span className="text-gray-400">Loading more recipes...</span>
        </div>
      )}

      {!hasMore && recipes.length > 0 && (
        <div className="text-center py-8">
          <span className="text-gray-400">You've seen all our delicious recipes!</span>
        </div>
      )}
    </div>
  );
};

export default RecipeGrid;
