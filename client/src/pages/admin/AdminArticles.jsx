import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { 
  FiPlus, 
  FiEdit, 
  FiTrash2, 
  FiEye, 
  FiSearch,
  FiFilter,
  FiMoreVertical,
  FiCalendar,
  FiUser,
  FiTag
} from 'react-icons/fi';
import { apiService, queryKeys } from '../../utils/api';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const AdminArticles = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedArticles, setSelectedArticles] = useState([]);

  // Fetch articles
  const { data: articlesData, isLoading } = useQuery(
    queryKeys.articles.adminList({
      page: currentPage,
      search: searchTerm,
      category: selectedCategory,
      status: statusFilter
    }),
    () => apiService.getAdminArticles({
      page: currentPage,
      search: searchTerm,
      category: selectedCategory,
      status: statusFilter
    }),
    {
      staleTime: 1 * 60 * 1000,
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

  // Delete article mutation
  const deleteMutation = useMutation(apiService.deleteArticle, {
    onSuccess: () => {
      queryClient.invalidateQueries(queryKeys.articles.adminList());
      setSelectedArticles([]);
    },
  });

  // Bulk delete mutation
  const bulkDeleteMutation = useMutation(apiService.bulkDeleteArticles, {
    onSuccess: () => {
      queryClient.invalidateQueries(queryKeys.articles.adminList());
      setSelectedArticles([]);
    },
  });

  // Toggle article status mutation
  const toggleStatusMutation = useMutation(apiService.toggleArticleStatus, {
    onSuccess: () => {
      queryClient.invalidateQueries(queryKeys.articles.adminList());
    },
  });

  const handleDelete = (articleId) => {
    if (window.confirm('Are you sure you want to delete this article?')) {
      deleteMutation.mutate(articleId);
    }
  };

  const handleBulkDelete = () => {
    if (selectedArticles.length === 0) return;
    if (window.confirm(`Are you sure you want to delete ${selectedArticles.length} articles?`)) {
      bulkDeleteMutation.mutate(selectedArticles);
    }
  };

  const handleToggleStatus = (articleId, currentStatus) => {
    toggleStatusMutation.mutate({ id: articleId, status: currentStatus === 'published' ? 'draft' : 'published' });
  };

  const handleSelectAll = () => {
    if (selectedArticles.length === articlesData?.data?.articles?.length) {
      setSelectedArticles([]);
    } else {
      setSelectedArticles(articlesData?.data?.articles?.map(article => article._id) || []);
    }
  };

  const handleSelectArticle = (articleId) => {
    setSelectedArticles(prev => 
      prev.includes(articleId) 
        ? prev.filter(id => id !== articleId)
        : [...prev, articleId]
    );
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      published: { color: 'bg-green-100 text-green-700', text: 'Published' },
      draft: { color: 'bg-yellow-100 text-yellow-700', text: 'Draft' },
      archived: { color: 'bg-gray-100 text-gray-700', text: 'Archived' }
    };
    const config = statusConfig[status] || statusConfig.draft;
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${config.color}`}>
        {config.text}
      </span>
    );
  };

  return (
    <>
      <Helmet>
        <title>Manage News - UACP Admin</title>
      </Helmet>

      <div className="p-6">
        {/* Header */}
        <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-eternity-700 mb-2">Manage News</h1>
            <p className="text-eternity-600">
              {articlesData?.total || 0} news items total
            </p>
          </div>
          
          <Link
            to="/admin/articles/new"
            className="btn-primary flex items-center"
          >
            <FiPlus className="mr-2" />
            New News
          </Link>
        </div>

        {/* Filters */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-sidecar-300 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <div>
              <label className="block text-sm font-medium text-eternity-700 mb-2">
                Search News
              </label>
              <div className="relative">
                <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-eternity-400" />
                <input
                  type="text"
                  placeholder="Search by title..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-sidecar-300 rounded-lg focus:ring-2 focus:ring-eternity-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Category Filter */}
            <div>
              <label className="block text-sm font-medium text-eternity-700 mb-2">
                Category
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-3 py-2 border border-sidecar-300 rounded-lg focus:ring-2 focus:ring-eternity-500 focus:border-transparent"
              >
                <option value="">All Categories</option>
                {categoriesData?.categories?.map((category) => (
                  <option key={category._id} value={category._id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Status Filter */}
            <div>
              <label className="block text-sm font-medium text-eternity-700 mb-2">
                Status
              </label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-3 py-2 border border-sidecar-300 rounded-lg focus:ring-2 focus:ring-eternity-500 focus:border-transparent"
              >
                <option value="">All Status</option>
                <option value="published">Published</option>
                <option value="draft">Draft</option>
                <option value="archived">Archived</option>
              </select>
            </div>

            {/* Bulk Actions */}
            <div>
              <label className="block text-sm font-medium text-eternity-700 mb-2">
                Bulk Actions
              </label>
              <button
                onClick={handleBulkDelete}
                disabled={selectedArticles.length === 0}
                className="w-full px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Delete Selected ({selectedArticles.length})
              </button>
            </div>
          </div>
        </div>

        {/* News Table */}
        {isLoading ? (
          <LoadingSpinner />
        ) : (
          <div className="bg-white rounded-lg shadow-sm border border-sidecar-300 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-sidecar-50">
                  <tr>
                    <th className="px-6 py-3 text-left">
                      <input
                        type="checkbox"
                        checked={selectedArticles.length === articlesData?.data?.articles?.length && articlesData?.data?.articles?.length > 0}
                        onChange={handleSelectAll}
                        className="rounded border-sidecar-300 text-eternity-600 focus:ring-eternity-500"
                      />
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-eternity-500 uppercase tracking-wider">
                      News Item
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-eternity-500 uppercase tracking-wider">
                      Category
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-eternity-500 uppercase tracking-wider">
                      Author
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-eternity-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-eternity-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-eternity-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-sidecar-300">
                  {articlesData?.data?.articles?.map((article) => (
                    <motion.tr
                      key={article._id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="hover:bg-sidecar-50"
                    >
                      <td className="px-6 py-4">
                        <input
                          type="checkbox"
                          checked={selectedArticles.includes(article._id)}
                          onChange={() => handleSelectArticle(article._id)}
                          className="rounded border-sidecar-300 text-eternity-600 focus:ring-eternity-500"
                        />
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          {article.featuredImage && (
                            <img
                              src={article.featuredImage}
                              alt={article.title}
                              className="w-12 h-12 object-cover rounded-lg mr-4"
                            />
                          )}
                          <div>
                            <div className="text-sm font-medium text-eternity-900">
                              {article.title}
                            </div>
                            <div className="text-sm text-eternity-500">
                              {article.excerpt?.substring(0, 60)}...
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        {article.category && (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-alpine-100 text-alpine-800">
                            {article.category.name}
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-sm text-eternity-900">
                        {article.author?.name || 'Anonymous'}
                      </td>
                      <td className="px-6 py-4">
                        {getStatusBadge(article.status)}
                      </td>
                      <td className="px-6 py-4 text-sm text-eternity-500">
                        {new Date(article.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-2">
                          <Link
                            to={`/articles/${article.slug}`}
                            target="_blank"
                            className="text-eternity-400 hover:text-eternity-600"
                            title="View"
                          >
                            <FiEye />
                          </Link>
                          <Link
                            to={`/admin/articles/edit/${article._id}`}
                            className="text-blue-400 hover:text-blue-600"
                            title="Edit"
                          >
                            <FiEdit />
                          </Link>
                          <button
                            onClick={() => handleToggleStatus(article._id, article.status)}
                            className="text-yellow-400 hover:text-yellow-600"
                            title="Toggle Status"
                          >
                            <FiTag />
                          </button>
                          <button
                            onClick={() => handleDelete(article._id)}
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

            {/* Pagination */}
            {articlesData?.data?.pagination?.totalPages > 1 && (
              <div className="px-6 py-4 border-t border-cream-200">
                <div className="flex items-center justify-between">
                  <div className="text-sm text-mocha-500">
                    Showing {((currentPage - 1) * 10) + 1} to {Math.min(currentPage * 10, articlesData.data.pagination.total)} of {articlesData.data.pagination.total} results
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => setCurrentPage(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="px-3 py-1 border border-mocha-200 rounded hover:bg-mocha-50 disabled:opacity-50"
                    >
                      Previous
                    </button>
                    <span className="px-3 py-1 text-mocha-700">
                      Page {currentPage} of {articlesData.data.pagination.totalPages}
                    </span>
                    <button
                      onClick={() => setCurrentPage(currentPage + 1)}
                      disabled={currentPage === articlesData.data.pagination.totalPages}
                      className="px-3 py-1 border border-mocha-200 rounded hover:bg-mocha-50 disabled:opacity-50"
                    >
                      Next
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default AdminArticles; 