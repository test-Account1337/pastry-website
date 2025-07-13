import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiGrid } from 'react-icons/fi';

const CategoryCard = ({ category, className = '' }) => {
  return (
    <motion.div
      whileHover={{ y: -3, scale: 1.02 }}
      className={`card card-hover text-center ${className}`}
    >
      <Link to={`/category/${category.slug}`} className="block p-6">
        <div className="text-4xl mb-4">
          <FiGrid className="mx-auto text-delta-500" />
        </div>
        
        <h3 className="text-lg font-display font-bold text-eternity-700 mb-2">
          {category.name}
        </h3>
        
        {category.description && (
          <p className="text-sm text-eternity-600 mb-4 line-clamp-2">
            {category.description}
          </p>
        )}
        
        <div className="flex items-center justify-center space-x-2 text-sm text-eternity-500">
          <span>{category.articleCount || 0}</span>
          <span>articles</span>
        </div>
        
        <div 
          className="w-12 h-1 mx-auto mt-4 rounded-full"
          style={{ backgroundColor: category.color }}
        ></div>
      </Link>
    </motion.div>
  );
};

export default CategoryCard; 