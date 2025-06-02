
import { useState } from 'react';
import { Button } from './ui/button';
import { Plus, Upload } from 'lucide-react';

interface RecipeFormData {
  name: string;
  description: string;
  image: string;
  medium_price: string;
  large_price: string;
  ingredients: string[];
  cooking_time: string;
  spice_level: 'Mild' | 'Medium' | 'Hot';
}

interface RecipeFormProps {
  initialData?: Partial<RecipeFormData>;
  onSubmit: (data: RecipeFormData) => Promise<void>;
  loading: boolean;
  submitText: string;
  isEdit?: boolean;
  currentImage?: string;
}

export const RecipeForm = ({ 
  initialData, 
  onSubmit, 
  loading, 
  submitText, 
  isEdit = false,
  currentImage 
}: RecipeFormProps) => {
  const [formData, setFormData] = useState<RecipeFormData>({
    name: initialData?.name || '',
    description: initialData?.description || '',
    image: initialData?.image || '',
    medium_price: initialData?.medium_price || '',
    large_price: initialData?.large_price || '',
    ingredients: initialData?.ingredients || [''],
    cooking_time: initialData?.cooking_time || '',
    spice_level: initialData?.spice_level || 'Medium'
  });

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>(currentImage || '');
  const [keepOriginalImage, setKeepOriginalImage] = useState(true);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setKeepOriginalImage(false);
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setImagePreview(result);
        setFormData(prev => ({ ...prev, image: result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleKeepOriginalImage = () => {
    if (currentImage) {
      setKeepOriginalImage(true);
      setImageFile(null);
      setImagePreview(currentImage);
      setFormData(prev => ({ ...prev, image: currentImage }));
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
    await onSubmit(formData);
  };

  return (
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
        <label className="block text-gray-300 mb-2">Recipe Image *</label>
        <div className="space-y-4">
          <div className="flex items-center gap-4 flex-wrap">
            {isEdit && currentImage && (
              <Button
                type="button"
                onClick={handleKeepOriginalImage}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  keepOriginalImage 
                    ? 'bg-coral-600 text-white' 
                    : 'bg-gray-600 text-gray-300 hover:bg-gray-500'
                }`}
              >
                Keep Current Image
              </Button>
            )}
            
            <div className="flex items-center gap-2">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
                id="image-upload"
                required={!isEdit}
              />
              <label
                htmlFor="image-upload"
                className={`flex items-center gap-2 px-4 py-2 rounded-lg cursor-pointer transition-colors ${
                  !keepOriginalImage || !isEdit
                    ? 'bg-coral-600 hover:bg-coral-700 text-white' 
                    : 'bg-gray-600 hover:bg-gray-500 text-gray-300'
                }`}
              >
                <Upload className="h-4 w-4" />
                {isEdit ? 'Upload New Image' : 'Choose Image'}
              </label>
            </div>
            
            {imageFile && (
              <span className="text-gray-300 text-sm">{imageFile.name}</span>
            )}
          </div>
          
          {imagePreview && (
            <div className="mt-4">
              <p className="text-gray-400 text-sm mb-2">
                {isEdit && keepOriginalImage ? 'Current Image:' : 'Image Preview:'}
              </p>
              <img
                src={imagePreview}
                alt="Recipe preview"
                className="w-32 h-32 object-cover rounded-lg border border-white/20"
              />
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-gray-300 mb-2">Medium Price ($) *</label>
          <input
            type="number"
            step="0.01"
            value={formData.medium_price}
            onChange={(e) => handleInputChange('medium_price', e.target.value)}
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
            value={formData.large_price}
            onChange={(e) => handleInputChange('large_price', e.target.value)}
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
          value={formData.cooking_time}
          onChange={(e) => handleInputChange('cooking_time', e.target.value)}
          className="w-full p-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400"
          placeholder="e.g., 45 minutes"
        />
      </div>

      <div>
        <label className="block text-gray-300 mb-2">Spice Level</label>
        <select
          value={formData.spice_level}
          onChange={(e) => handleInputChange('spice_level', e.target.value)}
          className="w-full p-3  bg-coral-60/100 border border-white/20 rounded-lg text-white"
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

      <Button
        type="submit"
        className="w-full btn-coral"
        disabled={loading}
      >
        {loading ? `${submitText}...` : submitText}
      </Button>
    </form>
  );
};
