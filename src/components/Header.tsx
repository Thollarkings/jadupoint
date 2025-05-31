
import { Link, useLocation } from 'react-router-dom';
import { ShoppingCart, User, LogOut } from 'lucide-react';
import { useCart } from '../hooks/useCart';
import { useAuth } from '../hooks/useAuth';
import { useState } from 'react';
import AuthDialog from './AuthDialog';
import CartSidebar from './CartSidebar';

const Header = () => {
  const location = useLocation();
  const { items } = useCart();
  const { user, signOut } = useAuth();
  const [showAuthDialog, setShowAuthDialog] = useState(false);
  const [showCartSidebar, setShowCartSidebar] = useState(false);
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

  const isActive = (path: string) => location.pathname === path;

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <>
      <header className="glass-card m-4 p-4 sticky top-4 z-50">
        <div className="flex items-center justify-between">
          <Link to="/" className="text-2xl font-bold text-coral-400 hover:text-coral-300 transition-colors">
            JaduPoint
          </Link>
          
          <nav className="hidden md:flex space-x-6">
            <Link 
              to="/" 
              className={`transition-colors ${isActive('/') ? 'text-coral-400' : 'text-gray-300 hover:text-white'}`}
            >
              Home
            </Link>
            <Link 
              to="/about" 
              className={`transition-colors ${isActive('/about') ? 'text-coral-400' : 'text-gray-300 hover:text-white'}`}
            >
              About
            </Link>
            <Link 
              to="/contact" 
              className={`transition-colors ${isActive('/contact') ? 'text-coral-400' : 'text-gray-300 hover:text-white'}`}
            >
              Contact
            </Link>
            <Link 
              to="/order" 
              className={`transition-colors ${isActive('/order') ? 'text-coral-400' : 'text-gray-300 hover:text-white'}`}
            >
              Order
            </Link>
            <Link 
              to="/catering" 
              className={`transition-colors ${isActive('/catering') ? 'text-coral-400' : 'text-gray-300 hover:text-white'}`}
            >
              Catering
            </Link>
          </nav>

          <div className="flex items-center gap-4">
            {/* Cart */}
            <button 
              onClick={() => setShowCartSidebar(true)}
              className="relative p-2 hover:bg-white/10 rounded-lg transition-colors flex items-center text-gray-300 hover:text-white gap-2"
            >  View Cart 
              <ShoppingCart className="h-6 w-6 text-coral-400" /> 
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-coral-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {totalItems}
                </span>
              )}
            </button>

            {/* Auth Section */}
            {user ? (
              <div className="flex items-center gap-2">
                <span className="text-white text-sm hidden sm:block">
                  {user.email}
                </span>
                <button
                  onClick={handleSignOut}
                  className="p-2 hover:bg-white/10 rounded-lg transition-colors text-gray-300 hover:text-white"
                  title="Sign Out"
                >
                  <LogOut className="h-5 w-5" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => setShowAuthDialog(true)}
                className="flex items-center gap-2 p-2 hover:bg-white/10 rounded-lg transition-colors text-gray-300 hover:text-white"
              >
                <User className="h-5 w-5" />
                <span className="hidden sm:block">Sign In</span>
              </button>
            )}
          </div>
        </div>
      </header>

      <AuthDialog 
        isOpen={showAuthDialog}
        onClose={() => setShowAuthDialog(false)}
      />

      <CartSidebar 
        isOpen={showCartSidebar}
        onClose={() => setShowCartSidebar(false)}
      />
    </>
  );
};

export default Header;
