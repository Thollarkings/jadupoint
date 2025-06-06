
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
import { saveUserBillingInfo, loadUserBillingInfo } from '../../services/checkoutService';

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
  const { items, total } = useCart();
  const { user, signUp } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [formData, setFormData] = useState<CheckoutFormData>({
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
  });

  const [checkoutType, setCheckoutType] = useState<'account' | 'guest'>('account');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [isLoadingBillingInfo, setIsLoadingBillingInfo] = useState(true);

  // Load billing information when component mounts or user changes
  useEffect(() => {
    const loadBillingInfo = async () => {
      setIsLoadingBillingInfo(true);
      try {
        const billingInfo = await loadUserBillingInfo(user?.id || null);
        
        if (billingInfo) {
          setFormData(prev => ({
            ...prev,
            ...billingInfo,
            email: billingInfo.email || user?.email || '',
            confirmEmail: billingInfo.email || user?.email || '',
          }));
        }
      } catch (error) {
        console.error('Error loading billing information:', error);
      } finally {
        setIsLoadingBillingInfo(false);
      }
    };

    loadBillingInfo();
  }, [user]);

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
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

      // Save billing info for both guests and logged-in users
      await saveUserBillingInfo(userId, formData);
      
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

      console.log('Proceeding to payment with order data:', orderData);
      console.log('Customer info:', customerInfo);

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

  if (isLoadingBillingInfo) {
    return (
      <div className="glass-card p-6">
        <div className="flex flex-col items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-coral-400"></div>
          <p className="mt-4 text-white">Loading your information...</p>
        </div>
      </div>
    );
  }

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
