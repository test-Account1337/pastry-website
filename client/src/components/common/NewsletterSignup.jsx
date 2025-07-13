import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FiMail, FiUser, FiTrendingUp, FiSend, FiAward } from 'react-icons/fi';
import { useMutation } from 'react-query';
import { apiService } from '../../utils/api';
import toast from 'react-hot-toast';
import { useTranslation } from '../../utils/translations';

const NewsletterSignup = () => {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const { t } = useTranslation();

  const subscribeMutation = useMutation(
    (data) => apiService.subscribeNewsletter(data),
    {
      onSuccess: () => {
        toast.success('Successfully subscribed to newsletter!');
        setEmail('');
        setName('');
      },
      onError: (error) => {
        toast.error(error.response?.data?.message || 'Failed to subscribe');
      },
    }
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email) {
      toast.error('Please enter your email address');
      return;
    }
    subscribeMutation.mutate({ email, name });
  };

  return (
    <section className="bg-gradient-to-r from-eternity-700 to-eternity-800 text-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-8"
          >
            <div className="flex justify-center mb-4">
              <div className="bg-alpine-200 p-3 rounded-full">
                <FiMail className="w-8 h-8 text-eternity-700" />
              </div>
            </div>
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
              {t('stayConnected')}
            </h2>
            <p className="text-xl text-sidecar-300 max-w-2xl mx-auto">
              {t('newsletterSubtitle')}
            </p>
          </motion.div>

          <motion.form
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            onSubmit={handleSubmit}
            className="max-w-md mx-auto"
          >
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <input
                  type="text"
                  placeholder="Your name (optional)"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg text-eternity-700 placeholder-eternity-400 focus:outline-none focus:ring-2 focus:ring-alpine-300"
                />
              </div>
              <div className="flex-1">
                <input
                  type="email"
                  placeholder="Your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-4 py-3 rounded-lg text-eternity-700 placeholder-eternity-400 focus:outline-none focus:ring-2 focus:ring-alpine-300"
                />
              </div>
              <button
                type="submit"
                disabled={subscribeMutation.isLoading}
                className="btn-primary bg-alpine-500 hover:bg-alpine-600 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {subscribeMutation.isLoading ? (
                  <div className="loading-spinner w-5 h-5"></div>
                ) : (
                  <>
                    <FiSend className="mr-2" />
                    Subscribe
                  </>
                )}
              </button>
            </div>
            
            <p className="text-sm text-sidecar-300 mt-4">
              We respect your privacy. Unsubscribe at any time.
            </p>
          </motion.form>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            <div className="text-center">
              <div className="text-2xl mb-2">
                <FiTrendingUp className="w-8 h-8 text-alpine-400 mx-auto" />
              </div>
              <h3 className="font-semibold mb-2">Exclusive Recipes</h3>
              <p className="text-sm text-sidecar-300">
                Get access to premium African recipes from top chefs
              </p>
            </div>
            <div className="text-center">
              <div className="text-2xl mb-2">
                <FiAward className="w-8 h-8 text-alpine-400 mx-auto" />
              </div>
              <h3 className="font-semibold mb-2">Chef Interviews</h3>
              <p className="text-sm text-sidecar-300">
                Behind-the-scenes insights from African culinary masters
              </p>
            </div>
            <div className="text-center">
              <div className="text-2xl mb-2">
                <FiTrendingUp className="w-8 h-8 text-alpine-400 mx-auto" />
              </div>
              <h3 className="font-semibold mb-2">Industry Trends</h3>
              <p className="text-sm text-sidecar-300">
                Stay ahead with the latest African culinary innovations
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default NewsletterSignup; 