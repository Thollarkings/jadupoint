
import { useState } from 'react';
import { useCart } from '../hooks/useCart';
import { useAuth } from '../hooks/useAuth';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Checkbox } from '../components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '../components/ui/radio-group';
import { Stepper } from '../components/ui/stepper';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../hooks/use-toast';
import { ChevronDown, Info, AlertCircle } from 'lucide-react';

const Checkout = () => {
  const { items, total, clearCart } = useCart();
  const { user, signUp } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
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
    // Shipping address fields
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
  const [showOptionalFields, setShowOptionalFields] = useState(false);

  const steps = [
    { id: 'billing', title: 'Billing', description: 'Your details' },
    { id: 'payment', title: 'Payment', description: 'Secure checkout' }
  ];

  const states = [
    'Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut',
    'Delaware', 'Florida', 'Georgia', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa',
    'Kansas', 'Kentucky', 'Louisiana', 'Maine', 'Maryland', 'Massachusetts', 'Michigan',
    'Minnesota', 'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire',
    'New Jersey', 'New Mexico', 'New York', 'North Carolina', 'North Dakota', 'Ohio',
    'Oklahoma', 'Oregon', 'Pennsylvania', 'Rhode Island', 'South Carolina', 'South Dakota',
    'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virginia', 'Washington', 'West Virginia',
    'Wisconsin', 'Wyoming'
  ];

  const validateForm = () => {
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

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
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
          title: "Account Created",
          description: "Your account has been created successfully!",
          variant: "default"
        });

        customerEmail = formData.email;
        customerName = `${formData.firstName} ${formData.lastName}`;
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

  if (items.length === 0) {
    return (
      <div className="min-h-screen px-4 py-8 flex items-center justify-center bg-gradient-to-r from-black via-coral-900 to-black">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-white mb-4">Your cart is empty</h1>
          <p className="text-gray-300 mb-6">Add some delicious Jollof rice to get started!</p>
          <Button onClick={() => navigate('/order')} className="btn-coral">
            Browse Menu
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen px-4 py-8 bg-gradient-to-r from-black via-coral-900 to-black">
      <div className="max-w-6xl mx-auto">
        {/* Progress Stepper */}
        <div className="mb-8">
          <Stepper steps={steps} currentStep={0} />
        </div>

        <h1 className="text-4xl font-bold text-white mb-8 text-center">Checkout</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Billing Form */}
          <div className="glass-card p-6">
            <h2 className="text-2xl font-bold text-white mb-6">Billing Details</h2>
            
            {/* Account Creation vs Guest Checkout */}
            {!user && (
              <div className="mb-6 p-4 bg-white/5 rounded-lg">
                <Label className="text-gray-300 text-lg font-semibold mb-3 block">Checkout Options</Label>
                <RadioGroup value={checkoutType} onValueChange={(value: 'account' | 'guest') => setCheckoutType(value)} className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="account" id="account" className="border-white/20 text-coral-400" />
                    <Label htmlFor="account" className="text-gray-300 cursor-pointer">Create Account & Place Order</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="guest" id="guest" className="border-white/20 text-coral-400" />
                    <Label htmlFor="guest" className="text-gray-300 cursor-pointer">Guest Checkout</Label>
                  </div>
                </RadioGroup>
              </div>
            )}
            
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Name Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-gray-300">First name *</Label>
                  <Input
                    value={formData.firstName}
                    onChange={(e) => handleInputChange('firstName', e.target.value)}
                    className={`bg-white/10 border-white/20 text-white placeholder-gray-400 ${errors.firstName ? 'border-red-500' : ''}`}
                    placeholder="Enter first name"
                  />
                  {errors.firstName && (
                    <p className="text-red-400 text-sm mt-1 flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />
                      {errors.firstName}
                    </p>
                  )}
                </div>
                <div>
                  <Label className="text-gray-300">Last name *</Label>
                  <Input
                    value={formData.lastName}
                    onChange={(e) => handleInputChange('lastName', e.target.value)}
                    className={`bg-white/10 border-white/20 text-white placeholder-gray-400 ${errors.lastName ? 'border-red-500' : ''}`}
                    placeholder="Enter last name"
                  />
                  {errors.lastName && (
                    <p className="text-red-400 text-sm mt-1 flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />
                      {errors.lastName}
                    </p>
                  )}
                </div>
              </div>

              {/* Company (Optional) */}
              <div className="transition-all duration-300">
                <div className="flex items-center gap-2 mb-2">
                  <Checkbox
                    id="show-company"
                    checked={showOptionalFields}
                    onCheckedChange={(checked) => setShowOptionalFields(checked === true)}
                    className="border-white/20"
                  />
                  <Label htmlFor="show-company" className="text-gray-300 cursor-pointer">
                    Add company details (optional)
                  </Label>
                  <ChevronDown className={`h-4 w-4 text-gray-400 transition-transform ${showOptionalFields ? 'rotate-180' : ''}`} />
                </div>
                {showOptionalFields && (
                  <div className="animate-fade-in">
                    <Input
                      value={formData.company}
                      onChange={(e) => handleInputChange('company', e.target.value)}
                      className="bg-white/10 border-white/20 text-white placeholder-gray-400"
                      placeholder="Company name"
                    />
                  </div>
                )}
              </div>

              {/* Country */}
              <div>
                <Label className="text-gray-300">Country / Region *</Label>
                <Select value={formData.country} onValueChange={(value) => handleInputChange('country', value)}>
                  <SelectTrigger className="bg-white/10 border-white/20 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-600">
                    <SelectItem value="United States (US)">United States (US)</SelectItem>
                    <SelectItem value="Canada">Canada</SelectItem>
                    <SelectItem value="United Kingdom">United Kingdom</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Street Address */}
              <div>
                <Label className="text-gray-300">Street address *</Label>
                <Input
                  value={formData.streetAddress}
                  onChange={(e) => handleInputChange('streetAddress', e.target.value)}
                  className={`bg-white/10 border-white/20 text-white placeholder-gray-400 ${errors.streetAddress ? 'border-red-500' : ''}`}
                  placeholder="House number and street name"
                />
                {errors.streetAddress && (
                  <p className="text-red-400 text-sm mt-1 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {errors.streetAddress}
                  </p>
                )}
                <div className="mt-2 p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg flex items-start gap-2">
                  <Info className="h-4 w-4 text-blue-400 mt-0.5 flex-shrink-0" />
                  <p className="text-blue-300 text-sm">
                    Please double check that your billing address matches your Credit/Debit Card Address.
                  </p>
                </div>
              </div>

              {/* Apartment (Optional) */}
              <div>
                <Label className="text-gray-300">Apartment, suite, unit, etc. (optional)</Label>
                <Input
                  value={formData.apartment}
                  onChange={(e) => handleInputChange('apartment', e.target.value)}
                  className="bg-white/10 border-white/20 text-white placeholder-gray-400"
                  placeholder="Apartment, suite, unit, building, floor, etc."
                />
              </div>

              {/* City, State, ZIP */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label className="text-gray-300">Town / City *</Label>
                  <Input
                    value={formData.city}
                    onChange={(e) => handleInputChange('city', e.target.value)}
                    className={`bg-white/10 border-white/20 text-white placeholder-gray-400 ${errors.city ? 'border-red-500' : ''}`}
                    placeholder="Enter city"
                  />
                  {errors.city && (
                    <p className="text-red-400 text-sm mt-1 flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />
                      {errors.city}
                    </p>
                  )}
                </div>
                <div>
                  <Label className="text-gray-300">State *</Label>
                  <Select value={formData.state} onValueChange={(value) => handleInputChange('state', value)}>
                    <SelectTrigger className={`bg-white/10 border-white/20 text-white ${errors.state ? 'border-red-500' : ''}`}>
                      <SelectValue placeholder="Select state" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-800 border-gray-600 max-h-60">
                      {states.map((state) => (
                        <SelectItem key={state} value={state} className="text-white hover:bg-gray-700">
                          {state}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.state && (
                    <p className="text-red-400 text-sm mt-1 flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />
                      {errors.state}
                    </p>
                  )}
                </div>
                <div>
                  <Label className="text-gray-300">ZIP Code *</Label>
                  <Input
                    value={formData.zipCode}
                    onChange={(e) => handleInputChange('zipCode', e.target.value)}
                    className={`bg-white/10 border-white/20 text-white placeholder-gray-400 ${errors.zipCode ? 'border-red-500' : ''}`}
                    placeholder="12345"
                  />
                  {errors.zipCode && (
                    <p className="text-red-400 text-sm mt-1 flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />
                      {errors.zipCode}
                    </p>
                  )}
                </div>
              </div>

              {/* Phone */}
              <div>
                <Label className="text-gray-300">Mobile phone number *</Label>
                <Input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  className={`bg-white/10 border-white/20 text-white placeholder-gray-400 ${errors.phone ? 'border-red-500' : ''}`}
                  placeholder="(555) 123-4567"
                />
                {errors.phone && (
                  <p className="text-red-400 text-sm mt-1 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {errors.phone}
                  </p>
                )}
              </div>

              {/* Email Fields - Only show for account creation or guest checkout */}
              {!user && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-gray-300">Email address *</Label>
                    <Input
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className={`bg-white/10 border-white/20 text-white placeholder-gray-400 ${errors.email ? 'border-red-500' : ''} ${checkoutType === 'guest' ? 'opacity-50' : ''}`}
                      placeholder="Enter email"
                      disabled={checkoutType === 'guest'}
                    />
                    {errors.email && (
                      <p className="text-red-400 text-sm mt-1 flex items-center gap-1">
                        <AlertCircle className="h-3 w-3" />
                        {errors.email}
                      </p>
                    )}
                  </div>
                  <div>
                    <Label className="text-gray-300">Confirm email address *</Label>
                    <Input
                      type="email"
                      value={formData.confirmEmail}
                      onChange={(e) => handleInputChange('confirmEmail', e.target.value)}
                      className={`bg-white/10 border-white/20 text-white placeholder-gray-400 ${errors.confirmEmail ? 'border-red-500' : ''} ${checkoutType === 'guest' ? 'opacity-50' : ''}`}
                      placeholder="Confirm email"
                      disabled={checkoutType === 'guest'}
                    />
                    {errors.confirmEmail && (
                      <p className="text-red-400 text-sm mt-1 flex items-center gap-1">
                        <AlertCircle className="h-3 w-3" />
                        {errors.confirmEmail}
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* Password (for account creation only) */}
              {!user && checkoutType === 'account' && (
                <div>
                  <Label className="text-gray-300">Create account password *</Label>
                  <Input
                    type="password"
                    value={formData.password}
                    onChange={(e) => handleInputChange('password', e.target.value)}
                    className={`bg-white/10 border-white/20 text-white placeholder-gray-400 ${errors.password ? 'border-red-500' : ''}`}
                    placeholder="Minimum 6 characters"
                  />
                  {errors.password && (
                    <p className="text-red-400 text-sm mt-1 flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />
                      {errors.password}
                    </p>
                  )}
                </div>
              )}

              {/* Ship to Different Address */}
              <div className="pt-4 border-t border-white/10">
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="ship-different"
                    checked={formData.shipToDifferent}
                    onCheckedChange={(checked) => handleInputChange('shipToDifferent', checked)}
                    className="border-white/20"
                  />
                  <Label htmlFor="ship-different" className="text-gray-300 cursor-pointer">
                    Ship to a different address?
                  </Label>
                  <ChevronDown className={`h-4 w-4 text-gray-400 transition-transform ${formData.shipToDifferent ? 'rotate-180' : ''}`} />
                </div>
                
                {/* Shipping Address Form */}
                {formData.shipToDifferent && (
                  <div className="mt-4 p-4 bg-white/5 rounded-lg animate-fade-in space-y-4">
                    <h3 className="text-lg font-semibold text-white mb-4">Shipping Address</h3>
                    
                    {/* Shipping Name Fields */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label className="text-gray-300">First name *</Label>
                        <Input
                          value={formData.shippingFirstName}
                          onChange={(e) => handleInputChange('shippingFirstName', e.target.value)}
                          className={`bg-white/10 border-white/20 text-white placeholder-gray-400 ${errors.shippingFirstName ? 'border-red-500' : ''}`}
                          placeholder="Enter first name"
                        />
                        {errors.shippingFirstName && (
                          <p className="text-red-400 text-sm mt-1 flex items-center gap-1">
                            <AlertCircle className="h-3 w-3" />
                            {errors.shippingFirstName}
                          </p>
                        )}
                      </div>
                      <div>
                        <Label className="text-gray-300">Last name *</Label>
                        <Input
                          value={formData.shippingLastName}
                          onChange={(e) => handleInputChange('shippingLastName', e.target.value)}
                          className={`bg-white/10 border-white/20 text-white placeholder-gray-400 ${errors.shippingLastName ? 'border-red-500' : ''}`}
                          placeholder="Enter last name"
                        />
                        {errors.shippingLastName && (
                          <p className="text-red-400 text-sm mt-1 flex items-center gap-1">
                            <AlertCircle className="h-3 w-3" />
                            {errors.shippingLastName}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Shipping Company (Optional) */}
                    <div>
                      <Label className="text-gray-300">Company name (optional)</Label>
                      <Input
                        value={formData.shippingCompany}
                        onChange={(e) => handleInputChange('shippingCompany', e.target.value)}
                        className="bg-white/10 border-white/20 text-white placeholder-gray-400"
                        placeholder="Company name"
                      />
                    </div>

                    {/* Shipping Country */}
                    <div>
                      <Label className="text-gray-300">Country / Region *</Label>
                      <Select value={formData.shippingCountry} onValueChange={(value) => handleInputChange('shippingCountry', value)}>
                        <SelectTrigger className="bg-white/10 border-white/20 text-white">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-gray-800 border-gray-600">
                          <SelectItem value="United States (US)">United States (US)</SelectItem>
                          <SelectItem value="Canada">Canada</SelectItem>
                          <SelectItem value="United Kingdom">United Kingdom</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Shipping Street Address */}
                    <div>
                      <Label className="text-gray-300">Street address *</Label>
                      <Input
                        value={formData.shippingStreetAddress}
                        onChange={(e) => handleInputChange('shippingStreetAddress', e.target.value)}
                        className={`bg-white/10 border-white/20 text-white placeholder-gray-400 ${errors.shippingStreetAddress ? 'border-red-500' : ''}`}
                        placeholder="House number and street name"
                      />
                      {errors.shippingStreetAddress && (
                        <p className="text-red-400 text-sm mt-1 flex items-center gap-1">
                          <AlertCircle className="h-3 w-3" />
                          {errors.shippingStreetAddress}
                        </p>
                      )}
                    </div>

                    {/* Shipping Apartment (Optional) */}
                    <div>
                      <Label className="text-gray-300">Apartment, suite, unit, etc. (optional)</Label>
                      <Input
                        value={formData.shippingApartment}
                        onChange={(e) => handleInputChange('shippingApartment', e.target.value)}
                        className="bg-white/10 border-white/20 text-white placeholder-gray-400"
                        placeholder="Apartment, suite, unit, building, floor, etc."
                      />
                    </div>

                    {/* Shipping City, State, ZIP */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <Label className="text-gray-300">Town / City *</Label>
                        <Input
                          value={formData.shippingCity}
                          onChange={(e) => handleInputChange('shippingCity', e.target.value)}
                          className={`bg-white/10 border-white/20 text-white placeholder-gray-400 ${errors.shippingCity ? 'border-red-500' : ''}`}
                          placeholder="Enter city"
                        />
                        {errors.shippingCity && (
                          <p className="text-red-400 text-sm mt-1 flex items-center gap-1">
                            <AlertCircle className="h-3 w-3" />
                            {errors.shippingCity}
                          </p>
                        )}
                      </div>
                      <div>
                        <Label className="text-gray-300">State *</Label>
                        <Select value={formData.shippingState} onValueChange={(value) => handleInputChange('shippingState', value)}>
                          <SelectTrigger className={`bg-white/10 border-white/20 text-white ${errors.shippingState ? 'border-red-500' : ''}`}>
                            <SelectValue placeholder="Select state" />
                          </SelectTrigger>
                          <SelectContent className="bg-gray-800 border-gray-600 max-h-60">
                            {states.map((state) => (
                              <SelectItem key={state} value={state} className="text-white hover:bg-gray-700">
                                {state}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        {errors.shippingState && (
                          <p className="text-red-400 text-sm mt-1 flex items-center gap-1">
                            <AlertCircle className="h-3 w-3" />
                            {errors.shippingState}
                          </p>
                        )}
                      </div>
                      <div>
                        <Label className="text-gray-300">ZIP Code *</Label>
                        <Input
                          value={formData.shippingZipCode}
                          onChange={(e) => handleInputChange('shippingZipCode', e.target.value)}
                          className={`bg-white/10 border-white/20 text-white placeholder-gray-400 ${errors.shippingZipCode ? 'border-red-500' : ''}`}
                          placeholder="12345"
                        />
                        {errors.shippingZipCode && (
                          <p className="text-red-400 text-sm mt-1 flex items-center gap-1">
                            <AlertCircle className="h-3 w-3" />
                            {errors.shippingZipCode}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
              
              <Button 
                type="submit" 
                className="w-full btn-coral text-lg py-4 mt-6"
                disabled={loading}
              >
                {loading ? 'Processing...' : `Continue to Payment - $${total.toFixed(2)}`}
              </Button>
            </form>
          </div>

          {/* Order Summary */}
          <div className="glass-card p-6">
            <h2 className="text-2xl font-bold text-white mb-4">Order Summary</h2>
            
            <div className="space-y-4 mb-6">
              {items.map((item) => (
                <div key={`${item.id}-${item.size}`} className="flex gap-4">
                  <img 
                    src={item.image} 
                    alt={item.name}
                    className="w-16 h-16 object-cover rounded-lg"
                  />
                  <div className="flex-1">
                    <h4 className="text-white font-semibold">{item.name}</h4>
                    <p className="text-gray-400 text-sm capitalize">{item.size}</p>
                    <p className="text-coral-400 font-semibold">
                      ${item.price} x {item.quantity} = ${(item.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="border-t border-white/10 pt-4">
              <div className="flex justify-between items-center">
                <span className="text-xl font-bold text-white">Total:</span>
                <span className="text-2xl font-bold text-coral-400">${total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
