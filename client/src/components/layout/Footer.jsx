import React from 'react';
import { Link } from 'react-router-dom';
import { FiMail, FiPhone, FiMapPin, FiTwitter, FiInstagram, FiFacebook, FiYoutube } from 'react-icons/fi';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    articles: [
      { name: 'Latest News', href: '/articles' },
      { name: 'Featured Stories', href: '/articles?featured=true' },
      { name: 'Chef Interviews', href: '/category/chef-interviews' },
      { name: 'UACP Events', href: '/category/uacp-events' },
    ],
    categories: [
      { name: 'African Cuisine', href: '/category/african-cuisine' },
      { name: 'Competitions', href: '/category/competitions' },
      { name: 'Events', href: '/category/events' },
      { name: 'Chef Training', href: '/category/chef-training' },
    ],
    company: [
      { name: 'About Us', href: '/about' },
      { name: 'Contact', href: '/contact' },
      { name: 'Privacy Policy', href: '/privacy' },
      { name: 'Terms of Service', href: '/terms' },
    ],
  };

  const socialLinks = [
    { name: 'Twitter', icon: FiTwitter, href: 'https://twitter.com/pastrynews' },
    { name: 'Instagram', icon: FiInstagram, href: 'https://instagram.com/pastrynews' },
    { name: 'Facebook', icon: FiFacebook, href: 'https://facebook.com/pastrynews' },
    { name: 'YouTube', icon: FiYoutube, href: 'https://youtube.com/pastrynews' },
  ];

  return (
    <footer className="bg-eternity-800 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="text-3xl">👨‍🍳</div>
              <div>
                <h3 className="text-xl font-display font-bold">UACP</h3>
                <p className="text-sm text-sidecar-300">Union Africaine des Chefs Professionnels</p>
              </div>
            </div>
            <p className="text-sidecar-300 mb-6 max-w-md">
              Uniting African culinary professionals, promoting excellence, and advancing the gastronomy industry across the continent. 
              Join our community of African chefs and culinary enthusiasts.
            </p>
            
            {/* Contact Info */}
            <div className="space-y-3">
              <div className="flex items-center space-x-3 text-sidecar-300">
                <FiMail className="w-4 h-4" />
                <span>hello@pastrynews.com</span>
              </div>
              <div className="flex items-center space-x-3 text-sidecar-300">
                <FiPhone className="w-4 h-4" />
                <span>+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center space-x-3 text-sidecar-300">
                <FiMapPin className="w-4 h-4" />
                <span>123 Pastry Street, Culinary City, CC 12345</span>
              </div>
            </div>
          </div>

          {/* News Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">News</h4>
            <ul className="space-y-2">
              {footerLinks.articles.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-sidecar-300 hover:text-white transition-colors duration-200"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Categories</h4>
            <ul className="space-y-2">
              {footerLinks.categories.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-sidecar-300 hover:text-white transition-colors duration-200"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Company</h4>
            <ul className="space-y-2">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-sidecar-300 hover:text-white transition-colors duration-200"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-eternity-700 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-sidecar-300 text-sm">
              © {currentYear} UACP. All rights reserved.
            </div>
            
            {/* Social Links */}
            <div className="flex items-center space-x-4">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sidecar-300 hover:text-white transition-colors duration-200"
                  aria-label={social.name}
                >
                  <social.icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 