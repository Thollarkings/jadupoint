
import { Recipe } from '../data/recipes';

interface RecipeCardProps {
  recipe: Recipe;
  onClick: (recipe: Recipe) => void;
}

const RecipeCard = ({ recipe, onClick }: RecipeCardProps) => {
  return (
    <div 
      className="glass-card p-4 cursor-pointer hover:scale-105 transition-all duration-300 animate-fade-in group"
      onClick={() => onClick(recipe)}
    >
      <div className="relative overflow-hidden rounded-lg mb-4">
        <img 
          src={recipe.image} 
          alt={recipe.name}
          className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
        />
        <div className="absolute top-2 right-2 bg-black/50 backdrop-blur-sm rounded-full px-2 py-1">
          <span className="text-coral-400 font-semibold">★ {recipe.rating}</span>
        </div>
      </div>
      
      <h3 className="text-xl font-semibold text-white mb-2 group-hover:text-coral-400 transition-colors">
        {recipe.name}
      </h3>
      
      <p className="text-gray-400 text-sm mb-3 line-clamp-2">
        {recipe.description}
      </p>
      
      <div className="flex justify-between items-center">
        <div className="text-sm text-gray-500">
          {recipe.reviews} reviews
        </div>
        <div className="text-coral-400 font-bold">
          ${recipe.prices.medium}+
        </div>
      </div>
      
      <div className="mt-2 flex gap-2">
        <span className={`text-xs px-2 py-1 rounded-full ${
          recipe.spiceLevel === 'Mild' ? 'bg-green-500/20 text-green-400' :
          recipe.spiceLevel === 'Medium' ? 'bg-yellow-500/20 text-yellow-400' :
          'bg-red-500/20 text-red-400'
        }`}>
          {recipe.spiceLevel}
        </span>
        <span className="text-xs px-2 py-1 rounded-full bg-blue-500/20 text-blue-400">
          {recipe.cookingTime}
        </span>
      </div>
    </div>
  );
};

export default RecipeCard;
