import React, { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiMenu, 
  FiX, 
  FiHome, 
  FiFileText, 
  FiFolder, 
  FiUsers, 
  FiSettings, 
  FiLogOut,
  FiUser,
  FiBarChart2
} from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext.jsx';

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const navigation = [
    { name: 'Dashboard', href: '/admin/dashboard', icon: FiHome },
    { name: 'News', href: '/admin/articles', icon: FiFileText },
    { name: 'Categories', href: '/admin/categories', icon: FiFolder },
    { name: 'Users', href: '/admin/users', icon: FiUsers },
    { name: 'Analytics', href: '/admin/analytics', icon: FiBarChart2 },
    { name: 'Settings', href: '/admin/settings', icon: FiSettings },
  ];

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  return (
    <div className="min-h-screen bg-sidecar-50">
      {/* Mobile sidebar overlay (removed) */}
      {/* Sidebar (removed) */}

      {/* Main Content */}
      <div>
        {/* Top Bar */}
        <div className="bg-white shadow-sm border-b border-sidecar-300">
          <div className="flex items-center justify-between px-6 py-4">
            <div className="flex items-center space-x-4">
              <Link
                to="/admin/dashboard"
                className="flex items-center text-eternity-600 hover:text-eternity-800 font-medium transition-colors duration-200"
              >
                <FiHome className="w-5 h-5 mr-2" />
                Dashboard
              </Link>
            </div>
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 text-eternity-500 hover:text-eternity-700"
            >
              <FiMenu className="w-6 h-6" />
            </button>
            <div className="flex items-center space-x-4">
              <Link
                to="/"
                target="_blank"
                className="text-sm text-eternity-600 hover:text-eternity-800 transition-colors duration-200"
              >
                View Site →
              </Link>
              <button
                onClick={handleLogout}
                className="flex items-center text-sm text-red-600 hover:text-red-800 transition-colors duration-200 border border-red-100 rounded px-3 py-1 ml-2"
              >
                <FiLogOut className="w-4 h-4 mr-1" />
                Log Out
              </button>
            </div>
          </div>
        </div>

        {/* Page Content */}
        <main className="flex-1 w-full p-0">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout; 