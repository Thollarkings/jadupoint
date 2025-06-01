
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { useToast } from '../hooks/use-toast';
import { ArrowLeft, Plus } from 'lucide-react';
import { recipes, Recipe } from '../data/recipes';

const EditRecipe = () => {
  const { id } = useParams<{ id: string }>();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    image: '',
    prices: { medium: '', large: '' },
    ingredients: [''],
    cookingTime: '',
    spiceLevel: 'Medium' as 'Mild' | 'Medium' | 'Hot'
  });
  const [loading, setLoading] = useState(false);
  const [recipeFound, setRecipeFound] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (id) {
      const recipe = recipes.find(r => r.id === id);
      if (recipe) {
        setFormData({
          name: recipe.name,
          description: recipe.description,
          image: recipe.image,
          prices: {
            medium: recipe.prices.medium.toString(),
            large: recipe.prices.large.toString()
          },
          ingredients: recipe.ingredients.length > 0 ? recipe.ingredients : [''],
          cookingTime: recipe.cookingTime,
          spiceLevel: recipe.spiceLevel
        });
        setRecipeFound(true);
      } else {
        toast({
          title: "Recipe Not Found",
          description: "The recipe you're trying to edit doesn't exist.",
          variant: "destructive"
        });
        navigate('/admin/dashboard');
      }
    }
  }, [id, navigate, toast]);

  const handleInputChange = (field: string, value: string) => {
    if (field.startsWith('prices.')) {
      const priceField = field.split('.')[1];
      setFormData(prev => ({
        ...prev,
        prices: { ...prev.prices, [priceField]: value }
      }));
    } else {
      setFormData(prev => ({ ...prev, [field]: value }));
    }
  };

  const handleIngredientChange = (index: number, value: string) => {
    const newIngredients = [...formData.ingredients];
    newIngredients[index] = value;
    setFormData(prev => ({ ...prev, ingredients: newIngredients }));
  };

  const addIngredient = () => {
    setFormData(prev => ({ ...prev, ingredients: [...prev.ingredients, ''] }));
  };

  const removeIngredient = (index: number) => {
    if (formData.ingredients.length > 1) {
      const newIngredients = formData.ingredients.filter((_, i) => i !== index);
      setFormData(prev => ({ ...prev, ingredients: newIngredients }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Basic validation
    if (!formData.name || !formData.description || !formData.image || 
        !formData.prices.medium || !formData.prices.large) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      setLoading(false);
      return;
    }

    try {
      // For now, just simulate updating the recipe
      // In a real app, you'd update in database here
      console.log('Updating recipe:', formData);
      
      toast({
        title: "Recipe Updated",
        description: "Recipe has been updated successfully.",
      });
      
      navigate('/admin/dashboard');
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update recipe. Please try again.",
        variant: "destructive"
      });
    }
    
    setLoading(false);
  };

  if (!recipeFound) {
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
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-gray-300 mb-2">Recipe Name *</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                className="w-full p-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400"
                placeholder="Enter recipe name"
                required
              />
            </div>

            <div>
              <label className="block text-gray-300 mb-2">Description *</label>
              <textarea
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                className="w-full p-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 h-24 resize-none"
                placeholder="Enter recipe description"
                required
              />
            </div>

            <div>
              <label className="block text-gray-300 mb-2">Image URL *</label>
              <input
                type="url"
                value={formData.image}
                onChange={(e) => handleInputChange('image', e.target.value)}
                className="w-full p-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400"
                placeholder="Enter image URL"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-300 mb-2">Medium Price ($) *</label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.prices.medium}
                  onChange={(e) => handleInputChange('prices.medium', e.target.value)}
                  className="w-full p-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400"
                  placeholder="0.00"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-300 mb-2">Large Price ($) *</label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.prices.large}
                  onChange={(e) => handleInputChange('prices.large', e.target.value)}
                  className="w-full p-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400"
                  placeholder="0.00"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-gray-300 mb-2">Cooking Time</label>
              <input
                type="text"
                value={formData.cookingTime}
                onChange={(e) => handleInputChange('cookingTime', e.target.value)}
                className="w-full p-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400"
                placeholder="e.g., 45 minutes"
              />
            </div>

            <div>
              <label className="block text-gray-300 mb-2">Spice Level</label>
              <select
                value={formData.spiceLevel}
                onChange={(e) => handleInputChange('spiceLevel', e.target.value)}
                className="w-full p-3 bg-white/10 border border-white/20 rounded-lg text-white"
              >
                <option value="Mild">Mild</option>
                <option value="Medium">Medium</option>
                <option value="Hot">Hot</option>
              </select>
            </div>

            <div>
              <label className="block text-gray-300 mb-2">Ingredients</label>
              {formData.ingredients.map((ingredient, index) => (
                <div key={index} className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={ingredient}
                    onChange={(e) => handleIngredientChange(index, e.target.value)}
                    className="flex-1 p-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400"
                    placeholder="Enter ingredient"
                  />
                  {formData.ingredients.length > 1 && (
                    <Button
                      type="button"
                      variant="destructive"
                      onClick={() => removeIngredient(index)}
                      className="px-3"
                    >
                      ×
                    </Button>
                  )}
                </div>
              ))}
              <Button
                type="button"
                onClick={addIngredient}
                className="btn-coral flex items-center gap-2"
              >
                <Plus className="h-4 w-4" />
                Add Ingredient
              </Button>
            </div>

            <div className="flex gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate('/admin/dashboard')}
                className="flex-1 border-white/20 text-white hover:bg-white/10"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="flex-1 btn-coral"
                disabled={loading}
              >
                {loading ? 'Updating Recipe...' : 'Update Recipe'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditRecipe;
