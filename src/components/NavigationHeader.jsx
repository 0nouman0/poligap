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
    <header className="bg-white border-b border-gray-200 shadow-sm relative z-50 sticky top-0">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          
          {/* Simple Logo */}
          <div 
            onClick={() => onNavigate('home')}
            className="flex items-center cursor-pointer group"
          >
            <h1 className="text-3xl font-black text-gray-800 group-hover:text-purple-600 transition-colors duration-300">
              <span className="text-purple-600">Poli</span>gap
            </h1>
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center space-x-8">
            <button
              onClick={() => onNavigate('analyzer')}
              className={`font-semibold transition-colors ${
                currentPage === 'analyzer' 
                  ? 'text-purple-600' 
                  : 'text-gray-600 hover:text-purple-600'
              }`}
            >
              Analyzer
            </button>
            <button
              onClick={() => onNavigate('generator')}
              className={`font-semibold transition-colors ${
                currentPage === 'generator' 
                  ? 'text-purple-600' 
                  : 'text-gray-600 hover:text-purple-600'
              }`}
            >
              Generator
            </button>
            <button
              onClick={() => onNavigate('history')}
              className={`font-semibold transition-colors ${
                currentPage === 'history' 
                  ? 'text-purple-600' 
                  : 'text-gray-600 hover:text-purple-600'
              }`}
            >
              History
            </button>
            <button
              onClick={() => onNavigate('pricing')}
              className={`font-semibold transition-colors ${
                currentPage === 'pricing' 
                  ? 'text-purple-600' 
                  : 'text-gray-600 hover:text-purple-600'
              }`}
            >
              Pricing
            </button>
            <button
              onClick={() => onNavigate('compliances')}
              className={`font-semibold transition-colors ${
                currentPage === 'compliances' 
                  ? 'text-purple-600' 
                  : 'text-gray-600 hover:text-purple-600'
              }`}
            >
              Learn
            </button>
            <button
              onClick={() => onNavigate('assessment')}
              className={`font-semibold transition-colors ${
                currentPage === 'assessment' 
                  ? 'text-purple-600' 
                  : 'text-gray-600 hover:text-purple-600'
              }`}
            >
              Assessment
            </button>
          </nav>

          {/* User Actions */}
          <div className="flex items-center space-x-4">
            {user ? (
              <div className="relative">
                {/* Simple Account Button */}
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="group flex items-center space-x-3 bg-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-purple-700 transition-colors duration-300 shadow-md hover:shadow-lg"
                >
                  <div className="w-8 h-8 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
                    <span className="text-sm font-bold">
                      {user.user_metadata?.first_name?.charAt(0) || user.email?.charAt(0) || '?'}
                    </span>
                  </div>
                  <span className="hidden sm:inline">
                    {user.user_metadata?.first_name || 'Account'}
                  </span>
                  <span className="text-sm">▼</span>
                </button>

                {/* Simple User Dropdown Menu */}
                {showUserMenu && (
                  <div className="absolute right-0 mt-3 w-64 bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-50">
                    <div className="px-4 py-3 border-b border-gray-100">
                      <p className="text-lg font-bold text-gray-800">
                        {user.user_metadata?.full_name || 'User'}
                      </p>
                      <p className="text-sm text-gray-600">{user.email}</p>
                    </div>
                    
                    <button
                      onClick={() => {
                        onNavigate('profile');
                        setShowUserMenu(false);
                      }}
                      className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-50 transition-colors duration-200 flex items-center space-x-2"
                    >
                      <span>👤</span>
                      <span>My Profile</span>
                    </button>
                    
                    <button
                      onClick={() => {
                        onNavigate('monitor');
                        setShowUserMenu(false);
                      }}
                      className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-50 transition-colors duration-200 flex items-center space-x-2"
                    >
                      <span>📊</span>
                      <span>Compliance Monitor</span>
                    </button>
                    
                    <div className="border-t border-gray-100 mt-1 pt-1">
                      <button
                        onClick={handleSignOut}
                        className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 transition-colors duration-200 flex items-center space-x-2"
                      >
                        <span>🚪</span>
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => onNavigate('login')}
                  className="text-gray-700 font-semibold hover:text-purple-600 transition-colors"
                >
                  Sign In
                </button>
                <button
                  onClick={() => onNavigate('login')}
                  className="bg-purple-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-purple-700 transition-colors shadow-md"
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
