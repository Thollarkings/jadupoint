
import { useState } from 'react';
import { recipes, Recipe } from '../data/recipes';
import RecipeCard from '../components/RecipeCard';
import RecipeDetailsPanel from '../components/RecipeDetailsPanel';

const Home = () => {
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);

  return (
    <div className="min-h-screen bg-gradient-to-r from-black via-coral-900 to-black">
      {/* Hero Section */}
      <section className="text-center py-16 px-4">
        <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 animate-fade-in">
          Welcome to <span className="text-coral-400">JaduPoint</span>
        </h1>
        <p className="text-xl text-gray-300 max-w-2xl mx-auto mb-8 animate-fade-in">
          Experience the authentic taste of perfectly crafted African cuisine , delivered fresh to your doorstep with the magic touch of tradition and love.
        </p>
{/*         <div className="animate-fade-in">
          <a href="#recipes" className="btn-coral inline-block">
            Explore Our Flavors
          </a>
        </div> */}
      </section>

      {/* Recipes Grid */}
      <section id="recipes" className="px-4 pb-16">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-white text-center mb-12">
            Our Signature <span className="text-coral-400">Jollof and Fried </span> Collection
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recipes.map((recipe) => (
              <RecipeCard 
                key={recipe.id} 
                recipe={recipe} 
                onClick={setSelectedRecipe}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Recipe Details Panel */}
      <RecipeDetailsPanel 
        recipe={selectedRecipe!}
        isOpen={!!selectedRecipe}
        onClose={() => setSelectedRecipe(null)}
      />
    </div>
  );
};

export default Home;
