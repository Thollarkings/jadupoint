
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { RecipeForm } from '../components/RecipeForm';
import { useRecipes } from '../hooks/useRecipes';
import { useAuth } from '../hooks/useAuth';

const AddRecipe = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { addRecipe } = useRecipes();
  const { user } = useAuth();

  useEffect(() => {
    // Check if admin is logged in (for backward compatibility with existing auth)
    const isLoggedIn = localStorage.getItem('admin_logged_in');
    const loginTime = localStorage.getItem('admin_login_time');
    
    if (!isLoggedIn || !loginTime) {
      navigate('/admin/login');
      return;
    }
    
    // Check if session is still valid (24 hours)
    const twentyFourHours = 24 * 60 * 60 * 1000;
    if (Date.now() - parseInt(loginTime) > twentyFourHours) {
      localStorage.removeItem('admin_logged_in');
      localStorage.removeItem('admin_login_time');
      navigate('/admin/login');
      return;
    }
  }, [navigate]);

  const handleSubmit = async (formData: any) => {
    setLoading(true);

    // Basic validation
    if (!formData.name || !formData.description || !formData.image || 
        !formData.medium_price || !formData.large_price) {
      setLoading(false);
      return;
    }

    const recipeData = {
      name: formData.name,
      description: formData.description,
      image: formData.image,
      rating: 4.5,
      reviews: 0,
      medium_price: parseFloat(formData.medium_price),
      large_price: parseFloat(formData.large_price),
      ingredients: formData.ingredients.filter((ingredient: string) => ingredient.trim() !== ''),
      cooking_time: formData.cooking_time,
      spice_level: formData.spice_level
    };

    const result = await addRecipe(recipeData);
    
    if (result.success) {
      navigate('/admin/dashboard');
    }
    
    setLoading(false);
  };

  return (
    <div className="min-h-screen px-4 py-8 bg-gradient-to-r from-black via-coral-900 to-black">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <Button
            variant="ghost"
            onClick={() => navigate('/admin/dashboard')}
            className="text-gray-300 hover:text-white p-2"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-4xl font-bold text-white">Add New Recipe</h1>
        </div>

        <div className="glass-card p-6">
          <RecipeForm
            onSubmit={handleSubmit}
            loading={loading}
            submitText="Add Recipe"
          />
          
          <div className="mt-6">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate('/admin/dashboard')}
              className="w-full border-white/20 text-white hover:bg-white/10"
            >
              Cancel
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddRecipe;
