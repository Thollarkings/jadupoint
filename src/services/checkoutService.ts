
import { supabase } from '../integrations/supabase/client';
import { CheckoutFormData } from '../components/checkout/CheckoutForm';
import { CartItem } from '../hooks/useCart';

export const saveUserBillingInfo = async (userId: string | null, formData: CheckoutFormData) => {
  if (!userId) return;

  try {
    const { error } = await supabase
      .from('profiles')
      .upsert({
        id: userId,
        full_name: `${formData.firstName} ${formData.lastName}`,
        email: formData.email,
        // Add billing address fields to profiles table if needed
      });

    if (error) {
      console.error('Error saving billing info:', error);
    }
  } catch (error) {
    console.error('Error saving billing info:', error);
  }
};

export const saveUserCart = async (userId: string | null, items: CartItem[]) => {
  if (!userId || items.length === 0) return;

  try {
    // Save cart items to localStorage for now, can be moved to database later
    localStorage.setItem(`cart_${userId}`, JSON.stringify(items));
  } catch (error) {
    console.error('Error saving cart:', error);
  }
};

export const loadUserCart = async (userId: string | null): Promise<CartItem[]> => {
  if (!userId) return [];

  try {
    const savedCart = localStorage.getItem(`cart_${userId}`);
    return savedCart ? JSON.parse(savedCart) : [];
  } catch (error) {
    console.error('Error loading cart:', error);
    return [];
  }
};
