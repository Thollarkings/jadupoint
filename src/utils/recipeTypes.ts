
export interface SupabaseRecipe {
  id: string;
  name: string;
  description: string;
  full_description?: string;
  image: string;
  rating: number;
  reviews: number;
  medium_price: number;
  large_price: number;
  ingredients: string[];
  cooking_time?: string;
  spice_level: 'Mild' | 'Medium' | 'Hot';
  created_at: string;
  updated_at: string;
}

export const toSupabaseRecipe = (recipe: any): SupabaseRecipe => {
  let spiceLevel: 'Mild' | 'Medium' | 'Hot' = 'Medium';
  const spiceInput = (recipe.spice_level || '').toString().trim().toLowerCase();
  
  if (spiceInput === 'hot') spiceLevel = 'Hot';
  else if (spiceInput === 'mild') spiceLevel = 'Mild';

  let ingredients: string[] = [];
  if (Array.isArray(recipe.ingredients)) {
    ingredients = recipe.ingredients.map((i: any) => i.toString());
  } else if (typeof recipe.ingredients === 'string') {
    try {
      ingredients = JSON.parse(recipe.ingredients);
    } catch {
      ingredients = [recipe.ingredients];
    }
  }

  const parseNumber = (value: any, defaultValue: number = 0): number => {
    if (typeof value === 'number') return value;
    const num = parseFloat(value);
    return isNaN(num) ? defaultValue : num;
  };

  return {
    id: recipe.id?.toString() || '',
    name: recipe.name?.toString() || 'Unnamed Recipe',
    description: recipe.description?.toString() || '',
    full_description: recipe.full_description?.toString(),
    image: recipe.image?.toString() || '',
    rating: parseNumber(recipe.rating, 4.5),
    reviews: parseNumber(recipe.reviews, 0),
    medium_price: parseNumber(recipe.medium_price),
    large_price: parseNumber(recipe.large_price),
    ingredients,
    cooking_time: recipe.cooking_time?.toString(),
    spice_level: spiceLevel,
    created_at: recipe.created_at?.toString() || new Date().toISOString(),
    updated_at: recipe.updated_at?.toString() || new Date().toISOString(),
  };
};
