
import { Checkbox } from '../ui/checkbox';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { ChevronDown, AlertCircle } from 'lucide-react';
import { CheckoutFormData } from './CheckoutForm';

interface ShippingAddressFormProps {
  formData: CheckoutFormData;
  errors: Record<string, string>;
  onInputChange: (field: string, value: string | boolean) => void;
}

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

export const ShippingAddressForm = ({ formData, errors, onInputChange }: ShippingAddressFormProps) => {
  return (
    <div className="pt-4 border-t border-white/10">
      <div className="flex items-center gap-2">
        <Checkbox
          id="ship-different"
          checked={formData.shipToDifferent}
          onCheckedChange={(checked) => onInputChange('shipToDifferent', checked)}
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
                onChange={(e) => onInputChange('shippingFirstName', e.target.value)}
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
                onChange={(e) => onInputChange('shippingLastName', e.target.value)}
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
              onChange={(e) => onInputChange('shippingCompany', e.target.value)}
              className="bg-white/10 border-white/20 text-white placeholder-gray-400"
              placeholder="Company name"
            />
          </div>

          {/* Shipping Country */}
          <div>
            <Label className="text-gray-300">Country / Region *</Label>
            <Select value={formData.shippingCountry} onValueChange={(value) => onInputChange('shippingCountry', value)}>
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
              onChange={(e) => onInputChange('shippingStreetAddress', e.target.value)}
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
              onChange={(e) => onInputChange('shippingApartment', e.target.value)}
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
                onChange={(e) => onInputChange('shippingCity', e.target.value)}
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
              <Select value={formData.shippingState} onValueChange={(value) => onInputChange('shippingState', value)}>
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
                onChange={(e) => onInputChange('shippingZipCode', e.target.value)}
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
  );
};
