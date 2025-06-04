
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { useToast } from '../hooks/use-toast';
import { Eye, EyeOff } from 'lucide-react';

const AdminLogin = () => {
  const [credentials, setCredentials] = useState({
    username: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Check credentials
    if (credentials.username === 'bazu' && credentials.password === 'akanji01') {
      // Store admin session
      localStorage.setItem('admin_logged_in', 'true');
      localStorage.setItem('admin_login_time', Date.now().toString());
      
      toast({
        title: "Login Successful",
        description: "Welcome to the admin dashboard.",
      });
      
      navigate('/admin/dashboard');
    } else {
      toast({
        title: "Login Failed",
        description: "Invalid username or password.",
        variant: "destructive"
      });
    }
    
    setLoading(false);
  };

  return (
    <div className="min-h-screen px-4 py-8 bg-gradient-to-r from-black via-coral-900 to-black flex items-center justify-center">
      <div className="max-w-md w-full">
        <div className="glass-card p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">Admin Login</h1>
            <p className="text-gray-300">Access the recipe management dashboard</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-gray-300 mb-2">Username</label>
              <input
                type="text"
                value={credentials.username}
                onChange={(e) => setCredentials(prev => ({ ...prev, username: e.target.value }))}
                className="w-full p-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400"
                placeholder="Enter username"
                required
              />
            </div>

            <div>
              <label className="block text-gray-300 mb-2">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={credentials.password}
                  onChange={(e) => setCredentials(prev => ({ ...prev, password: e.target.value }))}
                  className="w-full p-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 pr-12"
                  placeholder="Enter password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            <Button 
              type="submit" 
              className="w-full btn-coral text-lg py-3"
              disabled={loading}
            >
              {loading ? 'Logging in...' : 'Login'}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <Button
              variant="ghost"
              onClick={() => navigate('/about')}
              className="text-gray-400 hover:text-white"
            >
              Back to About
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
