import { useState, useEffect } from 'react';
import { useCart } from '../../hooks/useCart';
import { useAuth } from '../../hooks/useAuth';
import { Button } from '../ui/button';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../../hooks/use-toast';
import { BillingDetailsForm } from './BillingDetailsForm';
import { ShippingAddressForm } from './ShippingAddressForm';
import { CheckoutOptions } from './CheckoutOptions';
import { validateCheckoutForm } from '../../utils/checkoutValidation';
import { saveUserBillingInfo, saveUserCart } from '../../services/checkoutService';

export interface CheckoutFormData {
  firstName: string;
  lastName: string;
  company: string;
  country: string;
  streetAddress: string;
  apartment: string;
  city: string;
  state: string;
  zipCode: string;
  phone: string;
  email: string;
  confirmEmail: string;
  password: string;
  shipToDifferent: boolean;
  shippingFirstName: string;
  shippingLastName: string;
  shippingCompany: string;
  shippingCountry: string;
  shippingStreetAddress: string;
  shippingApartment: string;
  shippingCity: string;
  shippingState: string;
  shippingZipCode: string;
}

interface CheckoutFormProps {
  onSuccess: () => void;
}

export const CheckoutForm = ({ onSuccess }: CheckoutFormProps) => {
  const { items, total, clearCart } = useCart();
  const { user, signUp } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  // Load initial formData from localStorage or default
  const getInitialFormData = (): CheckoutFormData => {
    try {
      if (user) {
        const savedData = localStorage.getItem(`billingInfo_${user.id}`);
        if (savedData) return JSON.parse(savedData);
      } else {
        const guestData = localStorage.getItem('guestBillingInfo');
        if (guestData) return JSON.parse(guestData);
      }
    } catch (e) {
      console.error('Failed to load billing info from localStorage', e);
    }

    return {
      firstName: '',
      lastName: '',
      company: '',
      country: 'United States (US)',
      streetAddress: '',
      apartment: '',
      city: '',
      state: '',
      zipCode: '',
      phone: '',
      email: user?.email || '',
      confirmEmail: user?.email || '',
      password: '',
      shipToDifferent: false,
      shippingFirstName: '',
      shippingLastName: '',
      shippingCompany: '',
      shippingCountry: 'United States (US)',
      shippingStreetAddress: '',
      shippingApartment: '',
      shippingCity: '',
      shippingState: '',
      shippingZipCode: ''
    };
  };

  const [formData, setFormData] = useState<CheckoutFormData>(getInitialFormData());
  const [checkoutType, setCheckoutType] = useState<'account' | 'guest'>(
    user ? 'account' : 'guest'
  );
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  // Save to localStorage every time formData changes
  useEffect(() => {
    try {
      if (user) {
        localStorage.setItem(`billingInfo_${user.id}`, JSON.stringify(formData));
      } else {
        localStorage.setItem('guestBillingInfo', JSON.stringify(formData));
      }
    } catch (e) {
      console.error('Failed to save to localStorage', e);
    }
  }, [formData, user]);

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const validationErrors = validateCheckoutForm(formData, checkoutType, user);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      toast({
        title: "Validation Error",
        description: "Please fix the errors below and try again.",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);

    try {
      let userId = user?.id || null;
      let customerEmail = user?.email || null;
      let customerName = user?.email?.split('@')[0] || null;

      // Create account if user selected account creation and is not logged in
      if (!user && checkoutType === 'account') {
        const { error } = await signUp(formData.email, formData.password, `${formData.firstName} ${formData.lastName}`);

        if (error) {
          toast({
            title: "Account Creation Failed",
            description: error.message || "Failed to create account. Please try again.",
            variant: "destructive"
          });
          setLoading(false);
          return;
        }

        toast({
          title: "Account Created Successfully!",
          description: `Account successfully created. Please check your email ${formData.email} to confirm your email.`,
          variant: "default"
        });

        customerEmail = formData.email;
        customerName = `${formData.firstName} ${formData.lastName}`;
      }

      // Save billing info and cart for logged-in users
      if (userId || (checkoutType === 'account' && !user)) {
        await saveUserBillingInfo(userId, formData);
        await saveUserCart(userId, items);
      }

      // Prepare shipping address
      const shippingAddress = formData.shipToDifferent
        ? `${formData.shippingStreetAddress}${formData.shippingApartment ? ', ' + formData.shippingApartment : ''}, ${formData.shippingCity}, ${formData.shippingState} ${formData.shippingZipCode}`
        : `${formData.streetAddress}${formData.apartment ? ', ' + formData.apartment : ''}, ${formData.city}, ${formData.state} ${formData.zipCode}`;

      // Prepare order data to pass to payment page
      const orderData = {
        items: JSON.parse(JSON.stringify(items)),
        total: total,
        user_id: userId,
        guest_name: checkoutType === 'guest' ? `${formData.firstName} ${formData.lastName}` : null,
        guest_email: checkoutType === 'guest' ? formData.email : customerEmail,
        phone_number: formData.phone,
        delivery_address: shippingAddress,
        billing_address: `${formData.streetAddress}${formData.apartment ? ', ' + formData.apartment : ''}, ${formData.city}, ${formData.state} ${formData.zipCode}`,
        status: 'pending'
      };

      const customerInfo = {
        name: customerName || `${formData.firstName} ${formData.lastName}`,
        email: customerEmail || formData.email,
        phone: formData.phone,
        address: shippingAddress
      };

      // Navigate to payment page with order data
      navigate('/payment', {
        state: {
          orderData,
          customerInfo
        }
      });

      onSuccess();

    } catch (error) {
      console.error('Error preparing order:', error);
      toast({
        title: "Error",
        description: "Failed to proceed to payment. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="glass-card p-6">
      <h2 className="text-2xl font-bold text-white mb-6">Billing Details</h2>

      <CheckoutOptions
        user={user}
        checkoutType={checkoutType}
        onCheckoutTypeChange={setCheckoutType}
      />

      <form onSubmit={handleSubmit} className="space-y-4">
        <BillingDetailsForm
          formData={formData}
          errors={errors}
          checkoutType={checkoutType}
          user={user}
          onInputChange={handleInputChange}
        />

        <ShippingAddressForm
          formData={formData}
          errors={errors}
          onInputChange={handleInputChange}
        />

        <Button
          type="submit"
          className="w-full btn-coral text-lg py-4 mt-6"
          disabled={loading}
        >
          {loading ? 'Processing...' : `Continue to Payment - $${total.toFixed(2)}`}
        </Button>
      </form>
    </div>
  );
};