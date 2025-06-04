
import { useState } from 'react';
import { Recipe } from '../data/recipes';
import { useCart } from '../hooks/useCart';
import { Button } from './ui/button';

interface RecipeDetailsPanelProps {
  recipe: Recipe;
  isOpen: boolean;
  onClose: () => void;
}

const RecipeDetailsPanel = ({ recipe, isOpen, onClose }: RecipeDetailsPanelProps) => {
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState<'medium' | 'large'>('medium');
  const { addItem } = useCart();

  const handleAddToCart = () => {
    addItem({
      id: recipe.id,
      name: recipe.name,
      price: recipe.prices[selectedSize],
      size: selectedSize,
      image: recipe.image
    });
    
    // Reset state and close panel
    setQuantity(1);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
        onClick={onClose}
      />
      
      {/* Panel */}
      <div className={`fixed right-0 top-0 h-full w-full max-w-md bg-slate-900/95 backdrop-blur-lg border-l border-white/10 z-50 transform transition-transform duration-300 ${
        isOpen ? 'animate-slide-in-right' : 'animate-slide-out-right'
      }`}>
        <div className="p-6 h-full overflow-y-auto">
          {/* Close button */}
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-white text-2xl"
          >
            ×
          </button>
          
          {/* Recipe image */}
          <div className="mb-6 mt-8">
            <img 
              src={recipe.image} 
              alt={recipe.name}
              className="w-full h-64 object-cover rounded-lg"
            />
          </div>
          
          {/* Recipe info */}
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-white mb-2">{recipe.name}</h2>
            <p className="text-gray-300 mb-4">{recipe.description}</p>
            
            <div className="flex items-center gap-4 mb-4">
              <div className="flex items-center">
                <span className="text-coral-400 font-semibold">★ {recipe.rating}</span>
                <span className="text-gray-500 ml-2">({recipe.reviews} reviews)</span>
              </div>
              <span className={`text-xs px-2 py-1 rounded-full ${
                recipe.spiceLevel === 'Mild' ? 'bg-green-500/20 text-green-400' :
                recipe.spiceLevel === 'Medium' ? 'bg-yellow-500/20 text-yellow-400' :
                'bg-red-500/20 text-red-400'
              }`}>
                {recipe.spiceLevel}
              </span>
            </div>
          </div>
          
          {/* Ingredients */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-white mb-3">Ingredients</h3>
            <ul className="text-gray-300 text-sm space-y-1">
              {recipe.ingredients.map((ingredient, index) => (
                <li key={index} className="flex items-center">
                  <span className="text-coral-400 mr-2">•</span>
                  {ingredient}
                </li>
              ))}
            </ul>
          </div>
          
          {/* Size selection */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-white mb-3">Size</h3>
            <div className="space-y-2">
              <label className="flex items-center justify-between p-3 glass-card cursor-pointer hover:bg-white/10">
                <div className="flex items-center">
                  <input
                    type="radio"
                    name="size"
                    value="medium"
                    checked={selectedSize === 'medium'}
                    onChange={(e) => setSelectedSize(e.target.value as 'medium' | 'large')}
                    className="text-coral-500 mr-3"
                  />
                  <span className="text-white">Medium</span>
                </div>
                <span className="text-coral-400 font-semibold">${recipe.prices.medium}</span>
              </label>
              
              <label className="flex items-center justify-between p-3 glass-card cursor-pointer hover:bg-white/10">
                <div className="flex items-center">
                  <input
                    type="radio"
                    name="size"
                    value="large"
                    checked={selectedSize === 'large'}
                    onChange={(e) => setSelectedSize(e.target.value as 'medium' | 'large')}
                    className="text-coral-500 mr-3"
                  />
                  <span className="text-white">Large</span>
                </div>
                <span className="text-coral-400 font-semibold">${recipe.prices.large}</span>
              </label>
            </div>
          </div>
          
          {/* Quantity selector */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-white mb-3">Quantity</h3>
            <div className="flex items-center gap-4">
              <button 
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white text-xl flex items-center justify-center transition-colors"
              >
                -
              </button>
              <span className="text-white text-xl font-semibold w-8 text-center">{quantity}</span>
              <button 
                onClick={() => setQuantity(quantity + 1)}
                className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white text-xl flex items-center justify-center transition-colors"
              >
                +
              </button>
            </div>
          </div>
          
          {/* Add to cart button */}
          <Button 
            onClick={handleAddToCart}
            className="w-full btn-coral text-lg py-3"
          >
            Add to Cart - ${(recipe.prices[selectedSize] * quantity).toFixed(2)}
          </Button>
        </div>
      </div>
    </>
  );
};

export default RecipeDetailsPanel;
