const express = require('express');
const { body, validationResult, query } = require('express-validator');
const Article = require('../models/Article');
const Category = require('../models/Category');
const User = require('../models/User');
const { 
  authenticateToken, 
  requireAdminOrEditorOrAuthor, 
  requireOwnershipOrAdmin,
  optionalAuth 
} = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/articles
// @desc    Get all published articles (public) or all articles (admin)
// @access  Public / Private
router.get('/', [
  optionalAuth,
  query('page').optional().isInt({ min: 1 }).toInt(),
  query('limit').optional().isInt({ min: 1, max: 50 }).toInt(),
  query('category').optional().isString(),
  query('author').optional().isString(),
  query('tag').optional().isString(),
  query('search').optional().isString(),
  query('sort').optional().isIn(['newest', 'latest', 'oldest', 'popular', 'featured', 'title']),
  query('status').optional().isIn(['draft', 'published', 'archived'])
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Validation error',
        errors: errors.array() 
      });
    }

    const {
      page = 1,
      limit = 10,
      category,
      author,
      tag,
      search,
      sort = 'newest',
      status
    } = req.query;

    // Get all articles from Firebase
    let articles = await Article.findAll();

    // Filter articles based on query parameters
    if (!req.user || !['admin', 'editor'].includes(req.user.role)) {
      articles = articles.filter(article => 
        article.status === 'published' && 
        new Date(article.publishedAt) <= new Date()
      );
    } else if (status) {
      articles = articles.filter(article => article.status === status);
    }

    if (category) {
      articles = articles.filter(article => article.category === category);
    }

    if (author) {
      articles = articles.filter(article => article.author === author);
    }

    if (tag) {
      articles = articles.filter(article => 
        article.tags && article.tags.includes(tag.toLowerCase())
      );
    }

    // Search functionality
    if (search && search.trim()) {
      const searchTerm = search.toLowerCase();
      articles = articles.filter(article =>
        article.title.toLowerCase().includes(searchTerm) ||
        article.excerpt.toLowerCase().includes(searchTerm) ||
        article.content.toLowerCase().includes(searchTerm)
      );
    }

    // Sort articles
    switch (sort) {
      case 'oldest':
        articles.sort((a, b) => new Date(a.publishedAt) - new Date(b.publishedAt));
        break;
      case 'popular':
        articles.sort((a, b) => (b.viewCount || 0) - (a.viewCount || 0));
        break;
      case 'featured':
        articles.sort((a, b) => {
          if (a.isFeatured && !b.isFeatured) return -1;
          if (!a.isFeatured && b.isFeatured) return 1;
          return new Date(b.publishedAt) - new Date(a.publishedAt);
        });
        break;
      case 'title':
        articles.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case 'latest':
      case 'newest':
      default:
        articles.sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt));
    }

    // Pagination
    const total = articles.length;
    const totalPages = Math.ceil(total / limit);
    const skip = (page - 1) * limit;
    const paginatedArticles = articles.slice(skip, skip + parseInt(limit));

    // Populate author and category data
    const populatedArticles = await Promise.all(
      paginatedArticles.map(async (article) => {
        const authorData = await User.findById(article.author);
        const categoryData = await Category.findById(article.category);
        
        return {
          ...article,
          author: authorData ? {
            _id: authorData._id,
            firstName: authorData.firstName,
            lastName: authorData.lastName,
            avatar: authorData.avatar
          } : null,
          category: categoryData ? {
            _id: categoryData._id,
            name: categoryData.name,
            slug: categoryData.slug,
            color: categoryData.color
          } : null
        };
      })
    );

    res.json({
      articles: populatedArticles,
      pagination: {
        currentPage: parseInt(page),
        totalPages,
        total,
        hasNext: page < totalPages,
        hasPrev: page > 1
      }
    });
  } catch (error) {
    console.error('Get articles error:', error);
    res.status(500).json({ 
      message: 'Server error' 
    });
  }
});

// @route   GET /api/articles/featured
// @desc    Get featured articles
// @access  Public
router.get('/featured', async (req, res) => {
  try {
    const articles = await Article.getFeatured(5);
    res.json({ articles });
  } catch (error) {
    console.error('Get featured articles error:', error);
    res.status(500).json({ 
      message: 'Server error' 
    });
  }
});

