import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

const Auth = () => {
  const { signUp, signIn, resetPassword, tryCommonPasswords } = useAuth();
  const [loading, setLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    // Clear errors when user starts typing
    if (error) setError('');
  };

  const validateForm = () => {
    if (!formData.email || !formData.password) {
      setError('Email and password are required');
      return false;
    }
    
    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
      setError('Please enter a valid email address');
      return false;
    }
    
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return false;
    }
    
    if (isSignUp && formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return false;
    }
    
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setLoading(true);
    setError('');
    setMessage('');

    try {
      if (isSignUp) {
        const { user, error } = await signUp(formData.email, formData.password);
        
        if (error) throw error;
        
        if (user) {
          setMessage(`Account created successfully! Please check ${formData.email} for a verification email.`);
        }
      } else {
        const { user, error } = await signIn(formData.email, formData.password);
        
        if (error) throw error;
        
        if (user) {
          setMessage('Signed in successfully! Redirecting...');
        }
      }
    } catch (error) {
      // Handle errors with better messaging
      console.error('Authentication error:', error);
      setError(error.message || 'Authentication failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleModeSwitch = () => {
    setIsSignUp(!isSignUp);
    setShowForgotPassword(false);
    setError('');
    setMessage('');
    setFormData({
      email: '',
      password: '',
      confirmPassword: ''
    });
  };

  const handleQuickRecovery = async () => {
    if (!formData.email) {
      setError('Please enter your email address first');
      return;
    }

    setLoading(true);
    setError('');
    setMessage('');

    // Send password reset email
    const { error, message } = await resetPassword(formData.email);
    
    if (error) {
      setError(error.message || 'Failed to send recovery email. Please try again.');
    } else {
      setMessage('Recovery email sent! Check your inbox and follow the link to reset your password.');
    }

    setLoading(false);
  };

  const handleTryCommonPasswords = async () => {
    if (!formData.email) {
      setError('Please enter your email address first');
      return;
    }

    setLoading(true);
    setError('');
    setMessage('Testing common passwords...');

    const { user, error, password } = await tryCommonPasswords(formData.email);
    
    if (error) {
      setError(error.message);
      setMessage('');
    } else if (user) {
      setMessage(`✅ Success! Logged in with password: ${password}`);
      setError('');
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-osmo shadow-osmo p-8 w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">
            <span className="text-purple-600">Poli</span>
            <span className="text-gray-800">gap</span>
          </h1>
          <p className="text-gray-600">
            {isSignUp ? 'Create your account' : 'Welcome back'}
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Migration Notice */}
          <div className="bg-blue-50 border border-blue-200 rounded-osmo p-4">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-blue-800">
                  New Authentication System
                </h3>
                <div className="mt-2 text-sm text-blue-700">
                  <p>We've upgraded to a more reliable authentication system. If you had an account before, please sign up again.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              Email Address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              value={formData.email}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-osmo focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors"
              placeholder="Enter your email"
            />
          </div>

          {/* Password */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              value={formData.password}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-osmo focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors"
              placeholder="Enter your password"
            />
          </div>

          {/* Confirm Password - only for sign up */}
          {isSignUp && (
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                required
                value={formData.confirmPassword}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-osmo focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors"
                placeholder="Confirm your password"
              />
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-osmo p-3">
              <p className="text-red-600 text-sm">{error}</p>
              
              {/* Show recovery options for auth errors */}
              {(error.includes('already registered') || error.includes('Invalid email or password') || error.includes('invalid-credential')) && (
                <div className="mt-3 space-y-2">
                  <button
                    type="button"
                    onClick={handleTryCommonPasswords}
                    disabled={loading || !formData.email}
                    className="w-full bg-yellow-600 text-white py-2 px-4 rounded-osmo hover:bg-yellow-700 focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                  >
                    {loading ? 'Testing Passwords...' : '🔍 Try Common Test Passwords'}
                  </button>
                  
                  <button
                    type="button"
                    onClick={handleQuickRecovery}
                    disabled={loading || !formData.email}
                    className="w-full bg-red-600 text-white py-2 px-4 rounded-osmo hover:bg-red-700 focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                  >
                    {loading ? 'Sending Recovery Email...' : '🔧 Send Password Reset Email'}
                  </button>
                  
                  <p className="text-xs text-red-500 text-center">
                    First try common passwords, then use password reset if needed
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Success Message */}
          {message && (
            <div className="bg-green-50 border border-green-200 rounded-osmo p-3">
              <p className="text-green-600 text-sm">{message}</p>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-purple-600 text-white py-3 px-6 rounded-osmo hover:bg-purple-700 focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                {isSignUp ? 'Creating Account...' : 'Signing In...'}
              </div>
            ) : (
              isSignUp ? 'Create Account' : 'Sign In'
            )}
          </button>

          {/* Forgot Password - only show for sign in */}
          {!isSignUp && (
            <div className="text-center">
              <button
                type="button"
                onClick={handleQuickRecovery}
                disabled={loading || !formData.email}
                className="text-sm text-purple-600 hover:text-purple-700 font-medium focus:outline-none focus:underline disabled:opacity-50"
              >
                Forgot your password?
              </button>
            </div>
          )}
        </form>

        {/* Mode Switch */}
        <div className="mt-6 text-center">
          <p className="text-gray-600">
            {isSignUp ? 'Already have an account?' : "Don't have an account?"}
            <button
              type="button"
              onClick={handleModeSwitch}
              className="ml-1 text-purple-600 hover:text-purple-700 font-medium focus:outline-none focus:underline"
            >
              {isSignUp ? 'Sign In' : 'Sign Up'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Auth;
