import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

function UserProfile({ onNavigate }) {
  const { user, signOut, updateProfile, loading } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: user?.user_metadata?.first_name || '',
    lastName: user?.user_metadata?.last_name || '',
    company: user?.user_metadata?.company || '',
    email: user?.email || ''
  });
  const [updating, setUpdating] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setUpdating(true);
    setError('');
    setMessage('');

    try {
      const { data, error } = await updateProfile({
        first_name: formData.firstName,
        last_name: formData.lastName,
        company: formData.company,
        full_name: `${formData.firstName} ${formData.lastName}`.trim()
      });

      if (error) {
        setError(error.message);
      } else {
        setMessage('Profile updated successfully!');
        setIsEditing(false);
        setTimeout(() => setMessage(''), 3000);
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
      console.error('Profile update error:', err);
    } finally {
      setUpdating(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      onNavigate('home');
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-pink-50 flex items-center justify-center">
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-12 shadow-xl border border-white/20">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-purple-600 border-t-transparent mx-auto"></div>
          <p className="text-slate-800 font-bold text-lg mt-4 text-center">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-pink-50">
      {/* Enhanced Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200 p-6 shadow-lg sticky top-0 z-10">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <button
            onClick={() => onNavigate('home')}
            className="group bg-gradient-to-r from-slate-700 to-slate-800 text-white px-6 py-3 rounded-xl font-bold hover:from-slate-800 hover:to-slate-900 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          >
            <span className="flex items-center space-x-2">
              <span className="group-hover:-translate-x-1 transition-transform duration-300">←</span>
              <span>Back to home</span>
            </span>
          </button>
          <div className="text-center">
            <h1 className="text-4xl font-black bg-gradient-to-r from-slate-800 via-purple-700 to-pink-700 bg-clip-text text-transparent">My Account</h1>
            <p className="text-gray-600 mt-1 font-medium">Manage your profile and preferences</p>
          </div>
          <div className="w-24"></div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-12">
        <div className="max-w-3xl mx-auto">
          
          {/* Enhanced Profile Card */}
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-10 mb-10">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center">
                <div className="w-20 h-20 bg-gradient-to-br from-purple-600 via-pink-600 to-purple-700 rounded-2xl flex items-center justify-center mr-6 shadow-lg">
                  <span className="text-3xl text-white font-black">
                    {user?.user_metadata?.first_name?.charAt(0) || user?.email?.charAt(0) || '?'}
                  </span>
                </div>
                <div>
                  <h2 className="text-3xl font-black bg-gradient-to-r from-slate-800 to-purple-700 bg-clip-text text-transparent">
                    {user?.user_metadata?.full_name || 'User Profile'}
                  </h2>
                  <p className="text-gray-600 font-medium text-lg">{user?.email}</p>
                  {user?.user_metadata?.company && (
                    <p className="text-gray-500 font-medium bg-gray-100 px-3 py-1 rounded-lg mt-2 inline-block">{user.user_metadata.company}</p>
                  )}
                </div>
              </div>
              
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl font-bold hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                {isEditing ? 'Cancel' : 'Edit Profile'}
              </button>
            </div>

            {/* Account Status */}
            <div className="bg-green-50 border border-green-200 rounded-osmo p-4 mb-6">
              <div className="flex items-center">
                <span className="text-green-500 mr-2">✅</span>
                <div>
                  <p className="text-green-800 font-semibold">Account Verified</p>
                  <p className="text-green-600 text-sm">Your email has been verified</p>
                </div>
              </div>
            </div>

            {/* Edit Form */}
            {isEditing && (
              <form onSubmit={handleUpdateProfile} className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-osmo-dark mb-2">
                      First Name
                    </label>
                    <input
                      type="text"
                      value={formData.firstName}
                      onChange={(e) => handleInputChange('firstName', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-200 rounded-osmo text-osmo-dark placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-osmo-purple"
                      placeholder="John"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-osmo-dark mb-2">
                      Last Name
                    </label>
                    <input
                      type="text"
                      value={formData.lastName}
                      onChange={(e) => handleInputChange('lastName', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-200 rounded-osmo text-osmo-dark placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-osmo-purple"
                      placeholder="Doe"
                      required
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-bold text-osmo-dark mb-2">
                    Company
                  </label>
                  <input
                    type="text"
                    value={formData.company}
                    onChange={(e) => handleInputChange('company', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-osmo text-osmo-dark placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-osmo-purple"
                    placeholder="Your Company Name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-osmo-dark mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    className="w-full px-4 py-3 border border-gray-200 rounded-osmo text-gray-500 bg-gray-50"
                    disabled
                  />
                  <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
                </div>

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

                <button
                  type="submit"
                  disabled={updating}
                  className="w-full bg-osmo-purple text-white py-3 px-4 rounded-osmo font-bold hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-osmo-purple disabled:bg-gray-400 transition-all shadow-osmo"
                >
                  {updating ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-2"></div>
                      Updating...
                    </div>
                  ) : (
                    'Update Profile'
                  )}
                </button>
              </form>
            )}
          </div>

          {/* Usage Stats */}
          <div className="bg-white rounded-osmo-lg shadow-osmo-lg border border-gray-100 p-8 mb-8">
            <h3 className="text-xl font-black text-osmo-dark mb-6">Usage Statistics</h3>
            <div className="grid grid-cols-3 gap-6 text-center">
              <div>
                <div className="text-3xl font-black text-osmo-blue mb-2">0</div>
                <div className="text-osmo-dark font-semibold">Documents Analyzed</div>
                <div className="text-gray-500 text-sm">Total uploads</div>
              </div>
              <div>
                <div className="text-3xl font-black text-osmo-green mb-2">0</div>
                <div className="text-osmo-dark font-semibold">Compliance Gaps Found</div>
                <div className="text-gray-500 text-sm">Issues identified</div>
              </div>
              <div>
                <div className="text-3xl font-black text-osmo-purple mb-2">0</div>
                <div className="text-osmo-dark font-semibold">Risk Assessments</div>
                <div className="text-gray-500 text-sm">Completed evaluations</div>
              </div>
            </div>
          </div>

          {/* Account Actions */}
          <div className="bg-white rounded-osmo-lg shadow-osmo-lg border border-gray-100 p-8">
            <h3 className="text-xl font-black text-osmo-dark mb-6">Account Actions</h3>
            <div className="space-y-4">
              <button
                onClick={handleSignOut}
                className="w-full bg-red-500 text-white py-3 px-4 rounded-osmo font-bold hover:bg-red-600 transition-all shadow-osmo"
              >
                Sign Out
              </button>
              
              <div className="text-center">
                <p className="text-gray-500 text-sm">
                  Joined: {user?.created_at ? new Date(user.created_at).toLocaleDateString() : 'Recently'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserProfile;
