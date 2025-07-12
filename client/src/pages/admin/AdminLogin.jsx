import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiMail, FiLock, FiEye, FiEyeOff } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext.jsx';

const AdminLogin = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const { login, loading } = useAuth();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await login(formData.email, formData.password);
  };

  return (
    <>
      <Helmet>
        <title>Admin Login - Pastry News</title>
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-cream-100 via-pink-50 to-mocha-100 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-md"
        >
          {/* Logo */}
          <div className="text-center mb-8">
            <Link to="/" className="inline-flex items-center space-x-2">
              <div className="text-4xl">🍰</div>
              <div>
                <h1 className="text-2xl font-display font-bold gradient-text">
                  Pastry News
                </h1>
                <p className="text-sm text-mocha-600">Admin Portal</p>
              </div>
            </Link>
          </div>

          {/* Login Card */}
          <div className="card p-8">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-display font-bold text-mocha-700 mb-2">
                Welcome Back
              </h2>
              <p className="text-mocha-600">
                Sign in to access the admin dashboard
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email Field */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-mocha-700 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <FiMail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-mocha-400 w-5 h-5" />
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="input-field pl-10"
                    placeholder="Enter your email"
                  />
                </div>
              </div>

              {/* Password Field */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-mocha-700 mb-2">
                  Password
                </label>
                <div className="relative">
                  <FiLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-mocha-400 w-5 h-5" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    className="input-field pl-10 pr-10"
                    placeholder="Enter your password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-mocha-400 hover:text-mocha-600 transition-colors duration-200"
                  >
                    {showPassword ? <FiEyeOff className="w-5 h-5" /> : <FiEye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full btn-primary py-3 text-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <div className="loading-spinner w-5 h-5 mr-2"></div>
                    Signing In...
                  </div>
                ) : (
                  'Sign In'
                )}
              </button>
            </form>

            {/* Footer */}
            <div className="mt-8 text-center">
              <p className="text-sm text-mocha-500">
                Need help? Contact{' '}
                <a href="mailto:support@pastrynews.com" className="text-mocha-600 hover:text-mocha-800 font-medium">
                  support@pastrynews.com
                </a>
              </p>
            </div>
          </div>

          {/* Back to Site */}
          <div className="text-center mt-6">
            <Link
              to="/"
              className="text-mocha-600 hover:text-mocha-800 font-medium transition-colors duration-200"
            >
              ← Back to Pastry News
            </Link>
          </div>
        </motion.div>
      </div>
    </>
  );
};

export default AdminLogin; 