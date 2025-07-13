import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FiSearch, FiMenu, FiX, FiUser } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import SearchModal from '../common/SearchModal';
import { useQuery } from 'react-query';
import { apiService, queryKeys } from '../../utils/api';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // Fetch categories for navigation
  const { data: categoriesData } = useQuery(
    queryKeys.categories.lists(),
    apiService.getCategories,
    {
      staleTime: 5 * 60 * 1000, // 5 minutes
    }
  );

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close menu when route changes
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  const handleSearch = (query) => {
    setIsSearchOpen(false);
    navigate(`/search?q=${encodeURIComponent(query)}`);
  };

  const navigation = [
    { name: 'Home', href: '/' },
    { name: 'News', href: '/articles' },
    { name: 'About', href: '/about' },
    { name: 'Contact', href: '/contact' },
  ];

  return (
    <>
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-white-rock-400/95 backdrop-blur-md shadow-medium' 
          : 'bg-transparent'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 lg:h-20">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2">
              <img 
                src="/images/uacp_logo.png" 
                alt="UACP Logo" 
                className="h-8 lg:h-12 w-auto"
              />
              <div className="hidden sm:block">
                <h1 className="text-xl lg:text-2xl font-display font-bold gradient-text">
                  UACP
                </h1>
                <p className="text-xs text-eternity-600 hidden lg:block">
                  Union Africaine des Chefs Professionnels
                </p>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-8">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`text-sm font-medium transition-colors duration-200 ${
                    location.pathname === item.href
                      ? 'text-eternity-700'
                      : 'text-eternity-600 hover:text-eternity-700'
                  }`}
                >
                  {item.name}
                </Link>
              ))}
              
              {/* Categories Dropdown */}
              {categoriesData?.categories && (
                <div className="relative group">
                  <button className="text-sm font-medium text-eternity-600 hover:text-eternity-700 transition-colors duration-200">
                    Categories
                  </button>
                  <div className="absolute top-full left-0 mt-2 w-64 bg-white-rock-400 rounded-lg shadow-large border border-sidecar-300 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                    <div className="py-2">
                      {categoriesData.categories.slice(0, 6).map((category) => (
                        <Link
                          key={category._id}
                          to={`/category/${category.slug}`}
                          className="block px-4 py-2 text-sm text-eternity-700 hover:bg-sidecar-100 transition-colors duration-200"
                        >
                          <div className="flex items-center space-x-2">
                            <span>{category.icon}</span>
                            <span>{category.name}</span>
                            <span className="text-xs text-delta-500">({category.articleCount})</span>
                          </div>
                        </Link>
                      ))}
                      <div className="border-t border-sidecar-300 mt-2 pt-2">
                        <Link
                          to="/articles"
                          className="block px-4 py-2 text-sm text-eternity-600 hover:bg-sidecar-100 transition-colors duration-200"
                        >
                          View All News →
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </nav>

            {/* Desktop Actions */}
            <div className="hidden lg:flex items-center space-x-4">
              <button
                onClick={() => setIsSearchOpen(true)}
                className="p-2 text-eternity-600 hover:text-eternity-700 transition-colors duration-200"
                aria-label="Search"
              >
                <FiSearch className="w-5 h-5" />
              </button>
              
              <Link
                to="/admin/login"
                className="flex items-center space-x-2 text-sm font-medium text-eternity-600 hover:text-eternity-700 transition-colors duration-200"
              >
                <FiUser className="w-4 h-4" />
                <span>Admin</span>
              </Link>
            </div>

            {/* Mobile menu button */}
            <div className="lg:hidden flex items-center space-x-2">
              <button
                onClick={() => setIsSearchOpen(true)}
                className="p-2 text-eternity-600 hover:text-eternity-700 transition-colors duration-200"
                aria-label="Search"
              >
                <FiSearch className="w-5 h-5" />
              </button>
              
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-2 text-eternity-600 hover:text-eternity-700 transition-colors duration-200"
                aria-label="Toggle menu"
              >
                {isMenuOpen ? (
                  <FiX className="w-6 h-6" />
                ) : (
                  <FiMenu className="w-6 h-6" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="lg:hidden bg-white-rock-400 border-t border-sidecar-300"
            >
              <div className="px-4 py-6 space-y-4">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`block text-base font-medium transition-colors duration-200 ${
                      location.pathname === item.href
                        ? 'text-eternity-700'
                        : 'text-eternity-600 hover:text-eternity-700'
                    }`}
                  >
                    {item.name}
                  </Link>
                ))}
                
                {/* Mobile Categories */}
                {categoriesData?.categories && (
                  <div className="pt-4 border-t border-sidecar-300">
                    <h3 className="text-sm font-semibold text-eternity-700 mb-3">Categories</h3>
                    <div className="grid grid-cols-2 gap-2">
                      {categoriesData.categories.slice(0, 6).map((category) => (
                        <Link
                          key={category._id}
                          to={`/category/${category.slug}`}
                          className="flex items-center space-x-2 p-2 rounded-lg hover:bg-sidecar-100 transition-colors duration-200"
                        >
                          <span>{category.icon}</span>
                          <span className="text-sm text-eternity-700">{category.name}</span>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
                
                <div className="pt-4 border-t border-sidecar-300">
                  <Link
                    to="/admin/login"
                    className="flex items-center space-x-2 text-base font-medium text-eternity-600 hover:text-eternity-700 transition-colors duration-200"
                  >
                    <FiUser className="w-4 h-4" />
                    <span>Admin Login</span>
                  </Link>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Spacer for fixed header */}
      <div className="h-16 lg:h-20" />

      {/* Search Modal */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onSearch={handleSearch}
      />
    </>
  );
};

export default Header; 