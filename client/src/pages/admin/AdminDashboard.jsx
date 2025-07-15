import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiPlus, FiFileText, FiUsers, FiFolder, FiTrendingUp, FiEye } from 'react-icons/fi';
import { useQuery } from 'react-query';
import { apiService, queryKeys } from '../../utils/api';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const AdminDashboard = () => {
  // Fetch dashboard data
  const { data: dashboardData, isLoading, error } = useQuery(
    // queryKeys.articles.dashboardStats(),
    queryKeys.articles.adminList(),
    apiService.getDashboardStats,
    {
      staleTime: 5 * 60 * 1000,
      retry: 1,
      retryDelay: 1000,
    }
  );

  const stats = [
    {
      name: 'Total News',
      value: dashboardData?.stats?.articles?.total || 0,
      icon: FiFileText,
      color: 'bg-blue-500',
      href: '/admin/articles'
    },
    {
      name: 'Published News',
      value: dashboardData?.stats?.articles?.published || 0,
      icon: FiEye,
      color: 'bg-green-500',
      href: '/admin/articles'
    },
    {
      name: 'Categories',
      value: dashboardData?.stats?.categories?.total || 0,
      icon: FiFolder,
      color: 'bg-purple-500',
      href: '/admin/categories'
    },
    {
      name: 'Users',
      value: dashboardData?.stats?.users?.total || 0,
      icon: FiUsers,
      color: 'bg-orange-500',
      href: '/admin/users'
    },
  ];

  const quickActions = [
    {
      name: 'Create News',
      description: 'Write a new news item',
      icon: FiPlus,
      href: '/admin/articles/new',
      color: 'bg-eternity-600 hover:bg-eternity-700'
    },
    {
      name: 'Add Category',
      description: 'Create a new category',
      icon: FiFolder,
      href: '/admin/categories',
      color: 'bg-alpine-500 hover:bg-alpine-600'
    },
    {
      name: 'Manage Users',
      description: 'View and manage users',
      icon: FiUsers,
      href: '/admin/users',
      color: 'bg-tabasco-500 hover:bg-tabasco-600'
    },
  ];

  if (isLoading) {
    return <LoadingSpinner size="lg" />;
  }

  if (error) {
    return (
      <div className="w-full max-w-5xl mx-auto px-4 py-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <h2 className="text-lg font-semibold text-red-800 mb-2">Server Connection Error</h2>
          <p className="text-red-700 mb-4">
            Unable to fetch dashboard data. Please make sure the server is running on port 5000.
          </p>
          <div className="text-sm text-red-600">
            <p>To start the server, run:</p>
            <code className="bg-red-100 px-2 py-1 rounded">cd server && npm start</code>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Dashboard - UACP Admin</title>
      </Helmet>

      <div className="w-full max-w-5xl mx-auto px-4 py-8 space-y-10">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-display font-bold text-eternity-700 mb-2">
            Dashboard
          </h1>
          <p className="text-eternity-600">
            Welcome back! Here's what's happening with your UACP news site.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="card p-6"
            >
              <Link to={stat.href} className="block">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-eternity-600">{stat.name}</p>
                    <p className="text-3xl font-bold text-eternity-700">{stat.value}</p>
                  </div>
                  <div className={`p-3 rounded-lg ${stat.color} text-white`}>
                    <stat.icon className="w-6 h-6" />
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {quickActions.map((action, index) => (
            <motion.div
              key={action.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + index * 0.1 }}
              className="card p-6 hover:shadow-medium transition-shadow duration-200"
            >
              <Link to={action.href} className="block">
                <div className="flex items-center space-x-4">
                  <div className={`p-3 rounded-lg ${action.color} text-white`}>
                    <action.icon className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-eternity-700">{action.name}</h3>
                    <p className="text-sm text-eternity-600">{action.description}</p>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Recent Articles */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="card p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-display font-bold text-eternity-700">Recent News</h2>
              <Link
                to="/admin/articles"
                className="text-sm text-eternity-600 hover:text-eternity-800 font-medium"
              >
                View All →
              </Link>
            </div>
            <div className="space-y-4">
              {dashboardData?.recentArticles?.slice(0, 5).map((article) => (
                <div key={article._id} className="flex items-center space-x-3 p-3 rounded-lg hover:bg-sidecar-100">
                  <div className="w-12 h-12 bg-sidecar-200 rounded-lg flex items-center justify-center">
                    <FiFileText className="w-5 h-5 text-eternity-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-medium text-eternity-700 truncate">
                      {article.title}
                    </h3>
                    <p className="text-xs text-eternity-500">
                      {article.author?.firstName} {article.author?.lastName} • {article.status}
                    </p>
                  </div>
                  <div className={`badge ${
                    article.status === 'published' ? 'badge-success' : 
                    article.status === 'draft' ? 'badge-warning' : 'badge-error'
                  }`}>
                    {article.status}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="card p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-display font-bold text-eternity-700">Recent Users</h2>
              <Link
                to="/admin/users"
                className="text-sm text-eternity-600 hover:text-eternity-800 font-medium"
              >
                View All →
              </Link>
            </div>
            <div className="space-y-4">
              {dashboardData?.recentUsers?.slice(0, 5).map((user) => (
                <div key={user._id} className="flex items-center space-x-3 p-3 rounded-lg hover:bg-sidecar-100">
                  <div className="w-12 h-12 bg-eternity-100 rounded-full flex items-center justify-center">
                    <FiUsers className="w-5 h-5 text-eternity-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-medium text-eternity-700">
                      {user.firstName} {user.lastName}
                    </h3>
                    <p className="text-xs text-eternity-500">{user.email}</p>
                  </div>
                  <div className="badge badge-primary capitalize">
                    {user.role}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminDashboard; 