// @route   GET /api/articles/dashboard/stats
// @desc    Get dashboard statistics
// @access  Private (Admin/Editor)
router.get('/dashboard/stats', [authenticateToken, requireAdminOrEditorOrAuthor], async (req, res) => {
  try {
    const articles = await Article.findAll();
    const categories = await Category.findAll();
    const users = await User.findAll();

    // Calculate article statistics
    const totalArticles = articles.length;
    const publishedArticles = articles.filter(article => article.status === 'published').length;
    const draftArticles = articles.filter(article => article.status === 'draft').length;
    const archivedArticles = articles.filter(article => article.status === 'archived').length;
    const featuredArticles = articles.filter(article => article.isFeatured).length;

    // Calculate user statistics
    const totalUsers = users.length;
    const activeUsers = users.filter(user => user.isActive).length;
    const adminUsers = users.filter(user => user.role === 'admin').length;
    const editorUsers = users.filter(user => user.role === 'editor').length;
    const authorUsers = users.filter(user => user.role === 'author').length;

    // Get recent articles (last 5)
    const recentArticles = articles
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 5)
      .map(async (article) => {
        const authorData = await User.findById(article.author);
        return {
          ...article,
          author: authorData ? {
            _id: authorData._id,
            firstName: authorData.firstName,
            lastName: authorData.lastName,
            avatar: authorData.avatar
          } : null
        };
      });

    // Get recent users (last 5)
    const recentUsers = users
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 5)
      .map(user => {
        const { password, ...userWithoutPassword } = user;
        return userWithoutPassword;
      });

    // Wait for all recent articles to be populated
    const populatedRecentArticles = await Promise.all(recentArticles);

    res.json({
      stats: {
        articles: {
          total: totalArticles,
          published: publishedArticles,
          draft: draftArticles,
          archived: archivedArticles,
          featured: featuredArticles
        },
        categories: {
          total: categories.length
        },
        users: {
          total: totalUsers,
          active: activeUsers,
          byRole: {
            admin: adminUsers,
            editor: editorUsers,
            author: authorUsers
          }
        }
      },
      recentArticles: populatedRecentArticles,
      recentUsers
    });
  } catch (error) {
    console.error('Get dashboard stats error:', error);
    res.status(500).json({ 
      message: 'Server error' 
    });
  }
});

