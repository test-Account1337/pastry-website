import axios from 'axios';

// API URL configuration based on environment variable
const getApiUrl = () => {
  const useRailway = import.meta.env.VITE_USE_RAILWAY === 'true';
  
  if (useRailway) {
    return import.meta.env.VITE_RAILWAY_URL || 'https://pastry-website-production.up.railway.app';
  } else {
    return import.meta.env.VITE_API_URL || 'http://localhost:5000';
  }
};

// Create axios instance with dynamic base URL
const createApiInstance = (baseURL) => {
  return axios.create({
    baseURL,
    timeout: 10000,
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

// Health check function
const checkApiHealth = async (url) => {
  try {
    const response = await axios.get(`${url}/api/health`, { timeout: 5000 });
    return response.status === 200;
  } catch (error) {
    console.warn(`Health check failed for ${url}:`, error.message);
    return false;
  }
};

// Initialize API with fallback logic
let api = createApiInstance(getApiUrl());
let currentApiUrl = getApiUrl();

// Function to switch API URL
const switchApiUrl = async (newUrl) => {
  if (newUrl !== currentApiUrl) {
    console.log(`Switching API URL from ${currentApiUrl} to ${newUrl}`);
    currentApiUrl = newUrl;
    api = createApiInstance(newUrl);
    
    // Re-add interceptors to new instance
    setupInterceptors();
  }
};

// Setup interceptors
const setupInterceptors = () => {
  // Request interceptor
  api.interceptors.request.use(
    (config) => {
      // Add auth token if available
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  // Response interceptor with automatic fallback
  api.interceptors.response.use(
    (response) => {
      return response;
    },
    async (error) => {
      // Handle authentication errors
      if (error.response?.status === 401) {
        localStorage.removeItem('token');
        window.location.href = '/admin/login';
        return Promise.reject(error);
      }
      
      // Handle network errors
      if (!error.response && (error.code === 'ECONNABORTED' || error.code === 'ERR_NETWORK')) {
        console.error('❌ API request failed. Check your VITE_USE_RAILWAY configuration.');
      }
      
      // Handle other network errors
      if (!error.response) {
        console.error('Network error:', error);
      }
      
      return Promise.reject(error);
    }
  );
};

// Initialize interceptors
setupInterceptors();

// Initialize API based on environment variable
export const initializeApi = async () => {
  const useRailway = import.meta.env.VITE_USE_RAILWAY === 'true';
  const apiUrl = getApiUrl();
  
  if (useRailway) {
    console.log('🔧 Using Railway API (configured via VITE_USE_RAILWAY)');
  } else {
    console.log('🔧 Using localhost API (configured via VITE_USE_RAILWAY)');
  }
  
  await switchApiUrl(apiUrl);
  console.log(`✅ API initialized: ${apiUrl.replace(/^https?:\/\//, '')}`);
};

// API endpoints
export const endpoints = {
  // Auth
  auth: {
    login: '/api/auth/login',
    register: '/api/auth/register',
    me: '/api/auth/me',
    profile: '/api/auth/profile',
    password: '/api/auth/password',
    users: '/api/auth/users',
  },
  
  // Articles
  articles: {
    list: '/api/articles',
    featured: '/api/articles/featured',
    single: (slug) => `/api/articles/${slug}`,
    create: '/api/articles',
    update: (id) => `/api/articles/${id}`,
    delete: (id) => `/api/articles/${id}`,
    like: (id) => `/api/articles/${id}/like`,
    search: '/api/articles/search/suggestions',
    adminList: '/api/articles/admin',
    byCategory: (slug) => `/api/articles/category/${slug}`,
    related: (id) => `/api/articles/${id}/related`,
    bulkDelete: '/api/articles/bulk-delete',
    toggleStatus: (id) => `/api/articles/${id}/status`,
    dashboardStats: '/api/articles/dashboard/stats',
  },
  
  // Categories
  categories: {
    list: '/api/categories',
    single: (slug) => `/api/categories/${slug}`,
    create: '/api/categories',
    update: (id) => `/api/categories/${id}`,
    delete: (id) => `/api/categories/${id}`,
    status: (id) => `/api/categories/${id}/status`,
    adminList: '/api/categories/admin',
    related: (id) => `/api/categories/${id}/related`,
  },
  
  // Users
  users: {
    list: '/api/users',
    single: (id) => `/api/users/${id}`,
    update: (id) => `/api/users/${id}`,
    delete: (id) => `/api/users/${id}`,
    avatar: (id) => `/api/users/${id}/avatar`,
    stats: '/api/users/stats/overview',
    adminList: '/api/users/admin',
    toggleStatus: (id) => `/api/users/${id}/status`,
  },
  
  // Contact
  contact: {
    send: '/api/contact',
    newsletter: '/api/contact/newsletter',
  },
  
  // Upload
  upload: {
    image: '/api/upload/image',
    avatar: '/api/upload/avatar',
    featuredImage: '/api/upload/featured-image',
    multiple: '/api/upload/multiple',
    delete: (publicId) => `/api/upload/${publicId}`,
  },
  
  // Health check
  health: '/api/health',
};

// API functions
export const apiService = {
  // Auth
  login: (credentials) => api.post(endpoints.auth.login, credentials),
  getProfile: () => api.get(endpoints.auth.me),
  updateProfile: (data) => api.put(endpoints.auth.profile, data),
  changePassword: (data) => api.put(endpoints.auth.password, data),
  getUsers: () => api.get(endpoints.auth.users),
  
  // Articles
  getArticles: (params) => api.get(endpoints.articles.list, { params }),
  getFeaturedArticles: () => api.get(endpoints.articles.featured),
  getArticle: (slug) => api.get(endpoints.articles.single(slug)).then(res => res.data.article),
  getArticleBySlug: (slug) => api.get(endpoints.articles.single(slug)).then(res => res.data.article),
  getRelatedArticles: (articleId, categoryId) => api.get(endpoints.articles.related(articleId), { params: { category: categoryId } }),
  searchArticles: (params) => api.get('/api/articles/search', { params }),
  createArticle: (data) => api.post(endpoints.articles.create, data),
  updateArticle: (id, data) => api.put(endpoints.articles.update(id), data),
  deleteArticle: (id) => api.delete(endpoints.articles.delete(id)),
  bulkDeleteArticles: (ids) => api.post(endpoints.articles.bulkDelete, { ids }),
  toggleArticleStatus: (data) => api.put(endpoints.articles.toggleStatus(data.id), data),
  likeArticle: (id) => api.post(endpoints.articles.like(id)),
  getArticlesByCategory: (slug, params) => api.get(endpoints.articles.byCategory(slug), { params }),
  getAdminArticles: (params) => api.get(endpoints.articles.adminList, { params }).then(res => res.data),
  getDashboardStats: () => api.get(endpoints.articles.dashboardStats).then(res => res.data),
  
  // Categories
  getCategories: () => {
    console.log('🔍 Frontend: Calling getCategories API...');
    return api.get(endpoints.categories.list).then(res => res.data);
  },
  getCategory: (slug) => api.get(endpoints.categories.single(slug)),
  getCategoryBySlug: (slug) => api.get(endpoints.categories.single(slug)),
  getRelatedCategories: (categoryId) => api.get(endpoints.categories.related(categoryId)),
  createCategory: (data) => api.post(endpoints.categories.create, data),
  updateCategory: (id, data) => api.put(endpoints.categories.update(id), data),
  deleteCategory: (id) => api.delete(endpoints.categories.delete(id)),
  toggleCategoryStatus: (id) => api.put(endpoints.categories.status(id)),
  getAdminCategories: () => api.get(endpoints.categories.adminList).then(res => res.data),
  
  // Users
  getAllUsers: () => api.get(endpoints.users.list),
  getUser: (id) => api.get(endpoints.users.single(id)),
  updateUser: (id, data) => api.put(endpoints.users.update(id), data),
  deleteUser: (id) => api.delete(endpoints.users.delete(id)),
  updateUserAvatar: (id, data) => api.put(endpoints.users.avatar(id), data),
  getUserStats: () => api.get(endpoints.users.stats),
  getAdminUsers: (params) => api.get(endpoints.users.adminList, { params }),
  toggleUserStatus: (data) => api.put(endpoints.users.toggleStatus(data.id), data),
  createUser: (data) => api.post(endpoints.users.list, data),
  getPublicUsers: () => api.get('/api/users/public').then(res => res.data.users),
  
  // Contact
  sendContact: (data) => api.post(endpoints.contact.send, data),
  sendContactMessage: (data) => api.post(endpoints.contact.send, data),
  subscribeNewsletter: (data) => api.post(endpoints.contact.newsletter, data),
  
  // Upload
  uploadImage: (formData) => api.post(endpoints.upload.image, formData, {
    headers: {
      'Content-Type': undefined, // Let browser set the correct Content-Type for FormData
    },
    timeout: 30000, // 30 seconds for image uploads
  }),
  uploadAvatar: (formData) => api.post(endpoints.upload.avatar, formData, {
    headers: {
      'Content-Type': undefined,
    },
    timeout: 30000,
  }),
  uploadFeaturedImage: (formData) => api.post(endpoints.upload.featuredImage, formData, {
    headers: {
      'Content-Type': undefined,
    },
    timeout: 30000,
  }),
  uploadMultipleImages: (formData) => api.post(endpoints.upload.multiple, formData, {
    headers: {
      'Content-Type': undefined,
    },
    timeout: 30000,
  }),
  deleteImage: (publicId) => api.delete(endpoints.upload.delete(publicId)),
  
  // Health check
  healthCheck: () => api.get(endpoints.health),
};

// Query keys for React Query
export const queryKeys = {
  articles: {
    all: ['articles'],
    lists: () => [...queryKeys.articles.all, 'list'],
    list: (filters) => [...queryKeys.articles.lists(), filters],
    details: () => [...queryKeys.articles.all, 'detail'],
    detail: (slug) => [...queryKeys.articles.details(), slug],
    featured: () => [...queryKeys.articles.all, 'featured'],
    adminList: (filters) => [...queryKeys.articles.all, 'admin', filters],
    byCategory: (slug) => [...queryKeys.articles.all, 'category', slug],
    related: (id) => [...queryKeys.articles.all, 'related', id],
    search: (params) => [...queryKeys.articles.all, 'search', params],
    dashboardStats: () => [...queryKeys.articles.all, 'dashboard', 'stats'],
  },
  categories: {
    all: ['categories'],
    lists: () => [...queryKeys.categories.all, 'list'],
    list: (filters) => [...queryKeys.categories.lists(), filters],
    details: () => [...queryKeys.categories.all, 'detail'],
    detail: (slug) => [...queryKeys.categories.details(), slug],
    adminList: () => [...queryKeys.categories.all, 'admin'],
    related: (id) => [...queryKeys.categories.all, 'related', id],
  },
  users: {
    all: ['users'],
    lists: () => [...queryKeys.users.all, 'list'],
    list: (filters) => [...queryKeys.users.lists(), filters],
    details: () => [...queryKeys.users.all, 'detail'],
    detail: (id) => [...queryKeys.users.details(), id],
    stats: () => [...queryKeys.users.all, 'stats'],
    adminList: () => [...queryKeys.users.all, 'admin'],
    profile: () => [...queryKeys.users.all, 'profile'],
  },
  auth: {
    user: ['auth', 'user'],
    profile: ['auth', 'profile'],
  },
};

export default api; 