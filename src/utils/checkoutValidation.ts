
import { CheckoutFormData } from '../components/checkout/CheckoutForm';
import { User } from '@supabase/supabase-js';

export const validateCheckoutForm = (
  formData: CheckoutFormData, 
  checkoutType: 'account' | 'guest', 
  user: User | null
): Record<string, string> => {
  const newErrors: Record<string, string> = {};

  // Required field validation
  if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
  if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
  if (!formData.streetAddress.trim()) newErrors.streetAddress = 'Street address is required';
  if (!formData.city.trim()) newErrors.city = 'City is required';
  if (!formData.state) newErrors.state = 'State is required';
  if (!formData.zipCode.trim()) newErrors.zipCode = 'ZIP code is required';
  if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';

  // Shipping address validation if different address is selected
  if (formData.shipToDifferent) {
    if (!formData.shippingFirstName.trim()) newErrors.shippingFirstName = 'Shipping first name is required';
    if (!formData.shippingLastName.trim()) newErrors.shippingLastName = 'Shipping last name is required';
    if (!formData.shippingStreetAddress.trim()) newErrors.shippingStreetAddress = 'Shipping street address is required';
    if (!formData.shippingCity.trim()) newErrors.shippingCity = 'Shipping city is required';
    if (!formData.shippingState) newErrors.shippingState = 'Shipping state is required';
    if (!formData.shippingZipCode.trim()) newErrors.shippingZipCode = 'Shipping ZIP code is required';
  }

  // Account creation validation
  if (!user && checkoutType === 'account') {
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    if (!formData.confirmEmail.trim()) newErrors.confirmEmail = 'Email confirmation is required';
    if (!formData.password.trim()) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (formData.email && !emailRegex.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    // Email confirmation validation
    if (formData.email && formData.confirmEmail && formData.email !== formData.confirmEmail) {
      newErrors.confirmEmail = 'Email addresses do not match';
    }
  }

  // ZIP code validation (US format)
  const zipRegex = /^\d{5}(-\d{4})?$/;
  if (formData.zipCode && !zipRegex.test(formData.zipCode)) {
    newErrors.zipCode = 'Please enter a valid ZIP code';
  }
  if (formData.shipToDifferent && formData.shippingZipCode && !zipRegex.test(formData.shippingZipCode)) {
    newErrors.shippingZipCode = 'Please enter a valid shipping ZIP code';
  }

  // Phone validation
  const phoneRegex = /^\+?[\d\s\-\(\)]{10,}$/;
  if (formData.phone && !phoneRegex.test(formData.phone)) {
    newErrors.phone = 'Please enter a valid phone number';
  }

  return newErrors;
};
