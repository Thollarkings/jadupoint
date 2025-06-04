
import { Skeleton } from './ui/skeleton';

const RecipeCardSkeleton = () => {
  return (
    <div className="glass-card p-4 animate-pulse">
      <div className="relative overflow-hidden rounded-lg mb-4">
        <Skeleton className="w-full h-48 bg-gray-700" />
        <div className="absolute top-2 right-2">
          <Skeleton className="w-12 h-6 bg-gray-600 rounded-full" />
        </div>
      </div>
      
      <Skeleton className="h-6 bg-gray-700 mb-2 w-3/4" />
      <Skeleton className="h-4 bg-gray-700 mb-3 w-full" />
      <Skeleton className="h-4 bg-gray-700 mb-3 w-2/3" />
      
      <div className="flex justify-between items-center mb-2">
        <Skeleton className="h-4 bg-gray-700 w-20" />
        <Skeleton className="h-4 bg-gray-700 w-16" />
      </div>
      
      <div className="flex gap-2">
        <Skeleton className="h-6 bg-gray-700 w-12 rounded-full" />
        <Skeleton className="h-6 bg-gray-700 w-16 rounded-full" />
      </div>
    </div>
  );
};

export default RecipeCardSkeleton;
