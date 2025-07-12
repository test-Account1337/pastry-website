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
        <title>Articles - Pastry News</title>
        <meta name="description" content="Browse all articles about pastry chefs, techniques, trends, and industry news. Find the latest insights from the world of pastry arts." />
      </Helmet>

      <div className="bg-white">
        {/* Page Header */}
        <section className="bg-gradient-to-tl from-mocha-900 via-mocha-800 to-mocha-700 text-black py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center"
            >
              <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">
                All Articles
              </h1>
              <p className="text-xl text-black/90 max-w-2xl mx-auto">
                Discover the latest stories, techniques, and insights from the pastry world
              </p>
            </motion.div>
          </div>
        </section>

        {/* Search and Filters */}
        <section className="py-8 bg-cream-50 border-b border-cream-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col lg:flex-row gap-6 items-start lg:items-center justify-between">
              {/* Search Bar */}
              <div className="flex-1 max-w-md">
                <div className="relative">
                  <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-mocha-400" />
                  <input
                    type="text"
                    placeholder="Search articles..."
                    value={currentSearch}
                    onChange={(e) => handleSearch(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-mocha-200 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Filter Toggle */}
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="flex items-center px-4 py-2 bg-white border border-mocha-200 rounded-lg hover:bg-mocha-50 transition-colors"
                >
                  <FiFilter className="mr-2" />
                  Filters
                </button>

                {/* View Mode Toggle */}
                <div className="flex bg-white border border-mocha-200 rounded-lg p-1">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 rounded ${
                      viewMode === 'grid' ? 'bg-pink-100 text-pink-700' : 'text-mocha-500 hover:text-mocha-700'
                    }`}
                  >
                    <FiGrid />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2 rounded ${
                      viewMode === 'list' ? 'bg-pink-100 text-pink-700' : 'text-mocha-500 hover:text-mocha-700'
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
                className="mt-6 p-6 bg-white rounded-lg border border-mocha-200"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {/* Category Filter */}
                  <div>
                    <label className="block text-sm font-medium text-mocha-700 mb-2">
                      Category
                    </label>
                    <select
                      value={currentCategory}
                      onChange={(e) => handleCategoryFilter(e.target.value)}
                      className="w-full px-3 py-2 border border-mocha-200 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                    >
                      <option value="">All Categories</option>
                      {categoriesData?.categories?.map((category) => (
                        <option key={category._id} value={category._id}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Sort Filter */}
                  <div>
                    <label className="block text-sm font-medium text-mocha-700 mb-2">
                      Sort By
                    </label>
                    <select
                      value={currentSort}
                      onChange={(e) => handleSortChange(e.target.value)}
                      className="w-full px-3 py-2 border border-mocha-200 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                    >
                      <option value="latest">Latest First</option>
                      <option value="oldest">Oldest First</option>
                      <option value="popular">Most Popular</option>
                      <option value="title">Title A-Z</option>
                    </select>
                  </div>

                  {/* Results Per Page */}
                  <div>
                    <label className="block text-sm font-medium text-mocha-700 mb-2">
                      Results Per Page
                    </label>
                    <select
                      value={currentLimit}
                      onChange={(e) => updateFilters({ limit: e.target.value })}
                      className="w-full px-3 py-2 border border-mocha-200 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
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
              <p className="text-mocha-600">
                Showing {((currentPage - 1) * currentLimit) + 1} to{' '}
                {Math.min(currentPage * currentLimit, totalArticles)} of {totalArticles} articles
              </p>
            </div>

            {isLoading ? (
              <LoadingSpinner />
            ) : articlesData?.data?.articles?.length > 0 ? (
              <>
                {/* Articles Grid/List */}
                <div
                  className={`grid gap-8 ${
                    viewMode === 'grid'
                      ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
                      : 'grid-cols-1'
                  }`}
                >
                  {articlesData.data.articles.map((article) => (
                    <motion.div
                      key={article._id}
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
                        className="flex items-center px-3 py-2 text-sm border border-mocha-200 rounded-lg hover:bg-mocha-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <FiChevronLeft className="mr-1" />
                        Previous
                      </button>

                      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                        <button
                          key={page}
                          onClick={() => handlePageChange(page)}
                          className={`px-3 py-2 text-sm border rounded-lg ${
                            page === currentPage
                              ? 'bg-pink-500 text-white border-pink-500'
                              : 'border-mocha-200 text-mocha-600 hover:bg-mocha-50'
                          }`}
                        >
                          {page}
                        </button>
                      ))}

                      <button
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className="flex items-center px-3 py-2 text-sm border border-mocha-200 rounded-lg hover:bg-mocha-50 disabled:opacity-50 disabled:cursor-not-allowed"
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
                <div className="text-6xl mb-4">🍰</div>
                <h3 className="text-2xl font-semibold text-mocha-700 mb-2">
                  No articles found
                </h3>
                <p className="text-mocha-600 mb-6">
                  {currentSearch || currentCategory
                    ? 'Try adjusting your search criteria or filters.'
                    : 'Check back soon for new articles!'}
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