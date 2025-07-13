const { db } = require('../config/firebase');

class Article {
  constructor(data = {}) {
    this.id = data.id || null;
    this._id = data.id || data._id || null; // Add _id for frontend compatibility
    this.title = data.title || '';
    this.slug = data.slug || '';
    this.excerpt = data.excerpt || '';
    this.content = data.content || '';
    this.author = data.author || null;
    this.category = data.category || null;
    this.tags = data.tags || [];
    this.featuredImage = data.featuredImage || '';
    this.images = data.images || [];
    this.status = data.status || 'draft';
    this.publishedAt = data.publishedAt || null;
    this.metaTitle = data.metaTitle || '';
    this.metaDescription = data.metaDescription || '';
    this.readingTime = data.readingTime || 0;
    this.viewCount = data.viewCount || 0;
    this.likes = data.likes || 0;
    this.isFeatured = data.isFeatured !== undefined ? data.isFeatured : false;
    this.allowComments = data.allowComments !== undefined ? data.allowComments : true;
    this.seoKeywords = data.seoKeywords || [];
    this.socialShareImage = data.socialShareImage || '';
    this.relatedArticles = data.relatedArticles || [];
    this.createdAt = data.createdAt || new Date();
    this.updatedAt = data.updatedAt || new Date();
  }

