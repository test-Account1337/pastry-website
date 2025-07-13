const { db } = require('../config/firebase');
const bcrypt = require('bcryptjs');

class User {
  constructor(data = {}) {
    this.id = data.id || null;
    this._id = data.id || data._id || null; // Add _id for frontend compatibility
    this.username = data.username || '';
    this.email = data.email || '';
    this.password = data.password || '';
    this.firstName = data.firstName || '';
    this.lastName = data.lastName || '';
    this.role = data.role || 'author';
    this.avatar = data.avatar || null;
    this.bio = data.bio || '';
    this.isActive = data.isActive !== undefined ? data.isActive : true;
    this.lastLogin = data.lastLogin || null;
    this.passwordResetToken = data.passwordResetToken || null;
    this.passwordResetExpires = data.passwordResetExpires || null;
    this.emailVerified = data.emailVerified !== undefined ? data.emailVerified : false;
    this.createdAt = data.createdAt || new Date();
    this.updatedAt = data.updatedAt || new Date();
  }

  // Get full name
  get fullName() {
    return `${this.firstName} ${this.lastName}`;
  }

  // Hash password before saving
  async hashPassword() {
    if (this.password && !this.password.startsWith('$2')) {
      const salt = await bcrypt.genSalt(12);
      this.password = await bcrypt.hash(this.password, salt);
    }
  }

  // Compare password
  async comparePassword(candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
  }

  // Convert to public JSON (without sensitive data)
  toPublicJSON() {
    const { password, passwordResetToken, passwordResetExpires, ...publicData } = this;
    return publicData;
  }

  // Save user to Realtime Database
  async save() {
    await this.hashPassword();
    
    const userData = {
      username: this.username,
      email: this.email.toLowerCase(),
      password: this.password,
      firstName: this.firstName,
      lastName: this.lastName,
      role: this.role,
      avatar: this.avatar,
      bio: this.bio,
      isActive: this.isActive,
      lastLogin: this.lastLogin,
      passwordResetToken: this.passwordResetToken,
      passwordResetExpires: this.passwordResetExpires,
      emailVerified: this.emailVerified,
      createdAt: this.createdAt,
      updatedAt: new Date()
    };

    if (this.id) {
      // Update existing user
      await db.ref(`users/${this.id}`).update(userData);
      this.updatedAt = userData.updatedAt;
    } else {
      // Create new user
      const userRef = await db.ref('users').push(userData);
      this.id = userRef.key;
      this._id = userRef.key; // Ensure _id is set for frontend compatibility
      this.createdAt = userData.createdAt;
      this.updatedAt = userData.updatedAt;
    }

    return this;
  }

  // Find user by ID
  static async findById(id) {
    const snapshot = await db.ref(`users/${id}`).once('value');
    if (!snapshot.exists()) return null;
    
    return new User({ id: snapshot.key, ...snapshot.val() });
  }

  // Find user by email
  static async findByEmail(email) {
    const snapshot = await db.ref('users')
      .orderByChild('email')
      .equalTo(email.toLowerCase())
      .once('value');
    
    if (!snapshot.exists()) return null;
    
    const userData = snapshot.val();
    const userId = Object.keys(userData)[0];
    return new User({ id: userId, ...userData[userId] });
  }

  // Find user by username
  static async findByUsername(username) {
    const snapshot = await db.ref('users')
      .orderByChild('username')
      .equalTo(username)
      .once('value');
    
    if (!snapshot.exists()) return null;
    
    const userData = snapshot.val();
    const userId = Object.keys(userData)[0];
    return new User({ id: userId, ...userData[userId] });
  }

  // Find all users
  static async findAll() {
    const snapshot = await db.ref('users').once('value');
    if (!snapshot.exists()) return [];
    
    const users = [];
    snapshot.forEach((childSnapshot) => {
      users.push(new User({ id: childSnapshot.key, ...childSnapshot.val() }));
    });
    
    return users;
  }

  // Delete user
  async delete() {
    if (this.id) {
      await db.ref(`users/${this.id}`).remove();
    }
  }

  // Update user (instance method)
  async update(updates) {
    Object.assign(this, updates);
    this.updatedAt = new Date();
    return await this.save();
  }

  // Update user (static method)
  static async update(id, updates) {
    const user = await User.findById(id);
    if (!user) return null;
    
    Object.assign(user, updates);
    user.updatedAt = new Date();
    return await user.save();
  }

  // Delete user (static method)
  static async delete(id) {
    const user = await User.findById(id);
    if (!user) return false;
    
    await user.delete();
    return true;
  }

  // Create user (static method)
  static async create(data) {
    const user = new User(data);
    return await user.save();
  }
}

module.exports = User; 