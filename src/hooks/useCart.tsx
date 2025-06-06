
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from './useAuth';
import { loadUserCart, saveUserCart, mergeGuestCartWithUserCart } from '../services/checkoutService';

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
  isLoading: boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasInitialized, setHasInitialized] = useState(false);
  const { user } = useAuth();

  // Load user's cart when they log in or component mounts
  useEffect(() => {
    const loadCart = async () => {
      setIsLoading(true);
      try {
        let cartItems: CartItem[] = [];
        
        if (user?.id) {
          // User is logged in
          if (!hasInitialized) {
            // First login or page refresh - check if there's a guest cart to merge
            const guestCartStr = localStorage.getItem('guest_cart');
            if (guestCartStr && JSON.parse(guestCartStr).length > 0) {
              console.log('Merging guest cart with user cart');
              cartItems = await mergeGuestCartWithUserCart(user.id);
            } else {
              cartItems = await loadUserCart(user.id);
            }
          } else {
            // User was already logged in, just load their cart
            cartItems = await loadUserCart(user.id);
          }
        } else {
          // Guest user
          cartItems = await loadUserCart(null);
        }
        
        setItems(cartItems);
        setHasInitialized(true);
      } catch (error) {
        console.error('Error loading cart:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadCart();
  }, [user?.id, hasInitialized]);

  // Save cart whenever items change (but not on initial load)
  useEffect(() => {
    if (hasInitialized && !isLoading) {
      const saveCart = async () => {
        try {
          await saveUserCart(user?.id || null, items);
        } catch (error) {
          console.error('Error saving cart:', error);
        }
      };
      
      saveCart();
    }
  }, [items, user?.id, isLoading, hasInitialized]);

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

  const clearCart = async () => {
    setItems([]);
    try {
      await saveUserCart(user?.id || null, []);
      if (user?.id) {
        localStorage.removeItem(`cart_${user.id}`);
      } else {
        localStorage.removeItem('guest_cart');
      }
    } catch (error) {
      console.error('Error clearing cart:', error);
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
      total,
      isLoading
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
