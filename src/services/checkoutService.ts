
import { supabase } from '../integrations/supabase/client';
import { CheckoutFormData } from '../components/checkout/CheckoutForm';
import { CartItem } from '../hooks/useCart';

export const saveUserBillingInfo = async (userId: string | null, formData: CheckoutFormData) => {
  if (!userId) {
    // Store in localStorage for guest users
    localStorage.setItem('guest_billing_info', JSON.stringify({
      firstName: formData.firstName,
      lastName: formData.lastName,
      company: formData.company,
      country: formData.country,
      streetAddress: formData.streetAddress,
      apartment: formData.apartment,
      city: formData.city,
      state: formData.state,
      zipCode: formData.zipCode,
      phone: formData.phone,
      email: formData.email
    }));
    return;
  }

  try {
    // First update the profiles table with basic user info
    const { error: profileError } = await supabase
      .from('profiles')
      .upsert({
        id: userId,
        full_name: `${formData.firstName} ${formData.lastName}`,
        email: formData.email,
      });

    if (profileError) {
      console.error('Error saving profile info:', profileError);
    }

    // Then save detailed billing info to Supabase using upsert to handle existing records
    const { error: billingError } = await supabase
      .from('billing_info')
      .upsert({
        user_id: userId,
        first_name: formData.firstName,
        last_name: formData.lastName,
        company: formData.company,
        country: formData.country,
        street_address: formData.streetAddress,
        apartment: formData.apartment,
        city: formData.city,
        state: formData.state,
        zip_code: formData.zipCode,
        phone: formData.phone,
        email: formData.email,
        updated_at: new Date().toISOString()
      }, {
        onConflict: 'user_id'
      });

    if (billingError) {
      console.error('Error saving billing info to Supabase:', billingError);
      throw billingError;
    }

    console.log('Billing info saved to Supabase successfully');
  } catch (error) {
    console.error('Error saving billing info:', error);
    throw error;
  }
};

export const loadUserBillingInfo = async (userId: string | null): Promise<Partial<CheckoutFormData> | null> => {
  if (!userId) {
    // Load from localStorage for guest users
    const guestBillingInfo = localStorage.getItem('guest_billing_info');
    if (guestBillingInfo) {
      return JSON.parse(guestBillingInfo);
    }
    return null;
  }

  try {
    // Load billing info from Supabase database
    const { data: billingData, error: billingError } = await supabase
      .from('billing_info')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (billingError && billingError.code !== 'PGRST116') { // PGRST116 is "no rows returned"
      console.error('Error loading billing info:', billingError);
      return null;
    }

    if (!billingData) {
      // If no billing data, try to get basic info from profiles
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (profileError) {
        console.error('Error loading profile info:', profileError);
        return null;
      }

      if (profileData) {
        // Extract name parts
        const fullName = profileData.full_name || '';
        const nameParts = fullName.split(' ');
        const firstName = nameParts[0] || '';
        const lastName = nameParts.slice(1).join(' ') || '';

        return {
          firstName,
          lastName,
          email: profileData.email || '',
          confirmEmail: profileData.email || '',
        };
      }
      
      return null;
    }

    // Map database fields to form data fields
    console.log('Billing info loaded from Supabase:', billingData);
    return {
      firstName: billingData.first_name || '',
      lastName: billingData.last_name || '',
      company: billingData.company || '',
      country: billingData.country || 'United States (US)',
      streetAddress: billingData.street_address || '',
      apartment: billingData.apartment || '',
      city: billingData.city || '',
      state: billingData.state || '',
      zipCode: billingData.zip_code || '',
      phone: billingData.phone || '',
      email: billingData.email || '',
      confirmEmail: billingData.email || '',
    };
  } catch (error) {
    console.error('Error loading billing info:', error);
    return null;
  }
};

