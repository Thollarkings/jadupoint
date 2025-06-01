
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { useToast } from '../hooks/use-toast';
import { supabase } from '../integrations/supabase/client';
import { Plus, Edit, Trash2, LogOut } from 'lucide-react';

interface Recipe {
  id: string;
  name: string;
  description: string;
  full_description: string;
  image: string;
  rating: number;
  reviews: number;
  price_medium: number;
  price_large: number;
  ingredients: string[];
  cooking_time: string;
  spice_level: string;
}

const AdminDashboard = () => {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

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
      handleLogout();
      return;
    }
    
    fetchRecipes();
  }, [navigate]);

  const fetchRecipes = async () => {
    try {
      const { data, error } = await supabase
        .from('recipes')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setRecipes(data || []);
    } catch (error) {
      console.error('Error fetching recipes:', error);
      toast({
        title: "Error",
        description: "Failed to load recipes.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('admin_logged_in');
    localStorage.removeItem('admin_login_time');
    toast({
      title: "Logged Out",
      description: "You have been logged out successfully.",
    });
    navigate('/admin/login');
  };

  const handleDeleteRecipe = async (id: string) => {
    if (!confirm('Are you sure you want to delete this recipe?')) {
      return;
    }

    try {
      const { error } = await supabase
        .from('recipes')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setRecipes(prev => prev.filter(recipe => recipe.id !== id));
      toast({
        title: "Recipe Deleted",
        description: "Recipe has been deleted successfully.",
      });
    } catch (error) {
      console.error('Error deleting recipe:', error);
      toast({
        title: "Error",
        description: "Failed to delete recipe.",
        variant: "destructive"
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen px-4 py-8 bg-gradient-to-r from-black via-coral-900 to-black flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen px-4 py-8 bg-gradient-to-r from-black via-coral-900 to-black">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">Admin Dashboard</h1>
            <p className="text-gray-300">Manage your Jollof rice recipes</p>
          </div>
          
          <div className="flex gap-4">
            <Button 
              onClick={() => navigate('/admin/recipe/new')}
              className="btn-coral flex items-center gap-2"
            >
              <Plus className="h-5 w-5" />
              Add Recipe
            </Button>
            
            <Button 
              onClick={handleLogout}
              variant="outline"
              className="border-white/20 text-white hover:bg-white/10 flex items-center gap-2"
            >
              <LogOut className="h-5 w-5" />
              Logout
            </Button>
          </div>
        </div>

        {/* Recipes List */}
        <div className="glass-card p-6">
          <h2 className="text-2xl font-bold text-white mb-6">Recipes ({recipes.length})</h2>
          
          {recipes.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-400 text-lg mb-4">No recipes found</p>
              <Button 
                onClick={() => navigate('/admin/recipe/new')}
                className="btn-coral"
              >
                Add Your First Recipe
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recipes.map((recipe) => (
                <div key={recipe.id} className="bg-white/5 rounded-lg p-4 border border-white/10">
                  <img 
                    src={recipe.image} 
                    alt={recipe.name}
                    className="w-full h-48 object-cover rounded-lg mb-4"
                  />
                  
                  <div className="space-y-2 mb-4">
                    <h3 className="text-white font-semibold text-lg">{recipe.name}</h3>
                    <p className="text-gray-400 text-sm line-clamp-2">{recipe.description}</p>
                    <div className="flex justify-between text-sm">
                      <span className="text-coral-400">Medium: ${recipe.price_medium}</span>
                      <span className="text-coral-400">Large: ${recipe.price_large}</span>
                    </div>
                    <div className="flex justify-between text-sm text-gray-400">
                      <span>Rating: {recipe.rating}/5</span>
                      <span>{recipe.spice_level}</span>
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button 
                      onClick={() => navigate(`/admin/recipe/edit/${recipe.id}`)}
                      size="sm"
                      className="flex-1 bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center gap-1"
                    >
                      <Edit className="h-4 w-4" />
                      Edit
                    </Button>
                    
                    <Button 
                      onClick={() => handleDeleteRecipe(recipe.id)}
                      size="sm"
                      variant="destructive"
                      className="flex-1 flex items-center justify-center gap-1"
                    >
                      <Trash2 className="h-4 w-4" />
                      Delete
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
