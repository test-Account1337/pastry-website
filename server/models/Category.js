const { db } = require('../config/firebase');

class Category {
  constructor(data = {}) {
    this.id = data.id || null;
    this.name = data.name || '';
    this.slug = data.slug || '';
    this.description = data.description || '';
    this.color = data.color || '#2D5A27';
    this.icon = data.icon || '🌍';
    this.image = data.image || null;
    this.isActive = data.isActive !== undefined ? data.isActive : true;
    this.sortOrder = data.sortOrder || 0;
    this.metaTitle = data.metaTitle || '';
    this.metaDescription = data.metaDescription || '';
    this.parentCategory = data.parentCategory || null;
    this.articleCount = data.articleCount || 0;
    this.createdAt = data.createdAt || new Date();
    this.updatedAt = data.updatedAt || new Date();
  }

  // Get full category path (for nested categories)
  get fullPath() {
    if (this.parentCategory) {
      return `${this.parentCategory.name} > ${this.name}`;
    }
    return this.name;
  }

  // Generate slug from name
  generateSlug() {
    if (!this.slug && this.name) {
      this.slug = this.name
        .toLowerCase()
        .replace(/[^a-z0-9 -]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim('-');
    }
  }

  // Save category to Realtime Database
  async save() {
    this.generateSlug();
    
    const categoryData = {
      name: this.name,
      slug: this.slug,
      description: this.description,
      color: this.color,
      icon: this.icon,
      image: this.image,
      isActive: this.isActive,
      sortOrder: this.sortOrder,
      metaTitle: this.metaTitle,
      metaDescription: this.metaDescription,
      parentCategory: this.parentCategory,
      articleCount: this.articleCount,
      createdAt: this.createdAt,
      updatedAt: new Date()
    };

    if (this.id) {
      // Update existing category
      await db.ref(`categories/${this.id}`).update(categoryData);
      this.updatedAt = categoryData.updatedAt;
    } else {
      // Create new category
      const categoryRef = await db.ref('categories').push(categoryData);
      this.id = categoryRef.key;
      this.createdAt = categoryData.createdAt;
      this.updatedAt = categoryData.updatedAt;
    }

    return this;
  }

  // Find category by ID
  static async findById(id) {
    const snapshot = await db.ref(`categories/${id}`).once('value');
    if (!snapshot.exists()) return null;
    
    return new Category({ id: snapshot.key, ...snapshot.val() });
  }

  // Find category by slug
  static async findBySlug(slug) {
    const snapshot = await db.ref('categories')
      .orderByChild('slug')
      .equalTo(slug)
      .once('value');
    
    if (!snapshot.exists()) return null;
    
    const categoryData = snapshot.val();
    const categoryId = Object.keys(categoryData)[0];
    return new Category({ id: categoryId, ...categoryData[categoryId] });
  }

  // Get active categories
  static async getActive() {
    const snapshot = await db.ref('categories')
      .orderByChild('isActive')
      .equalTo(true)
      .once('value');
    
    if (!snapshot.exists()) return [];
    
    const categories = [];
    snapshot.forEach((childSnapshot) => {
      categories.push(new Category({ id: childSnapshot.key, ...childSnapshot.val() }));
    });
    
    // Sort by sortOrder and name
    return categories.sort((a, b) => {
      if (a.sortOrder !== b.sortOrder) {
        return a.sortOrder - b.sortOrder;
      }
      return a.name.localeCompare(b.name);
    });
  }

  // Get categories with article count
  static async getWithCount() {
    const categories = await this.getActive();
    
    // Get article counts for each category
    for (let category of categories) {
      const articlesSnapshot = await db.ref('articles')
        .orderByChild('category')
        .equalTo(category.id)
        .once('value');
      
      let count = 0;
      if (articlesSnapshot.exists()) {
        articlesSnapshot.forEach((childSnapshot) => {
          const article = childSnapshot.val();
          if (article.status === 'published') {
            count++;
          }
        });
      }
      
      category.articleCount = count;
    }
    
    return categories;
  }

  // Find all categories
  static async findAll() {
    const snapshot = await db.ref('categories').once('value');
    if (!snapshot.exists()) return [];
    
    const categories = [];
    snapshot.forEach((childSnapshot) => {
      categories.push(new Category({ id: childSnapshot.key, ...childSnapshot.val() }));
    });
    
    // Sort by sortOrder and name
    return categories.sort((a, b) => {
      if (a.sortOrder !== b.sortOrder) {
        return a.sortOrder - b.sortOrder;
      }
      return a.name.localeCompare(b.name);
    });
  }

  // Update article count
  async updateArticleCount() {
    const articlesSnapshot = await db.ref('articles')
      .orderByChild('category')
      .equalTo(this.id)
      .once('value');
    
    let count = 0;
    if (articlesSnapshot.exists()) {
      articlesSnapshot.forEach((childSnapshot) => {
        const article = childSnapshot.val();
        if (article.status === 'published') {
          count++;
        }
      });
    }
    
    this.articleCount = count;
    return await this.save();
  }

  // Delete category
  async delete() {
    if (this.id) {
      await db.ref(`categories/${this.id}`).remove();
    }
  }

  // Update category (instance method)
  async update(updates) {
    Object.assign(this, updates);
    this.updatedAt = new Date();
    return await this.save();
  }

  // Update category (static method)
  static async update(id, updates) {
    const category = await Category.findById(id);
    if (!category) return null;
    
    Object.assign(category, updates);
    category.updatedAt = new Date();
    return await category.save();
  }

  // Delete category (static method)
  static async delete(id) {
    const category = await Category.findById(id);
    if (!category) return false;
    
    await category.delete();
    return true;
  }
}

module.exports = Category; 