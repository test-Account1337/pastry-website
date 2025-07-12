const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Category name is required'],
    trim: true,
    maxlength: [50, 'Category name cannot exceed 50 characters']
  },
  slug: {
    type: String,
    required: [true, 'Category slug is required'],
    unique: true,
    lowercase: true,
    trim: true
  },
  description: {
    type: String,
    maxlength: [300, 'Description cannot exceed 300 characters']
  },
  color: {
    type: String,
    default: '#8D6E63', // Default mocha brown
    match: [/^#[0-9A-F]{6}$/i, 'Color must be a valid hex color']
  },
  icon: {
    type: String,
    default: '🍰'
  },
  image: {
    type: String,
    default: null
  },
  isActive: {
    type: Boolean,
    default: true
  },
  sortOrder: {
    type: Number,
    default: 0
  },
  metaTitle: {
    type: String,
    maxlength: [60, 'Meta title cannot exceed 60 characters']
  },
  metaDescription: {
    type: String,
    maxlength: [160, 'Meta description cannot exceed 160 characters']
  },
  parentCategory: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    default: null
  },
  articleCount: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Indexes for better query performance
categorySchema.index({ slug: 1 });
categorySchema.index({ isActive: 1, sortOrder: 1 });
categorySchema.index({ parentCategory: 1 });

// Pre-save middleware to generate slug if not provided
categorySchema.pre('save', function(next) {
  if (!this.slug) {
    this.slug = this.name
      .toLowerCase()
      .replace(/[^a-z0-9 -]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim('-');
  }
  next();
});

// Static method to get active categories
categorySchema.statics.getActive = function() {
  return this.find({ isActive: true })
    .sort({ sortOrder: 1, name: 1 });
};

// Static method to get categories with article count
categorySchema.statics.getWithCount = function() {
  return this.aggregate([
    { $match: { isActive: true } },
    {
      $lookup: {
        from: 'articles',
        localField: '_id',
        foreignField: 'category',
        pipeline: [
          { $match: { status: 'published' } }
        ],
        as: 'articles'
      }
    },
    {
      $addFields: {
        articleCount: { $size: '$articles' }
      }
    },
    { $unset: 'articles' },
    { $sort: { sortOrder: 1, name: 1 } }
  ]);
};

// Method to update article count
categorySchema.methods.updateArticleCount = async function() {
  const Article = mongoose.model('Article');
  const count = await Article.countDocuments({
    category: this._id,
    status: 'published'
  });
  this.articleCount = count;
  return this.save();
};

// Virtual for full category path (for nested categories)
categorySchema.virtual('fullPath').get(function() {
  if (this.parentCategory) {
    return `${this.parentCategory.name} > ${this.name}`;
  }
  return this.name;
});

// Ensure virtuals are included in JSON output
categorySchema.set('toJSON', { virtuals: true });
categorySchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Category', categorySchema); 