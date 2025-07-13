import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiHome, FiArrowLeft, FiSearch } from 'react-icons/fi';

const NotFoundPage = () => {
  return (
    <>
      <Helmet>
        <title>Page Not Found - UACP</title>
        <meta name="description" content="The page you're looking for doesn't exist. Return to UACP news portal." />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-sidecar-100 via-alpine-50 to-eternity-100 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-2xl text-center"
        >
          {/* Logo */}
          <div className="mb-8">
            <Link to="/" className="inline-flex items-center space-x-3">
              <img 
                src="/images/uacp_logo.png" 
                alt="UACP Logo" 
                className="h-16 w-auto"
              />
              <div>
                <h1 className="text-3xl font-display font-bold gradient-text">
                  UACP
                </h1>
                <p className="text-sm text-eternity-600">Union Africaine des Chefs Professionnels</p>
              </div>
            </Link>
          </div>

          {/* 404 Content */}
          <div className="card p-12">
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="mb-8"
            >
              <div className="text-8xl font-bold text-eternity-300 mb-4">404</div>
              <div className="text-6xl mb-4">🌍</div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.5 }}
            >
              <h2 className="text-3xl font-display font-bold text-eternity-700 mb-4">
                Page Not Found
              </h2>
              <p className="text-lg text-eternity-600 mb-8 max-w-md mx-auto">
                The page you're looking for doesn't exist or has been moved. 
                Let's get you back to exploring African culinary excellence.
              </p>
            </motion.div>

            {/* Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.5 }}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            >
              <Link
                to="/"
                className="btn-primary flex items-center space-x-2 px-6 py-3"
              >
                <FiHome className="w-5 h-5" />
                <span>Go to Homepage</span>
              </Link>

              <Link
                to="/articles"
                className="btn-secondary flex items-center space-x-2 px-6 py-3"
              >
                <FiSearch className="w-5 h-5" />
                <span>Browse News</span>
              </Link>

              <button
                onClick={() => window.history.back()}
                className="btn-outline flex items-center space-x-2 px-6 py-3"
              >
                <FiArrowLeft className="w-5 h-5" />
                <span>Go Back</span>
              </button>
            </motion.div>

            {/* Additional Help */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8, duration: 0.5 }}
              className="mt-12 pt-8 border-t border-sidecar-200"
            >
              <p className="text-sm text-eternity-500 mb-4">
                Can't find what you're looking for?
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center text-sm">
                <Link
                  to="/contact"
                  className="text-eternity-600 hover:text-eternity-800 font-medium transition-colors duration-200"
                >
                  Contact Support
                </Link>
                <Link
                  to="/about"
                  className="text-eternity-600 hover:text-eternity-800 font-medium transition-colors duration-200"
                >
                  About UACP
                </Link>
                <Link
                  to="/search"
                  className="text-eternity-600 hover:text-eternity-800 font-medium transition-colors duration-200"
                >
                  Search Articles
                </Link>
              </div>
            </motion.div>
          </div>

          {/* Footer Note */}
          <div className="mt-8 text-center">
            <p className="text-sm text-eternity-500">
              © 2024 UACP - Union Africaine des Chefs Professionnels. 
              Celebrating African culinary excellence.
            </p>
          </div>
        </motion.div>
      </div>
    </>
  );
};

export default NotFoundPage; 