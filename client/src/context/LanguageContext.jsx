import React, { createContext, useContext, useState, useEffect } from 'react';

// Language context
const LanguageContext = createContext();

// Available languages
export const languages = {
  en: {
    code: 'en',
    name: 'English',
    flag: '🇺🇸',
    dir: 'ltr'
  },
  fr: {
    code: 'fr',
    name: 'Français',
    flag: '🇫🇷',
    dir: 'ltr'
  },
  ar: {
    code: 'ar',
    name: 'العربية',
    flag: '🇸🇦',
    dir: 'rtl'
  }
};

// Language provider component
export const LanguageProvider = ({ children }) => {
  const [currentLanguage, setCurrentLanguage] = useState(() => {
    // Get language from localStorage or default to English
    const savedLanguage = localStorage.getItem('language');
    return savedLanguage && languages[savedLanguage] ? savedLanguage : 'en';
  });

  // Update document direction and language when language changes
  useEffect(() => {
    const language = languages[currentLanguage];
    document.documentElement.lang = language.code;
    document.documentElement.dir = language.dir;
    localStorage.setItem('language', currentLanguage);
  }, [currentLanguage]);

  const changeLanguage = (languageCode) => {
    if (languages[languageCode]) {
      setCurrentLanguage(languageCode);
    }
  };

  const value = {
    currentLanguage,
    changeLanguage,
    languages
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

// Custom hook to use language context
export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

export default LanguageContext; 