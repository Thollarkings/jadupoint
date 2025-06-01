
import { useState } from 'react';
import { useRecipes, SupabaseRecipe } from '../hooks/useRecipes';
import RecipeCard from '../components/RecipeCard';
import RecipeDetailsPanel from '../components/RecipeDetailsPanel';
import CartSidebar from '../components/CartSidebar';

// Convert Supabase recipe to legacy format for compatibility
const convertRecipe = (recipe: SupabaseRecipe) => ({
  id: recipe.id,
  name: recipe.name,
  description: recipe.description,
  image: recipe.image,
  rating: recipe.rating,
  reviews: recipe.reviews,
  prices: {
    medium: recipe.medium_price,
    large: recipe.large_price
  },
  ingredients: recipe.ingredients,
  cookingTime: recipe.cooking_time || '',
  spiceLevel: recipe.spice_level
});

const Order = () => {
  const [selectedRecipe, setSelectedRecipe] = useState<any>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const { recipes, loading } = useRecipes();

  if (loading) {
    return (
      <div className="min-h-screen px-4 py-8 bg-gradient-to-r from-black via-coral-900 to-black flex items-center justify-center">
        <div className="text-white text-xl">Loading recipes...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen px-4 py-8 bg-gradient-to-r from-black via-coral-900 to-black">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">Order Jollof Rice</h1>
            <p className="text-gray-300">Choose your favorite flavors and add them to your cart</p>
          </div>
        </div>

        {/* Recipes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recipes.map((recipe) => (
            <RecipeCard 
              key={recipe.id} 
              recipe={convertRecipe(recipe)} 
              onClick={(r) => setSelectedRecipe(r)}
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
