
import { useState } from 'react';
import { useCart } from '../hooks/useCart';
import { useAuth } from '../hooks/useAuth';
import { Button } from '../components/ui/button';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../integrations/supabase/client';
import { useToast } from '../hooks/use-toast';

const Checkout = () => {
  const { items, total, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [guestInfo, setGuestInfo] = useState({
    name: '',
    email: '',
    phone: '',
    address: ''
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const orderData = {
        items: JSON.parse(JSON.stringify(items)), // Convert to plain JSON
        total_amount: total,
        user_id: user?.id || null,
        guest_name: user ? null : guestInfo.name,
        guest_email: user ? null : guestInfo.email,
        phone_number: guestInfo.phone,
        delivery_address: guestInfo.address,
        status: 'pending'
      };

      const { error } = await supabase
        .from('orders')
        .insert(orderData); // Remove the array wrapper

      if (error) throw error;

      toast({
        title: "Order Placed Successfully!",
        description: "We'll prepare your delicious Jollof rice right away.",
      });

      clearCart();
      navigate('/');
    } catch (error) {
      console.error('Error placing order:', error);
      toast({
        title: "Error",
        description: "Failed to place order. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen px-4 py-8 flex items-center justify-center">
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
    <div className="min-h-screen px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-8">Checkout</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
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

          {/* Delivery Information */}
          <div className="glass-card p-6">
            <h2 className="text-2xl font-bold text-white mb-4">Delivery Information</h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              {!user && (
                <>
                  <div>
                    <label className="block text-gray-300 mb-2">Full Name *</label>
                    <input
                      type="text"
                      value={guestInfo.name}
                      onChange={(e) => setGuestInfo(prev => ({ ...prev, name: e.target.value }))}
                      className="w-full p-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400"
                      placeholder="Enter your full name"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-gray-300 mb-2">Email *</label>
                    <input
                      type="email"
                      value={guestInfo.email}
                      onChange={(e) => setGuestInfo(prev => ({ ...prev, email: e.target.value }))}
                      className="w-full p-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400"
                      placeholder="Enter your email"
                      required
                    />
                  </div>
                </>
              )}
              
              <div>
                <label className="block text-gray-300 mb-2">Phone Number *</label>
                <input
                  type="tel"
                  value={guestInfo.phone}
                  onChange={(e) => setGuestInfo(prev => ({ ...prev, phone: e.target.value }))}
                  className="w-full p-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400"
                  placeholder="Enter your phone number"
                  required
                />
              </div>
              
              <div>
                <label className="block text-gray-300 mb-2">Delivery Address *</label>
                <textarea
                  value={guestInfo.address}
                  onChange={(e) => setGuestInfo(prev => ({ ...prev, address: e.target.value }))}
                  className="w-full p-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 h-24 resize-none"
                  placeholder="Enter your full delivery address"
                  required
                />
              </div>
              
              <Button 
                type="submit" 
                className="w-full btn-coral text-lg py-4"
                disabled={loading}
              >
                {loading ? 'Placing Order...' : `Place Order - $${total.toFixed(2)}`}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
