import { useState, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useUserAnalytics } from '../hooks/useUserAnalytics';

function UserProfile({ onNavigate }) {
  const { user, signOut, updateProfile, loading } = useAuth();
  const { analytics, loading: analyticsLoading, refreshAnalytics } = useUserAnalytics();
  const [isEditing, setIsEditing] = useState(false);
  const [profileImage, setProfileImage] = useState(user?.user_metadata?.profile_picture || null);
  const [imagePreview, setImagePreview] = useState(null);
  const fileInputRef = useRef(null);
  const [formData, setFormData] = useState({
    firstName: user?.user_metadata?.first_name || '',
    lastName: user?.user_metadata?.last_name || '',
    company: user?.user_metadata?.company || '',
    email: user?.email || '',
    phone: user?.user_metadata?.phone || '',
    title: user?.user_metadata?.title || '',
    bio: user?.user_metadata?.bio || ''
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

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Check file size (limit to 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError('Image size must be less than 5MB');
        return;
      }

      // Check file type
      if (!file.type.startsWith('image/')) {
        setError('Please select a valid image file');
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerImageUpload = () => {
    fileInputRef.current?.click();
  };

  const removeProfileImage = () => {
    setImagePreview(null);
    setProfileImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setUpdating(true);
    setError('');
    setMessage('');

    try {
      const updates = {
        first_name: formData.firstName,
        last_name: formData.lastName,
        company: formData.company,
        phone: formData.phone,
        title: formData.title,
        bio: formData.bio,
        full_name: `${formData.firstName} ${formData.lastName}`.trim()
      };

      // Add profile picture if one was uploaded
      if (imagePreview) {
        updates.profile_picture = imagePreview;
      }

      const { data, error } = await updateProfile(updates);

      if (error) {
        setError(error.message);
      } else {
        setMessage('Profile updated successfully!');
        setIsEditing(false);
        setProfileImage(imagePreview || profileImage);
        setImagePreview(null);
        refreshAnalytics(); // Refresh analytics after profile update
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 relative overflow-hidden">
      {/* Enhanced Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-purple-400/20 to-pink-400/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-cyan-400/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-indigo-400/10 to-purple-400/10 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>

      {/* Enhanced Header */}
      <div className="relative bg-white/80 backdrop-blur-lg border-b border-gray-200/50 shadow-xl sticky top-0 z-20">
        <div className="max-w-6xl mx-auto flex items-center justify-between p-6">
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
            <h1 className="text-5xl font-black bg-gradient-to-r from-slate-800 via-purple-700 to-pink-700 bg-clip-text text-transparent">My Dashboard</h1>
            <p className="text-gray-600 mt-2 font-medium text-lg">Welcome back, manage your compliance journey</p>
          </div>
          <div className="w-24"></div>
        </div>
      </div>

      <div className="relative container mx-auto px-6 py-12 max-w-7xl">
        <div className="max-w-6xl mx-auto">
          
          {/* Enhanced Profile Card with Glass Effect */}
          <div className="bg-white/70 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/30 p-12 lg:p-16 mb-12 relative overflow-hidden">
            {/* Floating Elements */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-400/20 to-pink-400/20 rounded-full blur-2xl"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-br from-blue-400/20 to-cyan-400/20 rounded-full blur-2xl"></div>
            
            <div className="relative flex items-start justify-between mb-8">
              <div className="flex items-start space-x-8">
                {/* Enhanced Profile Photo Section */}
                <div className="relative group">
                  <div className="w-40 h-40 rounded-3xl overflow-hidden shadow-2xl border-4 border-white/60 bg-gradient-to-br from-purple-600 via-pink-600 to-purple-700 flex items-center justify-center relative">
                    {/* Glow Effect */}
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-400/30 to-pink-400/30 blur-xl"></div>
                    
                    {profileImage || imagePreview ? (
                      <img 
                        src={imagePreview || profileImage} 
                        alt="Profile" 
                        className="w-full h-full object-cover relative z-10"
                      />
                    ) : (
                      <span className="text-5xl text-white font-black relative z-10">
                        {user?.user_metadata?.first_name?.charAt(0) || user?.email?.charAt(0) || '?'}
                      </span>
                    )}
                  </div>
                  
                  {/* Enhanced Photo Upload Overlay */}
                  {isEditing && (
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm rounded-3xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 cursor-pointer">
                      <div className="text-center">
                        <button
                          type="button"
                          onClick={triggerImageUpload}
                          className="bg-white/95 backdrop-blur-sm text-gray-800 px-6 py-3 rounded-xl font-bold hover:bg-white transition-all duration-300 mb-3 block w-full shadow-lg transform hover:scale-105"
                        >
                          📸 Upload Photo
                        </button>
                        {(profileImage || imagePreview) && (
                          <button
                            type="button"
                            onClick={removeProfileImage}
                            className="bg-red-500/95 backdrop-blur-sm text-white px-6 py-3 rounded-xl font-bold hover:bg-red-600 transition-all duration-300 block w-full shadow-lg transform hover:scale-105"
                          >
                            🗑️ Remove
                          </button>
                        )}
                      </div>
                    </div>
                  )}
                  
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </div>

                {/* Enhanced Profile Info */}
                <div className="flex-1">
                  <h2 className="text-5xl font-black bg-gradient-to-r from-slate-800 to-purple-700 bg-clip-text text-transparent mb-3">
                    {user?.user_metadata?.full_name || 'User Profile'}
                  </h2>
                  <p className="text-gray-600 font-medium text-xl mb-3">{user?.email}</p>
                  
                  {user?.user_metadata?.title && (
                    <div className="flex items-center mb-3">
                      <span className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-4 py-2 rounded-xl font-bold text-lg shadow-lg">
                        💼 {user.user_metadata.title}
                      </span>
                    </div>
                  )}
                  
                  {user?.user_metadata?.company && (
                    <div className="flex items-center mb-3">
                      <span className="bg-gradient-to-r from-gray-100 to-purple-100 text-gray-700 px-4 py-2 rounded-xl font-bold text-lg shadow-sm border border-gray-200">
                        🏢 {user.user_metadata.company}
                      </span>
                    </div>
                  )}
                  
                  {user?.user_metadata?.phone && (
                    <p className="text-gray-600 font-medium flex items-center mb-3 text-lg">
                      <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-lg mr-3 font-bold">📞</span>
                      {user.user_metadata.phone}
                    </p>
                  )}
                  
                  {user?.user_metadata?.bio && (
                    <div className="mt-4">
                      <p className="text-gray-600 leading-relaxed bg-gradient-to-br from-gray-50 to-blue-50 p-6 rounded-2xl border border-gray-200 shadow-inner">
                        {user.user_metadata.bio}
                      </p>
                    </div>
                  )}
                </div>
              </div>
              
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-2xl font-bold hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-2xl hover:shadow-3xl transform hover:-translate-y-1 hover:scale-105"
              >
                {isEditing ? '❌ Cancel' : '✏️ Edit Profile'}
              </button>
            </div>

            {/* Enhanced Account Status */}
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-2xl p-6 mb-6 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-20 h-20 bg-green-400/20 rounded-full blur-xl"></div>
              <div className="relative flex items-center">
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center mr-4 shadow-lg">
                  <span className="text-white text-xl font-black">✅</span>
                </div>
                <div>
                  <p className="text-green-800 font-black text-xl">Account Verified</p>
                  <p className="text-green-600 text-sm font-medium">Your email has been verified and account is active</p>
                </div>
              </div>
            </div>

            {/* Enhanced Edit Form */}
            {isEditing && (
              <div className="bg-gradient-to-br from-white/80 to-purple-50/80 backdrop-blur-xl p-10 rounded-3xl border-2 border-white/40 shadow-2xl relative overflow-hidden">
                {/* Floating Background Elements */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-400/10 to-pink-400/10 rounded-full blur-2xl"></div>
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-br from-blue-400/10 to-cyan-400/10 rounded-full blur-2xl"></div>
                
                <form onSubmit={handleUpdateProfile} className="space-y-8 relative">
                  <h3 className="text-3xl font-black bg-gradient-to-r from-slate-800 to-purple-700 bg-clip-text text-transparent mb-8 text-center">
                    ✏️ Edit Your Profile
                  </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">
                      First Name *
                    </label>
                    <input
                      type="text"
                      value={formData.firstName}
                      onChange={(e) => handleInputChange('firstName', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl text-slate-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                      placeholder="John"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">
                      Last Name *
                    </label>
                    <input
                      type="text"
                      value={formData.lastName}
                      onChange={(e) => handleInputChange('lastName', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl text-slate-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                      placeholder="Doe"
                      required
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">
                      Company
                    </label>
                    <input
                      type="text"
                      value={formData.company}
                      onChange={(e) => handleInputChange('company', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl text-slate-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                      placeholder="Your Company Name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">
                      Job Title
                    </label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) => handleInputChange('title', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl text-slate-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                      placeholder="Software Engineer, Manager, etc."
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl text-slate-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                    placeholder="+1 (555) 123-4567"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">
                    Bio
                  </label>
                  <textarea
                    value={formData.bio}
                    onChange={(e) => handleInputChange('bio', e.target.value)}
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl text-slate-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all resize-none"
                    placeholder="Tell us a bit about yourself and your role..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl text-gray-500 bg-gray-100 cursor-not-allowed"
                    disabled
                  />
                  <p className="text-xs text-gray-500 mt-1 flex items-center">
                    🔒 Email cannot be changed for security reasons
                  </p>
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
                  className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-4 px-6 rounded-xl font-bold hover:from-purple-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                >
                  {updating ? (
                    <div className="flex items-center justify-center space-x-2">
                      <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                      <span>Updating Profile...</span>
                    </div>
                  ) : (
                    <span className="flex items-center justify-center space-x-2">
                      <span>💾</span>
                      <span>Save Changes</span>
                    </span>
                  )}
                </button>
              </form>
            </div>
            )}
          </div>

          {/* Enhanced Usage Dashboard - Full Width */}
          <div className="mb-12 -mx-6">
            {/* Usage Statistics */}
            <div className="bg-white/70 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/30 p-8 lg:p-12 mx-6 relative overflow-hidden">
              {/* Background Elements */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-2xl"></div>
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-br from-green-400/20 to-cyan-400/20 rounded-full blur-2xl"></div>
              
              <div className="relative">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-10">
                  <h3 className="text-3xl lg:text-4xl font-black bg-gradient-to-r from-slate-800 to-purple-700 bg-clip-text text-transparent mb-4 md:mb-0">
                    📊 Usage Dashboard
                  </h3>
                  <button
                    onClick={refreshAnalytics}
                    className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-6 py-3 rounded-xl hover:from-blue-600 hover:to-purple-600 transition-all duration-300 shadow-lg transform hover:scale-105 font-bold"
                  >
                    🔄 Refresh Analytics
                  </button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8 mb-12">
                  <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-8 rounded-3xl border-2 border-blue-200 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 hover:scale-105 relative overflow-hidden group cursor-pointer">
                    <div className="absolute top-0 right-0 w-20 h-20 bg-blue-400/20 rounded-full blur-xl group-hover:w-24 group-hover:h-24 transition-all duration-300"></div>
                    <div className="relative">
                      <div className="flex items-center justify-between mb-4">
                        <div className="w-12 h-12 bg-blue-500 rounded-2xl flex items-center justify-center shadow-lg">
                          <span className="text-white text-xl font-black">📄</span>
                        </div>
                        <div className="text-blue-400 text-xs font-bold uppercase tracking-wider">This Week</div>
                      </div>
                      <div className="text-5xl font-black text-blue-600 mb-3 leading-none">
                        {analyticsLoading ? (
                          <div className="animate-pulse bg-blue-300 h-12 w-20 rounded-xl"></div>
                        ) : (
                          <span className="animate-in slide-in-from-bottom duration-500">{analytics.documentsAnalyzed}</span>
                        )}
                      </div>
                      <div className="text-blue-800 font-bold text-lg mb-2">Documents Analyzed</div>
                      <div className="text-blue-600 text-sm font-medium bg-blue-100/50 px-3 py-1 rounded-full inline-block">
                        +{analytics.trendData.documentsThisWeek} this week
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-gradient-to-br from-green-50 to-green-100 p-8 rounded-3xl border-2 border-green-200 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 hover:scale-105 relative overflow-hidden group cursor-pointer">
                    <div className="absolute top-0 right-0 w-20 h-20 bg-green-400/20 rounded-full blur-xl group-hover:w-24 group-hover:h-24 transition-all duration-300"></div>
                    <div className="relative">
                      <div className="flex items-center justify-between mb-4">
                        <div className="w-12 h-12 bg-green-500 rounded-2xl flex items-center justify-center shadow-lg">
                          <span className="text-white text-xl font-black">🔍</span>
                        </div>
                        <div className="text-green-400 text-xs font-bold uppercase tracking-wider">Identified</div>
                      </div>
                      <div className="text-5xl font-black text-green-600 mb-3 leading-none">
                        {analyticsLoading ? (
                          <div className="animate-pulse bg-green-300 h-12 w-20 rounded-xl"></div>
                        ) : (
                          <span className="animate-in slide-in-from-bottom duration-700">{analytics.gapsFound}</span>
                        )}
                      </div>
                      <div className="text-green-800 font-bold text-lg mb-2">Gaps Found</div>
                      <div className="text-green-600 text-sm font-medium bg-green-100/50 px-3 py-1 rounded-full inline-block">
                        {analytics.trendData.gapsResolved > 0 ? `-${analytics.trendData.gapsResolved} resolved` : 'Track progress'}
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-8 rounded-3xl border-2 border-purple-200 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 hover:scale-105 relative overflow-hidden group cursor-pointer">
                    <div className="absolute top-0 right-0 w-20 h-20 bg-purple-400/20 rounded-full blur-xl group-hover:w-24 group-hover:h-24 transition-all duration-300"></div>
                    <div className="relative">
                      <div className="flex items-center justify-between mb-4">
                        <div className="w-12 h-12 bg-purple-500 rounded-2xl flex items-center justify-center shadow-lg">
                          <span className="text-white text-xl font-black">🛡️</span>
                        </div>
                        <div className="text-purple-400 text-xs font-bold uppercase tracking-wider">Completed</div>
                      </div>
                      <div className="text-5xl font-black text-purple-600 mb-3 leading-none">
                        {analyticsLoading ? (
                          <div className="animate-pulse bg-purple-300 h-12 w-20 rounded-xl"></div>
                        ) : (
                          <span className="animate-in slide-in-from-bottom duration-900">{analytics.riskAssessments}</span>
                        )}
                      </div>
                      <div className="text-purple-800 font-bold text-lg mb-2">Risk Assessments</div>
                      <div className="text-purple-600 text-sm font-medium bg-purple-100/50 px-3 py-1 rounded-full inline-block">
                        {analytics.riskAssessments > 0 ? 'Completed' : 'Get started'}
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-8 rounded-3xl border-2 border-orange-200 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 hover:scale-105 relative overflow-hidden group cursor-pointer">
                    <div className="absolute top-0 right-0 w-20 h-20 bg-orange-400/20 rounded-full blur-xl group-hover:w-24 group-hover:h-24 transition-all duration-300"></div>
                    <div className="relative">
                      <div className="flex items-center justify-between mb-4">
                        <div className="w-12 h-12 bg-orange-500 rounded-2xl flex items-center justify-center shadow-lg">
                          <span className="text-white text-xl font-black">📊</span>
                        </div>
                        <div className="text-orange-400 text-xs font-bold uppercase tracking-wider">Average</div>
                      </div>
                      <div className="text-5xl font-black text-orange-600 mb-3 leading-none">
                        {analyticsLoading ? (
                          <div className="animate-pulse bg-orange-300 h-12 w-20 rounded-xl"></div>
                        ) : (
                          <span className="animate-in slide-in-from-bottom duration-1100">{analytics.averageComplianceScore}%</span>
                        )}
                      </div>
                      <div className="text-orange-800 font-bold text-lg mb-2">Compliance Score</div>
                      <div className="text-orange-600 text-sm font-medium bg-orange-100/50 px-3 py-1 rounded-full inline-block">
                        {analytics.trendData.improvementPercentage !== 0 
                          ? `${analytics.trendData.improvementPercentage > 0 ? '+' : ''}${analytics.trendData.improvementPercentage}% trend`
                          : 'No trend data'
                        }
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Recent Activity */}
                <div className="bg-gradient-to-br from-gray-50 to-purple-50 p-6 rounded-xl border border-white/50">
                  <h4 className="font-black text-slate-800 mb-4 flex items-center">
                    🕒 Recent Activity
                  </h4>
                  {analyticsLoading ? (
                    <div className="space-y-3">
                      {[1, 2, 3].map(i => (
                        <div key={i} className="animate-pulse p-3 bg-gray-200 rounded-lg"></div>
                      ))}
                    </div>
                  ) : analytics.recentActivity.length > 0 ? (
                    <div className="space-y-3">
                    {analytics.recentActivity.map((activity, index) => (
                      <div key={activity.id || index} className="flex items-center justify-between p-3 bg-white rounded-lg shadow-sm">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                            {activity.type === 'policy_analysis' ? '�' : '�🛡️'}
                          </div>
                          <div>
                            <p className="font-bold text-slate-800 text-sm">{activity.title}</p>
                            <p className="text-gray-500 text-xs">
                              {new Date(activity.timestamp).toLocaleDateString()} • {activity.description}
                            </p>
                          </div>
                        </div>
                        <span className={`px-2 py-1 rounded-lg text-xs font-bold ${
                          activity.status === 'success' ? 'bg-green-100 text-green-700' :
                          activity.status === 'warning' ? 'bg-orange-100 text-orange-700' :
                          'bg-red-100 text-red-700'
                        }`}>
                          {activity.score ? `${activity.score}%` : 
                           activity.status === 'success' ? '✅ Complete' :
                           activity.status === 'warning' ? '⏳ Review' : '❌ Action Needed'}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <div className="text-4xl mb-3">📊</div>
                    <p className="text-gray-500 text-sm">No recent activity</p>
                    <p className="text-gray-400 text-xs">Start analyzing documents to see activity here</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          
          {/* Quick Actions & Account Info Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 mb-12">
            {/* Quick Actions - Enhanced */}
            <div className="lg:col-span-2 bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 p-10">
              <h3 className="text-2xl font-black bg-gradient-to-r from-slate-800 to-purple-700 bg-clip-text text-transparent mb-8 flex items-center">
                ⚡ Quick Actions
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <button
                  onClick={() => onNavigate('analyzer')}
                  className="group bg-gradient-to-r from-blue-500 to-blue-600 text-white p-6 rounded-2xl font-bold hover:from-blue-600 hover:to-blue-700 transition-all duration-300 transform hover:-translate-y-1 hover:scale-105 shadow-lg hover:shadow-2xl flex flex-col items-center space-y-3"
                >
                  <div className="text-4xl group-hover:scale-110 transition-transform duration-300">🔍</div>
                  <span className="text-lg">Analyze Document</span>
                  <span className="text-sm opacity-80">Upload and analyze compliance documents</span>
                </button>
                <button
                  onClick={() => onNavigate('generator')}
                  className="group bg-gradient-to-r from-green-500 to-green-600 text-white p-6 rounded-2xl font-bold hover:from-green-600 hover:to-green-700 transition-all duration-300 transform hover:-translate-y-1 hover:scale-105 shadow-lg hover:shadow-2xl flex flex-col items-center space-y-3"
                >
                  <div className="text-4xl group-hover:scale-110 transition-transform duration-300">⚡</div>
                  <span className="text-lg">Generate Policy</span>
                  <span className="text-sm opacity-80">Create custom compliance policies</span>
                </button>
                <button
                  onClick={() => onNavigate('assessment')}
                  className="group bg-gradient-to-r from-purple-500 to-purple-600 text-white p-6 rounded-2xl font-bold hover:from-purple-600 hover:to-purple-700 transition-all duration-300 transform hover:-translate-y-1 hover:scale-105 shadow-lg hover:shadow-2xl flex flex-col items-center space-y-3"
                >
                  <div className="text-4xl group-hover:scale-110 transition-transform duration-300">🛡️</div>
                  <span className="text-lg">Risk Assessment</span>
                  <span className="text-sm opacity-80">Evaluate organizational risks</span>
                </button>
                <button
                  onClick={() => onNavigate('history')}
                  className="group bg-gradient-to-r from-indigo-500 to-indigo-600 text-white p-6 rounded-2xl font-bold hover:from-indigo-600 hover:to-indigo-700 transition-all duration-300 transform hover:-translate-y-1 hover:scale-105 shadow-lg hover:shadow-2xl flex flex-col items-center space-y-3"
                >
                  <div className="text-4xl group-hover:scale-110 transition-transform duration-300">📋</div>
                  <span className="text-lg">View History</span>
                  <span className="text-sm opacity-80">Browse past analyses and reports</span>
                </button>
              </div>
            </div>

            {/* Account Info */}
            <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 p-10">
              <h3 className="text-2xl font-black bg-gradient-to-r from-slate-800 to-purple-700 bg-clip-text text-transparent mb-8 flex items-center">
                👤 Account Overview
              </h3>
              <div className="space-y-6">
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-2xl p-6">
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="w-10 h-10 bg-green-500 rounded-xl flex items-center justify-center">
                      <span className="text-white text-lg font-black">✅</span>
                    </div>
                    <span className="text-green-800 font-bold text-lg">Account Verified</span>
                  </div>
                  <p className="text-green-600 text-sm">Your email has been verified and account is active</p>
                </div>
                
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-2xl p-6">
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center">
                      <span className="text-white text-lg font-black">💎</span>
                    </div>
                    <span className="text-blue-800 font-bold text-lg">{analytics.planUsage?.planType || 'Free'} Plan</span>
                  </div>
                  <p className="text-blue-600 text-sm mb-3">
                    {analytics.planUsage?.current || 0}/{analytics.planUsage?.limit || 10} analyses used this month
                  </p>
                  <div className="w-full bg-blue-200 rounded-full h-3 mb-3">
                    <div 
                      className="bg-gradient-to-r from-blue-500 to-blue-600 h-3 rounded-full transition-all duration-500" 
                      style={{ width: `${Math.min(((analytics.planUsage?.current || 0) / (analytics.planUsage?.limit || 10)) * 100, 100)}%` }}
                    ></div>
                  </div>
                  <button
                    onClick={() => onNavigate('pricing')}
                    className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white px-4 py-2 rounded-xl font-bold hover:from-blue-600 hover:to-blue-700 transition-all duration-300 transform hover:scale-105 shadow-lg text-sm"
                  >
                    {(analytics.planUsage?.current || 0) >= (analytics.planUsage?.limit || 10) ? 'Upgrade Now →' : 'Upgrade Plan →'}
                  </button>
                </div>

                <div className="text-center pt-4 border-t border-gray-200">
                  <p className="text-gray-500 text-sm font-medium">
                    Member since: {user?.created_at ? new Date(user.created_at).toLocaleDateString() : 'Recently'}
                  </p>
                  {!analyticsLoading && (analytics.accountAge || 0) > 0 && (
                    <p className="text-gray-400 text-xs mt-2">
                      {analytics.accountAge} days • Welcome to Poligap! 🎉
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Dynamic Insights & Recommendations */}
          {!analyticsLoading && analytics.documentsAnalyzed > 0 && (
            <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 p-10 mb-12">
              <h3 className="text-2xl font-black bg-gradient-to-r from-slate-800 to-purple-700 bg-clip-text text-transparent mb-8 flex items-center">
                💡 Personalized Insights
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Compliance Insights */}
                <div className="bg-gradient-to-br from-blue-50 to-purple-50 p-6 rounded-xl border border-white/50">
                  <h4 className="font-black text-slate-800 mb-3 flex items-center">
                    📊 Compliance Journey
                  </h4>
                  <div className="space-y-3">
                    {analytics.averageComplianceScore >= 80 ? (
                      <div className="flex items-center space-x-2">
                        <span className="text-green-500">🌟</span>
                        <span className="text-green-700 text-sm font-medium">
                          Excellent compliance performance! You're in the top tier.
                        </span>
                      </div>
                    ) : analytics.averageComplianceScore >= 60 ? (
                      <div className="flex items-center space-x-2">
                        <span className="text-yellow-500">⚡</span>
                        <span className="text-yellow-700 text-sm font-medium">
                          Good progress! Focus on addressing high-priority gaps.
                        </span>
                      </div>
                    ) : (
                      <div className="flex items-center space-x-2">
                        <span className="text-red-500">🎯</span>
                        <span className="text-red-700 text-sm font-medium">
                          Opportunity for improvement. Start with critical compliance gaps.
                        </span>
                      </div>
                    )}
                    
                    {analytics.trendData.improvementPercentage > 0 && (
                      <div className="flex items-center space-x-2">
                        <span className="text-green-500">📈</span>
                        <span className="text-green-700 text-sm font-medium">
                          Your compliance scores are trending upward by {analytics.trendData.improvementPercentage}%
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Action Recommendations */}
                <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-6 rounded-xl border border-white/50">
                  <h4 className="font-black text-slate-800 mb-3 flex items-center">
                    🚀 Next Steps
                  </h4>
                  <div className="space-y-3">
                    {analytics.riskAssessments === 0 && (
                      <div className="flex items-center space-x-2">
                        <span className="text-purple-500">🛡️</span>
                        <span className="text-purple-700 text-sm font-medium">
                          Complete your first risk assessment to get comprehensive insights
                        </span>
                      </div>
                    )}
                    
                    {analytics.documentsAnalyzed < 5 && (
                      <div className="flex items-center space-x-2">
                        <span className="text-blue-500">📄</span>
                        <span className="text-blue-700 text-sm font-medium">
                          Analyze more documents to build a complete compliance picture
                        </span>
                      </div>
                    )}
                    
                    {analytics.planUsage.current >= analytics.planUsage.limit * 0.8 && (
                      <div className="flex items-center space-x-2">
                        <span className="text-yellow-500">💎</span>
                        <span className="text-yellow-700 text-sm font-medium">
                          Consider upgrading your plan for unlimited analysis
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Account Actions & Settings */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {/* Security Settings */}
            <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 p-10">
              <h3 className="text-xl font-black bg-gradient-to-r from-slate-800 to-purple-700 bg-clip-text text-transparent mb-8 flex items-center">
                🔐 Security & Privacy
              </h3>
              <div className="space-y-5">
                <button className="w-full bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 p-4 rounded-xl font-bold hover:from-gray-200 hover:to-gray-300 transition-all duration-300 text-left flex items-center justify-between">
                  <span className="flex items-center space-x-3">
                    <span>🔑</span>
                    <span>Change Password</span>
                  </span>
                  <span>→</span>
                </button>
                
                <button className="w-full bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 p-4 rounded-xl font-bold hover:from-gray-200 hover:to-gray-300 transition-all duration-300 text-left flex items-center justify-between">
                  <span className="flex items-center space-x-3">
                    <span>🛡️</span>
                    <span>Two-Factor Authentication</span>
                  </span>
                  <span className="bg-red-100 text-red-600 px-2 py-1 rounded-lg text-xs">
                    Not Enabled
                  </span>
                </button>
                
                <button className="w-full bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 p-4 rounded-xl font-bold hover:from-gray-200 hover:to-gray-300 transition-all duration-300 text-left flex items-center justify-between">
                  <span className="flex items-center space-x-3">
                    <span>📱</span>
                    <span>Connected Devices</span>
                  </span>
                  <span>→</span>
                </button>
              </div>
            </div>

            {/* Account Management */}
            <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 p-10">
              <h3 className="text-xl font-black bg-gradient-to-r from-slate-800 to-purple-700 bg-clip-text text-transparent mb-8 flex items-center">
                ⚙️ Account Management
              </h3>
              <div className="space-y-5">
                <button className="w-full bg-gradient-to-r from-blue-100 to-blue-200 text-blue-700 p-4 rounded-xl font-bold hover:from-blue-200 hover:to-blue-300 transition-all duration-300 text-left flex items-center justify-between">
                  <span className="flex items-center space-x-3">
                    <span>📊</span>
                    <span>Export My Data</span>
                  </span>
                  <span>→</span>
                </button>
                
                <button className="w-full bg-gradient-to-r from-yellow-100 to-yellow-200 text-yellow-700 p-4 rounded-xl font-bold hover:from-yellow-200 hover:to-yellow-300 transition-all duration-300 text-left flex items-center justify-between">
                  <span className="flex items-center space-x-3">
                    <span>📧</span>
                    <span>Email Preferences</span>
                  </span>
                  <span>→</span>
                </button>
                
                <button
                  onClick={handleSignOut}
                  className="w-full bg-gradient-to-r from-red-500 to-red-600 text-white p-4 rounded-xl font-bold hover:from-red-600 hover:to-red-700 transition-all duration-300 transform hover:-translate-y-0.5 shadow-lg hover:shadow-xl flex items-center justify-center space-x-3"
                >
                  <span>🚪</span>
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          </div>
        </div>
        </div>
      </div>
    </div>
  );
}

export default UserProfile;