// @route   GET /api/articles/admin
// @desc    Get all articles for admin (including drafts, unpublished, etc.)
// @access  Private (Admin/Editor/Author)
router.get('/admin', [authenticateToken, requireAdminOrEditorOrAuthor], async (req, res) => {
  try {
    let articles = await Article.findAll();

    // Filtering
    const { search, category, status, page = 1, limit = 10 } = req.query;

    if (status && status !== "") {
      articles = articles.filter(article => article.status === status);
    }
    if (category && category !== "") {
      articles = articles.filter(article => article.category === category);
    }
    if (search && search.trim() !== "") {
      const searchTerm = search.toLowerCase();
      articles = articles.filter(article =>
        article.title.toLowerCase().includes(searchTerm) ||
        article.excerpt.toLowerCase().includes(searchTerm) ||
        article.content.toLowerCase().includes(searchTerm)
      );
    }

    // Pagination
    const total = articles.length;
    const totalPages = Math.ceil(total / limit);
    const skip = (page - 1) * limit;
    const paginatedArticles = articles.slice(skip, skip + parseInt(limit));

    // Populate author and category data for each article
    const populatedArticles = await Promise.all(
      paginatedArticles.map(async (article) => {
        const authorData = await User.findById(article.author);
        const categoryData = await Category.findById(article.category);
        return {
          ...article,
          author: authorData ? {
            _id: authorData._id,
            firstName: authorData.firstName,
            lastName: authorData.lastName,
            avatar: authorData.avatar
          } : null,
          category: categoryData ? {
            _id: categoryData._id,
            name: categoryData.name,
            slug: categoryData.slug,
            color: categoryData.color
          } : null
        };
      })
    );

    res.json({
      articles: populatedArticles,
      pagination: {
        currentPage: parseInt(page),
        totalPages,
        total,
        hasNext: page < totalPages,
        hasPrev: page > 1
      }
    });
  } catch (error) {
    console.error('❌ Get admin articles error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/articles/:slug
// @desc    Get article by slug
// @access  Public
router.get('/:slug', async (req, res) => {
  try {
    const articles = await Article.findAll();
    const article = articles.find(a => 
      a.slug === req.params.slug &&
      a.status === 'published' &&
      new Date(a.publishedAt) <= new Date()
    );

    if (!article) {
      return res.status(404).json({ 
        message: 'Article not found' 
      });
    }

    // Increment view count
    await Article.incrementViews(article._id);

    // Populate author and category data
    const authorData = await User.findById(article.author);
    const categoryData = await Category.findById(article.category);

    const populatedArticle = {
      ...article,
      author: authorData ? {
        _id: authorData._id,
        firstName: authorData.firstName,
        lastName: authorData.lastName,
        avatar: authorData.avatar,
        bio: authorData.bio
      } : null,
      category: categoryData ? {
        _id: categoryData._id,
        name: categoryData.name,
        slug: categoryData.slug,
        color: categoryData.color
      } : null
    };

    res.json({ article: populatedArticle });
  } catch (error) {
    console.error('Get article error:', error);
    res.status(500).json({ 
      message: 'Server error' 
    });
  }
});

// @route   POST /api/articles
// @desc    Create a new article
// @access  Private
router.post('/', [
  authenticateToken,
  requireAdminOrEditorOrAuthor,
  body('title', 'Title is required').notEmpty(),
  body('excerpt', 'Excerpt is required').notEmpty(),
  body('content', 'Content is required').notEmpty(),
  body('category', 'Category is required').isString(),
  body('featuredImage', 'Featured image is required').notEmpty(),
  body('tags').optional().isArray(),
  body('status').optional().isIn(['draft', 'published']),
  body('isFeatured').optional().isBoolean(),
  body('allowComments').optional().isBoolean()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Validation error',
        errors: errors.array() 
      });
    }

    const {
      title,
      excerpt,
      content,
      category,
      featuredImage,
      tags = [],
      status = 'draft',
      isFeatured = false,
      allowComments = true,
      metaTitle,
      metaDescription,
      seoKeywords
    } = req.body;

    // Check if category exists
    const categoryExists = await Category.findById(category);
    if (!categoryExists) {
      return res.status(400).json({ 
        message: 'Category not found' 
      });
    }

    // Create article
    const articleData = {
      title,
      excerpt,
      content,
      category,
      featuredImage,
      tags: tags.map(tag => tag.toLowerCase()),
      status,
      isFeatured,
      allowComments,
      metaTitle,
      metaDescription,
      seoKeywords,
      author: req.user.id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      viewCount: 0,
      likes: 0,
      slug: title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
    };

    const article = await Article.create(articleData);

    // Populate author and category for response
    const authorData = await User.findById(article.author);
    const categoryData = await Category.findById(article.category);

    const populatedArticle = {
      ...article,
      author: authorData ? {
        _id: authorData._id,
        firstName: authorData.firstName,
        lastName: authorData.lastName,
        avatar: authorData.avatar
      } : null,
      category: categoryData ? {
        _id: categoryData._id,
        name: categoryData.name,
        slug: categoryData.slug,
        color: categoryData.color
      } : null
    };

    res.status(201).json({
      message: 'Article created successfully',
      article: populatedArticle
    });
  } catch (error) {
    console.error('Create article error:', error);
    res.status(500).json({ 
      message: 'Server error' 
    });
  }
});

