
import { useState } from 'react';
import { recipes, Recipe } from '../data/recipes';
import RecipeCard from '../components/RecipeCard';
import RecipeDetailsPanel from '../components/RecipeDetailsPanel';
import CartSidebar from '../components/CartSidebar';
import { Button } from '../components/ui/button';

const Order = () => {
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);

  return (
    <div className="min-h-screen px-4 py-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">Order Jollof Rice</h1>
            <p className="text-gray-300">Choose your favorite flavors and add them to your cart</p>
          </div>
          <Button 
            onClick={() => setIsCartOpen(true)}
            className="btn-coral"
          >
            View Cart
          </Button>
        </div>

        {/* Recipes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recipes.map((recipe) => (
            <RecipeCard 
              key={recipe.id} 
              recipe={recipe} 
              onClick={setSelectedRecipe}
            />
          ))}
        </div>

        {/* Recipe Details Panel */}
        <RecipeDetailsPanel 
          recipe={selectedRecipe!}
          isOpen={!!selectedRecipe}
          onClose={() => setSelectedRecipe(null)}
        />

        {/* Cart Sidebar */}
        <CartSidebar 
          isOpen={isCartOpen}
          onClose={() => setIsCartOpen(false)}
        />
      </div>
    </div>
  );
};

export default Order;
