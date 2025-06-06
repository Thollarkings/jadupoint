
import { useCart } from '../hooks/useCart';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Stepper } from '../components/ui/stepper';
import { CheckoutForm } from '../components/checkout/CheckoutForm';
import { OrderSummary } from '../components/checkout/OrderSummary';
import { useEffect, useState } from 'react';
import { useAuth } from '../hooks/useAuth'; // Assuming you have an auth hook

const Checkout = () => {
  const { items, total } = useCart();
  const navigate = useNavigate();

  const steps = [
    { id: 'billing', title: 'Billing', description: 'Your details' },
    { id: 'payment', title: 'Payment', description: 'Secure checkout' }
  ];

  const handleCheckoutSuccess = () => {
    // Scroll to top on successful checkout
    window.scrollTo({ top: 0, behavior: 'smooth' });
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
          {/* Checkout Form */}
          <CheckoutForm onSuccess={handleCheckoutSuccess} />

          {/* Order Summary */}
          <OrderSummary items={items} total={total} />
        </div>
      </div>
    </div>
  );
};

export default Checkout;
