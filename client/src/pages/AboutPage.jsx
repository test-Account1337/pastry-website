import React from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  FiHeart, 
  FiUsers, 
  FiAward, 
  FiTarget,
  FiCoffee,
  FiBookOpen,
  FiGlobe,
  FiStar
} from 'react-icons/fi';
import NewsletterSignup from '../components/common/NewsletterSignup';

const AboutPage = () => {
  const stats = [
    { icon: FiUsers, number: '500+', label: 'Chef Interviews' },
    { icon: FiBookOpen, number: '1000+', label: 'Articles Published' },
    { icon: FiGlobe, number: '50+', label: 'Countries Reached' },
    { icon: FiStar, number: '10K+', label: 'Happy Readers' },
  ];

  const values = [
    {
      icon: FiHeart,
      title: 'Passion for Pastry',
      description: 'We share the same passion for pastry arts that drives chefs around the world to create extraordinary desserts.'
    },
    {
      icon: FiTarget,
      title: 'Quality Content',
      description: 'Every article is carefully crafted to provide valuable insights, techniques, and inspiration to our community.'
    },
    {
      icon: FiUsers,
      title: 'Community First',
      description: 'We believe in building a supportive community where pastry professionals can connect, learn, and grow together.'
    },
    {
      icon: FiAward,
      title: 'Excellence',
      description: 'We strive for excellence in everything we do, from the content we publish to the experiences we create.'
    }
  ];

  const team = [
    {
      name: 'Sarah Johnson',
      role: 'Editor-in-Chief',
      bio: 'Former pastry chef with 15+ years of experience in fine dining and pastry education.',
      image: '/images/team/sarah.jpg'
    },
    {
      name: 'Michael Chen',
      role: 'Senior Writer',
      bio: 'Food journalist specializing in pastry arts and culinary trends across Asia and Europe.',
      image: '/images/team/michael.jpg'
    },
    {
      name: 'Emma Rodriguez',
      role: 'Photography Director',
      bio: 'Award-winning food photographer with a passion for capturing the artistry of pastry creation.',
      image: '/images/team/emma.jpg'
    }
  ];

  return (
    <>
      <Helmet>
        <title>{'About'}</title>
        <meta name="description" content="Learn about Pastry News, our mission to connect the pastry community, and the team behind the premier source for pastry industry insights." />
      </Helmet>

      <div className="bg-white">
        {/* Hero Section */}
        <section className="relative overflow-hidden hero-gradient min-h-[60vh] flex items-center">
          <div className="absolute inset-0 pastry-bg opacity-30"></div>
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center"
            >
              <h1 className="text-4xl md:text-6xl font-display font-bold text-white text-shadow mb-6">
                About
                <span className="block text-pink-200">Pastry News</span>
              </h1>
              <p className="text-xl md:text-2xl text-white/90 mb-8 max-w-3xl mx-auto">
                Connecting pastry professionals worldwide through quality content, inspiration, and community
              </p>
            </motion.div>
          </div>
        </section>

        {/* Mission Section */}
        <section className="py-16 lg:py-24 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-16"
            >
              <h2 className="text-3xl md:text-4xl font-display font-bold text-mocha-700 mb-6">
                Our Mission
              </h2>
              <p className="text-lg text-mocha-600 max-w-4xl mx-auto leading-relaxed">
                At Pastry News, we believe that pastry arts are more than just baking—they're a form of artistic expression, 
                cultural heritage, and culinary innovation. Our mission is to be the premier platform that connects pastry 
                professionals worldwide, sharing knowledge, inspiring creativity, and celebrating the incredible talent 
                within our community.
              </p>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16"
            >
              {stats.map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="text-center"
                >
                  <div className="bg-pink-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <stat.icon className="text-2xl text-pink-600" />
                  </div>
                  <div className="text-3xl font-bold text-mocha-700 mb-2">{stat.number}</div>
                  <div className="text-mocha-600">{stat.label}</div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Values Section */}
        <section className="py-16 lg:py-24 bg-cream-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-16"
            >
              <h2 className="text-3xl md:text-4xl font-display font-bold text-mocha-700 mb-6">
                Our Values
              </h2>
              <p className="text-lg text-mocha-600 max-w-2xl mx-auto">
                The principles that guide everything we do at Pastry News
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {values.map((value, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="bg-white p-8 rounded-lg shadow-sm border border-cream-200"
                >
                  <div className="bg-pink-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                    <value.icon className="text-xl text-pink-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-mocha-700 mb-3">{value.title}</h3>
                  <p className="text-mocha-600 leading-relaxed">{value.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Story Section */}
        <section className="py-16 lg:py-24 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <h2 className="text-3xl md:text-4xl font-display font-bold text-mocha-700 mb-6">
                  Our Story
                </h2>
                <div className="space-y-4 text-mocha-600 leading-relaxed">
                  <p>
                    Pastry News was born from a simple observation: while the pastry world is full of incredible talent 
                    and innovation, there wasn't a dedicated platform that truly captured the essence of this beautiful craft.
                  </p>
                  <p>
                    Founded by a group of pastry professionals, food journalists, and passionate food lovers, we set out 
                    to create a space where the pastry community could come together to share knowledge, celebrate achievements, 
                    and inspire the next generation of pastry artists.
                  </p>
                  <p>
                    Today, we're proud to serve as the premier destination for pastry news, featuring exclusive interviews 
                    with world-renowned chefs, in-depth technique guides, industry insights, and stories that showcase the 
                    incredible diversity and creativity within the pastry world.
                  </p>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="relative"
              >
                <div className="bg-gradient-to-br from-pink-100 to-cream-100 p-8 rounded-lg">
                  <div className="text-center py-16">
                    <div className="text-6xl mb-4">
                      <FiCoffee className="w-16 h-16 text-delta-400 mx-auto" />
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold text-mocha-700 mb-3">
                    Join Our Community
                  </h3>
                  <p className="text-mocha-600 mb-6">
                    Be part of a growing community of pastry professionals, enthusiasts, and innovators.
                  </p>
                  <Link to="/contact" className="btn-primary">
                    Get in Touch
                  </Link>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className="py-16 lg:py-24 bg-cream-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-16"
            >
              <h2 className="text-3xl md:text-4xl font-display font-bold text-mocha-700 mb-6">
                Meet Our Team
              </h2>
              <p className="text-lg text-mocha-600 max-w-2xl mx-auto">
                The passionate individuals behind Pastry News who work tirelessly to bring you the best content
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {team.map((member, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="bg-white p-6 rounded-lg shadow-sm border border-cream-200 text-center"
                >
                  <div className="w-24 h-24 bg-gradient-to-br from-pink-200 to-cream-200 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FiCoffee className="text-3xl text-mocha-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-mocha-700 mb-2">{member.name}</h3>
                  <p className="text-pink-600 font-medium mb-3">{member.role}</p>
                  <p className="text-mocha-600 text-sm leading-relaxed">{member.bio}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 lg:py-24 bg-mocha-600 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl md:text-4xl font-display font-bold mb-6">
                Ready to Explore?
              </h2>
              <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
                Discover the latest articles, techniques, and stories from the world of pastry arts
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/articles" className="btn-primary bg-white text-mocha-600 hover:bg-cream-100">
                  Browse Articles
                </Link>
                <Link to="/contact" className="btn-outline border-white text-white hover:bg-white hover:text-mocha-600">
                  Contact Us
                </Link>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Newsletter Signup */}
        <NewsletterSignup />
      </div>
    </>
  );
};

export default AboutPage; 