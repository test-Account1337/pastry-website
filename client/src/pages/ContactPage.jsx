import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { 
  FiMail, 
  FiPhone, 
  FiMapPin, 
  FiClock,
  FiSend,
  FiCheckCircle
} from 'react-icons/fi';
import { useMutation } from 'react-query';
import { apiService } from '../utils/api';
import LoadingSpinner from '../components/common/LoadingSpinner';

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const contactMutation = useMutation(apiService.sendContactMessage, {
    onSuccess: () => {
      setIsSubmitted(true);
      setFormData({ name: '', email: '', subject: '', message: '' });
    },
    onError: (error) => {
      console.error('Contact form error:', error);
      alert('There was an error sending your message. Please try again.');
    }
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    contactMutation.mutate(formData);
  };

  const contactInfo = [
    {
      icon: FiMail,
      title: 'Email Us',
      content: 'hello@pastrynews.com',
      link: 'mailto:hello@pastrynews.com'
    },
    {
      icon: FiPhone,
      title: 'Call Us',
      content: '+1 (555) 123-4567',
      link: 'tel:+15551234567'
    },
    {
      icon: FiMapPin,
      title: 'Visit Us',
      content: '123 Pastry Street, Culinary District, NY 10001',
      link: 'https://maps.google.com'
    },
    {
      icon: FiClock,
      title: 'Business Hours',
      content: 'Mon-Fri: 9AM-6PM EST',
      link: null
    }
  ];

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center max-w-md mx-auto px-4"
        >
          <div className="bg-green-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
            <FiCheckCircle className="text-4xl text-green-600" />
          </div>
          <h1 className="text-3xl font-display font-bold text-mocha-700 mb-4">
            Message Sent!
          </h1>
          <p className="text-mocha-600 mb-8">
            Thank you for reaching out to us. We'll get back to you as soon as possible.
          </p>
          <button
            onClick={() => setIsSubmitted(false)}
            className="btn-primary"
          >
            Send Another Message
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Contact Us - Pastry News</title>
        <meta name="description" content="Get in touch with the Pastry News team. We'd love to hear from you about collaborations, feedback, or any questions you might have." />
      </Helmet>

      <div className="bg-white">
        {/* Hero Section */}
        <section className="relative overflow-hidden hero-gradient min-h-[50vh] flex items-center">
          <div className="absolute inset-0 pastry-bg opacity-30"></div>
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center"
            >
              <h1 className="text-4xl md:text-6xl font-display font-bold text-white text-shadow mb-6">
                Get in
                <span className="block text-pink-200">Touch</span>
              </h1>
              <p className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto">
                We'd love to hear from you. Send us a message and we'll respond as soon as possible.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Contact Content */}
        <section className="py-16 lg:py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Contact Form */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <h2 className="text-3xl font-display font-bold text-mocha-700 mb-8">
                  Send us a Message
                </h2>
                
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-mocha-700 mb-2">
                        Name *
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 border border-mocha-200 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                        placeholder="Your name"
                      />
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-mocha-700 mb-2">
                        Email *
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 border border-mocha-200 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                        placeholder="your.email@example.com"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="subject" className="block text-sm font-medium text-mocha-700 mb-2">
                      Subject *
                    </label>
                    <input
                      type="text"
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-mocha-200 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                      placeholder="What's this about?"
                    />
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-mocha-700 mb-2">
                      Message *
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      required
                      rows={6}
                      className="w-full px-4 py-3 border border-mocha-200 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent resize-vertical"
                      placeholder="Tell us more about your inquiry..."
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={contactMutation.isLoading}
                    className="w-full btn-primary flex items-center justify-center"
                  >
                    {contactMutation.isLoading ? (
                      <LoadingSpinner size="sm" />
                    ) : (
                      <>
                        <FiSend className="mr-2" />
                        Send Message
                      </>
                    )}
                  </button>
                </form>
              </motion.div>

              {/* Contact Information */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <h2 className="text-3xl font-display font-bold text-mocha-700 mb-8">
                  Contact Information
                </h2>
                
                <div className="space-y-6">
                  {contactInfo.map((info, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      className="flex items-start space-x-4"
                    >
                      <div className="bg-pink-100 w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0">
                        <info.icon className="text-xl text-pink-600" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-mocha-700 mb-1">
                          {info.title}
                        </h3>
                        {info.link ? (
                          <a
                            href={info.link}
                            className="text-mocha-600 hover:text-pink-600 transition-colors"
                          >
                            {info.content}
                          </a>
                        ) : (
                          <p className="text-mocha-600">{info.content}</p>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Additional Info */}
                <div className="mt-12 p-6 bg-cream-50 rounded-lg">
                  <h3 className="text-lg font-semibold text-mocha-700 mb-3">
                    What can we help you with?
                  </h3>
                  <ul className="space-y-2 text-mocha-600">
                    <li>• Article submissions and collaborations</li>
                    <li>• Advertising and sponsorship opportunities</li>
                    <li>• Technical support and feedback</li>
                    <li>• General inquiries about pastry arts</li>
                    <li>• Partnership and business opportunities</li>
                  </ul>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-16 lg:py-24 bg-cream-50">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl md:text-4xl font-display font-bold text-mocha-700 mb-6">
                Frequently Asked Questions
              </h2>
              <p className="text-lg text-mocha-600">
                Quick answers to common questions
              </p>
            </motion.div>

            <div className="space-y-6">
              {[
                {
                  question: "How can I submit an article to Pastry News?",
                  answer: "We welcome article submissions from pastry professionals and enthusiasts. Please email us at submissions@pastrynews.com with your article proposal and we'll get back to you within 48 hours."
                },
                {
                  question: "Do you offer advertising opportunities?",
                  answer: "Yes! We offer various advertising options including sponsored content, banner ads, and newsletter sponsorships. Contact us for our media kit and pricing information."
                },
                {
                  question: "Can I republish your articles on my website?",
                  answer: "We allow republishing with proper attribution and a link back to the original article. Please contact us for permission and guidelines."
                },
                {
                  question: "How often do you publish new content?",
                  answer: "We publish new articles 3-4 times per week, with additional content including chef interviews, technique guides, and industry news."
                }
              ].map((faq, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="bg-white p-6 rounded-lg shadow-sm border border-cream-200"
                >
                  <h3 className="text-lg font-semibold text-mocha-700 mb-3">
                    {faq.question}
                  </h3>
                  <p className="text-mocha-600 leading-relaxed">
                    {faq.answer}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default ContactPage; 