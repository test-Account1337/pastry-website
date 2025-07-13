import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { 
  FiPlus, 
  FiEdit, 
  FiTrash2, 
  FiUser, 
  FiMail,
  FiShield,
  FiCalendar,
  FiMoreVertical,
  FiCheck,
  FiX
} from 'react-icons/fi';
import { apiService, queryKeys } from '../../utils/api';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const AdminUsers = () => {
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'user',
    isActive: true
  });

  // Fetch users
  const { data: usersData, isLoading } = useQuery(
    ['users', 'public'],
    apiService.getPublicUsers,
    {
      staleTime: 5 * 60 * 1000,
    }
  );

  // Create user mutation
  const createMutation = useMutation(apiService.createUser, {
    onSuccess: () => {
      queryClient.invalidateQueries(queryKeys.users.adminList());
      setShowForm(false);
      setFormData({ name: '', email: '', role: 'user', isActive: true });
    },
  });

  // Update user mutation
  const updateMutation = useMutation(apiService.updateUser, {
    onSuccess: () => {
      queryClient.invalidateQueries(queryKeys.users.adminList());
      setShowForm(false);
      setEditingUser(null);
      setFormData({ name: '', email: '', role: 'user', isActive: true });
    },
  });

  // Delete user mutation
  const deleteMutation = useMutation(apiService.deleteUser, {
    onSuccess: () => {
      queryClient.invalidateQueries(queryKeys.users.adminList());
    },
  });

  // Toggle user status mutation
  const toggleStatusMutation = useMutation(apiService.toggleUserStatus, {
    onSuccess: () => {
      queryClient.invalidateQueries(queryKeys.users.adminList());
    },
  });

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      alert('Please enter a name.');
      return;
    }

    if (!formData.email.trim()) {
      alert('Please enter an email.');
      return;
    }

    if (editingUser) {
      updateMutation.mutate({ id: editingUser._id, ...formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  const handleEdit = (user) => {
    setEditingUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      role: user.role,
      isActive: user.isActive
    });
    setShowForm(true);
  };

  const handleDelete = (userId) => {
    if (window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      deleteMutation.mutate(userId);
    }
  };

  const handleToggleStatus = (userId, currentStatus) => {
    toggleStatusMutation.mutate({ id: userId, isActive: !currentStatus });
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingUser(null);
    setFormData({ name: '', email: '', role: 'user', isActive: true });
  };

  const getRoleBadge = (role) => {
    const roleConfig = {
      admin: { color: 'bg-red-100 text-red-700', text: 'Admin' },
      editor: { color: 'bg-blue-100 text-blue-700', text: 'Editor' },
      user: { color: 'bg-green-100 text-green-700', text: 'User' }
    };
    const config = roleConfig[role] || roleConfig.user;
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${config.color}`}>
        {config.text}
      </span>
    );
  };

  const getStatusBadge = (isActive) => {
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
        isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
      }`}>
        {isActive ? 'Active' : 'Inactive'}
      </span>
    );
  };

  return (
    <>
      <Helmet>
        <title>Manage Users - Admin Dashboard</title>
      </Helmet>

      <div className="p-6">
        {/* Header */}
        <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-mocha-700 mb-2">Manage Users</h1>
            <p className="text-mocha-600">
              {usersData?.length || 0} users total
            </p>
          </div>
          
          <button
            onClick={() => setShowForm(true)}
            className="btn-primary flex items-center"
          >
            <FiPlus className="mr-2" />
            New User
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Users List */}
          <div className="lg:col-span-2">
            {isLoading ? (
              <LoadingSpinner />
            ) : (
              <div className="bg-white rounded-lg shadow-sm border border-cream-200 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-cream-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-mocha-500 uppercase tracking-wider">
                          User
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-mocha-500 uppercase tracking-wider">
                          Role
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-mocha-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-mocha-500 uppercase tracking-wider">
                          Joined
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-mocha-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-cream-200">
                      {usersData?.map((user) => (
                        <motion.tr
                          key={user._id}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="hover:bg-cream-50"
                        >
                          <td className="px-6 py-4">
                            <div className="flex items-center">
                              <div className="w-10 h-10 bg-pink-100 rounded-full flex items-center justify-center mr-3">
                                <FiUser className="text-pink-600" />
                              </div>
                              <div>
                                <div className="text-sm font-medium text-mocha-900">
                                  {user.firstName || ''} {user.lastName || ''}
                                </div>
                                <div className="text-sm text-mocha-500">
                                  {user.email}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            {getRoleBadge(user.role)}
                          </td>
                          <td className="px-6 py-4">
                            {getStatusBadge(user.isActive)}
                          </td>
                          <td className="px-6 py-4 text-sm text-mocha-500">
                            {new Date(user.createdAt).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center space-x-2">
                              <button
                                onClick={() => handleToggleStatus(user._id, user.isActive)}
                                className={`${
                                  user.isActive ? 'text-yellow-400 hover:text-yellow-600' : 'text-green-400 hover:text-green-600'
                                }`}
                                title={user.isActive ? 'Deactivate' : 'Activate'}
                              >
                                {user.isActive ? <FiX /> : <FiCheck />}
                              </button>
                              <button
                                onClick={() => handleEdit(user)}
                                className="text-blue-400 hover:text-blue-600"
                                title="Edit"
                              >
                                <FiEdit />
                              </button>
                              <button
                                onClick={() => handleDelete(user._id)}
                                className="text-red-400 hover:text-red-600"
                                title="Delete"
                              >
                                <FiTrash2 />
                              </button>
                            </div>
                          </td>
                        </motion.tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>

          {/* User Form */}
          <div className="lg:col-span-1">
            {showForm && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-white rounded-lg shadow-sm border border-cream-200 p-6 sticky top-6"
              >
                <h3 className="text-lg font-semibold text-mocha-700 mb-4">
                  {editingUser ? 'Edit User' : 'New User'}
                </h3>
                
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-mocha-700 mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="Enter full name..."
                      className="w-full px-3 py-2 border border-mocha-200 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
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
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="user@example.com"
                      className="w-full px-3 py-2 border border-mocha-200 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-mocha-700 mb-2">
                      Role
                    </label>
                    <select
                      name="role"
                      value={formData.role}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-mocha-200 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                    >
                      <option value="user">User</option>
                      <option value="editor">Editor</option>
                      <option value="admin">Admin</option>
                    </select>
                  </div>

                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      name="isActive"
                      checked={formData.isActive}
                      onChange={handleInputChange}
                      className="h-4 w-4 text-pink-600 focus:ring-pink-500 border-mocha-300 rounded"
                    />
                    <label className="ml-2 block text-sm text-mocha-700">
                      Active Account
                    </label>
                  </div>

                  {!editingUser && (
                    <div className="bg-yellow-50 p-3 rounded-lg">
                      <p className="text-sm text-yellow-700">
                        A temporary password will be sent to the user's email address.
                      </p>
                    </div>
                  )}

                  <div className="flex space-x-3 pt-4">
                    <button
                      type="submit"
                      disabled={createMutation.isLoading || updateMutation.isLoading}
                      className="flex-1 btn-primary"
                    >
                      {createMutation.isLoading || updateMutation.isLoading ? (
                        <LoadingSpinner size="sm" />
                      ) : (
                        editingUser ? 'Update User' : 'Create User'
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={handleCancel}
                      className="flex-1 btn-outline"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </motion.div>
            )}

            {/* User Stats */}
            {!showForm && (
              <div className="bg-white rounded-lg shadow-sm border border-cream-200 p-6">
                <h3 className="text-lg font-semibold text-mocha-700 mb-4">User Statistics</h3>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-mocha-600">Total Users</span>
                    <span className="font-semibold text-mocha-700">
                      {usersData?.length || 0}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-mocha-600">Active Users</span>
                    <span className="font-semibold text-mocha-700">
                      {usersData?.filter(user => user.isActive).length || 0}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-mocha-600">Admins</span>
                    <span className="font-semibold text-mocha-700">
                      {usersData?.filter(user => user.role === 'admin').length || 0}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-mocha-600">Editors</span>
                    <span className="font-semibold text-mocha-700">
                      {usersData?.filter(user => user.role === 'editor').length || 0}
                    </span>
                  </div>
                </div>

                {/* Role Legend */}
                <div className="mt-6 pt-4 border-t border-cream-200">
                  <h4 className="text-sm font-medium text-mocha-700 mb-3">Role Permissions</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center">
                      <span className="w-3 h-3 bg-red-500 rounded-full mr-2"></span>
                      <span className="text-mocha-600">Admin - Full access</span>
                    </div>
                    <div className="flex items-center">
                      <span className="w-3 h-3 bg-blue-500 rounded-full mr-2"></span>
                      <span className="text-mocha-600">Editor - Content management</span>
                    </div>
                    <div className="flex items-center">
                      <span className="w-3 h-3 bg-green-500 rounded-full mr-2"></span>
                      <span className="text-mocha-600">User - Read access</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminUsers; 