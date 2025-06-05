
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Checkbox } from '../ui/checkbox';
import { AlertCircle, ChevronDown, Info } from 'lucide-react';
import { User } from '@supabase/supabase-js';
import { CheckoutFormData } from './CheckoutForm';
import { useState } from 'react';

interface BillingDetailsFormProps {
  formData: CheckoutFormData;
  errors: Record<string, string>;
  checkoutType: 'account' | 'guest';
  user: User | null;
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

export const BillingDetailsForm = ({ formData, errors, checkoutType, user, onInputChange }: BillingDetailsFormProps) => {
  const [showOptionalFields, setShowOptionalFields] = useState(false);

  return (
    <>
      {/* Name Fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label className="text-gray-300">First name *</Label>
          <Input
            value={formData.firstName}
            onChange={(e) => onInputChange('firstName', e.target.value)}
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
            onChange={(e) => onInputChange('lastName', e.target.value)}
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
              onChange={(e) => onInputChange('company', e.target.value)}
              className="bg-white/10 border-white/20 text-white placeholder-gray-400"
              placeholder="Company name"
            />
          </div>
        )}
      </div>

      {/* Country */}
      <div>
        <Label className="text-gray-300">Country / Region *</Label>
        <Select value={formData.country} onValueChange={(value) => onInputChange('country', value)}>
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
          onChange={(e) => onInputChange('streetAddress', e.target.value)}
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
          onChange={(e) => onInputChange('apartment', e.target.value)}
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
            onChange={(e) => onInputChange('city', e.target.value)}
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
          <Select value={formData.state} onValueChange={(value) => onInputChange('state', value)}>
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
            onChange={(e) => onInputChange('zipCode', e.target.value)}
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
          onChange={(e) => onInputChange('phone', e.target.value)}
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
              onChange={(e) => onInputChange('email', e.target.value)}
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
              onChange={(e) => onInputChange('confirmEmail', e.target.value)}
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
            onChange={(e) => onInputChange('password', e.target.value)}
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
    </>
  );
};
