
export interface Recipe {
  id: string;
  name: string;
  description: string;
  image: string;
  rating: number;
  reviews: number;
  prices: {
    medium: number;
    large: number;
  };
  ingredients: string[];
  cookingTime: string;
  spiceLevel: 'Mild' | 'Medium' | 'Hot';
}

export const recipes: Recipe[] = [
  {
    id: '1',
    name: 'Classic Nigerian Jollof',
    description: 'Traditional Nigerian Jollof rice with the perfect blend of tomatoes, peppers, and aromatic spices.',
    image: '/jollof/jollof1.jpg',
    rating: 4.8,
    reviews: 245,
    prices: { medium: 15.99, large: 22.99 },
    ingredients: ['Basmati rice', 'Fresh tomatoes', 'Red bell peppers', 'Onions', 'Nigerian spices', 'Chicken stock'],
    cookingTime: '45 minutes',
    spiceLevel: 'Medium'
  },
  {
    id: '2',
    name: 'Smoky Party Jollof',
    description: 'The legendary party Jollof with that signature smoky flavor and perfectly cooked grains.',
    image: '/jollof/jollof2.jpg',
    rating: 4.9,
    reviews: 189,
    prices: { medium: 17.99, large: 24.99 },
    ingredients: ['Long grain rice', 'Smoked tomatoes', 'Scotch bonnets', 'Palm oil', 'Beef stock', 'Bay leaves'],
    cookingTime: '55 minutes',
    spiceLevel: 'Hot'
  },
  {
    id: '3',
    name: 'Coconut Jollof Rice',
    description: 'A tropical twist on the classic with coconut milk creating a creamy, aromatic delight.',
    image: '/jollof/jollof3.jpg',
    rating: 4.7,
    reviews: 156,
    prices: { medium: 16.99, large: 23.99 },
    ingredients: ['Jasmine rice', 'Coconut milk', 'Fresh tomatoes', 'Ginger', 'Turmeric', 'Vegetable broth'],
    cookingTime: '40 minutes',
    spiceLevel: 'Mild'
  },
  {
    id: '4',
    name: 'Seafood Jollof Supreme',
    description: 'Premium Jollof rice loaded with fresh prawns, fish, and a medley of coastal spices.',
    image: '/jollof/jollof4.jpg',
    rating: 4.9,
    reviews: 201,
    prices: { medium: 21.99, large: 29.99 },
    ingredients: ['Premium rice', 'Fresh prawns', 'Fish fillets', 'Crab seasoning', 'White wine', 'Seafood stock'],
    cookingTime: '50 minutes',
    spiceLevel: 'Medium'
  },
  {
    id: '5',
    name: 'Vegetarian Garden Jollof',
    description: 'Plant-based perfection with seasonal vegetables and herb-infused aromatic rice.',
    image: '/jollof/jollof5.jpg',
    rating: 4.6,
    reviews: 134,
    prices: { medium: 14.99, large: 20.99 },
    ingredients: ['Brown rice', 'Mixed vegetables', 'Fresh herbs', 'Vegetable stock', 'Nutritional yeast', 'Olive oil'],
    cookingTime: '35 minutes',
    spiceLevel: 'Mild'
  },
  {
    id: '6',
    name: 'Spicy Warrior Jollof',
    description: 'For the brave! Extra spicy Jollof with habaneros and ghost peppers for the ultimate heat experience.',
    image: '/jollof/jollof6.jpg',
    rating: 4.5,
    reviews: 98,
    prices: { medium: 18.99, large: 25.99 },
    ingredients: ['Red rice', 'Habanero peppers', 'Ghost peppers', 'Extra spices', 'Beef broth', 'Hot sauce'],
    cookingTime: '50 minutes',
    spiceLevel: 'Hot'
  }
];
