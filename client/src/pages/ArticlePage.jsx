import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { useQuery } from 'react-query';
import { 
  FiClock, 
  FiEye, 
  FiHeart, 
  FiShare2, 
  FiUser, 
  FiTag, 
  FiArrowLeft,
  FiFacebook,
  FiTwitter,
  FiLinkedin,
  FiMail
} from 'react-icons/fi';
import { apiService, queryKeys } from '../utils/api';
import ArticleCard from '../components/articles/ArticleCard';
import LoadingSpinner from '../components/common/LoadingSpinner';
import NewsletterSignup from '../components/common/NewsletterSignup';

const ArticlePage = () => {
  const { slug } = useParams();
  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);

  // Fetch article by slug
  const { data: article, isLoading, error } = useQuery(
    queryKeys.articles.detail(slug),
    () => apiService.getArticleBySlug(slug),
    {
      staleTime: 5 * 60 * 1000,
    }
  );

  // Fetch related articles
  const { data: relatedData } = useQuery(
    queryKeys.articles.related(article?._id),
    () => apiService.getRelatedArticles(article?._id, article?.category?._id),
    {
      enabled: !!article?._id,
      staleTime: 5 * 60 * 1000,
    }
  );

  const handleLike = () => {
    setIsLiked(!isLiked);
    setLikesCount(prev => isLiked ? prev - 1 : prev + 1);
  };

  const handleShare = (platform) => {
    const url = window.location.href;
    const title = article?.title;
    const text = article?.excerpt;

    let shareUrl = '';
    switch (platform) {
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
        break;
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`;
        break;
      case 'linkedin':
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
        break;
      case 'email':
        shareUrl = `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(text + '\n\n' + url)}`;
        break;
      default:
        return;
    }

    window.open(shareUrl, '_blank', 'width=600,height=400');
  };

  if (isLoading) {
    return (
      <>
        <Helmet>
          <title>Loading Article - UACP News</title>
        </Helmet>
        <div className="min-h-screen flex items-center justify-center">
          <LoadingSpinner />
        </div>
      </>
    );
  }

  if (error || !article) {
    return (
      <>
        <Helmet>
          <title>Article Not Found - UACP News</title>
        </Helmet>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-mocha-500 mb-4">Article Not Found</h1>
            <p className="text-mocha-600 mb-8">The article you're looking for doesn't exist.</p>
            <Link to="/articles" className="btn-primary">
              Browse Articles
            </Link>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Helmet>
        <title>{(article?.metaTitle || article?.title || 'Article')}</title>
        <meta name="description" content={article.excerpt || 'Read the latest news from UACP'} />
        <meta property="og:title" content={article.title || 'UACP News Article'} />
        <meta property="og:description" content={article.excerpt || 'Read the latest news from UACP'} />
        <meta property="og:image" content={article.featuredImage || ''} />
        <meta property="og:url" content={window.location.href} />
        <meta name="twitter:card" content="summary_large_image" />
      </Helmet>

      <div className="bg-white">
        {/* Breadcrumb */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <nav className="flex items-center space-x-2 text-sm text-mocha-500">
            <Link to="/" className="hover:text-mocha-700">Home</Link>
            <span>/</span>
            <Link to="/articles" className="hover:text-mocha-700">Articles</Link>
            <span>/</span>
            <span className="text-mocha-700">{article.title}</span>
          </nav>
        </div>

        {/* Article Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-8"
        >
          {/* Category Badge */}
          {article.category && (
            <Link
              to={`/category/${article.category.slug}`}
              className="inline-block bg-pink-100 text-pink-700 px-3 py-1 rounded-full text-sm font-medium mb-4 hover:bg-pink-200 transition-colors"
            >
              {article.category.name}
            </Link>
          )}

          {/* Title */}
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold text-mocha-700 mb-6 leading-tight">
            {article.title}
          </h1>

          {/* Meta Information */}
          <div className="flex flex-wrap items-center gap-6 text-mocha-500 mb-6">
            <div className="flex items-center">
              <FiUser className="mr-2" />
              <span>{article.author?.name || 'Anonymous'}</span>
            </div>
            <div className="flex items-center">
              <FiClock className="mr-2" />
              <span>{new Date(article.createdAt).toLocaleDateString()}</span>
            </div>
            <div className="flex items-center">
              <FiEye className="mr-2" />
              <span>{article.views || 0} views</span>
            </div>
            <div className="flex items-center">
              <FiHeart className="mr-2" />
              <span>{likesCount} likes</span>
            </div>
          </div>

          {/* Featured Image */}
          {article.featuredImage && (
            <div className="mb-8">
              <img
                src={article.featuredImage}
                alt={article.title}
                className="w-full h-64 md:h-96 object-cover rounded-lg shadow-lg"
              />
            </div>
          )}

          {/* Excerpt */}
          {article.excerpt && (
            <div className="bg-cream-50 p-6 rounded-lg mb-8">
              <p className="text-lg text-mocha-600 italic leading-relaxed">
                {article.excerpt}
              </p>
            </div>
          )}
        </motion.div>

        {/* Article Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-12"
        >
          <div 
            className="prose prose-lg max-w-none text-mocha-700 leading-relaxed"
            dangerouslySetInnerHTML={{ __html: article.content }}
          />

          {/* Tags */}
          {article.tags && article.tags.length > 0 && (
            <div className="mt-8 pt-8 border-t border-cream-200">
              <div className="flex items-center mb-4">
                <FiTag className="mr-2 text-mocha-500" />
                <span className="text-mocha-600 font-medium">Tags:</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {article.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="bg-mocha-100 text-mocha-700 px-3 py-1 rounded-full text-sm"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </motion.div>

        {/* Social Sharing */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-12"
        >
          <div className="bg-cream-50 p-6 rounded-lg">
            <h3 className="text-lg font-semibold text-mocha-700 mb-4">Share this article</h3>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => handleShare('facebook')}
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <FiFacebook className="mr-2" />
                Facebook
              </button>
              <button
                onClick={() => handleShare('twitter')}
                className="flex items-center px-4 py-2 bg-sky-500 text-white rounded-lg hover:bg-sky-600 transition-colors"
              >
                <FiTwitter className="mr-2" />
                Twitter
              </button>
              <button
                onClick={() => handleShare('linkedin')}
                className="flex items-center px-4 py-2 bg-blue-700 text-white rounded-lg hover:bg-blue-800 transition-colors"
              >
                <FiLinkedin className="mr-2" />
                LinkedIn
              </button>
              <button
                onClick={() => handleShare('email')}
                className="flex items-center px-4 py-2 bg-mocha-600 text-white rounded-lg hover:bg-mocha-700 transition-colors"
              >
                <FiMail className="mr-2" />
                Email
              </button>
            </div>
          </div>
        </motion.div>

        {/* Like Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-12"
        >
          <button
            onClick={handleLike}
            className={`flex items-center px-6 py-3 rounded-lg border-2 transition-colors ${
              isLiked
                ? 'border-pink-500 bg-pink-50 text-pink-700'
                : 'border-mocha-300 text-mocha-600 hover:border-mocha-400 hover:bg-mocha-50'
            }`}
          >
            <FiHeart className={`mr-2 ${isLiked ? 'fill-current' : ''}`} />
            {isLiked ? 'Liked' : 'Like this article'}
          </button>
        </motion.div>

        {/* Related Articles */}
        {relatedData?.articles && relatedData.articles.length > 0 && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="bg-cream-50 py-16"
          >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <h2 className="text-2xl md:text-3xl font-display font-bold text-mocha-700 mb-8 text-center">
                Related Articles
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {relatedData.articles.slice(0, 3).map((relatedArticle) => (
                  <ArticleCard key={relatedArticle._id} article={relatedArticle} />
                ))}
              </div>
            </div>
          </motion.section>
        )}

        {/* Newsletter Signup */}
        <NewsletterSignup />
      </div>
    </>
  );
};

export default ArticlePage; 