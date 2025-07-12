import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiClock, FiEye, FiHeart, FiUser } from 'react-icons/fi';
import { formatDistanceToNow } from 'date-fns';

const ArticleCard = ({ article, featured = false, className = '' }) => {
  const formatDate = (dateString) => {
    if (!dateString) return '';
    return formatDistanceToNow(new Date(dateString), { addSuffix: true });
  };

  const truncateText = (text, maxLength = 120) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  if (featured) {
    return (
      <motion.div
        whileHover={{ y: -5 }}
        className={`card card-hover ${className}`}
      >
        <div className="relative aspect-video overflow-hidden">
          <img
            src={article.featuredImage}
            alt={article.title}
            className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <div className="absolute bottom-4 left-4 right-4">
            <div className="badge badge-primary mb-2">
              {article.category?.name}
            </div>
            <h3 className="text-xl font-display font-bold text-white mb-2 line-clamp-2">
              {article.title}
            </h3>
            <div className="flex items-center space-x-4 text-white/80 text-sm">
              <div className="flex items-center space-x-1">
                <FiUser className="w-4 h-4" />
                <span>{article.author?.firstName} {article.author?.lastName}</span>
              </div>
              <div className="flex items-center space-x-1">
                <FiClock className="w-4 h-4" />
                <span>{formatDate(article.publishedAt)}</span>
              </div>
            </div>
          </div>
        </div>
        <div className="p-6">
          <p className="text-mocha-600 mb-4 line-clamp-3">
            {article.excerpt}
          </p>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4 text-sm text-mocha-500">
              <div className="flex items-center space-x-1">
                <FiEye className="w-4 h-4" />
                <span>{article.viewCount || 0}</span>
              </div>
              <div className="flex items-center space-x-1">
                <FiHeart className="w-4 h-4" />
                <span>{article.likes || 0}</span>
              </div>
            </div>
            <Link
              to={`/articles/${article.slug}`}
              className="text-mocha-600 hover:text-mocha-800 font-medium transition-colors duration-200"
            >
              Read More →
            </Link>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      whileHover={{ y: -5 }}
      className={`card card-hover ${className}`}
    >
      <div className="relative aspect-4-3 overflow-hidden">
        <img
          src={article.featuredImage}
          alt={article.title}
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
        />
        <div className="absolute top-4 left-4">
          <div className="badge badge-primary">
            {article.category?.name}
          </div>
        </div>
        {article.isFeatured && (
          <div className="absolute top-4 right-4">
            <div className="badge badge-secondary">
              Featured
            </div>
          </div>
        )}
      </div>
      
      <div className="p-6">
        <h3 className="text-lg font-display font-bold text-mocha-700 mb-3 line-clamp-2 hover:text-mocha-800 transition-colors duration-200">
          <Link to={`/articles/${article.slug}`}>
            {article.title}
          </Link>
        </h3>
        
        <p className="text-mocha-600 mb-4 line-clamp-3">
          {truncateText(article.excerpt)}
        </p>
        
        <div className="flex items-center justify-between text-sm text-mocha-500 mb-4">
          <div className="flex items-center space-x-1">
            <FiUser className="w-4 h-4" />
            <span>{article.author?.firstName} {article.author?.lastName}</span>
          </div>
          <div className="flex items-center space-x-1">
            <FiClock className="w-4 h-4" />
            <span>{formatDate(article.publishedAt)}</span>
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4 text-sm text-mocha-500">
            <div className="flex items-center space-x-1">
              <FiEye className="w-4 h-4" />
              <span>{article.viewCount || 0}</span>
            </div>
            <div className="flex items-center space-x-1">
              <FiHeart className="w-4 h-4" />
              <span>{article.likes || 0}</span>
            </div>
          </div>
          <Link
            to={`/articles/${article.slug}`}
            className="text-mocha-600 hover:text-mocha-800 font-medium transition-colors duration-200"
          >
            Read More →
          </Link>
        </div>
      </div>
    </motion.div>
  );
};

export default ArticleCard; 