
import { CartItem } from '../../hooks/useCart';

interface OrderSummaryProps {
  items: CartItem[];
  total: number;
}

export const OrderSummary = ({ items, total }: OrderSummaryProps) => {
  return (
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
  );
};
