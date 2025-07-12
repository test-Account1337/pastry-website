import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { useAuth } from '../../context/AuthContext.jsx';
import { 
  FiUser, 
  FiMail, 
  FiLock, 
  FiSave,
  FiCamera,
  FiShield,
  FiSettings,
  FiBell,
  FiKey
} from 'react-icons/fi';
import { apiService, queryKeys } from '../../utils/api';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const AdminProfile = () => {
  const { user, updateUser } = useAuth();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState('profile');
  const [imageUploading, setImageUploading] = useState(false);

  // Profile form state
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    bio: user?.bio || '',
    avatar: user?.avatar || ''
  });

  // Password form state
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  // Settings form state
  const [settingsData, setSettingsData] = useState({
    emailNotifications: true,
    pushNotifications: false,
    newsletterSubscribed: true,
    language: 'en',
    timezone: 'UTC'
  });

  // Update profile mutation
  const updateProfileMutation = useMutation(apiService.updateProfile, {
    onSuccess: (data) => {
      updateUser(data.user);
      queryClient.invalidateQueries(queryKeys.users.profile());
    },
  });

  // Change password mutation
  const changePasswordMutation = useMutation(apiService.changePassword, {
    onSuccess: () => {
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      alert('Password updated successfully!');
    },
  });

  // Update settings mutation
  const updateSettingsMutation = useMutation(apiService.updateSettings, {
    onSuccess: () => {
      alert('Settings updated successfully!');
    },
  });

  const handleProfileInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePasswordInputChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSettingsInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSettingsData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleProfileSubmit = (e) => {
    e.preventDefault();
    updateProfileMutation.mutate(profileData);
  };

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert('New passwords do not match.');
      return;
    }

    if (passwordData.newPassword.length < 6) {
      alert('New password must be at least 6 characters long.');
      return;
    }

    changePasswordMutation.mutate({
      currentPassword: passwordData.currentPassword,
      newPassword: passwordData.newPassword
    });
  };

  const handleSettingsSubmit = (e) => {
    e.preventDefault();
    updateSettingsMutation.mutate(settingsData);
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setImageUploading(true);
    try {
      const formData = new FormData();
      formData.append('image', file);
      
      const response = await apiService.uploadImage(formData);
      setProfileData(prev => ({
        ...prev,
        avatar: response.url
      }));
    } catch (error) {
      console.error('Image upload error:', error);
      alert('Error uploading image. Please try again.');
    } finally {
      setImageUploading(false);
    }
  };

  const tabs = [
    { id: 'profile', label: 'Profile', icon: FiUser },
    { id: 'password', label: 'Password', icon: FiLock },
    { id: 'settings', label: 'Settings', icon: FiSettings }
  ];

  return (
    <>
      <Helmet>
        <title>Profile Settings - Admin Dashboard</title>
      </Helmet>

      <div className="p-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-mocha-700 mb-2">Profile Settings</h1>
          <p className="text-mocha-600">
            Manage your account settings and preferences
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border border-cream-200 p-6">
              {/* User Info */}
              <div className="text-center mb-6">
                <div className="relative inline-block">
                  <div className="w-20 h-20 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    {profileData.avatar ? (
                      <img
                        src={profileData.avatar}
                        alt={profileData.name}
                        className="w-20 h-20 rounded-full object-cover"
                      />
                    ) : (
                      <FiUser className="text-3xl text-pink-600" />
                    )}
                  </div>
                  <label className="absolute bottom-0 right-0 bg-pink-500 text-white p-2 rounded-full cursor-pointer hover:bg-pink-600">
                    <FiCamera size={16} />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </label>
                </div>
                <h3 className="text-lg font-semibold text-mocha-700">{profileData.name}</h3>
                <p className="text-mocha-500">{profileData.email}</p>
                <div className="mt-2">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-700">
                    <FiShield className="mr-1" />
                    Admin
                  </span>
                </div>
              </div>

              {/* Navigation Tabs */}
              <nav className="space-y-2">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center px-3 py-2 rounded-lg text-left transition-colors ${
                        activeTab === tab.id
                          ? 'bg-pink-100 text-pink-700'
                          : 'text-mocha-600 hover:bg-mocha-50'
                      }`}
                    >
                      <Icon className="mr-3" />
                      {tab.label}
                    </button>
                  );
                })}
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-lg shadow-sm border border-cream-200 p-6">
              {/* Profile Tab */}
              {activeTab === 'profile' && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                >
                  <h2 className="text-2xl font-bold text-mocha-700 mb-6">Profile Information</h2>
                  
                  <form onSubmit={handleProfileSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-mocha-700 mb-2">
                          Full Name *
                        </label>
                        <input
                          type="text"
                          name="name"
                          value={profileData.name}
                          onChange={handleProfileInputChange}
                          className="w-full px-4 py-3 border border-mocha-200 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-mocha-700 mb-2">
                          Email Address *
                        </label>
                        <input
                          type="email"
                          name="email"
                          value={profileData.email}
                          onChange={handleProfileInputChange}
                          className="w-full px-4 py-3 border border-mocha-200 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-mocha-700 mb-2">
                        Bio
                      </label>
                      <textarea
                        name="bio"
                        value={profileData.bio}
                        onChange={handleProfileInputChange}
                        rows={4}
                        placeholder="Tell us a bit about yourself..."
                        className="w-full px-4 py-3 border border-mocha-200 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent resize-vertical"
                      />
                    </div>

                    <div className="flex justify-end">
                      <button
                        type="submit"
                        disabled={updateProfileMutation.isLoading}
                        className="btn-primary flex items-center"
                      >
                        {updateProfileMutation.isLoading ? (
                          <LoadingSpinner size="sm" />
                        ) : (
                          <FiSave className="mr-2" />
                        )}
                        Save Changes
                      </button>
                    </div>
                  </form>
                </motion.div>
              )}

              {/* Password Tab */}
              {activeTab === 'password' && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                >
                  <h2 className="text-2xl font-bold text-mocha-700 mb-6">Change Password</h2>
                  
                  <form onSubmit={handlePasswordSubmit} className="space-y-6 max-w-md">
                    <div>
                      <label className="block text-sm font-medium text-mocha-700 mb-2">
                        Current Password *
                      </label>
                      <input
                        type="password"
                        name="currentPassword"
                        value={passwordData.currentPassword}
                        onChange={handlePasswordInputChange}
                        className="w-full px-4 py-3 border border-mocha-200 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-mocha-700 mb-2">
                        New Password *
                      </label>
                      <input
                        type="password"
                        name="newPassword"
                        value={passwordData.newPassword}
                        onChange={handlePasswordInputChange}
                        className="w-full px-4 py-3 border border-mocha-200 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-mocha-700 mb-2">
                        Confirm New Password *
                      </label>
                      <input
                        type="password"
                        name="confirmPassword"
                        value={passwordData.confirmPassword}
                        onChange={handlePasswordInputChange}
                        className="w-full px-4 py-3 border border-mocha-200 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                        required
                      />
                    </div>

                    <div className="bg-yellow-50 p-4 rounded-lg">
                      <div className="flex">
                        <FiKey className="text-yellow-400 mr-2 mt-0.5" />
                        <div>
                          <h4 className="text-sm font-medium text-yellow-800">Password Requirements</h4>
                          <ul className="text-sm text-yellow-700 mt-1 space-y-1">
                            <li>• At least 6 characters long</li>
                            <li>• Include uppercase and lowercase letters</li>
                            <li>• Include numbers and special characters</li>
                          </ul>
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-end">
                      <button
                        type="submit"
                        disabled={changePasswordMutation.isLoading}
                        className="btn-primary flex items-center"
                      >
                        {changePasswordMutation.isLoading ? (
                          <LoadingSpinner size="sm" />
                        ) : (
                          <FiLock className="mr-2" />
                        )}
                        Update Password
                      </button>
                    </div>
                  </form>
                </motion.div>
              )}

              {/* Settings Tab */}
              {activeTab === 'settings' && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                >
                  <h2 className="text-2xl font-bold text-mocha-700 mb-6">Account Settings</h2>
                  
                  <form onSubmit={handleSettingsSubmit} className="space-y-6">
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-mocha-700">Notifications</h3>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <label className="text-sm font-medium text-mocha-700">Email Notifications</label>
                          <p className="text-sm text-mocha-500">Receive updates via email</p>
                        </div>
                        <input
                          type="checkbox"
                          name="emailNotifications"
                          checked={settingsData.emailNotifications}
                          onChange={handleSettingsInputChange}
                          className="h-4 w-4 text-pink-600 focus:ring-pink-500 border-mocha-300 rounded"
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <label className="text-sm font-medium text-mocha-700">Push Notifications</label>
                          <p className="text-sm text-mocha-500">Receive browser notifications</p>
                        </div>
                        <input
                          type="checkbox"
                          name="pushNotifications"
                          checked={settingsData.pushNotifications}
                          onChange={handleSettingsInputChange}
                          className="h-4 w-4 text-pink-600 focus:ring-pink-500 border-mocha-300 rounded"
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <label className="text-sm font-medium text-mocha-700">Newsletter</label>
                          <p className="text-sm text-mocha-500">Subscribe to our newsletter</p>
                        </div>
                        <input
                          type="checkbox"
                          name="newsletterSubscribed"
                          checked={settingsData.newsletterSubscribed}
                          onChange={handleSettingsInputChange}
                          className="h-4 w-4 text-pink-600 focus:ring-pink-500 border-mocha-300 rounded"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-mocha-700 mb-2">
                          Language
                        </label>
                        <select
                          name="language"
                          value={settingsData.language}
                          onChange={handleSettingsInputChange}
                          className="w-full px-3 py-2 border border-mocha-200 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                        >
                          <option value="en">English</option>
                          <option value="es">Spanish</option>
                          <option value="fr">French</option>
                          <option value="de">German</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-mocha-700 mb-2">
                          Timezone
                        </label>
                        <select
                          name="timezone"
                          value={settingsData.timezone}
                          onChange={handleSettingsInputChange}
                          className="w-full px-3 py-2 border border-mocha-200 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                        >
                          <option value="UTC">UTC</option>
                          <option value="EST">Eastern Time</option>
                          <option value="PST">Pacific Time</option>
                          <option value="GMT">GMT</option>
                        </select>
                      </div>
                    </div>

                    <div className="flex justify-end">
                      <button
                        type="submit"
                        disabled={updateSettingsMutation.isLoading}
                        className="btn-primary flex items-center"
                      >
                        {updateSettingsMutation.isLoading ? (
                          <LoadingSpinner size="sm" />
                        ) : (
                          <FiSettings className="mr-2" />
                        )}
                        Save Settings
                      </button>
                    </div>
                  </form>
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminProfile; 