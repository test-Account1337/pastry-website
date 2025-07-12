const mongoose = require('mongoose');

const articleSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Article title is required'],
    trim: true,
    maxlength: [200, 'Title cannot exceed 200 characters']
  },
  slug: {
    type: String,
    required: [true, 'Article slug is required'],
    unique: true,
    lowercase: true,
    trim: true
  },
  excerpt: {
    type: String,
    required: [true, 'Article excerpt is required'],
    maxlength: [300, 'Excerpt cannot exceed 300 characters']
  },
  content: {
    type: String,
    required: [true, 'Article content is required']
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Author is required']
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: [true, 'Category is required']
  },
  tags: [{
    type: String,
    trim: true,
    lowercase: true
  }],
  featuredImage: {
    type: String,
    required: [true, 'Featured image is required']
  },
  images: [{
    url: String,
    caption: String,
    alt: String
  }],
  status: {
    type: String,
    enum: ['draft', 'published', 'archived'],
    default: 'draft'
  },
  publishedAt: {
    type: Date,
    default: null
  },
  metaTitle: {
    type: String,
    maxlength: [60, 'Meta title cannot exceed 60 characters']
  },
  metaDescription: {
    type: String,
    maxlength: [160, 'Meta description cannot exceed 160 characters']
  },
  readingTime: {
    type: Number,
    default: 0
  },
  viewCount: {
    type: Number,
    default: 0
  },
  likes: {
    type: Number,
    default: 0
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  allowComments: {
    type: Boolean,
    default: true
  },
  seoKeywords: [String],
  socialShareImage: String,
  relatedArticles: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Article'
  }]
}, {
  timestamps: true
});

// Indexes for better query performance
articleSchema.index({ slug: 1 });
articleSchema.index({ status: 1, publishedAt: -1 });
articleSchema.index({ category: 1 });
articleSchema.index({ author: 1 });
articleSchema.index({ tags: 1 });
articleSchema.index({ isFeatured: 1 });
articleSchema.index({ title: 'text', content: 'text' });

// Pre-save middleware to generate slug if not provided
articleSchema.pre('save', function(next) {
  if (!this.slug) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^a-z0-9 -]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim('-');
  }
  
  // Calculate reading time (average 200 words per minute)
  if (this.content) {
    const wordCount = this.content.split(/\s+/).length;
    this.readingTime = Math.ceil(wordCount / 200);
  }
  
  // Set publishedAt when status changes to published
  if (this.status === 'published' && !this.publishedAt) {
    this.publishedAt = new Date();
  }
  
  next();
});

// Method to increment view count
articleSchema.methods.incrementViews = function() {
  this.viewCount += 1;
  return this.save();
};

// Method to increment likes
articleSchema.methods.incrementLikes = function() {
  this.likes += 1;
  return this.save();
};

// Static method to get published articles
articleSchema.statics.getPublished = function() {
  return this.find({ 
    status: 'published', 
    publishedAt: { $lte: new Date() } 
  }).populate('author', 'firstName lastName avatar')
    .populate('category', 'name slug');
};

// Static method to get featured articles
articleSchema.statics.getFeatured = function(limit = 5) {
  return this.find({ 
    status: 'published', 
    publishedAt: { $lte: new Date() },
    isFeatured: true 
  })
  .sort({ publishedAt: -1 })
  .limit(limit)
  .populate('author', 'firstName lastName avatar')
  .populate('category', 'name slug');
};

// Static method to search articles
articleSchema.statics.search = function(query) {
  return this.find({
    $text: { $search: query },
    status: 'published',
    publishedAt: { $lte: new Date() }
  })
  .populate('author', 'firstName lastName avatar')
  .populate('category', 'name slug')
  .sort({ score: { $meta: 'textScore' } });
};

// Virtual for formatted date
articleSchema.virtual('formattedDate').get(function() {
  return this.publishedAt ? this.publishedAt.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }) : null;
});

// Ensure virtuals are included in JSON output
articleSchema.set('toJSON', { virtuals: true });
articleSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Article', articleSchema); 