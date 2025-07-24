import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

function NavigationHeader({ currentPage, onNavigate }) {
  const { user, signOut } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);

  const handleSignOut = async () => {
    try {
      await signOut();
      onNavigate('home');
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  return (
    <header className="bg-white border-b border-gray-200 shadow-osmo relative z-50">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          
          {/* Logo */}
          <div 
            onClick={() => onNavigate('home')}
            className="flex items-center cursor-pointer"
          >
            <h1 className="text-2xl font-black text-osmo-dark">
              <span className="text-osmo-purple">Poli</span>gap
            </h1>
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center space-x-8">
            <button
              onClick={() => onNavigate('analyzer')}
              className={`font-semibold transition-colors ${
                currentPage === 'analyzer' 
                  ? 'text-osmo-purple' 
                  : 'text-gray-600 hover:text-osmo-purple'
              }`}
            >
              Analyzer
            </button>
            <button
              onClick={() => onNavigate('generator')}
              className={`font-semibold transition-colors ${
                currentPage === 'generator' 
                  ? 'text-osmo-purple' 
                  : 'text-gray-600 hover:text-osmo-purple'
              }`}
            >
              Generator
            </button>
            <button
              onClick={() => onNavigate('history')}
              className={`font-semibold transition-colors ${
                currentPage === 'history' 
                  ? 'text-osmo-purple' 
                  : 'text-gray-600 hover:text-osmo-purple'
              }`}
            >
              History
            </button>
            <button
              onClick={() => onNavigate('pricing')}
              className={`font-semibold transition-colors ${
                currentPage === 'pricing' 
                  ? 'text-osmo-purple' 
                  : 'text-gray-600 hover:text-osmo-purple'
              }`}
            >
              Pricing
            </button>
            <button
              onClick={() => onNavigate('compliances')}
              className={`font-semibold transition-colors ${
                currentPage === 'compliances' 
                  ? 'text-osmo-purple' 
                  : 'text-gray-600 hover:text-osmo-purple'
              }`}
            >
              Learn
            </button>
            <button
              onClick={() => onNavigate('assessment')}
              className={`font-semibold transition-colors ${
                currentPage === 'assessment' 
                  ? 'text-osmo-purple' 
                  : 'text-gray-600 hover:text-osmo-purple'
              }`}
            >
              Assessment
            </button>
          </nav>

          {/* User Actions */}
          <div className="flex items-center space-x-4">
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center space-x-2 bg-osmo-purple text-white px-4 py-2 rounded-osmo font-semibold hover:bg-purple-700 transition-all shadow-osmo"
                >
                  <div className="w-6 h-6 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                    <span className="text-xs font-bold">
                      {user.user_metadata?.first_name?.charAt(0) || user.email?.charAt(0) || '?'}
                    </span>
                  </div>
                  <span className="hidden sm:inline">
                    {user.user_metadata?.first_name || 'Account'}
                  </span>
                  <span className="text-sm">▼</span>
                </button>

                {/* User Dropdown Menu */}
                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-osmo shadow-osmo-lg border border-gray-100 py-2 z-50">
                    <div className="px-4 py-2 border-b border-gray-100">
                      <p className="text-sm font-semibold text-osmo-dark">
                        {user.user_metadata?.full_name || 'User'}
                      </p>
                      <p className="text-xs text-gray-500">{user.email}</p>
                    </div>
                    
                    <button
                      onClick={() => {
                        onNavigate('profile');
                        setShowUserMenu(false);
                      }}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      👤 My Profile
                    </button>
                    
                    <button
                      onClick={() => {
                        onNavigate('monitor');
                        setShowUserMenu(false);
                      }}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      📊 Compliance Monitor
                    </button>
                    
                    <div className="border-t border-gray-100 mt-2 pt-2">
                      <button
                        onClick={handleSignOut}
                        className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                      >
                        🚪 Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => onNavigate('login')}
                  className="text-osmo-dark font-semibold hover:text-osmo-purple transition-colors"
                >
                  Sign In
                </button>
                <button
                  onClick={() => onNavigate('login')}
                  className="bg-osmo-purple text-white px-4 py-2 rounded-osmo font-semibold hover:bg-purple-700 transition-all shadow-osmo"
                >
                  Get Started
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Click outside to close dropdown */}
      {showUserMenu && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setShowUserMenu(false)}
        ></div>
      )}
    </header>
  );
}

export default NavigationHeader;
