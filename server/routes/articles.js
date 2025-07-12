const express = require('express');
const { body, validationResult, query } = require('express-validator');
const Article = require('../models/Article');
const Category = require('../models/Category');
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
  query('category').optional().custom((value) => {
    if (value === '' || value === null || value === undefined) {
      return true; // Allow empty values
    }
    return require('mongoose').Types.ObjectId.isValid(value);
  }),
  query('author').optional().isMongoId(),
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

    // Build query
    let query = {};
    
    // If not admin, only show published articles
    if (!req.user || !['admin', 'editor'].includes(req.user.role)) {
      query.status = 'published';
      query.publishedAt = { $lte: new Date() };
    } else if (status) {
      query.status = status;
    }

    if (category) query.category = category;
    if (author) query.author = author;
    if (tag) query.tags = { $in: [tag.toLowerCase()] };

    // Search functionality
    if (search && search.trim()) {
      query.$text = { $search: search };
    }

    // Build sort object
    let sortObj = {};
    switch (sort) {
      case 'oldest':
        sortObj = { publishedAt: 1 };
        break;
      case 'popular':
        sortObj = { viewCount: -1 };
        break;
      case 'featured':
        sortObj = { isFeatured: -1, publishedAt: -1 };
        break;
      case 'title':
        sortObj = { title: 1 };
        break;
      case 'latest':
      case 'newest':
      default:
        sortObj = { publishedAt: -1 };
    }

    // Execute query
    const skip = (page - 1) * limit;
    
    const articles = await Article.find(query)
      .populate('author', 'firstName lastName avatar')
      .populate('category', 'name slug color')
      .sort(sortObj)
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Article.countDocuments(query);
    const totalPages = Math.ceil(total / limit);

    res.json({
      articles,
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

// @route   GET /api/articles/:slug
// @desc    Get article by slug
// @access  Public
router.get('/:slug', async (req, res) => {
  try {
    const article = await Article.findOne({ 
      slug: req.params.slug,
      status: 'published',
      publishedAt: { $lte: new Date() }
    })
    .populate('author', 'firstName lastName avatar bio')
    .populate('category', 'name slug color')
    .populate('relatedArticles', 'title slug excerpt featuredImage');

    if (!article) {
      return res.status(404).json({ 
        message: 'Article not found' 
      });
    }

    // Increment view count
    await article.incrementViews();

    res.json({ article });
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
  body('category', 'Category is required').isMongoId(),
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
    const article = new Article({
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
      author: req.user._id
    });

    await article.save();

    // Populate author and category for response
    await article.populate('author', 'firstName lastName avatar');
    await article.populate('category', 'name slug color');

    res.status(201).json({
      message: 'Article created successfully',
      article
    });
  } catch (error) {
    console.error('Create article error:', error);
    if (error.code === 11000) {
      return res.status(400).json({ 
        message: 'Article with this title already exists' 
      });
    }
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
  body('category', 'Category is required').isMongoId(),
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
    Object.assign(article, {
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
      seoKeywords
    });

    await article.save();

    // Populate author and category for response
    await article.populate('author', 'firstName lastName avatar');
    await article.populate('category', 'name slug color');

    res.json({
      message: 'Article updated successfully',
      article
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

    await article.deleteOne();

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
    const article = await Article.findOne({ 
      _id: req.params.id,
      status: 'published',
      publishedAt: { $lte: new Date() }
    });

    if (!article) {
      return res.status(404).json({ 
        message: 'Article not found' 
      });
    }

    await article.incrementLikes();

    res.json({
      message: 'Article liked successfully',
      likes: article.likes
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
    
    const suggestions = await Article.find({
      $text: { $search: q },
      status: 'published',
      publishedAt: { $lte: new Date() }
    })
    .select('title slug')
    .limit(5)
    .sort({ score: { $meta: 'textScore' } });

    res.json({ suggestions });
  } catch (error) {
    console.error('Search suggestions error:', error);
    res.status(500).json({ 
      message: 'Server error' 
    });
  }
});

module.exports = router; 