import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

// Context
import { AuthProvider } from './context/AuthContext.jsx';

// Layout Components
import Layout from './components/layout/Layout';
import AdminLayout from './components/layout/AdminLayout';

// Public Pages
import HomePage from './pages/HomePage';
import ArticlePage from './pages/ArticlePage';
import ArticlesPage from './pages/ArticlesPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import SearchPage from './pages/SearchPage';
import CategoryPage from './pages/CategoryPage';

// Admin Pages
import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminArticles from './pages/admin/AdminArticles';
import AdminArticleForm from './pages/admin/AdminArticleForm';
import AdminCategories from './pages/admin/AdminCategories';
import AdminUsers from './pages/admin/AdminUsers';
import AdminProfile from './pages/admin/AdminProfile';

// Protected Route Component
import ProtectedRoute from './components/auth/ProtectedRoute';

function App() {
  return (
    <AuthProvider>
      <Helmet>
        <title>Pastry News - Your Premier Pastry Industry Source</title>
        <meta name="description" content="Your premier source for pastry news, chef interviews, and industry updates. Discover the latest trends, techniques, and stories from the world of pastry arts." />
        <link rel="canonical" href="https://pastrynews.com" />
      </Helmet>

      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="articles" element={<ArticlesPage />} />
          <Route path="articles/:slug" element={<ArticlePage />} />
          <Route path="category/:slug" element={<CategoryPage />} />
          <Route path="search" element={<SearchPage />} />
          <Route path="about" element={<AboutPage />} />
          <Route path="contact" element={<ContactPage />} />
        </Route>

        {/* Admin Login Route (standalone, not wrapped in AdminLayout) */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin" element={<AdminLogin />} />

        {/* Admin Protected Routes (wrapped in AdminLayout) */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route path="dashboard" element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          } />
          <Route path="articles" element={
            <ProtectedRoute>
              <AdminArticles />
            </ProtectedRoute>
          } />
          <Route path="articles/new" element={
            <ProtectedRoute>
              <AdminArticleForm />
            </ProtectedRoute>
          } />
          <Route path="articles/edit/:id" element={
            <ProtectedRoute>
              <AdminArticleForm />
            </ProtectedRoute>
          } />
          <Route path="categories" element={
            <ProtectedRoute>
              <AdminCategories />
            </ProtectedRoute>
          } />
          <Route path="users" element={
            <ProtectedRoute>
              <AdminUsers />
            </ProtectedRoute>
          } />
          <Route path="profile" element={
            <ProtectedRoute>
              <AdminProfile />
            </ProtectedRoute>
          } />
        </Route>

        {/* 404 Page */}
        <Route path="*" element={
          <Layout>
            <div className="min-h-screen flex items-center justify-center">
              <div className="text-center">
                <h1 className="text-6xl font-bold text-mocha-500 mb-4">404</h1>
                <h2 className="text-2xl font-semibold text-mocha-700 mb-4">Page Not Found</h2>
                <p className="text-mocha-600 mb-8">The page you're looking for doesn't exist.</p>
                <a href="/" className="btn-primary">
                  Go Home
                </a>
              </div>
            </div>
          </Layout>
        } />
      </Routes>
    </AuthProvider>
  );
}

export default App; 