// @route   PUT /api/articles/:id
// @desc    Update an article
// @access  Private
router.put('/:id', [
  authenticateToken,
  requireOwnershipOrAdmin('author'),
  body('title', 'Title is required').notEmpty(),
  body('excerpt', 'Excerpt is required').notEmpty(),
  body('content', 'Content is required').notEmpty(),
  body('category', 'Category is required').isString(),
  body('featuredImage', 'Featured image is required').notEmpty(),
  body('tags').optional().isArray(),
  body('status').optional().isIn(['draft', 'published', 'archived']),
  body('isFeatured').optional().isBoolean(),
  body('allowComments').optional().isBoolean()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Validation error',
        errors: errors.array() 
      });
    }

    const article = await Article.findById(req.params.id);
    if (!article) {
      return res.status(404).json({ 
        message: 'Article not found' 
      });
    }

    const {
      title,
      excerpt,
      content,
      category,
      featuredImage,
      tags,
      status,
      isFeatured,
      allowComments,
      metaTitle,
      metaDescription,
      seoKeywords
    } = req.body;

    // Check if category exists
    const categoryExists = await Category.findById(category);
    if (!categoryExists) {
      return res.status(400).json({ 
        message: 'Category not found' 
      });
    }

    // Update article
    const updateData = {
      title,
      excerpt,
      content,
      category,
      featuredImage,
      tags: tags ? tags.map(tag => tag.toLowerCase()) : article.tags,
      status,
      isFeatured,
      allowComments,
      metaTitle,
      metaDescription,
      seoKeywords,
      updatedAt: new Date().toISOString(),
      slug: title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
    };

    const updatedArticle = await Article.update(req.params.id, updateData);

    // Populate author and category for response
    const authorData = await User.findById(updatedArticle.author);
    const categoryData = await Category.findById(updatedArticle.category);

    const populatedArticle = {
      ...updatedArticle,
      author: authorData ? {
        _id: authorData._id,
        firstName: authorData.firstName,
        lastName: authorData.lastName,
        avatar: authorData.avatar
      } : null,
      category: categoryData ? {
        _id: categoryData._id,
        name: categoryData.name,
        slug: categoryData.slug,
        color: categoryData.color
      } : null
    };

    res.json({
      message: 'Article updated successfully',
      article: populatedArticle
    });
  } catch (error) {
    console.error('Update article error:', error);
    res.status(500).json({ 
      message: 'Server error' 
    });
  }
});

// @route   DELETE /api/articles/:id
// @desc    Delete an article
// @access  Private
router.delete('/:id', [
  authenticateToken,
  requireOwnershipOrAdmin('author')
], async (req, res) => {
  try {
    const article = await Article.findById(req.params.id);
    if (!article) {
      return res.status(404).json({ 
        message: 'Article not found' 
      });
    }

    await Article.delete(req.params.id);

    res.json({
      message: 'Article deleted successfully'
    });
  } catch (error) {
    console.error('Delete article error:', error);
    res.status(500).json({ 
      message: 'Server error' 
    });
  }
});

// @route   POST /api/articles/:id/like
// @desc    Like an article
// @access  Public
router.post('/:id/like', async (req, res) => {
  try {
    const articles = await Article.findAll();
    const article = articles.find(a => 
      a._id === req.params.id &&
      a.status === 'published' &&
      new Date(a.publishedAt) <= new Date()
    );

    if (!article) {
      return res.status(404).json({ 
        message: 'Article not found' 
      });
    }

    await Article.incrementLikes(req.params.id);

    res.json({
      message: 'Article liked successfully',
      likes: (article.likes || 0) + 1
    });
  } catch (error) {
    console.error('Like article error:', error);
    res.status(500).json({ 
      message: 'Server error' 
    });
  }
});

// @route   GET /api/articles/search/suggestions
// @desc    Get search suggestions
// @access  Public
router.get('/search/suggestions', [
  query('q').isString().isLength({ min: 2 })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Validation error',
        errors: errors.array() 
      });
    }

    const { q } = req.query;
    
    const articles = await Article.findAll();
    const suggestions = articles
      .filter(article => 
        article.status === 'published' &&
        new Date(article.publishedAt) <= new Date() &&
        (article.title.toLowerCase().includes(q.toLowerCase()) ||
         article.excerpt.toLowerCase().includes(q.toLowerCase()))
      )
      .slice(0, 5)
      .map(article => ({
        title: article.title,
        slug: article.slug
      }));

    res.json({ suggestions });
  } catch (error) {
    console.error('Search suggestions error:', error);
    res.status(500).json({ 
      message: 'Server error' 
    });
  }
});

module.exports = router; 