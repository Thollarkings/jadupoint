
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
import { Label } from '../ui/label';
import { User } from '@supabase/supabase-js';

interface CheckoutOptionsProps {
  user: User | null;
  checkoutType: 'account' | 'guest';
  onCheckoutTypeChange: (type: 'account' | 'guest') => void;
}

export const CheckoutOptions = ({ user, checkoutType, onCheckoutTypeChange }: CheckoutOptionsProps) => {
  if (user) return null;

  return (
    <div className="mb-6 p-4 bg-white/5 rounded-lg">
      <Label className="text-gray-300 text-lg font-semibold mb-3 block">Checkout Options</Label>
      <RadioGroup value={checkoutType} onValueChange={(value: 'account' | 'guest') => onCheckoutTypeChange(value)} className="space-y-3">
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
  );
};
