
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
      setLoading(true);

      try {
        // Extract token and type from URL
        const urlParams = new URLSearchParams(window.location.search);
        const token = urlParams.get('token');
        const type = urlParams.get('type');
        const redirectTo = urlParams.get('redirectTo') || '/checkout';

        if (user?.email_confirmed_at) {
          // If already confirmed, skip verification
          setConfirmed(true);
          setLoading(false);
          return;
        }

        if (token && type === 'signup') {
          // Verify the email using Supabase OTP
          const { error: verifyError } = await supabase.auth.verifyOtp({
            token_hash: token,
            type: 'signup',
          });

          if (verifyError) {
            throw verifyError;
          }

          // Refresh session to get updated user data
          const { data, error: refreshError } = await supabase.auth.refreshSession();

          if (refreshError) {
            console.error('Failed to refresh session:', refreshError.message);
            toast({
              title: "Session Error",
              description: "Please log in again to see your updated account status.",
              variant: "destructive"
            });
          }

          setConfirmed(true);

          toast({
            title: "Success!",
            description: "Your email has been successfully confirmed.",
            variant: "default"
          });
        } else {
          // No token found — assume user visited directly
          if (user) {
            // User is signed in but not confirmed
            toast({
              title: "Email Not Confirmed",
              description: "Check your inbox for the confirmation link.",
              variant: "destructive"
            });
          }
          setConfirmed(false);
        }
      } catch (error: any) {
        console.error('Error during email confirmation:', error.message);
        toast({
          title: "Confirmation Failed",
          description: "The token may be invalid or expired. Please try resending the confirmation email.",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    handleEmailConfirmation();
  }, [navigate, toast, user]);

  const handleReturnToCheckout = () => {
    navigate('/checkout');
    setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 100);
  };

  if (loading) {
    return (
      <div className="min-h-screen px-4 py-8 flex items-center justify-center bg-gradient-to-r from-black via-[#301934] to-black">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#f87171] mx-auto mb-4"></div>
          <p className="text-white text-lg">Confirming your email...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen px-4 py-8 flex items-center justify-center bg-gradient-to-r from-black via-[#301934] to-black">
      <div className="max-w-md mx-auto text-center">
        <div className="glass-card p-8 rounded-lg shadow-lg bg-black/30 backdrop-blur-sm">
          {confirmed ? (
            <>
              {/* Success State */}
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
              {/* Unconfirmed / Info State */}
              <div className="w-16 h-16 bg-purple-700 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h1 className="text-2xl font-bold text-white mb-4">Welcome to JaduPoint</h1>
              <p className="text-gray-300 mb-6">
                Thank you for visiting. Please check your inbox for the confirmation link or log in to continue.
              </p>
            </>
          )}

          <Button
            onClick={handleReturnToCheckout}
            className="bg-[#f87171] hover:bg-[#ef4444] text-black font-semibold w-full transition duration-300"
          >
            Return to Checkout
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmAccount;
