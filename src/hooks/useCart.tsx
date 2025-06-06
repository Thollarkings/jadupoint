
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from './useAuth';
import { loadUserCart, saveUserCart } from '../services/checkoutService';

export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  size: 'medium' | 'large';
  image: string;
}

interface CartContextType {
  items: CartItem[];
  addItem: (item: Omit<CartItem, 'quantity'>) => void;
  removeItem: (id: string, size: string) => void;
  updateQuantity: (id: string, size: string, quantity: number) => void;
  clearCart: () => void;
  total: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const { user } = useAuth();

  // Load user's cart when they log in
  useEffect(() => {
    const loadCart = async () => {
      if (user) {
        const savedCart = await loadUserCart(user.id);
        if (savedCart.length > 0) {
          setItems(savedCart);
        }
      } else {
        // Load from localStorage for guests
        const guestCart = localStorage.getItem('guest_cart');
        if (guestCart) {
          setItems(JSON.parse(guestCart));
        }
      }
    };

    loadCart();
  }, [user]);

  // Save cart whenever items change
  useEffect(() => {
    if (user) {
      saveUserCart(user.id, items);
    } else {
      // Save to localStorage for guests
      localStorage.setItem('guest_cart', JSON.stringify(items));
    }
  }, [items, user]);

  const addItem = (newItem: Omit<CartItem, 'quantity'>) => {
    setItems(prev => {
      const existingItem = prev.find(item => item.id === newItem.id && item.size === newItem.size);
      if (existingItem) {
        return prev.map(item =>
          item.id === newItem.id && item.size === newItem.size
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { ...newItem, quantity: 1 }];
    });
  };

  const removeItem = (id: string, size: string) => {
    setItems(prev => prev.filter(item => !(item.id === id && item.size === size)));
  };

  const updateQuantity = (id: string, size: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(id, size);
      return;
    }
    setItems(prev =>
      prev.map(item =>
        item.id === id && item.size === size
          ? { ...item, quantity }
          : item
      )
    );
  };

  const clearCart = () => {
    setItems([]);
    if (user) {
      saveUserCart(user.id, []);
    } else {
      localStorage.removeItem('guest_cart');
    }
  };

  const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  return (
    <CartContext.Provider value={{
      items,
      addItem,
      removeItem,
      updateQuantity,
      clearCart,
      total
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within CartProvider');
  }
  return context;
};
