import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiSearch, FiX, FiArrowRight } from 'react-icons/fi';
import { useQuery } from 'react-query';
import { apiService, queryKeys } from '../../utils/api';
import { Link } from 'react-router-dom';

const SearchModal = ({ isOpen, onClose, onSearch }) => {
  const [query, setQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  // Fetch search suggestions
  const { data: suggestionsData } = useQuery(
    queryKeys.articles.search(query),
    () => apiService.searchArticles(query),
    {
      enabled: query.length >= 2,
      staleTime: 2 * 60 * 1000,
    }
  );

  useEffect(() => {
    if (suggestionsData?.suggestions) {
      setSearchResults(suggestionsData.suggestions);
    }
  }, [suggestionsData]);

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query.trim());
    }
  };

  const handleResultClick = (result) => {
    onClose();
    // Navigate to the article
    window.location.href = `/articles/${result.slug}`;
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: -20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: -20 }}
          className="min-h-screen flex items-start justify-center p-4 pt-20"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[80vh] overflow-hidden">
            {/* Header */}
            <div className="p-6 border-b border-cream-200">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-display font-bold text-mocha-700">
                  Search Articles
                </h2>
                <button
                  onClick={onClose}
                  className="p-2 text-mocha-500 hover:text-mocha-700 transition-colors duration-200"
                >
                  <FiX className="w-6 h-6" />
                </button>
              </div>
              
              {/* Search Form */}
              <form onSubmit={handleSubmit} className="relative">
                <div className="relative">
                  <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-mocha-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Search for articles, chefs, techniques..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 border border-cream-300 rounded-lg focus:ring-2 focus:ring-mocha-500 focus:border-transparent text-lg"
                    autoFocus
                  />
                </div>
                <button
                  type="submit"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-mocha-500 text-white p-2 rounded-lg hover:bg-mocha-600 transition-colors duration-200"
                >
                  <FiArrowRight className="w-5 h-5" />
                </button>
              </form>
            </div>

            {/* Results */}
            <div className="max-h-96 overflow-y-auto">
              {query.length >= 2 && (
                <div className="p-6">
                  {searchResults.length > 0 ? (
                    <div className="space-y-4">
                      <h3 className="text-sm font-semibold text-mocha-600 uppercase tracking-wide">
                        Search Results
                      </h3>
                      {searchResults.map((result) => (
                        <div
                          key={result._id}
                          onClick={() => handleResultClick(result)}
                          className="p-4 rounded-lg hover:bg-cream-50 cursor-pointer transition-colors duration-200"
                        >
                          <h4 className="font-medium text-mocha-700 mb-1">
                            {result.title}
                          </h4>
                          <p className="text-sm text-mocha-500">
                            Click to read article
                          </p>
                        </div>
                      ))}
                    </div>
                  ) : query.length >= 2 ? (
                    <div className="text-center py-8">
                      <div className="text-4xl mb-4">🔍</div>
                      <h3 className="text-lg font-medium text-mocha-700 mb-2">
                        No results found
                      </h3>
                      <p className="text-mocha-500">
                        Try different keywords or browse our categories
                      </p>
                    </div>
                  ) : null}
                </div>
              )}

              {/* Quick Links */}
              {query.length < 2 && (
                <div className="p-6">
                  <h3 className="text-sm font-semibold text-mocha-600 uppercase tracking-wide mb-4">
                    Popular Categories
                  </h3>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { name: 'Chef Interviews', href: '/category/chef-interviews', icon: '👨‍🍳' },
                      { name: 'Recipes', href: '/category/recipes', icon: '📖' },
                      { name: 'Techniques', href: '/category/techniques', icon: '⚡' },
                      { name: 'Trends', href: '/category/pastry-trends', icon: '📈' },
                    ].map((category) => (
                      <Link
                        key={category.name}
                        to={category.href}
                        onClick={onClose}
                        className="flex items-center space-x-3 p-3 rounded-lg hover:bg-cream-50 transition-colors duration-200"
                      >
                        <span className="text-xl">{category.icon}</span>
                        <span className="text-sm font-medium text-mocha-700">
                          {category.name}
                        </span>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default SearchModal; 