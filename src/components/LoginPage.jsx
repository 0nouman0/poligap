import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

function LoginPage({ onNavigate }) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [company, setCompany] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const { signIn, signUp, resetPassword } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);

    try {
      if (isLogin) {
        // Login
        const { data, error } = await signIn(email, password);
        if (error) {
          setError(error.message);
        } else {
          setMessage('Login successful! Redirecting...');
          setTimeout(() => onNavigate('home'), 1500);
        }
      } else {
        // Sign up
        if (password !== confirmPassword) {
          setError('Passwords do not match');
          setLoading(false);
          return;
        }

        const { data, error, message } = await signUp(email, password, {
          first_name: firstName,
          last_name: lastName,
          company: company,
          full_name: `${firstName} ${lastName}`.trim()
        });

        if (error) {
          setError(error.message);
        } else if (message) {
          setMessage(message);
        } else if (data.user && data.session) {
          // User is automatically signed in (email confirmation disabled)
          setMessage('Account created successfully! Welcome to Poligap.');
          setTimeout(() => onNavigate('home'), 2000);
        } else {
          setMessage('Account created! Please check your email to verify your account.');
        }
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
      console.error('Auth error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!email) {
      setError('Please enter your email address first');
      return;
    }

    setLoading(true);
    setError('');
    
    const { data, error } = await resetPassword(email);
    
    if (error) {
      setError(error.message);
    } else {
      setMessage('Password reset email sent! Check your inbox.');
    }
    
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-6 py-12">
      {/* Subtle Background Elements */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-20 left-10 w-24 h-24 bg-gradient-to-br from-osmo-purple/10 to-osmo-pink/10 rounded-osmo opacity-50"></div>
        <div className="absolute top-60 right-20 w-16 h-16 bg-gradient-to-br from-osmo-cyan/10 to-osmo-blue/10 rounded-full opacity-60"></div>
        <div className="absolute bottom-40 left-1/3 w-32 h-16 bg-gradient-to-r from-osmo-yellow/10 to-osmo-green/10 rounded-osmo opacity-40"></div>
      </div>

      <div className="relative z-10 w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <button
              onClick={() => onNavigate('home')}
              className="bg-osmo-dark text-white px-4 py-2 rounded-osmo font-bold hover:bg-gray-700 transition-all shadow-osmo mr-4"
            >
              ← Back
            </button>
            <h1 className="text-3xl font-black text-osmo-dark">Poligap</h1>
          </div>
          <p className="text-gray-600">
            {isLogin ? 'Welcome back' : 'Create your account'}
          </p>
        </div>

        {/* Auth Form */}
        <div className="bg-white rounded-osmo-lg shadow-osmo-lg border border-gray-100 p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Sign Up Only Fields */}
            {!isLogin && (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-osmo-dark mb-2">
                      First Name
                    </label>
                    <input
                      type="text"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-200 rounded-osmo text-osmo-dark placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-osmo-purple"
                      placeholder="John"
                      required={!isLogin}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-osmo-dark mb-2">
                      Last Name
                    </label>
                    <input
                      type="text"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-200 rounded-osmo text-osmo-dark placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-osmo-purple"
                      placeholder="Doe"
                      required={!isLogin}
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-bold text-osmo-dark mb-2">
                    Company (Optional)
                  </label>
                  <input
                    type="text"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-osmo text-osmo-dark placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-osmo-purple"
                    placeholder="Your Company Name"
                  />
                </div>
              </>
            )}

            {/* Email */}
            <div>
              <label className="block text-sm font-bold text-osmo-dark mb-2">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-osmo text-osmo-dark placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-osmo-purple"
                placeholder="john@example.com"
                required
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-bold text-osmo-dark mb-2">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-osmo text-osmo-dark placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-osmo-purple"
                placeholder="••••••••"
                required
                minLength={6}
              />
            </div>

            {/* Confirm Password (Sign Up Only) */}
            {!isLogin && (
              <div>
                <label className="block text-sm font-bold text-osmo-dark mb-2">
                  Confirm Password
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-osmo text-osmo-dark placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-osmo-purple"
                  placeholder="••••••••"
                  required={!isLogin}
                  minLength={6}
                />
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-osmo p-4">
                <div className="flex items-center">
                  <span className="text-red-500 mr-2">⚠️</span>
                  <p className="text-red-700 text-sm">{error}</p>
                </div>
              </div>
            )}

            {/* Success Message */}
            {message && (
              <div className="bg-green-50 border border-green-200 rounded-osmo p-4">
                <div className="flex items-center">
                  <span className="text-green-500 mr-2">✅</span>
                  <p className="text-green-700 text-sm">{message}</p>
                </div>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-osmo-purple text-white py-3 px-4 rounded-osmo font-bold hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-osmo-purple disabled:bg-gray-400 transition-all shadow-osmo"
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-2"></div>
                  {isLogin ? 'Signing in...' : 'Creating account...'}
                </div>
              ) : (
                isLogin ? 'Sign In' : 'Create Account'
              )}
            </button>

            {/* Forgot Password (Login Only) */}
            {isLogin && (
              <div className="text-center">
                <button
                  type="button"
                  onClick={handleForgotPassword}
                  className="text-osmo-blue hover:text-osmo-purple text-sm font-semibold transition-colors"
                >
                  Forgot your password?
                </button>
              </div>
            )}

            {/* Toggle Login/Signup */}
            <div className="text-center pt-4 border-t border-gray-200">
              <p className="text-gray-600 text-sm">
                {isLogin ? "Don't have an account?" : "Already have an account?"}
                <button
                  type="button"
                  onClick={() => {
                    setIsLogin(!isLogin);
                    setError('');
                    setMessage('');
                  }}
                  className="text-osmo-blue hover:text-osmo-purple font-semibold ml-1 transition-colors"
                >
                  {isLogin ? 'Sign up' : 'Sign in'}
                </button>
              </p>
            </div>
          </form>
        </div>

        {/* Features Preview */}
        <div className="mt-8 text-center">
          <p className="text-gray-500 text-sm mb-4">What you'll get with Poligap:</p>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="w-8 h-8 bg-osmo-blue rounded-full flex items-center justify-center mx-auto mb-2">
                <span className="text-white text-xs">🤖</span>
              </div>
              <p className="text-xs text-gray-600">AI Analysis</p>
            </div>
            <div>
              <div className="w-8 h-8 bg-osmo-green rounded-full flex items-center justify-center mx-auto mb-2">
                <span className="text-white text-xs">🛡️</span>
              </div>
              <p className="text-xs text-gray-600">Compliance</p>
            </div>
            <div>
              <div className="w-8 h-8 bg-osmo-purple rounded-full flex items-center justify-center mx-auto mb-2">
                <span className="text-white text-xs">📊</span>
              </div>
              <p className="text-xs text-gray-600">Reports</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
