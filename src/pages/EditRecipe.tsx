
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { useToast } from '../hooks/use-toast';
import { ArrowLeft } from 'lucide-react';
import { RecipeForm } from '../components/RecipeForm';
import { useRecipes } from '../hooks/useRecipes';

const EditRecipe = () => {
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState(false);
  const [recipe, setRecipe] = useState<any>(null);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { recipes, updateRecipe } = useRecipes();

  useEffect(() => {
    // Check if admin is logged in
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

    // Find the recipe to edit
    if (id && recipes.length > 0) {
      const foundRecipe = recipes.find(r => r.id === id);
      if (foundRecipe) {
        setRecipe(foundRecipe);
      } else {
        toast({
          title: "Recipe Not Found",
          description: "The recipe you're trying to edit doesn't exist.",
          variant: "destructive"
        });
        navigate('/admin/dashboard');
      }
    }
  }, [id, recipes, navigate, toast]);

  const handleSubmit = async (formData: any) => {
    if (!id) return;
    
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
      medium_price: parseFloat(formData.medium_price),
      large_price: parseFloat(formData.large_price),
      ingredients: formData.ingredients.filter((ingredient: string) => ingredient.trim() !== ''),
      cooking_time: formData.cooking_time,
      spice_level: formData.spice_level
    };

    const result = await updateRecipe(id, recipeData);
    
    if (result.success) {
      navigate('/admin/dashboard');
    }
    
    setLoading(false);
  };

  if (!recipe) {
    return (
      <div className="min-h-screen px-4 py-8 bg-gradient-to-r from-black via-coral-900 to-black flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

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
          <h1 className="text-4xl font-bold text-white">Edit Recipe</h1>
        </div>

        <div className="glass-card p-6">
          <RecipeForm
            initialData={{
              name: recipe.name,
              description: recipe.description,
              image: recipe.image,
              medium_price: recipe.medium_price.toString(),
              large_price: recipe.large_price.toString(),
              ingredients: recipe.ingredients.length > 0 ? recipe.ingredients : [''],
              cooking_time: recipe.cooking_time || '',
              spice_level: recipe.spice_level
            }}
            currentImage={recipe.image}
            onSubmit={handleSubmit}
            loading={loading}
            submitText="Update Recipe"
            isEdit={true}
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

export default EditRecipe;
