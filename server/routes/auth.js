const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const { authenticateToken, requireAdmin } = require('../middleware/auth');

const router = express.Router();

// Generate JWT token
const generateToken = (userId) => {
  return jwt.sign(
    { userId },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );
};

// @route   POST /api/auth/login
// @desc    Authenticate user & get token
// @access  Public
router.post('/login', [
  body('email', 'Please include a valid email').isEmail(),
  body('password', 'Password is required').exists()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Validation error',
        errors: errors.array() 
      });
    }

    const { email, password } = req.body;

    // Debugging logs
    console.log('Login attempt:', email);

    // Check if user exists
    const user = await User.findByEmail(email);
    console.log('User found:', !!user);
    if (user) {
      console.log('Password in DB:', user.password);
      const isMatch = await user.comparePassword(password);
      console.log('Password match:', isMatch);
      if (!user.isActive) {
        return res.status(401).json({ 
          message: 'Account is deactivated' 
        });
      }
      if (!isMatch) {
        return res.status(401).json({ 
          message: 'Invalid credentials' 
        });
      }
      // Update last login
      user.lastLogin = new Date();
      await user.save();
      // Generate token
      const token = generateToken(user._id);
      return res.json({
        message: 'Login successful',
        token,
        user: user.toPublicJSON()
      });
    } else {
      return res.status(401).json({ 
        message: 'Invalid credentials' 
      });
    }
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ 
      message: 'Server error' 
    });
  }
});

// @route   POST /api/auth/register
// @desc    Register a new user (admin only)
// @access  Private (Admin)
router.post('/register', [
  authenticateToken,
  requireAdmin,
  body('username', 'Username is required').notEmpty(),
  body('email', 'Please include a valid email').isEmail(),
  body('password', 'Password must be at least 6 characters').isLength({ min: 6 }),
  body('firstName', 'First name is required').notEmpty(),
  body('lastName', 'Last name is required').notEmpty(),
  body('role', 'Role must be admin, editor, or author').isIn(['admin', 'editor', 'author'])
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Validation error',
        errors: errors.array() 
      });
    }

    const { username, email, password, firstName, lastName, role, bio } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [{ email }, { username }]
    });

    if (existingUser) {
      return res.status(400).json({ 
        message: 'User with this email or username already exists' 
      });
    }

    // Create new user
    const user = new User({
      username,
      email,
      password,
      firstName,
      lastName,
      role,
      bio
    });

    await user.save();

    res.status(201).json({
      message: 'User created successfully',
      user: user.toPublicJSON()
    });
  } catch (error) {
    console.error('Registration error:', error);
    if (error.code === 11000) {
      return res.status(400).json({ 
        message: 'User with this email or username already exists' 
      });
    }
    res.status(500).json({ 
      message: 'Server error' 
    });
  }
});

// @route   GET /api/auth/me
// @desc    Get current user profile
// @access  Private
router.get('/me', authenticateToken, async (req, res) => {
  try {
    res.json({
      user: req.user.toPublicJSON()
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ 
      message: 'Server error' 
    });
  }
});

// @route   PUT /api/auth/profile
// @desc    Update user profile
// @access  Private
router.put('/profile', [
  authenticateToken,
  body('firstName', 'First name is required').notEmpty(),
  body('lastName', 'Last name is required').notEmpty(),
  body('bio', 'Bio cannot exceed 500 characters').optional().isLength({ max: 500 })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Validation error',
        errors: errors.array() 
      });
    }

    const { firstName, lastName, bio } = req.body;

    const user = await User.findById(req.user._id);
    user.firstName = firstName;
    user.lastName = lastName;
    if (bio !== undefined) user.bio = bio;

    await user.save();

    res.json({
      message: 'Profile updated successfully',
      user: user.toPublicJSON()
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ 
      message: 'Server error' 
    });
  }
});

// @route   PUT /api/auth/password
// @desc    Change password
// @access  Private
router.put('/password', [
  authenticateToken,
  body('currentPassword', 'Current password is required').exists(),
  body('newPassword', 'New password must be at least 6 characters').isLength({ min: 6 })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Validation error',
        errors: errors.array() 
      });
    }

    const { currentPassword, newPassword } = req.body;

    const user = await User.findById(req.user._id);
    
    // Verify current password
    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      return res.status(400).json({ 
        message: 'Current password is incorrect' 
      });
    }

    // Update password
    user.password = newPassword;
    await user.save();

    res.json({
      message: 'Password changed successfully'
    });
  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({ 
      message: 'Server error' 
    });
  }
});

// @route   GET /api/auth/users
// @desc    Get all users (admin only)
// @access  Private (Admin)
router.get('/users', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const users = await User.find({}).select('-password');
    res.json({ users });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ 
      message: 'Server error' 
    });
  }
});

// @route   PUT /api/auth/users/:id/status
// @desc    Toggle user active status (admin only)
// @access  Private (Admin)
router.put('/users/:id/status', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ 
        message: 'User not found' 
      });
    }

    user.isActive = !user.isActive;
    await user.save();

    res.json({
      message: `User ${user.isActive ? 'activated' : 'deactivated'} successfully`,
      user: user.toPublicJSON()
    });
  } catch (error) {
    console.error('Toggle user status error:', error);
    res.status(500).json({ 
      message: 'Server error' 
    });
  }
});

module.exports = router; 