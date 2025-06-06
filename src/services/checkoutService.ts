
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

    // Then save detailed billing info
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
        updated_at: new Date().toISOString()
      });

    if (billingError) {
      console.error('Error saving billing info:', billingError);
    }
  } catch (error) {
    console.error('Error saving billing info:', error);
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
    // Load billing info from database
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
    };
  } catch (error) {
    console.error('Error loading billing info:', error);
    return null;
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
