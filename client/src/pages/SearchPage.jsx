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
  FiClock,
  FiTag,
  FiUser,
  FiX
} from 'react-icons/fi';
import { apiService, queryKeys } from '../utils/api';
import ArticleCard from '../components/articles/ArticleCard';
import LoadingSpinner from '../components/common/LoadingSpinner';

const SearchPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [viewMode, setViewMode] = useState('grid');
  const [showFilters, setShowFilters] = useState(false);

  // Get search parameters from URL
  const query = searchParams.get('q') || '';
  const page = parseInt(searchParams.get('page')) || 1;
  const category = searchParams.get('category') || '';
  const author = searchParams.get('author') || '';
  const dateFrom = searchParams.get('dateFrom') || '';
  const dateTo = searchParams.get('dateTo') || '';
  const sort = searchParams.get('sort') || 'relevance';

  // Fetch search results
  const { data: searchData, isLoading } = useQuery(
    queryKeys.articles.search({
      query,
      page,
      category,
      author,
      dateFrom,
      dateTo,
      sort
    }),
    () => apiService.searchArticles({
      query,
      page,
      category,
      author,
      dateFrom,
      dateTo,
      sort
    }),
    {
      enabled: !!query,
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

  // Update search parameters
  const updateSearchParams = (newParams) => {
    const params = new URLSearchParams(searchParams);
    Object.entries(newParams).forEach(([key, value]) => {
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
    });
    params.set('page', '1'); // Reset to first page
    setSearchParams(params);
  };

  const handleSearch = (searchQuery) => {
    updateSearchParams({ q: searchQuery });
  };

  const handleFilterChange = (filterType, value) => {
    updateSearchParams({ [filterType]: value });
  };

  const handlePageChange = (newPage) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', newPage.toString());
    setSearchParams(params);
  };

  const clearFilters = () => {
    const params = new URLSearchParams();
    params.set('q', query);
    setSearchParams(params);
  };

  const hasActiveFilters = category || author || dateFrom || dateTo || sort !== 'relevance';

  return (
    <>
      <Helmet>
        <title>Search Results - Pastry News</title>
        <meta name="description" content={`Search results for "${query}" - Find articles about pastry chefs, techniques, and industry news.`} />
      </Helmet>

      <div className="bg-white">
        {/* Search Header */}
        <section className="bg-gradient-to-r from-mocha-600 to-mocha-700 text-white py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center"
            >
              <h1 className="text-4xl md:text-5xl font-display font-bold mb-6">
                Search Results
              </h1>
              <p className="text-xl text-white/90 mb-8">
                {query ? `Results for "${query}"` : 'Search our articles'}
              </p>

              {/* Search Bar */}
              <div className="max-w-2xl mx-auto">
                <div className="relative">
                  <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-mocha-400 text-xl" />
                  <input
                    type="text"
                    placeholder="Search articles, chefs, techniques..."
                    value={query}
                    onChange={(e) => handleSearch(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 text-lg border-0 rounded-lg focus:ring-2 focus:ring-pink-500 text-mocha-700"
                  />
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Search Controls */}
        <section className="py-6 bg-cream-50 border-b border-cream-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
              {/* Results Summary */}
              <div className="text-mocha-600">
                {isLoading ? (
                  'Searching...'
                ) : (
                  <>
                    {searchData?.total || 0} results found
                    {query && ` for "${query}"`}
                  </>
                )}
              </div>

              {/* Controls */}
              <div className="flex items-center gap-4">
                {/* Filter Toggle */}
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="flex items-center px-4 py-2 bg-white border border-mocha-200 rounded-lg hover:bg-mocha-50 transition-colors"
                >
                  <FiFilter className="mr-2" />
                  Filters
                  {hasActiveFilters && (
                    <span className="ml-2 bg-pink-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      !
                    </span>
                  )}
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

            {/* Active Filters */}
            {hasActiveFilters && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="mt-4 flex flex-wrap gap-2"
              >
                <span className="text-sm text-mocha-600">Active filters:</span>
                {category && (
                  <span className="bg-pink-100 text-pink-700 px-3 py-1 rounded-full text-sm">
                    Category: {categoriesData?.categories?.find(c => c._id === category)?.name}
                  </span>
                )}
                {author && (
                  <span className="bg-pink-100 text-pink-700 px-3 py-1 rounded-full text-sm">
                    Author: {author}
                  </span>
                )}
                {dateFrom && (
                  <span className="bg-pink-100 text-pink-700 px-3 py-1 rounded-full text-sm">
                    From: {new Date(dateFrom).toLocaleDateString()}
                  </span>
                )}
                {dateTo && (
                  <span className="bg-pink-100 text-pink-700 px-3 py-1 rounded-full text-sm">
                    To: {new Date(dateTo).toLocaleDateString()}
                  </span>
                )}
                {sort !== 'relevance' && (
                  <span className="bg-pink-100 text-pink-700 px-3 py-1 rounded-full text-sm">
                    Sort: {sort}
                  </span>
                )}
                <button
                  onClick={clearFilters}
                  className="bg-mocha-100 text-mocha-700 px-3 py-1 rounded-full text-sm hover:bg-mocha-200 transition-colors"
                >
                  Clear all
                </button>
              </motion.div>
            )}

            {/* Filters Panel */}
            {showFilters && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-6 p-6 bg-white rounded-lg border border-mocha-200"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {/* Category Filter */}
                  <div>
                    <label className="block text-sm font-medium text-mocha-700 mb-2">
                      Category
                    </label>
                    <select
                      value={category}
                      onChange={(e) => handleFilterChange('category', e.target.value)}
                      className="w-full px-3 py-2 border border-mocha-200 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                    >
                      <option value="">All Categories</option>
                      {categoriesData?.categories?.map((cat) => (
                        <option key={cat._id} value={cat._id}>
                          {cat.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Author Filter */}
                  <div>
                    <label className="block text-sm font-medium text-mocha-700 mb-2">
                      Author
                    </label>
                    <input
                      type="text"
                      value={author}
                      onChange={(e) => handleFilterChange('author', e.target.value)}
                      placeholder="Search by author"
                      className="w-full px-3 py-2 border border-mocha-200 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                    />
                  </div>

                  {/* Date Range */}
                  <div>
                    <label className="block text-sm font-medium text-mocha-700 mb-2">
                      Date From
                    </label>
                    <input
                      type="date"
                      value={dateFrom}
                      onChange={(e) => handleFilterChange('dateFrom', e.target.value)}
                      className="w-full px-3 py-2 border border-mocha-200 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-mocha-700 mb-2">
                      Date To
                    </label>
                    <input
                      type="date"
                      value={dateTo}
                      onChange={(e) => handleFilterChange('dateTo', e.target.value)}
                      className="w-full px-3 py-2 border border-mocha-200 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                    />
                  </div>
                </div>

                {/* Sort Options */}
                <div className="mt-6">
                  <label className="block text-sm font-medium text-mocha-700 mb-2">
                    Sort By
                  </label>
                  <select
                    value={sort}
                    onChange={(e) => handleFilterChange('sort', e.target.value)}
                    className="w-full md:w-auto px-3 py-2 border border-mocha-200 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  >
                    <option value="relevance">Relevance</option>
                    <option value="latest">Latest First</option>
                    <option value="oldest">Oldest First</option>
                    <option value="popular">Most Popular</option>
                    <option value="title">Title A-Z</option>
                  </select>
                </div>
              </motion.div>
            )}
          </div>
        </section>

        {/* Search Results */}
        <section className="py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {!query ? (
              <div className="text-center py-16">
                <div className="text-6xl mb-4">🔍</div>
                <h2 className="text-2xl font-semibold text-mocha-700 mb-4">
                  Start Your Search
                </h2>
                <p className="text-mocha-600 mb-8">
                  Enter a search term above to find articles about pastry chefs, techniques, and industry news.
                </p>
              </div>
            ) : isLoading ? (
              <LoadingSpinner />
            ) : searchData?.articles?.length > 0 ? (
              <>
                {/* Results Grid */}
                <div
                  className={`grid gap-8 ${
                    viewMode === 'grid'
                      ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
                      : 'grid-cols-1'
                  }`}
                >
                  {searchData.articles.map((article) => (
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
                {searchData.totalPages > 1 && (
                  <div className="mt-12 flex justify-center">
                    <nav className="flex items-center space-x-2">
                      <button
                        onClick={() => handlePageChange(page - 1)}
                        disabled={page === 1}
                        className="flex items-center px-3 py-2 text-sm border border-mocha-200 rounded-lg hover:bg-mocha-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Previous
                      </button>

                      {Array.from({ length: Math.min(5, searchData.totalPages) }, (_, i) => {
                        const pageNum = i + 1;
                        return (
                          <button
                            key={pageNum}
                            onClick={() => handlePageChange(pageNum)}
                            className={`px-3 py-2 text-sm border rounded-lg ${
                              pageNum === page
                                ? 'bg-pink-500 text-white border-pink-500'
                                : 'border-mocha-200 text-mocha-600 hover:bg-mocha-50'
                            }`}
                          >
                            {pageNum}
                          </button>
                        );
                      })}

                      <button
                        onClick={() => handlePageChange(page + 1)}
                        disabled={page === searchData.totalPages}
                        className="flex items-center px-3 py-2 text-sm border border-mocha-200 rounded-lg hover:bg-mocha-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Next
                      </button>
                    </nav>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-16">
                <div className="text-6xl mb-4">🍰</div>
                <h2 className="text-2xl font-semibold text-mocha-700 mb-4">
                  No results found
                </h2>
                <p className="text-mocha-600 mb-8">
                  We couldn't find any articles matching "{query}". Try adjusting your search terms or filters.
                </p>
                <div className="space-y-2 text-mocha-600">
                  <p>Suggestions:</p>
                  <ul className="text-sm">
                    <li>• Check your spelling</li>
                    <li>• Try more general keywords</li>
                    <li>• Use different search terms</li>
                    <li>• Clear some filters</li>
                  </ul>
                </div>
              </div>
            )}
          </div>
        </section>
      </div>
    </>
  );
};

export default SearchPage; 