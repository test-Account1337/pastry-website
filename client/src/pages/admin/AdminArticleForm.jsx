import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { 
  FiSave, 
  FiEye, 
  FiX, 
  FiUpload,
  FiImage,
  FiTag,
  FiCalendar,
  FiUser
} from 'react-icons/fi';
import { apiService, queryKeys } from '../../utils/api';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const AdminArticleForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const isEditing = !!id;

  const [formData, setFormData] = useState({
    title: '',
    excerpt: '',
    content: '',
    category: '',
    tags: [],
    status: 'draft',
    featuredImage: '',
    metaTitle: '',
    metaDescription: ''
  });

  const [tagInput, setTagInput] = useState('');
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [imageUploading, setImageUploading] = useState(false);

  const DEFAULT_FEATURED_IMAGE = '/images/default-featured.jpg';

  // Fetch article for editing
  const { data: article, isLoading: articleLoading } = useQuery(
    queryKeys.articles.detail(id),
    () => apiService.getArticle(id),
    {
      enabled: isEditing,
      staleTime: 5 * 60 * 1000,
    }
  );

  // Fetch categories
  const { data: categoriesData } = useQuery(
    queryKeys.categories.lists(),
    apiService.getCategories,
    {
      staleTime: 10 * 60 * 1000,
    }
  );

  // Save article mutation
  const saveMutation = useMutation(
    isEditing ? apiService.updateArticle : apiService.createArticle,
    {
      onSuccess: (data) => {
        queryClient.invalidateQueries([...queryKeys.articles.all, 'admin']);
        queryClient.invalidateQueries(queryKeys.articles.lists());
        navigate('/admin/articles');
      },
      onError: (error) => {
        console.error('Save error:', error);
        alert('Error saving article. Please try again.');
      }
    }
  );

  // Load article data for editing
  useEffect(() => {
    if (article) {
      setFormData({
        title: article.title || '',
        excerpt: article.excerpt || '',
        content: article.content || '',
        category: article.category?._id || '',
        tags: article.tags || [],
        status: article.status || 'draft',
        featuredImage: article.featuredImage || '',
        metaTitle: article.metaTitle || '',
        metaDescription: article.metaDescription || ''
      });
    }
  }, [article]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleTagAdd = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()]
      }));
      setTagInput('');
    }
  };

  const handleTagRemove = (tagToRemove) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setImageUploading(true);
    try {
      console.log('📁 Frontend: File selected:', {
        name: file.name,
        type: file.type,
        size: file.size
      });

      const formData = new FormData();
      formData.append('image', file);
      
      console.log('📤 Frontend: Sending FormData...');
      const response = await apiService.uploadImage(formData);
      console.log('✅ Frontend: Upload successful:', response);
      
      // Handle both response formats
      const imageUrl = response.data?.image?.url || response.data?.url || response.image?.url || response.url;
      
      if (imageUrl) {
        setFormData(prev => ({
          ...prev,
          featuredImage: imageUrl
        }));
        console.log('✅ Frontend: Image URL set:', imageUrl);
      } else {
        console.error('❌ Frontend: No image URL in response:', response);
        alert('Upload successful but no image URL received');
      }
    } catch (error) {
      console.error('❌ Frontend: Image upload error:', error);
      let errorMessage = 'Error uploading image. Please try again.';
      
      if (error.response?.status === 400) {
        errorMessage = 'Invalid image file. Please select a valid image.';
      } else if (error.response?.status === 401) {
        errorMessage = 'Authentication required. Please log in again.';
      } else if (error.response?.status === 500) {
        errorMessage = 'Server error. Please check if the server is running and Cloudinary is configured.';
      }
      
      alert(errorMessage);
    } finally {
      setImageUploading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.title.trim()) {
      alert('Please enter a title for the article.');
      return;
    }

    if (!formData.content.trim()) {
      alert('Please enter content for the article.');
      return;
    }

    if (!formData.category) {
      alert('Please select a category for the article.');
      return;
    }

    // Use default image if none uploaded
    const featuredImage = formData.featuredImage || DEFAULT_FEATURED_IMAGE;

    const submitData = {
      ...formData,
      title: formData.title.trim(),
      excerpt: formData.excerpt.trim(),
      content: formData.content.trim(),
      featuredImage,
    };

    if (isEditing) {
      saveMutation.mutate({ id, ...submitData });
    } else {
      saveMutation.mutate(submitData);
    }
  };

  const generateSlug = () => {
    const slug = formData.title
      .toLowerCase()
      .replace(/[^a-z0-9 -]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim('-');
    return slug;
  };

  if (articleLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>{isEditing ? 'Edit News' : 'New News'} - UACP Admin</title>
      </Helmet>

      <div className="p-6">
        {/* Header */}
        <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-eternity-700 mb-2">
              {isEditing ? 'Edit News' : 'New News'}
            </h1>
            <p className="text-eternity-600">
              {isEditing ? 'Update your news content and settings' : 'Create a new news item for your readers'}
            </p>
          </div>
          
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setIsPreviewMode(!isPreviewMode)}
              className="btn-outline flex items-center"
            >
              <FiEye className="mr-2" />
              {isPreviewMode ? 'Edit Mode' : 'Preview'}
            </button>
            <button
              onClick={handleSubmit}
              disabled={saveMutation.isLoading}
              className="btn-primary flex items-center"
            >
              {saveMutation.isLoading ? (
                <LoadingSpinner size="sm" />
              ) : (
                <FiSave className="mr-2" />
              )}
              {isEditing ? 'Update Article' : 'Publish Article'}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm border border-cream-200 p-6">
              {/* Title */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-mocha-700 mb-2">
                  Article Title *
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="Enter article title..."
                  className="w-full px-4 py-3 border border-mocha-200 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent text-lg"
                />
                {formData.title && (
                  <p className="text-sm text-mocha-500 mt-2">
                    Slug: {generateSlug()}
                  </p>
                )}
              </div>

              {/* Excerpt */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-mocha-700 mb-2">
                  Excerpt
                </label>
                <textarea
                  name="excerpt"
                  value={formData.excerpt}
                  onChange={handleInputChange}
                  rows={3}
                  placeholder="Brief description of the article..."
                  className="w-full px-4 py-3 border border-mocha-200 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent resize-vertical"
                />
              </div>

              {/* Content */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-mocha-700 mb-2">
                  Content *
                </label>
                <textarea
                  name="content"
                  value={formData.content}
                  onChange={handleInputChange}
                  rows={15}
                  placeholder="Write your article content here... You can use HTML tags for formatting."
                  className="w-full px-4 py-3 border border-mocha-200 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent resize-vertical font-mono text-sm"
                />
                <p className="text-sm text-mocha-500 mt-2">
                  You can use HTML tags like &lt;h2&gt;, &lt;p&gt;, &lt;strong&gt;, &lt;em&gt;, &lt;ul&gt;, &lt;li&gt;, etc.
                </p>
              </div>

              {/* Featured Image */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-mocha-700 mb-2">
                  Featured Image
                </label>
                <div className="flex items-center space-x-4">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    id="image-upload"
                  />
                  <label
                    htmlFor="image-upload"
                    className="flex items-center px-4 py-2 border border-mocha-200 rounded-lg hover:bg-mocha-50 cursor-pointer"
                  >
                    <FiUpload className="mr-2" />
                    {imageUploading ? 'Uploading...' : 'Upload Image'}
                  </label>
                  {formData.featuredImage && (
                    <div className="flex items-center space-x-2">
                      <img
                        src={formData.featuredImage}
                        alt="Featured"
                        className="w-16 h-16 object-cover rounded-lg"
                      />
                      <button
                        onClick={() => setFormData(prev => ({ ...prev, featuredImage: '' }))}
                        className="text-red-500 hover:text-red-700"
                      >
                        <FiX />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Status */}
            <div className="bg-white rounded-lg shadow-sm border border-cream-200 p-6">
              <h3 className="text-lg font-semibold text-mocha-700 mb-4">Publishing</h3>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-mocha-700 mb-2">
                  Status
                </label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-mocha-200 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                >
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                  <option value="archived">Archived</option>
                </select>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-mocha-700 mb-2">
                  Category
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-mocha-200 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  required
                >
                  <option value="">Select Category</option>
                  {categoriesData?.categories?.map((category) => (
                    <option key={category._id} value={category._id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Tags */}
            <div className="bg-white rounded-lg shadow-sm border border-cream-200 p-6">
              <h3 className="text-lg font-semibold text-mocha-700 mb-4">Tags</h3>
              
              <div className="mb-4">
                <div className="flex">
                  <input
                    type="text"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleTagAdd())}
                    placeholder="Add a tag..."
                    className="flex-1 px-3 py-2 border border-mocha-200 rounded-l-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  />
                  <button
                    onClick={handleTagAdd}
                    className="px-3 py-2 bg-pink-500 text-white rounded-r-lg hover:bg-pink-600"
                  >
                    Add
                  </button>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                {formData.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="flex items-center bg-pink-100 text-pink-700 px-3 py-1 rounded-full text-sm"
                  >
                    {tag}
                    <button
                      onClick={() => handleTagRemove(tag)}
                      className="ml-2 text-pink-500 hover:text-pink-700"
                    >
                      <FiX size={14} />
                    </button>
                  </span>
                ))}
              </div>
            </div>

            {/* SEO */}
            <div className="bg-white rounded-lg shadow-sm border border-cream-200 p-6">
              <h3 className="text-lg font-semibold text-mocha-700 mb-4">SEO Settings</h3>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-mocha-700 mb-2">
                  Meta Title
                </label>
                <input
                  type="text"
                  name="metaTitle"
                  value={formData.metaTitle}
                  onChange={handleInputChange}
                  placeholder="SEO title (optional)"
                  className="w-full px-3 py-2 border border-mocha-200 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-mocha-700 mb-2">
                  Meta Description
                </label>
                <textarea
                  name="metaDescription"
                  value={formData.metaDescription}
                  onChange={handleInputChange}
                  rows={3}
                  placeholder="SEO description (optional)"
                  className="w-full px-3 py-2 border border-mocha-200 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent resize-vertical"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Preview Mode */}
        {isPreviewMode && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="fixed inset-0 bg-white z-50 overflow-y-auto"
          >
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-mocha-700">Preview</h2>
                <button
                  onClick={() => setIsPreviewMode(false)}
                  className="btn-outline"
                >
                  <FiX className="mr-2" />
                  Close Preview
                </button>
              </div>
              
              <div className="max-w-4xl mx-auto">
                <h1 className="text-4xl font-display font-bold text-mocha-700 mb-6">
                  {formData.title || 'Article Title'}
                </h1>
                
                {formData.excerpt && (
                  <div className="bg-cream-50 p-6 rounded-lg mb-8">
                    <p className="text-lg text-mocha-600 italic">
                      {formData.excerpt}
                    </p>
                  </div>
                )}
                
                {formData.featuredImage && (
                  <img
                    src={formData.featuredImage}
                    alt={formData.title}
                    className="w-full h-64 object-cover rounded-lg mb-8"
                  />
                )}
                
                <div 
                  className="prose prose-lg max-w-none text-mocha-700"
                  dangerouslySetInnerHTML={{ __html: formData.content || '<p>Article content will appear here...</p>' }}
                />
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </>
  );
};

export default AdminArticleForm; 