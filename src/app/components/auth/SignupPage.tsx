// Updated SignupPage.tsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useStore } from '../../../store/useStore';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../ui/card';
import { BriefcaseIcon, UserIcon, CheckIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import logo from '../../../images/logo.svg';
import {PricingSection}  from './PricingSection';
import { publicApi } from '../../../services/api';

export function SignupPage() {
  const navigate = useNavigate();
  const setUser = useStore((state) => state.setUser);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [selectedRole, setSelectedRole] = useState<'employer' | 'candidate' | null>('employer');
  const [signupSuccess, setSignupSuccess] = useState(false);
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
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

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRole) return;

    try {
      setLoading(true);
      setError('');

      const { data } = await publicApi.post(`/auth/register`, {
        name,
        email,
        password,
        role: selectedRole,
      });

      // Save user
      setUser({
        id: data.organization.id,
        email: data.organization.email,
        role: 'employer',
        name: data.organization.name,
      });

      // Save token
      localStorage.setItem('token', data.tokens.access.token);

      // Store user data for checkout
      setUserData(data.organization);

      // Show pricing section
      setSignupSuccess(true);
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Signup failed');
    } finally {
      setLoading(false);
    }
  };

  const handlePlanSelect = async (planId: string, checkoutLink: string | null) => {
   
    try {
      setCheckoutLoading(planId);

      // Create Polar checkout
      const anchor = document.createElement('a');
      anchor.href = checkoutLink;
      anchor.setAttribute('data-polar-checkout', '');
      anchor.setAttribute('data-polar-checkout-theme', 'dark');

      if (userData) {
        anchor.setAttribute('data-polar-checkout-customer-email', userData.email);
        anchor.setAttribute('data-polar-checkout-customer-name', userData.name);
      }

      document.body.appendChild(anchor);
      anchor.click();
      document.body.removeChild(anchor);

      setTimeout(() => {
        setCheckoutLoading(null);
      }, 1000);
    } catch (error: any) {
      console.error('Checkout error:', error);
      setError('Failed to initiate checkout. Please try again.');
      setCheckoutLoading(null);
    }
  };

  const handleSkipForNow = () => {
    navigate('/dashboard');
  };

  // Signup form
  if (!signupSuccess) {
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
              className="mx-auto h-10 w-auto object-contain"
            />
            <p className="text-gray-600">Create your account</p>
          </div>

          <Card className="border-gray-200 shadow-lg">
            <CardHeader>
              <CardTitle>Get Started</CardTitle>
              <CardDescription>Sign up to start using AI Interviewer</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSignup} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="John Doe"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>

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
                  {loading ? 'Creating...' : 'Create Account'}
                </Button>

                <div className="text-center text-sm text-gray-600">
                  Already have an account?{' '}
                  <button
                    type="button"
                    onClick={() => navigate('/login')}
                    className="text-black hover:underline"
                  >
                    Sign in
                  </button>
                </div>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    );
  }

  // Show pricing section after successful signup
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Success Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center py-8 px-4"
      >
        <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
          <CheckIcon className="h-8 w-8 text-green-600" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Welcome, {name}! 🎉
        </h1>
        <p className="text-gray-600">
          Your account has been created successfully. Choose a plan to get started.
        </p>
      </motion.div>

      <PricingSection
        onPlanSelect={handlePlanSelect}
        isLoading={checkoutLoading}
        userEmail={email}
        userName={name}
        showSkip={true}
        onSkip={handleSkipForNow}
      />

      {/* Error message */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="fixed bottom-4 right-4 bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg"
          >
            {error}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}