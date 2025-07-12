import axios from 'axios';

// Create axios instance
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

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

// Response interceptor
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle authentication errors
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/admin/login';
    }
    
    // Handle network errors
    if (!error.response) {
      console.error('Network error:', error);
    }
    
    return Promise.reject(error);
  }
);

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
  getArticle: (slug) => api.get(endpoints.articles.single(slug)),
  getArticleBySlug: (slug) => api.get(endpoints.articles.single(slug)),
  getRelatedArticles: (articleId, categoryId) => api.get(endpoints.articles.related(articleId), { params: { category: categoryId } }),
  searchArticles: (params) => api.get('/api/articles/search', { params }),
  createArticle: (data) => api.post(endpoints.articles.create, data),
  updateArticle: (id, data) => api.put(endpoints.articles.update(id), data),
  deleteArticle: (id) => api.delete(endpoints.articles.delete(id)),
  bulkDeleteArticles: (ids) => api.post(endpoints.articles.bulkDelete, { ids }),
  toggleArticleStatus: (data) => api.put(endpoints.articles.toggleStatus(data.id), data),
  likeArticle: (id) => api.post(endpoints.articles.like(id)),
  getArticlesByCategory: (slug, params) => api.get(endpoints.articles.byCategory(slug), { params }),
  getAdminArticles: (params) => api.get(endpoints.articles.adminList, { params }),
  
  // Categories
  getCategories: () => api.get(endpoints.categories.list),
  getCategory: (slug) => api.get(endpoints.categories.single(slug)),
  getCategoryBySlug: (slug) => api.get(endpoints.categories.single(slug)),
  getRelatedCategories: (categoryId) => api.get(endpoints.categories.related(categoryId)),
  createCategory: (data) => api.post(endpoints.categories.create, data),
  updateCategory: (id, data) => api.put(endpoints.categories.update(id), data),
  deleteCategory: (id) => api.delete(endpoints.categories.delete(id)),
  toggleCategoryStatus: (id) => api.put(endpoints.categories.status(id)),
  getAdminCategories: () => api.get(endpoints.categories.adminList),
  
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
  
  // Contact
  sendContact: (data) => api.post(endpoints.contact.send, data),
  sendContactMessage: (data) => api.post(endpoints.contact.send, data),
  subscribeNewsletter: (data) => api.post(endpoints.contact.newsletter, data),
  
  // Upload
  uploadImage: (formData) => api.post(endpoints.upload.image, formData),
  uploadAvatar: (formData) => api.post(endpoints.upload.avatar, formData),
  uploadFeaturedImage: (formData) => api.post(endpoints.upload.featuredImage, formData),
  uploadMultipleImages: (formData) => api.post(endpoints.upload.multiple, formData),
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
    adminList: () => [...queryKeys.articles.all, 'admin'],
    byCategory: (slug) => [...queryKeys.articles.all, 'category', slug],
    related: (id) => [...queryKeys.articles.all, 'related', id],
    search: (params) => [...queryKeys.articles.all, 'search', params],
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