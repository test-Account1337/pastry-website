import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiArrowRight, FiClock, FiEye, FiHeart } from 'react-icons/fi';
import { useQuery } from 'react-query';
import { apiService, queryKeys } from '../utils/api';
import ArticleCard from '../components/articles/ArticleCard';
import CategoryCard from '../components/categories/CategoryCard';
import LoadingSpinner from '../components/common/LoadingSpinner';

const HomePage = () => {
  // Fetch featured articles
  const { data: featuredData, isLoading: featuredLoading } = useQuery(
    queryKeys.articles.featured(),
    apiService.getFeaturedArticles,
    {
      staleTime: 5 * 60 * 1000,
    }
  );

  // Fetch latest articles
  const { data: latestData, isLoading: latestLoading } = useQuery(
    queryKeys.articles.list({ page: 1, limit: 6 }),
    () => apiService.getArticles({ page: 1, limit: 6 }),
    {
      staleTime: 5 * 60 * 1000,
    }
  );

  // Fetch categories
  const { data: categoriesData, isLoading: categoriesLoading } = useQuery(
    queryKeys.categories.lists(),
    apiService.getCategories,
    {
      staleTime: 10 * 60 * 1000,
    }
  );

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
      },
    },
  };

  return (
    <>
      <Helmet>
        <title>UACP - Union Africaine des Chefs Professionnels</title>
        <meta name="description" content="Uniting African culinary professionals, promoting excellence, and advancing the gastronomy industry across the continent. Your premier source for African culinary news and insights." />
      </Helmet>

      {/* Hero Section */}
      <section className="relative overflow-hidden min-h-[80vh] flex items-center" style={{ backgroundImage: 'url(/images/hero_section_bg.png)', backgroundSize: 'cover', backgroundPosition: 'center' }}>
        <div className="absolute inset-0 bg-gradient-to-tl from-eternity-900/80 via-eternity-800/70 to-eternity-700/60"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-display font-bold text-white text-shadow mb-6">
              Union Africaine des
              <span className="block text-alpine-300">Chefs Professionnels</span>
            </h1>
            <p className="text-xl md:text-2xl text-white/90 mb-8 max-w-3xl mx-auto">
              Uniting African culinary professionals, promoting excellence, and advancing the gastronomy industry across the continent
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/articles"
                className="btn-primary text-lg px-8 py-4 bg-alpine-400 text-eternity-900 hover:bg-alpine-300"
              >
                Explore News
                <FiArrowRight className="ml-2" />
              </Link>
              <Link
                to="/about"
                className="btn-outline text-lg px-8 py-4 border-alpine-300 text-alpine-300 hover:bg-alpine-300 hover:text-eternity-900"
              >
                About UACP
              </Link>
            </div>
          </motion.div>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute top-20 left-10 text-6xl opacity-20 animate-bounce-soft">🍰</div>
        <div className="absolute top-40 right-20 text-4xl opacity-20 animate-bounce-soft" style={{ animationDelay: '1s' }}>🥐</div>
        <div className="absolute bottom-20 left-20 text-5xl opacity-20 animate-bounce-soft" style={{ animationDelay: '2s' }}>🎂</div>
      </section>

      {/* Featured Articles Section */}
      <section className="py-16 lg:py-24 bg-white-rock-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-display font-bold text-eternity-700 mb-4">
              Featured Stories
            </h2>
            <p className="text-lg text-eternity-600 max-w-2xl mx-auto">
              Handpicked articles showcasing the best of culinary innovation, technique, and creativity
            </p>
          </motion.div>

          {featuredLoading ? (
            <LoadingSpinner />
          ) : (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {featuredData?.articles?.map((article, index) => (
                <motion.div key={article._id} variants={itemVariants}>
                  <ArticleCard article={article} featured={index === 0} />
                </motion.div>
              ))}
            </motion.div>
          )}

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5 }}
            className="text-center mt-12"
          >
            <Link
              to="/articles"
              className="btn-primary text-lg px-8 py-3 inline-flex items-center"
            >
              View All News
              <FiArrowRight className="ml-2" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 lg:py-24 bg-eternity-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-display font-bold text-eternity-700 mb-4">
              Explore Categories
            </h2>
            <p className="text-lg text-eternity-600 max-w-2xl mx-auto">
              Dive into specific areas of culinary arts that interest you most
            </p>
          </motion.div>

          {categoriesLoading ? (
            <LoadingSpinner />
          ) : (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
            >
              {categoriesData?.categories?.slice(0, 8).map((category) => (
                <motion.div key={category._id} variants={itemVariants}>
                  <CategoryCard category={category} />
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </section>

      {/* Latest Articles Section */}
      <section className="py-16 lg:py-24 bg-white-rock-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-display font-bold text-eternity-700 mb-4">
              Latest News
            </h2>
            <p className="text-lg text-eternity-600 max-w-2xl mx-auto">
              Stay updated with the freshest content from the culinary world
            </p>
          </motion.div>

          {latestLoading ? (
            <LoadingSpinner />
          ) : (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {latestData?.articles?.map((article) => (
                <motion.div key={article._id} variants={itemVariants}>
                  <ArticleCard article={article} />
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 lg:py-24 bg-eternity-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
              Join Our Community
            </h2>
            <p className="text-xl text-sidecar-300 max-w-2xl mx-auto">
              Connect with African culinary professionals and enthusiasts worldwide
            </p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center"
          >
            <motion.div variants={itemVariants} className="space-y-2">
              <div className="text-3xl md:text-4xl font-bold text-alpine-300">500+</div>
              <div className="text-sidecar-300">Articles Published</div>
            </motion.div>
            <motion.div variants={itemVariants} className="space-y-2">
              <div className="text-3xl md:text-4xl font-bold text-alpine-300">50+</div>
              <div className="text-sidecar-300">Expert Chefs</div>
            </motion.div>
            <motion.div variants={itemVariants} className="space-y-2">
              <div className="text-3xl md:text-4xl font-bold text-alpine-300">10K+</div>
              <div className="text-sidecar-300">Monthly Readers</div>
            </motion.div>
            <motion.div variants={itemVariants} className="space-y-2">
              <div className="text-3xl md:text-4xl font-bold text-alpine-300">25+</div>
              <div className="text-sidecar-300">Categories</div>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </>
  );
};

export default HomePage; 