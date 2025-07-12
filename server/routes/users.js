const express = require('express');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const { authenticateToken, requireAdmin } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/users
// @desc    Get all users (admin only)
// @access  Private (Admin)
router.get('/', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const users = await User.find({}).select('-password').sort({ createdAt: -1 });
    res.json({ users });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ 
      message: 'Server error' 
    });
  }
});

// @route   GET /api/users/:id
// @desc    Get user by ID (admin only)
// @access  Private (Admin)
router.get('/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) {
      return res.status(404).json({ 
        message: 'User not found' 
      });
    }
    res.json({ user });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ 
      message: 'Server error' 
    });
  }
});

// @route   PUT /api/users/:id
// @desc    Update user (admin only)
// @access  Private (Admin)
router.put('/:id', [
  authenticateToken,
  requireAdmin,
  body('firstName', 'First name is required').notEmpty(),
  body('lastName', 'Last name is required').notEmpty(),
  body('role', 'Role must be admin, editor, or author').isIn(['admin', 'editor', 'author']),
  body('isActive').optional().isBoolean(),
  body('bio').optional().isLength({ max: 500 })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Validation error',
        errors: errors.array() 
      });
    }

    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ 
        message: 'User not found' 
      });
    }

    const { firstName, lastName, role, isActive, bio } = req.body;

    // Update user
    Object.assign(user, {
      firstName,
      lastName,
      role,
      isActive,
      bio
    });

    await user.save();

    res.json({
      message: 'User updated successfully',
      user: user.toPublicJSON()
    });
  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({ 
      message: 'Server error' 
    });
  }
});

// @route   DELETE /api/users/:id
// @desc    Delete user (admin only)
// @access  Private (Admin)
router.delete('/:id', [
  authenticateToken,
  requireAdmin
], async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ 
        message: 'User not found' 
      });
    }

    // Check if user has articles
    const Article = require('../models/Article');
    const articleCount = await Article.countDocuments({ author: user._id });
    
    if (articleCount > 0) {
      return res.status(400).json({ 
        message: `Cannot delete user with ${articleCount} articles. Please reassign or delete the articles first.` 
      });
    }

    await user.deleteOne();

    res.json({
      message: 'User deleted successfully'
    });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({ 
      message: 'Server error' 
    });
  }
});

// @route   PUT /api/users/:id/avatar
// @desc    Update user avatar
// @access  Private
router.put('/:id/avatar', [
  authenticateToken,
  body('avatar', 'Avatar URL is required').notEmpty().isURL()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Validation error',
        errors: errors.array() 
      });
    }

    // Check if user is updating their own avatar or is admin
    if (req.params.id !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ 
        message: 'You can only update your own avatar' 
      });
    }

    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ 
        message: 'User not found' 
      });
    }

    user.avatar = req.body.avatar;
    await user.save();

    res.json({
      message: 'Avatar updated successfully',
      user: user.toPublicJSON()
    });
  } catch (error) {
    console.error('Update avatar error:', error);
    res.status(500).json({ 
      message: 'Server error' 
    });
  }
});

// @route   GET /api/users/stats/overview
// @desc    Get user statistics (admin only)
// @access  Private (Admin)
router.get('/stats/overview', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const activeUsers = await User.countDocuments({ isActive: true });
    const adminUsers = await User.countDocuments({ role: 'admin' });
    const editorUsers = await User.countDocuments({ role: 'editor' });
    const authorUsers = await User.countDocuments({ role: 'author' });

    // Get recent users
    const recentUsers = await User.find({})
      .select('firstName lastName email role isActive createdAt')
      .sort({ createdAt: -1 })
      .limit(5);

    res.json({
      stats: {
        total: totalUsers,
        active: activeUsers,
        inactive: totalUsers - activeUsers,
        byRole: {
          admin: adminUsers,
          editor: editorUsers,
          author: authorUsers
        }
      },
      recentUsers
    });
  } catch (error) {
    console.error('Get user stats error:', error);
    res.status(500).json({ 
      message: 'Server error' 
    });
  }
});

module.exports = router; 