import { useState,useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useStore } from '../../../store/useStore';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../ui/card';
import { BriefcaseIcon, UserIcon, AlertCircle, CheckIcon } from 'lucide-react';
import { motion } from 'motion/react';
import logo from '../../../images/logo.svg';
import { PricingSection } from './PricingSection';
import { publicApi } from '../../../services/api';

export function LoginPage() {
  const navigate = useNavigate();
  const setUser = useStore((state) => state.setUser);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [selectedRole, setSelectedRole] = useState<'employer' | 'candidate' | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // States for inactive user flow
  const [showPricing, setShowPricing] = useState(false);
  const [inactiveUser, setInactiveUser] = useState<any>(null);
  const [checkoutLoading, setCheckoutLoading] = useState<string | null>(null);

  // Load Polar checkout script
  useEffect(() => {
    if (!document.querySelector('script[src="https://cdn.jsdelivr.net/npm/@polar-sh/checkout@0.1/dist/embed.global.js"]')) {
      const script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/npm/@polar-sh/checkout@0.1/dist/embed.global.js';
      script.defer = true;
      script.setAttribute('data-auto-init', 'true');
      document.body.appendChild(script);
    }
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRole) return;

    try {
      setLoading(true);
      setError('');

      const { data } = await publicApi.post(`/auth/login`, {
        email,
        password,
        role: selectedRole,
      });
      
      console.log(data);

      // Check if user is active
      const isActive = data.organization.status === 'active';
      
 
    

      // Active user - normal flow
      localStorage.setItem('token', data.tokens.access.token);
      setUser({
        id: data.organization.id,
        email: data.organization.email,
        role: data.organization.role || selectedRole,
        name: data.organization.name,
      });
      
      navigate('/dashboard');
    } catch (err: any) {
  const message = err.response?.data?.message || 'Login failed';

  setError(message);

  // Optional: handle specific cases
  if (message.toLowerCase().includes('inactive')) {
    // You can redirect or show CTA
    setShowPricing(true)
    console.log('User inactive');
  }
} finally {
      setLoading(false);
    }
  };

  const handlePlanSelect = async (planId: string, checkoutLink: string | null) => {
    if (planId === 'enterprise' || !checkoutLink) {
      window.location.href = '/contact-sales';
      return;
    }

    try {
      setCheckoutLoading(planId);

      // Save token before checkout
      if (inactiveUser?.token) {
        localStorage.setItem('token', inactiveUser.token);
      }

      // Create Polar checkout
      const anchor = document.createElement('a');
      anchor.href = checkoutLink;
      anchor.setAttribute('data-polar-checkout', '');
      anchor.setAttribute('data-polar-checkout-theme', 'dark');

      if (inactiveUser) {
        anchor.setAttribute('data-polar-checkout-customer-email', inactiveUser.email);
        anchor.setAttribute('data-polar-checkout-customer-name', inactiveUser.name);
      }

      document.body.appendChild(anchor);
      anchor.click();
      document.body.removeChild(anchor);

      // Set up polling to check if checkout completed
      const checkInterval = setInterval(() => {
        // You can implement a check with your backend to verify subscription status
        // For now, we'll redirect after a delay
      }, 3000);

      setTimeout(() => {
        clearInterval(checkInterval);
        setCheckoutLoading(null);
        // After successful payment, redirect to dashboard
        navigate('/dashboard');
      }, 5000);
      
    } catch (error: any) {
      console.error('Checkout error:', error);
      setError('Failed to initiate checkout. Please try again.');
      setCheckoutLoading(null);
    }
  };

  const handleSkipForNow = () => {
    // Save token and go to dashboard with limited access
    if (inactiveUser?.token) {
      localStorage.setItem('token', inactiveUser.token);
      setUser({
        id: inactiveUser.id,
        email: inactiveUser.email,
        role: inactiveUser.role,
        name: inactiveUser.name,
      });
    }
    navigate('/dashboard');
  };

  // Show pricing section for inactive users
  if (showPricing) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="text-center py-12 px-4">
         <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
          <CheckIcon className="h-8 w-8 text-green-600" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Welcome, {name}! 🎉
        </h1>
        <p className="text-gray-600">
          Your account has been created successfully. Choose a plan to get started.
        </p>
        </div>
        
        <PricingSection
          onPlanSelect={handlePlanSelect}
          isLoading={checkoutLoading}
          userEmail={email}
          userName={inactiveUser?.name}
          showSkip={true}
          onSkip={handleSkipForNow}
          variant="full"
        />
      </div>
    );
  }

  // Login form
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md space-y-6"
      >
        <div className="text-center space-y-2">
          <img
            src={logo}
            alt="Intervo AI"
            className="mx-auto h-10 w-auto object-contain transition-all duration-300"
          />
          <p className="text-gray-600">Sign in to your account</p>
        </div>

        <Card className="border-gray-200 shadow-lg">
          <CardHeader>
            <CardTitle>Welcome back</CardTitle>
            <CardDescription>Enter your credentials to continue</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label>I am a...</Label>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() => setSelectedRole('employer')}
                    className={`p-4 border-2 rounded-lg transition-all ${
                      selectedRole === 'employer'
                        ? 'border-black bg-gray-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <BriefcaseIcon className="mx-auto mb-2 h-6 w-6" />
                    <div className="text-sm">Employer</div>
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedRole('candidate')}
                    className={`p-4 border-2 rounded-lg transition-all ${
                      selectedRole === 'candidate'
                        ? 'border-black bg-gray-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <UserIcon className="mx-auto mb-2 h-6 w-6" />
                    <div className="text-sm">Candidate</div>
                  </button>
                </div>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg p-3">
                  {error}
                </div>
              )}

              <Button type="submit" className="w-full" disabled={!selectedRole || loading}>
                {loading ? 'Signing in...' : 'Sign in'}
              </Button>

              <div className="text-center text-sm text-gray-600">
                Don't have an account?{' '}
                <button
                  type="button"
                  onClick={() => navigate('/signup')}
                  className="text-black hover:underline"
                >
                  Sign up
                </button>
              </div>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}