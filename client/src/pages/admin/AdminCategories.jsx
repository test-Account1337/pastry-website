import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { 
  FiPlus, 
  FiEdit, 
  FiTrash2, 
  FiEye,
  FiMoreVertical,
  FiTag,
  FiFileText
} from 'react-icons/fi';
import { apiService, queryKeys } from '../../utils/api';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const AdminCategories = () => {
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    slug: '',
    color: '#F8BBD9'
  });

  // Fetch categories
  const { data: categoriesData, isLoading } = useQuery(
    queryKeys.categories.adminList(),
    apiService.getAdminCategories,
    {
      staleTime: 5 * 60 * 1000,
    }
  );

  // Create category mutation
  const createMutation = useMutation(apiService.createCategory, {
    onSuccess: () => {
      queryClient.invalidateQueries(queryKeys.categories.lists());
      queryClient.invalidateQueries(queryKeys.categories.adminList());
      setShowForm(false);
      setFormData({ name: '', description: '', slug: '', color: '#F8BBD9' });
    },
  });

  // Update category mutation
  const updateMutation = useMutation(apiService.updateCategory, {
    onSuccess: () => {
      queryClient.invalidateQueries(queryKeys.categories.lists());
      queryClient.invalidateQueries(queryKeys.categories.adminList());
      setShowForm(false);
      setEditingCategory(null);
      setFormData({ name: '', description: '', slug: '', color: '#F8BBD9' });
    },
  });

  // Delete category mutation
  const deleteMutation = useMutation(apiService.deleteCategory, {
    onSuccess: () => {
      queryClient.invalidateQueries(queryKeys.categories.lists());
      queryClient.invalidateQueries(queryKeys.categories.adminList());
    },
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Auto-generate slug from name
    if (name === 'name') {
      const slug = value
        .toLowerCase()
        .replace(/[^a-z0-9 -]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim('-');
      setFormData(prev => ({ ...prev, slug }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      alert('Please enter a category name.');
      return;
    }

    if (editingCategory) {
      updateMutation.mutate({ id: editingCategory._id, ...formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  const handleEdit = (category) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      description: category.description || '',
      slug: category.slug,
      color: category.color || '#F8BBD9'
    });
    setShowForm(true);
  };

  const handleDelete = (categoryId) => {
    if (window.confirm('Are you sure you want to delete this category? This will also affect all articles in this category.')) {
      deleteMutation.mutate(categoryId);
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingCategory(null);
    setFormData({ name: '', description: '', slug: '', color: '#F8BBD9' });
  };

  return (
    <>
      <Helmet>
        <title>Manage Categories - Admin Dashboard</title>
      </Helmet>

      <div className="p-6">
        {/* Header */}
        <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-mocha-700 mb-2">Manage Categories</h1>
            <p className="text-mocha-600">
              {categoriesData?.categories?.length || 0} categories total
            </p>
          </div>
          
          <button
            onClick={() => setShowForm(true)}
            className="btn-primary flex items-center"
          >
            <FiPlus className="mr-2" />
            New Category
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Categories List */}
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
                          Category
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-mocha-500 uppercase tracking-wider">
                          Articles
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-mocha-500 uppercase tracking-wider">
                          Slug
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-mocha-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-cream-200">
                      {categoriesData?.categories?.map((category) => (
                        <motion.tr
                          key={category._id}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="hover:bg-cream-50"
                        >
                          <td className="px-6 py-4">
                            <div className="flex items-center">
                              <div
                                className="w-4 h-4 rounded-full mr-3"
                                style={{ backgroundColor: category.color || '#F8BBD9' }}
                              ></div>
                              <div>
                                <div className="text-sm font-medium text-mocha-900">
                                  {category.name}
                                </div>
                                {category.description && (
                                  <div className="text-sm text-mocha-500">
                                    {category.description}
                                  </div>
                                )}
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center text-sm text-mocha-900">
                              <FiFileText className="mr-1" />
                              {category.articleCount || 0} articles
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <code className="text-sm bg-mocha-100 px-2 py-1 rounded">
                              {category.slug}
                            </code>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center space-x-2">
                              <button
                                onClick={() => handleEdit(category)}
                                className="text-blue-400 hover:text-blue-600"
                                title="Edit"
                              >
                                <FiEdit />
                              </button>
                              <button
                                onClick={() => handleDelete(category._id)}
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

          {/* Category Form */}
          <div className="lg:col-span-1">
            {showForm && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-white rounded-lg shadow-sm border border-cream-200 p-6 sticky top-6"
              >
                <h3 className="text-lg font-semibold text-mocha-700 mb-4">
                  {editingCategory ? 'Edit Category' : 'New Category'}
                </h3>
                
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-mocha-700 mb-2">
                      Category Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="Enter category name..."
                      className="w-full px-3 py-2 border border-mocha-200 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-mocha-700 mb-2">
                      Description
                    </label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      rows={3}
                      placeholder="Brief description of the category..."
                      className="w-full px-3 py-2 border border-mocha-200 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent resize-vertical"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-mocha-700 mb-2">
                      Slug
                    </label>
                    <input
                      type="text"
                      name="slug"
                      value={formData.slug}
                      onChange={handleInputChange}
                      placeholder="category-slug"
                      className="w-full px-3 py-2 border border-mocha-200 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                    />
                    <p className="text-xs text-mocha-500 mt-1">
                      URL-friendly version of the name
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-mocha-700 mb-2">
                      Color
                    </label>
                    <div className="flex items-center space-x-3">
                      <input
                        type="color"
                        name="color"
                        value={formData.color}
                        onChange={handleInputChange}
                        className="w-12 h-10 border border-mocha-200 rounded-lg cursor-pointer"
                      />
                      <input
                        type="text"
                        value={formData.color}
                        onChange={(e) => setFormData(prev => ({ ...prev, color: e.target.value }))}
                        className="flex-1 px-3 py-2 border border-mocha-200 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                        placeholder="#F8BBD9"
                      />
                    </div>
                  </div>

                  <div className="flex space-x-3 pt-4">
                    <button
                      type="submit"
                      disabled={createMutation.isLoading || updateMutation.isLoading}
                      className="flex-1 btn-primary"
                    >
                      {createMutation.isLoading || updateMutation.isLoading ? (
                        <LoadingSpinner size="sm" />
                      ) : (
                        editingCategory ? 'Update Category' : 'Create Category'
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

            {/* Quick Stats */}
            {!showForm && (
              <div className="bg-white rounded-lg shadow-sm border border-cream-200 p-6">
                <h3 className="text-lg font-semibold text-mocha-700 mb-4">Quick Stats</h3>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-mocha-600">Total Categories</span>
                    <span className="font-semibold text-mocha-700">
                      {categoriesData?.categories?.length || 0}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-mocha-600">Total Articles</span>
                    <span className="font-semibold text-mocha-700">
                      {categoriesData?.categories?.reduce((sum, cat) => sum + (cat.articleCount || 0), 0) || 0}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-mocha-600">Most Popular</span>
                    <span className="font-semibold text-mocha-700">
                      {categoriesData?.categories?.reduce((max, cat) => 
                        (cat.articleCount || 0) > (max?.articleCount || 0) ? cat : max
                      )?.name || 'N/A'}
                    </span>
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

export default AdminCategories; 