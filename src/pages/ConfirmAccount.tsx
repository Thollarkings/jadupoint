
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { useAuth } from '../hooks/useAuth';
import { supabase } from '../integrations/supabase/client';
import { useToast } from '../hooks/use-toast';

const ConfirmAccount = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [confirmed, setConfirmed] = useState(false);

  useEffect(() => {
    const handleEmailConfirmation = async () => {
      try {
        // Check if there's a confirmation token in the URL
        const urlParams = new URLSearchParams(window.location.search);
        const token = urlParams.get('token');
        const type = urlParams.get('type');

        if (token && type === 'signup') {
          // Handle the email confirmation
          const { error } = await supabase.auth.verifyOtp({
            token_hash: token,
            type: 'signup'
          });

          if (error) {
            console.error('Error confirming email:', error);
            toast({
              title: "Confirmation Error",
              description: "There was an error confirming your email. Please try again.",
              variant: "destructive"
            });
          } else {
            setConfirmed(true);
            toast({
              title: "Email Confirmed!",
              description: "Your email has been successfully confirmed. You can now complete your checkout.",
              variant: "default"
            });
          }
        } else if (user) {
          // User is already logged in
          setConfirmed(true);
        }
      } catch (error) {
        console.error('Error during confirmation:', error);
        toast({
          title: "Error",
          description: "An unexpected error occurred. Please try again.",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    handleEmailConfirmation();
  }, [user, toast]);

  const handleReturnToCheckout = () => {
    navigate('/checkout');
    // Scroll to top when returning to checkout
    setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 100);
  };

  if (loading) {
    return (
      <div className="min-h-screen px-4 py-8 flex items-center justify-center bg-gradient-to-r from-black via-coral-900 to-black">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-coral-400 mx-auto mb-4"></div>
          <p className="text-white text-lg">Confirming your email...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen px-4 py-8 flex items-center justify-center bg-gradient-to-r from-black via-coral-900 to-black">
      <div className="max-w-md mx-auto text-center">
        <div className="glass-card p-8">
          {confirmed ? (
            <>
              <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h1 className="text-2xl font-bold text-white mb-4">Email Confirmed!</h1>
              <p className="text-gray-300 mb-6">
                Your email has been successfully confirmed. You can now return to complete your checkout.
              </p>
            </>
          ) : (
            <>
              <div className="w-16 h-16 bg-coral-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h1 className="text-2xl font-bold text-white mb-4">Welcome!</h1>
              <p className="text-gray-300 mb-6">
                Thank you for visiting JaduPoint. Click the button below to return to checkout.
              </p>
            </>
          )}
          
          <Button onClick={handleReturnToCheckout} className="btn-coral w-full">
            Return to Checkout
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmAccount;
