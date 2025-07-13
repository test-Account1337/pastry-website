import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiChevronDown, FiGlobe } from 'react-icons/fi';
import { useLanguage } from '../../context/LanguageContext';

const LanguageSwitcher = () => {
  const { currentLanguage, changeLanguage, languages } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);

  const currentLang = languages[currentLanguage];

  const handleLanguageChange = (languageCode) => {
    changeLanguage(languageCode);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-3 py-2 text-sm font-medium text-eternity-600 hover:text-eternity-700 transition-colors duration-200 rounded-lg hover:bg-sidecar-100"
        aria-label="Change language"
      >
        <FiGlobe className="w-4 h-4" />
        <span className="hidden sm:block">{currentLang.name}</span>
        <FiChevronDown className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute top-full right-0 mt-2 w-48 bg-white-rock-400 rounded-lg shadow-large border border-sidecar-300 z-50"
          >
            <div className="py-2">
              {Object.entries(languages).map(([code, language]) => (
                <button
                  key={code}
                  onClick={() => handleLanguageChange(code)}
                  className={`w-full flex items-center px-4 py-2 text-sm transition-colors duration-200 ${
                    currentLanguage === code
                      ? 'bg-sidecar-200 text-eternity-700'
                      : 'text-eternity-600 hover:bg-sidecar-100 hover:text-eternity-700'
                  }`}
                >
                  <span className="flex-1 text-left">{language.name}</span>
                  {currentLanguage === code && (
                    <div className="w-2 h-2 bg-delta-500 rounded-full"></div>
                  )}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default LanguageSwitcher; 