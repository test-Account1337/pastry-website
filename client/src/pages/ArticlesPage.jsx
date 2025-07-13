import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { useQuery } from 'react-query';
import { 
  FiSearch, 
  FiFilter, 
  FiGrid, 
  FiList,
  FiChevronLeft,
  FiChevronRight,
  FiCalendar,
  FiTag
} from 'react-icons/fi';
import { apiService, queryKeys } from '../utils/api';
import ArticleCard from '../components/articles/ArticleCard';
import LoadingSpinner from '../components/common/LoadingSpinner';
import NewsletterSignup from '../components/common/NewsletterSignup';

const ArticlesPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [viewMode, setViewMode] = useState('grid');
  const [showFilters, setShowFilters] = useState(false);

  // Get current filters from URL
  const currentPage = parseInt(searchParams.get('page')) || 1;
  const currentSearch = searchParams.get('search') || '';
  const currentCategory = searchParams.get('category') || '';
  const currentSort = searchParams.get('sort') || 'latest';
  const currentLimit = parseInt(searchParams.get('limit')) || 12;

  // Fetch articles with filters
  const { data: articlesData, isLoading } = useQuery(
    queryKeys.articles.list({
      page: currentPage,
      limit: currentLimit,
      search: currentSearch,
      category: currentCategory,
      sort: currentSort,
    }),
    () => apiService.getArticles({
      page: currentPage,
      limit: currentLimit,
      search: currentSearch,
      category: currentCategory,
      sort: currentSort,
    }),
    {
      staleTime: 2 * 60 * 1000,
    }
  );

  // Fetch categories for filter
  const { data: categoriesData } = useQuery(
    queryKeys.categories.lists(),
    apiService.getCategories,
    {
      staleTime: 10 * 60 * 1000,
    }
  );

  // Update URL when filters change
  const updateFilters = (newFilters) => {
    const params = new URLSearchParams(searchParams);
    Object.entries(newFilters).forEach(([key, value]) => {
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
    });
    params.set('page', '1'); // Reset to first page when filters change
    setSearchParams(params);
  };

  const handleSearch = (searchTerm) => {
    updateFilters({ search: searchTerm });
  };

  const handleCategoryFilter = (categoryId) => {
    updateFilters({ category: categoryId });
  };

  const handleSortChange = (sortBy) => {
    updateFilters({ sort: sortBy });
  };

  const handlePageChange = (page) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', page.toString());
    setSearchParams(params);
  };

  const totalPages = articlesData?.data?.pagination?.totalPages || 1;
  const totalArticles = articlesData?.data?.pagination?.total || 0;

  return (
    <>
      <Helmet>
        <title>News - UACP</title>
        <meta name="description" content="Browse all news about African chefs, culinary events, industry updates, and UACP activities. Find the latest insights from the African culinary world." />
      </Helmet>

      <div className="bg-white">
        {/* Page Header */}
        <section className="bg-gradient-to-tl from-eternity-900 via-eternity-800 to-eternity-700 text-white py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center"
            >
              <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">
                Latest News
              </h1>
              <p className="text-xl text-white/90 max-w-2xl mx-auto">
                Stay updated with the latest news, events, and insights from the African culinary world
              </p>
            </motion.div>
          </div>
        </section>

        {/* Search and Filters */}
        <section className="py-8 bg-eternity-50 border-b border-sidecar-300">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col lg:flex-row gap-6 items-start lg:items-center justify-between">
              {/* Search Bar */}
              <div className="flex-1 max-w-md">
                <div className="relative">
                  <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-mocha-400" />
                  <input
                    type="text"
                    placeholder="Search news..."
                    value={currentSearch}
                    onChange={(e) => handleSearch(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-sidecar-300 rounded-lg focus:ring-2 focus:ring-eternity-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Filter Toggle */}
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="flex items-center px-4 py-2 bg-white border border-sidecar-300 rounded-lg hover:bg-sidecar-100 transition-colors"
                >
                  <FiFilter className="mr-2" />
                  Filters
                </button>

                {/* View Mode Toggle */}
                <div className="flex bg-white border border-sidecar-300 rounded-lg p-1">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 rounded ${
                      viewMode === 'grid' ? 'bg-alpine-100 text-alpine-700' : 'text-eternity-500 hover:text-eternity-700'
                    }`}
                  >
                    <FiGrid />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2 rounded ${
                      viewMode === 'list' ? 'bg-alpine-100 text-alpine-700' : 'text-eternity-500 hover:text-eternity-700'
                    }`}
                  >
                    <FiList />
                  </button>
                </div>
              </div>
            </div>

            {/* Filters Panel */}
            {showFilters && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-6 p-6 bg-white rounded-lg border border-sidecar-300"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {/* Category Filter */}
                  <div>
                    <label className="block text-sm font-medium text-eternity-700 mb-2">
                      Category
                    </label>
                    <select
                      value={currentCategory}
                      onChange={(e) => handleCategoryFilter(e.target.value)}
                      className="w-full px-3 py-2 border border-sidecar-300 rounded-lg focus:ring-2 focus:ring-eternity-500 focus:border-transparent"
                    >
                      <option value="">All Categories</option>
                      {categoriesData?.categories?.map((category) => (
                        <option key={`category-${category._id}`} value={category._id}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Sort Filter */}
                  <div>
                    <label className="block text-sm font-medium text-eternity-700 mb-2">
                      Sort By
                    </label>
                    <select
                      value={currentSort}
                      onChange={(e) => handleSortChange(e.target.value)}
                      className="w-full px-3 py-2 border border-sidecar-300 rounded-lg focus:ring-2 focus:ring-eternity-500 focus:border-transparent"
                    >
                      <option value="latest">Latest First</option>
                      <option value="oldest">Oldest First</option>
                      <option value="popular">Most Popular</option>
                      <option value="title">Title A-Z</option>
                    </select>
                  </div>

                  {/* Results Per Page */}
                  <div>
                    <label className="block text-sm font-medium text-eternity-700 mb-2">
                      Results Per Page
                    </label>
                    <select
                      value={currentLimit}
                      onChange={(e) => updateFilters({ limit: e.target.value })}
                      className="w-full px-3 py-2 border border-sidecar-300 rounded-lg focus:ring-2 focus:ring-eternity-500 focus:border-transparent"
                    >
                      <option value={6}>6</option>
                      <option value={12}>12</option>
                      <option value={24}>24</option>
                    </select>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </section>

        {/* Articles Grid */}
        <section className="py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Results Summary */}
            <div className="flex justify-between items-center mb-8">
              <p className="text-eternity-600">
                Showing {((currentPage - 1) * currentLimit) + 1} to{' '}
                {Math.min(currentPage * currentLimit, totalArticles)} of {totalArticles} news items
              </p>
            </div>

            {isLoading ? (
              <LoadingSpinner />
            ) : articlesData?.data?.articles?.length > 0 ? (
              <>
                {/* News Grid/List */}
                <div
                  className={`grid gap-8 ${
                    viewMode === 'grid'
                      ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
                      : 'grid-cols-1'
                  }`}
                >
                  {articlesData.data.articles.map((article, index) => (
                    <motion.div
                      key={`article-${article._id}-${index}`}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5 }}
                    >
                      <ArticleCard 
                        article={article} 
                        viewMode={viewMode}
                      />
                    </motion.div>
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="mt-12 flex justify-center">
                    <nav className="flex items-center space-x-2">
                      <button
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="flex items-center px-3 py-2 text-sm border border-sidecar-300 rounded-lg hover:bg-sidecar-100 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <FiChevronLeft className="mr-1" />
                        Previous
                      </button>

                      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                        <button
                          key={`page-${page}`}
                          onClick={() => handlePageChange(page)}
                          className={`px-3 py-2 text-sm border rounded-lg ${
                            page === currentPage
                              ? 'bg-eternity-600 text-white border-eternity-600'
                              : 'border-sidecar-300 text-eternity-600 hover:bg-sidecar-100'
                          }`}
                        >
                          {page}
                        </button>
                      ))}

                      <button
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className="flex items-center px-3 py-2 text-sm border border-sidecar-300 rounded-lg hover:bg-sidecar-100 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Next
                        <FiChevronRight className="ml-1" />
                      </button>
                    </nav>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-16">
                <div className="text-6xl mb-4">📰</div>
                <h3 className="text-2xl font-semibold text-eternity-700 mb-2">
                  No news found
                </h3>
                <p className="text-eternity-600 mb-6">
                  {currentSearch || currentCategory
                    ? 'Try adjusting your search criteria or filters.'
                    : 'Check back soon for new news!'}
                </p>
                {(currentSearch || currentCategory) && (
                  <button
                    onClick={() => {
                      setSearchParams({});
                      setShowFilters(false);
                    }}
                    className="btn-primary"
                  >
                    Clear Filters
                  </button>
                )}
              </div>
            )}
          </div>
        </section>

        {/* Newsletter Signup */}
        <NewsletterSignup />
      </div>
    </>
  );
};

export default ArticlesPage; 