export const saveUserCart = async (userId: string | null, items: CartItem[]) => {
  if (!userId) {
    // Save to localStorage for guests
    localStorage.setItem('guest_cart', JSON.stringify(items));
    return;
  }

  try {
    // First, delete all existing cart items for this user
    const { error: deleteError } = await supabase
      .from('cart_items')
      .delete()
      .eq('user_id', userId);

    if (deleteError) {
      console.error('Error clearing existing cart items:', deleteError);
      throw deleteError;
    }

    // Then insert all current cart items
    if (items.length > 0) {
      const cartItemsToInsert = items.map(item => ({
        user_id: userId,
        recipe_id: item.id,
        recipe_name: item.name,
        price: item.price,
        quantity: item.quantity,
        size: item.size,
        image: item.image
      }));

      const { error: insertError } = await supabase
        .from('cart_items')
        .insert(cartItemsToInsert);

      if (insertError) {
        console.error('Error saving cart items to Supabase:', insertError);
        throw insertError;
      }

      console.log('Cart items saved to Supabase successfully');
    }

    // Also save to localStorage as backup
    localStorage.setItem(`cart_${userId}`, JSON.stringify(items));
  } catch (error) {
    console.error('Error saving cart:', error);
    // Fallback to localStorage if Supabase fails
    localStorage.setItem(`cart_${userId}`, JSON.stringify(items));
  }
};

export const loadUserCart = async (userId: string | null): Promise<CartItem[]> => {
  if (!userId) {
    // Load from localStorage for guests
    const guestCart = localStorage.getItem('guest_cart');
    return guestCart ? JSON.parse(guestCart) : [];
  }

  try {
    // Load cart items from Supabase
    const { data: cartItems, error } = await supabase
      .from('cart_items')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: true });

    if (error) {
      console.error('Error loading cart items from Supabase:', error);
      // Fallback to localStorage
      const savedCart = localStorage.getItem(`cart_${userId}`);
      return savedCart ? JSON.parse(savedCart) : [];
    }

    if (cartItems && cartItems.length > 0) {
      const cartItemsFormatted: CartItem[] = cartItems.map(item => ({
        id: item.recipe_id,
        name: item.recipe_name,
        price: Number(item.price),
        quantity: item.quantity,
        size: item.size as 'medium' | 'large',
        image: item.image
      }));

      console.log('Cart items loaded from Supabase:', cartItemsFormatted);
      
      // Also save to localStorage as backup
      localStorage.setItem(`cart_${userId}`, JSON.stringify(cartItemsFormatted));
      
      return cartItemsFormatted;
    }

    return [];
  } catch (error) {
    console.error('Error loading cart:', error);
    // Fallback to localStorage
    const savedCart = localStorage.getItem(`cart_${userId}`);
    return savedCart ? JSON.parse(savedCart) : [];
  }
};

// Function to merge guest cart with user cart on login
export const mergeGuestCartWithUserCart = async (userId: string): Promise<CartItem[]> => {
  try {
    // Get guest cart from localStorage
    const guestCartStr = localStorage.getItem('guest_cart');
    const guestCart: CartItem[] = guestCartStr ? JSON.parse(guestCartStr) : [];
    
    if (guestCart.length === 0) {
      // No guest cart to merge, just load user cart
      return await loadUserCart(userId);
    }

    // Load existing user cart from Supabase
    const userCart = await loadUserCart(userId);
    
    // Merge carts (guest cart items take priority)
    const mergedCart: CartItem[] = [...userCart];
    
    for (const guestItem of guestCart) {
      const existingItemIndex = mergedCart.findIndex(
        item => item.id === guestItem.id && item.size === guestItem.size
      );
      
      if (existingItemIndex >= 0) {
        // Item exists, update quantity (add guest quantity to existing)
        mergedCart[existingItemIndex].quantity += guestItem.quantity;
      } else {
        // New item, add to cart
        mergedCart.push(guestItem);
      }
    }
    
    // Save merged cart to Supabase
    await saveUserCart(userId, mergedCart);
    
    // Clear guest cart from localStorage
    localStorage.removeItem('guest_cart');
    
    console.log('Guest cart merged with user cart successfully');
    return mergedCart;
    
  } catch (error) {
    console.error('Error merging guest cart with user cart:', error);
    // Fallback: just load user cart
    return await loadUserCart(userId);
  }
};