  // Get formatted date
  get formattedDate() {
    return this.publishedAt ? this.publishedAt.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }) : null;
  }

  // Generate slug from title
  generateSlug() {
    if (!this.slug && this.title) {
      this.slug = this.title
        .toLowerCase()
        .replace(/[^a-z0-9 -]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim('-');
    }
  }

  // Calculate reading time
  calculateReadingTime() {
    if (this.content) {
      const wordCount = this.content.split(/\s+/).length;
      this.readingTime = Math.ceil(wordCount / 200);
    }
  }

  // Set published date when status changes to published
  setPublishedDate() {
    if (this.status === 'published' && !this.publishedAt) {
      this.publishedAt = new Date();
    }
  }

  // Increment view count
  async incrementViews() {
    this.viewCount += 1;
    return await this.save();
  }

  // Increment likes
  async incrementLikes() {
    this.likes += 1;
    return await this.save();
  }

  // Save article to Realtime Database
  async save() {
    this.generateSlug();
    this.calculateReadingTime();
    this.setPublishedDate();
    
    const articleData = {
      title: this.title,
      slug: this.slug,
      excerpt: this.excerpt,
      content: this.content,
      author: this.author,
      category: this.category,
      tags: this.tags,
      featuredImage: this.featuredImage,
      images: this.images,
      status: this.status,
      publishedAt: this.publishedAt,
      metaTitle: this.metaTitle,
      metaDescription: this.metaDescription,
      readingTime: this.readingTime,
      viewCount: this.viewCount,
      likes: this.likes,
      isFeatured: this.isFeatured,
      allowComments: this.allowComments,
      seoKeywords: this.seoKeywords,
      socialShareImage: this.socialShareImage,
      relatedArticles: this.relatedArticles,
      createdAt: this.createdAt,
      updatedAt: new Date()
    };

    if (this.id) {
      // Update existing article
      await db.ref(`articles/${this.id}`).update(articleData);
      this.updatedAt = articleData.updatedAt;
    } else {
      // Create new article
      const articleRef = await db.ref('articles').push(articleData);
      this.id = articleRef.key;
      this._id = articleRef.key; // Ensure _id is set for frontend compatibility
      this.createdAt = articleData.createdAt;
      this.updatedAt = articleData.updatedAt;
    }

    return this;
  }

  // Find article by ID
  static async findById(id) {
    const snapshot = await db.ref(`articles/${id}`).once('value');
    if (!snapshot.exists()) return null;
    
    return new Article({ id: snapshot.key, ...snapshot.val() });
  }

  // Find article by slug
  static async findBySlug(slug) {
    const snapshot = await db.ref('articles')
      .orderByChild('slug')
      .equalTo(slug)
      .once('value');
    
    if (!snapshot.exists()) return null;
    
    const articleData = snapshot.val();
    const articleId = Object.keys(articleData)[0];
    return new Article({ id: articleId, ...articleData[articleId] });
  }

  // Get published articles
  static async getPublished(limit = null, offset = 0) {
    const snapshot = await db.ref('articles')
      .orderByChild('status')
      .equalTo('published')
      .once('value');
    
    if (!snapshot.exists()) return [];
    
    const articles = [];
    snapshot.forEach((childSnapshot) => {
      const article = childSnapshot.val();
      if (article.publishedAt && new Date(article.publishedAt) <= new Date()) {
        articles.push(new Article({ id: childSnapshot.key, ...article }));
      }
    });
    
    // Sort by publishedAt descending
    articles.sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt));
    
    // Apply limit and offset
    if (offset > 0) {
      articles.splice(0, offset);
    }
    if (limit) {
      articles.splice(limit);
    }
    
    return articles;
  }

  // Get featured articles
  static async getFeatured(limit = 5) {
    const snapshot = await db.ref('articles')
      .orderByChild('isFeatured')
      .equalTo(true)
      .once('value');
    
    if (!snapshot.exists()) return [];
    
    const articles = [];
    snapshot.forEach((childSnapshot) => {
      const article = childSnapshot.val();
      if (article.status === 'published' && article.publishedAt && new Date(article.publishedAt) <= new Date()) {
        articles.push(new Article({ id: childSnapshot.key, ...article }));
      }
    });
    
    // Sort by publishedAt descending and limit
    articles.sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt));
    return articles.slice(0, limit);
  }

  // Search articles
  static async search(query, limit = 20) {
    const snapshot = await db.ref('articles')
      .orderByChild('status')
      .equalTo('published')
      .once('value');
    
    if (!snapshot.exists()) return [];
    
    const articles = [];
    snapshot.forEach((childSnapshot) => {
      const article = childSnapshot.val();
      if (article.publishedAt && new Date(article.publishedAt) <= new Date()) {
        articles.push(new Article({ id: childSnapshot.key, ...article }));
      }
    });
    
    // Filter by search query
    const searchTerm = query.toLowerCase();
    const filteredArticles = articles.filter(article => 
      article.title.toLowerCase().includes(searchTerm) ||
      article.content.toLowerCase().includes(searchTerm) ||
      article.excerpt.toLowerCase().includes(searchTerm) ||
      article.tags.some(tag => tag.toLowerCase().includes(searchTerm))
    );
    
    // Sort by publishedAt descending and limit
    filteredArticles.sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt));
    return filteredArticles.slice(0, limit);
  }

  // Get articles by category
  static async getByCategory(categoryId, limit = 20, offset = 0) {
    const snapshot = await db.ref('articles')
      .orderByChild('category')
      .equalTo(categoryId)
      .once('value');
    
    if (!snapshot.exists()) return [];
    
    const articles = [];
    snapshot.forEach((childSnapshot) => {
      const article = childSnapshot.val();
      if (article.status === 'published' && article.publishedAt && new Date(article.publishedAt) <= new Date()) {
        articles.push(new Article({ id: childSnapshot.key, ...article }));
      }
    });
    
    // Sort by publishedAt descending
    articles.sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt));
    
    // Apply limit and offset
    if (offset > 0) {
      articles.splice(0, offset);
    }
    if (limit) {
      articles.splice(limit);
    }
    
    return articles;
  }

  // Get articles by author
  static async getByAuthor(authorId, limit = 20, offset = 0) {
    const snapshot = await db.ref('articles')
      .orderByChild('author')
      .equalTo(authorId)
      .once('value');
    
    if (!snapshot.exists()) return [];
    
    const articles = [];
    snapshot.forEach((childSnapshot) => {
      const article = childSnapshot.val();
      if (article.status === 'published' && article.publishedAt && new Date(article.publishedAt) <= new Date()) {
        articles.push(new Article({ id: childSnapshot.key, ...article }));
      }
    });
    
    // Sort by publishedAt descending
    articles.sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt));
    
    // Apply limit and offset
    if (offset > 0) {
      articles.splice(0, offset);
    }
    if (limit) {
      articles.splice(limit);
    }
    
    return articles;
  }

  // Get all articles (for admin)
  static async findAll(limit = null, offset = 0) {
    const snapshot = await db.ref('articles').once('value');
    if (!snapshot.exists()) return [];
    
    const articles = [];
    snapshot.forEach((childSnapshot) => {
      articles.push(new Article({ id: childSnapshot.key, ...childSnapshot.val() }));
    });
    
    // Sort by createdAt descending
    articles.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    
    // Apply limit and offset
    if (offset > 0) {
      articles.splice(0, offset);
    }
    if (limit) {
      articles.splice(limit);
    }
    
    return articles;
  }

  // Delete article
  async delete() {
    if (this.id) {
      await db.ref(`articles/${this.id}`).remove();
    }
  }

  // Update article (instance method)
  async update(updates) {
    Object.assign(this, updates);
    this.updatedAt = new Date();
    return await this.save();
  }

  // Update article (static method)
  static async update(id, updates) {
    const article = await Article.findById(id);
    if (!article) return null;
    
    Object.assign(article, updates);
    article.updatedAt = new Date();
    return await article.save();
  }

  // Delete article (static method)
  static async delete(id) {
    const article = await Article.findById(id);
    if (!article) return false;
    
    await article.delete();
    return true;
  }

  // Increment views (static method)
  static async incrementViews(id) {
    const article = await Article.findById(id);
    if (!article) return false;
    
    await article.incrementViews();
    return true;
  }

  // Increment likes (static method)
  static async incrementLikes(id) {
    const article = await Article.findById(id);
    if (!article) return false;
    
    await article.incrementLikes();
    return true;
  }

  // Create article (static method)
  static async create(data) {
    const article = new Article(data);
    return await article.save();
  }
}

module.exports = Article; 