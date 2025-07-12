import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { useQuery } from 'react-query';
import { 
  FiArrowLeft, 
  FiGrid, 
  FiList,
  FiChevronLeft,
  FiChevronRight,
  FiClock,
  FiUser,
  FiEye
} from 'react-icons/fi';
import { apiService, queryKeys } from '../utils/api';
import ArticleCard from '../components/articles/ArticleCard';
import LoadingSpinner from '../components/common/LoadingSpinner';
import NewsletterSignup from '../components/common/NewsletterSignup';

const CategoryPage = () => {
  const { slug } = useParams();
  const [viewMode, setViewMode] = useState('grid');
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState('latest');

  // Fetch category by slug
  const { data: category, isLoading: categoryLoading } = useQuery(
    queryKeys.categories.detail(slug),
    () => apiService.getCategoryBySlug(slug),
    {
      staleTime: 10 * 60 * 1000,
    }
  );

  // Fetch articles in this category
  const { data: articlesData, isLoading: articlesLoading } = useQuery(
    queryKeys.articles.byCategory(slug, { page: currentPage, sort: sortBy }),
    () => apiService.getArticlesByCategory(slug, { page: currentPage, sort: sortBy }),
    {
      enabled: !!slug,
      staleTime: 2 * 60 * 1000,
    }
  );

  // Fetch related categories
  const { data: relatedCategories } = useQuery(
    queryKeys.categories.related(category?._id),
    () => apiService.getRelatedCategories(category?._id),
    {
      enabled: !!category?._id,
      staleTime: 10 * 60 * 1000,
    }
  );

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSortChange = (sort) => {
    setSortBy(sort);
    setCurrentPage(1);
  };

  if (categoryLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (!category) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-mocha-500 mb-4">Category Not Found</h1>
          <p className="text-mocha-600 mb-8">The category you're looking for doesn't exist.</p>
          <Link to="/articles" className="btn-primary">
            Browse All Articles
          </Link>
        </div>
      </div>
    );
  }

  const totalPages = articlesData?.totalPages || 1;
  const totalArticles = articlesData?.total || 0;

  return (
    <>
      <Helmet>
        <title>{category.name} - Pastry News</title>
        <meta name="description" content={category.description || `Explore ${category.name} articles and insights from the pastry world.`} />
      </Helmet>

      <div className="bg-white">
        {/* Category Header */}
        <section className="relative overflow-hidden hero-gradient min-h-[50vh] flex items-center">
          <div className="absolute inset-0 pastry-bg opacity-30"></div>
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center"
            >
              {/* Breadcrumb */}
              <nav className="flex items-center justify-center space-x-2 text-sm text-white/80 mb-6">
                <Link to="/" className="hover:text-white transition-colors">Home</Link>
                <span>/</span>
                <Link to="/articles" className="hover:text-white transition-colors">Articles</Link>
                <span>/</span>
                <span className="text-white">{category.name}</span>
              </nav>

              <h1 className="text-4xl md:text-6xl font-display font-bold text-white text-shadow mb-6">
                {category.name}
              </h1>
              {category.description && (
                <p className="text-xl md:text-2xl text-white/90 mb-8 max-w-3xl mx-auto">
                  {category.description}
                </p>
              )}
              
              {/* Category Stats */}
              <div className="flex justify-center space-x-8 text-white/90">
                <div className="text-center">
                  <div className="text-2xl font-bold">{totalArticles}</div>
                  <div className="text-sm">Articles</div>
                </div>
                {category.articleCount && (
                  <div className="text-center">
                    <div className="text-2xl font-bold">{category.articleCount}</div>
                    <div className="text-sm">Total</div>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        </section>

        {/* Category Content */}
        <section className="py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Controls */}
            <div className="flex flex-col lg:flex-row gap-6 items-start lg:items-center justify-between mb-8">
              <div className="flex items-center gap-4">
                <Link
                  to="/articles"
                  className="flex items-center text-mocha-600 hover:text-mocha-700 transition-colors"
                >
                  <FiArrowLeft className="mr-2" />
                  Back to All Articles
                </Link>
              </div>

              <div className="flex items-center gap-4">
                {/* Sort Options */}
                <select
                  value={sortBy}
                  onChange={(e) => handleSortChange(e.target.value)}
                  className="px-3 py-2 border border-mocha-200 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                >
                  <option value="latest">Latest First</option>
                  <option value="oldest">Oldest First</option>
                  <option value="popular">Most Popular</option>
                  <option value="title">Title A-Z</option>
                </select>

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

            {/* Articles Grid */}
            {articlesLoading ? (
              <LoadingSpinner />
            ) : articlesData?.data?.articles?.length > 0 ? (
              <>
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

                      {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                        const pageNum = i + 1;
                        return (
                          <button
                            key={pageNum}
                            onClick={() => handlePageChange(pageNum)}
                            className={`px-3 py-2 text-sm border rounded-lg ${
                              pageNum === currentPage
                                ? 'bg-pink-500 text-white border-pink-500'
                                : 'border-mocha-200 text-mocha-600 hover:bg-mocha-50'
                            }`}
                          >
                            {pageNum}
                          </button>
                        );
                      })}

                      <button
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className="flex items-center px-3 py-2 text-sm border border-mocha-200 rounded-lg hover:bg-mocha-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Next
                        <FiChevronLeft className="ml-1 rotate-180" />
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
                <p className="text-mocha-600 mb-8">
                  We don't have any articles in this category yet. Check back soon!
                </p>
                <Link to="/articles" className="btn-primary">
                  Browse All Articles
                </Link>
              </div>
            )}
          </div>
        </section>

        {/* Related Categories */}
        {relatedCategories?.categories && relatedCategories.categories.length > 0 && (
          <section className="py-16 lg:py-24 bg-cream-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="text-center mb-12"
              >
                <h2 className="text-3xl md:text-4xl font-display font-bold text-mocha-700 mb-4">
                  Explore More Categories
                </h2>
                <p className="text-lg text-mocha-600 max-w-2xl mx-auto">
                  Discover other areas of pastry arts that might interest you
                </p>
              </motion.div>

              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {relatedCategories.categories.slice(0, 8).map((relatedCategory) => (
                  <motion.div
                    key={relatedCategory._id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                  >
                    <Link
                      to={`/category/${relatedCategory.slug}`}
                      className="block bg-white p-6 rounded-lg shadow-sm border border-cream-200 hover:shadow-md transition-shadow text-center"
                    >
                      <div className="bg-pink-100 w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-4">
                        <span className="text-2xl">🍰</span>
                      </div>
                      <h3 className="font-semibold text-mocha-700 mb-2">
                        {relatedCategory.name}
                      </h3>
                      {relatedCategory.articleCount && (
                        <p className="text-sm text-mocha-500">
                          {relatedCategory.articleCount} articles
                        </p>
                      )}
                    </Link>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Newsletter Signup */}
        <NewsletterSignup />
      </div>
    </>
  );
};

export default CategoryPage; 