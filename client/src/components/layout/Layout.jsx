import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import NewsletterSignup from '../common/NewsletterSignup';

const Layout = () => {
  return (
    <div className="min-h-screen flex flex-col bg-eternity-50">
      <Header />
      
      <main className="flex-grow">
        <Outlet />
      </main>
      
      <NewsletterSignup />
      <Footer />
    </div>
  );
};

export default Layout; 