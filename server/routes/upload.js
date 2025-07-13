const express = require('express');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const { authenticateToken, requireAdminOrEditorOrAuthor } = require('../middleware/auth');

const router = express.Router();

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Log Cloudinary configuration (without sensitive data)
console.log('🔧 Cloudinary config:', {
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY ? '***' : 'NOT_SET',
  api_secret: process.env.CLOUDINARY_API_SECRET ? '***' : 'NOT_SET'
});

// Configure multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    // Check file type
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'), false);
    }
  }
});

// @route   POST /api/upload/image
// @desc    Upload image to Cloudinary
// @access  Private
router.post('/image', [
  authenticateToken,
  requireAdminOrEditorOrAuthor,
  upload.single('image')
], async (req, res) => {
  try {
    console.log('📸 Image upload request received');
    console.log('🔐 User authenticated:', req.user?.email);
    
    if (!req.file) {
      console.log('❌ No file in request');
      return res.status(400).json({ 
        message: 'No image file provided' 
      });
    }

    console.log('📁 File received:', {
      originalname: req.file.originalname,
      mimetype: req.file.mimetype,
      size: req.file.size
    });

    // Convert buffer to base64
    const b64 = Buffer.from(req.file.buffer).toString('base64');
    const dataURI = `data:${req.file.mimetype};base64,${b64}`;

    console.log('☁️ Uploading to Cloudinary...');

    // Upload to Cloudinary
    const result = await cloudinary.uploader.upload(dataURI, {
      folder: 'uacp-news',
      transformation: [
        { width: 1200, height: 800, crop: 'fill', quality: 'auto' },
        { fetch_format: 'auto' }
      ]
    });

    console.log('✅ Image uploaded successfully:', result.public_id);

    res.json({
      message: 'Image uploaded successfully',
      image: {
        url: result.secure_url,
        publicId: result.public_id,
        width: result.width,
        height: result.height,
        format: result.format
      }
    });
  } catch (error) {
    console.error('❌ Image upload error:', error);
    console.error('❌ Error details:', {
      message: error.message,
      code: error.code,
      statusCode: error.http_code
    });
    
    if (error.http_code === 400) {
      res.status(400).json({ 
        message: 'Invalid image file or Cloudinary configuration error',
        details: error.message
      });
    } else {
      res.status(500).json({ 
        message: 'Failed to upload image',
        details: error.message
      });
    }
  }
});

// @route   POST /api/upload/avatar
// @desc    Upload user avatar
// @access  Private
router.post('/avatar', [
  authenticateToken,
  upload.single('avatar')
], async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ 
        message: 'No avatar file provided' 
      });
    }

    // Convert buffer to base64
    const b64 = Buffer.from(req.file.buffer).toString('base64');
    const dataURI = `data:${req.file.mimetype};base64,${b64}`;

    // Upload to Cloudinary with avatar-specific transformations
    const result = await cloudinary.uploader.upload(dataURI, {
      folder: 'pastry-news/avatars',
      transformation: [
        { width: 200, height: 200, crop: 'fill', gravity: 'face' },
        { fetch_format: 'auto' }
      ]
    });

    res.json({
      message: 'Avatar uploaded successfully',
      avatar: {
        url: result.secure_url,
        publicId: result.public_id
      }
    });
  } catch (error) {
    console.error('Avatar upload error:', error);
    res.status(500).json({ 
      message: 'Failed to upload avatar' 
    });
  }
});

// @route   POST /api/upload/featured-image
// @desc    Upload featured image for articles
// @access  Private
router.post('/featured-image', [
  authenticateToken,
  requireAdminOrEditorOrAuthor,
  upload.single('image')
], async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ 
        message: 'No image file provided' 
      });
    }

    // Convert buffer to base64
    const b64 = Buffer.from(req.file.buffer).toString('base64');
    const dataURI = `data:${req.file.mimetype};base64,${b64}`;

    // Upload to Cloudinary with featured image transformations
    const result = await cloudinary.uploader.upload(dataURI, {
      folder: 'pastry-news/featured',
      transformation: [
        { width: 800, height: 600, crop: 'fill', quality: 'auto' },
        { fetch_format: 'auto' }
      ]
    });

    res.json({
      message: 'Featured image uploaded successfully',
      image: {
        url: result.secure_url,
        publicId: result.public_id,
        width: result.width,
        height: result.height
      }
    });
  } catch (error) {
    console.error('Featured image upload error:', error);
    res.status(500).json({ 
      message: 'Failed to upload featured image' 
    });
  }
});

// @route   DELETE /api/upload/:publicId
// @desc    Delete image from Cloudinary
// @access  Private
router.delete('/:publicId', [
  authenticateToken,
  requireAdminOrEditorOrAuthor
], async (req, res) => {
  try {
    const { publicId } = req.params;

    // Delete from Cloudinary
    const result = await cloudinary.uploader.destroy(publicId);

    if (result.result === 'ok') {
      res.json({
        message: 'Image deleted successfully'
      });
    } else {
      res.status(400).json({
        message: 'Failed to delete image'
      });
    }
  } catch (error) {
    console.error('Delete image error:', error);
    res.status(500).json({ 
      message: 'Failed to delete image' 
    });
  }
});

// @route   POST /api/upload/multiple
// @desc    Upload multiple images
// @access  Private
router.post('/multiple', [
  authenticateToken,
  requireAdminOrEditorOrAuthor,
  upload.array('images', 5) // Max 5 images
], async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ 
        message: 'No images provided' 
      });
    }

    const uploadPromises = req.files.map(async (file) => {
      // Convert buffer to base64
      const b64 = Buffer.from(file.buffer).toString('base64');
      const dataURI = `data:${file.mimetype};base64,${b64}`;

      // Upload to Cloudinary
      const result = await cloudinary.uploader.upload(dataURI, {
        folder: 'pastry-news/gallery',
        transformation: [
          { width: 800, height: 600, crop: 'fill', quality: 'auto' },
          { fetch_format: 'auto' }
        ]
      });

      return {
        url: result.secure_url,
        publicId: result.public_id,
        width: result.width,
        height: result.height,
        format: result.format
      };
    });

    const uploadedImages = await Promise.all(uploadPromises);

    res.json({
      message: 'Images uploaded successfully',
      images: uploadedImages
    });
  } catch (error) {
    console.error('Multiple images upload error:', error);
    res.status(500).json({ 
      message: 'Failed to upload images' 
    });
  }
});

module.exports = router; 