const express = require('express');
const { body, validationResult } = require('express-validator');
const Category = require('../models/Category');
const { authenticateToken, requireAdminOrEditor } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/categories
// @desc    Get all active categories
// @access  Public
router.get('/', async (req, res) => {
  try {
    const categories = await Category.getWithCount();
    res.json({ categories });
  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({ 
      message: 'Server error' 
    });
  }
});

// @route   GET /api/categories/:slug
// @desc    Get category by slug
// @access  Public
router.get('/:slug', async (req, res) => {
  try {
    const category = await Category.findOne({ 
      slug: req.params.slug,
      isActive: true 
    });

    if (!category) {
      return res.status(404).json({ 
        message: 'Category not found' 
      });
    }

    res.json({ category });
  } catch (error) {
    console.error('Get category error:', error);
    res.status(500).json({ 
      message: 'Server error' 
    });
  }
});

// @route   POST /api/categories
// @desc    Create a new category
// @access  Private (Admin/Editor)
router.post('/', [
  authenticateToken,
  requireAdminOrEditor,
  body('name', 'Category name is required').notEmpty(),
  body('description').optional().isLength({ max: 300 }),
  body('color').optional().matches(/^#[0-9A-F]{6}$/i),
  body('icon').optional().isString(),
  body('sortOrder').optional().isInt({ min: 0 }),
  body('parentCategory').optional().isMongoId()
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
      name,
      description,
      color = '#8D6E63',
      icon = '🍰',
      sortOrder = 0,
      parentCategory,
      metaTitle,
      metaDescription
    } = req.body;

    // Check if parent category exists
    if (parentCategory) {
      const parentExists = await Category.findById(parentCategory);
      if (!parentExists) {
        return res.status(400).json({ 
          message: 'Parent category not found' 
        });
      }
    }

    // Create category
    const category = new Category({
      name,
      description,
      color,
      icon,
      sortOrder,
      parentCategory,
      metaTitle,
      metaDescription
    });

    await category.save();

    res.status(201).json({
      message: 'Category created successfully',
      category
    });
  } catch (error) {
    console.error('Create category error:', error);
    if (error.code === 11000) {
      return res.status(400).json({ 
        message: 'Category with this name already exists' 
      });
    }
    res.status(500).json({ 
      message: 'Server error' 
    });
  }
});

// @route   PUT /api/categories/:id
// @desc    Update a category
// @access  Private (Admin/Editor)
router.put('/:id', [
  authenticateToken,
  requireAdminOrEditor,
  body('name', 'Category name is required').notEmpty(),
  body('description').optional().isLength({ max: 300 }),
  body('color').optional().matches(/^#[0-9A-F]{6}$/i),
  body('icon').optional().isString(),
  body('sortOrder').optional().isInt({ min: 0 }),
  body('parentCategory').optional().isMongoId(),
  body('isActive').optional().isBoolean()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Validation error',
        errors: errors.array() 
      });
    }

    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ 
        message: 'Category not found' 
      });
    }

    const {
      name,
      description,
      color,
      icon,
      sortOrder,
      parentCategory,
      isActive,
      metaTitle,
      metaDescription
    } = req.body;

    // Check if parent category exists
    if (parentCategory) {
      const parentExists = await Category.findById(parentCategory);
      if (!parentExists) {
        return res.status(400).json({ 
          message: 'Parent category not found' 
        });
      }
    }

    // Update category
    Object.assign(category, {
      name,
      description,
      color,
      icon,
      sortOrder,
      parentCategory,
      isActive,
      metaTitle,
      metaDescription
    });

    await category.save();

    res.json({
      message: 'Category updated successfully',
      category
    });
  } catch (error) {
    console.error('Update category error:', error);
    res.status(500).json({ 
      message: 'Server error' 
    });
  }
});

// @route   DELETE /api/categories/:id
// @desc    Delete a category
// @access  Private (Admin/Editor)
router.delete('/:id', [
  authenticateToken,
  requireAdminOrEditor
], async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ 
        message: 'Category not found' 
      });
    }

    // Check if category has articles
    const Article = require('../models/Article');
    const articleCount = await Article.countDocuments({ category: category._id });
    
    if (articleCount > 0) {
      return res.status(400).json({ 
        message: `Cannot delete category with ${articleCount} articles. Please reassign or delete the articles first.` 
      });
    }

    await category.deleteOne();

    res.json({
      message: 'Category deleted successfully'
    });
  } catch (error) {
    console.error('Delete category error:', error);
    res.status(500).json({ 
      message: 'Server error' 
    });
  }
});

// @route   PUT /api/categories/:id/status
// @desc    Toggle category active status
// @access  Private (Admin/Editor)
router.put('/:id/status', [
  authenticateToken,
  requireAdminOrEditor
], async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ 
        message: 'Category not found' 
      });
    }

    category.isActive = !category.isActive;
    await category.save();

    res.json({
      message: `Category ${category.isActive ? 'activated' : 'deactivated'} successfully`,
      category
    });
  } catch (error) {
    console.error('Toggle category status error:', error);
    res.status(500).json({ 
      message: 'Server error' 
    });
  }
});

module.exports = router; 