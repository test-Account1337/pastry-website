#!/usr/bin/env node

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// Import models
const User = require('./server/models/User');
const Category = require('./server/models/Category');
const Article = require('./server/models/Article');

const sampleCategories = [
  {
    name: 'Pastry Techniques',
    slug: 'pastry-techniques',
    description: 'Master the fundamental techniques of pastry arts',
    color: '#F8BBD9',
    isActive: true
  },
  {
    name: 'Chef Interviews',
    slug: 'chef-interviews',
    description: 'Exclusive interviews with renowned pastry chefs',
    color: '#8D6E63',
    isActive: true
  },
  {
    name: 'Industry News',
    slug: 'industry-news',
    description: 'Latest updates from the pastry industry',
    color: '#FFB74D',
    isActive: true
  },
  {
    name: 'Recipe Development',
    slug: 'recipe-development',
    description: 'Innovative recipes and development processes',
    color: '#81C784',
    isActive: true
  },
  {
    name: 'Competition Coverage',
    slug: 'competition-coverage',
    description: 'Coverage of pastry competitions and events',
    color: '#F06292',
    isActive: true
  }
];

const sampleArticles = [
  {
    title: 'The Art of French Macarons: A Complete Guide',
    slug: 'art-of-french-macarons-complete-guide',
    excerpt: 'Master the delicate art of creating perfect French macarons with our comprehensive guide covering techniques, tips, and troubleshooting.',
    featuredImage: 'https://images.unsplash.com/photo-1569864358645-9d1684040f43?w=800&h=600&fit=crop',
    content: `
      <h2>Introduction to French Macarons</h2>
      <p>French macarons are one of the most elegant and challenging pastries to master. These delicate almond-based cookies with a smooth ganache filling require precision, patience, and practice.</p>
      
      <h2>Essential Ingredients</h2>
      <ul>
        <li>Almond flour (finely ground)</li>
        <li>Powdered sugar</li>
        <li>Egg whites (aged for 24-48 hours)</li>
        <li>Granulated sugar</li>
        <li>Food coloring (optional)</li>
      </ul>
      
      <h2>Step-by-Step Process</h2>
      <p>The key to perfect macarons lies in the macaronage technique - the process of folding the dry ingredients into the meringue. This step determines the final texture and appearance of your macarons.</p>
      
      <h2>Common Mistakes to Avoid</h2>
      <p>Over-mixing the batter, under-mixing, incorrect oven temperature, and improper resting time are common pitfalls that can lead to failed macarons.</p>
      
      <h2>Tips for Success</h2>
      <ul>
        <li>Use aged egg whites for better stability</li>
        <li>Ensure all equipment is completely clean and dry</li>
        <li>Let macarons rest before baking to form a skin</li>
        <li>Use an oven thermometer for accurate temperature</li>
      </ul>
    `,
    status: 'published',
    tags: ['macarons', 'french-pastry', 'techniques', 'baking'],
    views: 1250,
    likes: 89
  },
  {
    title: 'Interview with Chef Pierre Dubois: Modern Pastry Innovation',
    slug: 'interview-chef-pierre-dubois-modern-pastry-innovation',
    excerpt: 'An exclusive conversation with renowned pastry chef Pierre Dubois about innovation, sustainability, and the future of pastry arts.',
    featuredImage: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&h=600&fit=crop',
    content: `
      <h2>Meet Chef Pierre Dubois</h2>
      <p>Chef Pierre Dubois has been at the forefront of pastry innovation for over two decades. His Paris-based patisserie has earned three Michelin stars and is known for pushing the boundaries of traditional French pastry.</p>
      
      <h2>On Innovation in Pastry</h2>
      <p>"Innovation doesn't mean abandoning tradition," says Chef Dubois. "It means understanding the fundamentals so well that you can respectfully evolve them. Every new technique I develop is built on centuries of pastry knowledge."</p>
      
      <h2>Sustainability in the Kitchen</h2>
      <p>Chef Dubois has been a pioneer in sustainable pastry practices, from sourcing local ingredients to reducing food waste through creative techniques.</p>
      
      <h2>The Future of Pastry</h2>
      <p>"I see a future where pastry becomes even more personal and experiential. Technology will help us create textures and flavors we never thought possible, but the human touch will always be essential."</p>
    `,
    status: 'published',
    tags: ['chef-interview', 'innovation', 'sustainability', 'french-pastry'],
    views: 890,
    likes: 67
  },
  {
    title: '2024 Pastry Industry Trends: What\'s Next?',
    slug: '2024-pastry-industry-trends-whats-next',
    excerpt: 'Explore the latest trends shaping the pastry industry in 2024, from plant-based innovations to technology integration.',
    featuredImage: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=800&h=600&fit=crop',
    content: `
      <h2>Plant-Based Revolution</h2>
      <p>The plant-based movement continues to gain momentum in pastry, with innovative alternatives to traditional ingredients like eggs, butter, and cream.</p>
      
      <h2>Technology Integration</h2>
      <p>From 3D-printed decorations to AI-assisted recipe development, technology is transforming how pastry chefs work and create.</p>
      
      <h2>Sustainability Focus</h2>
      <p>Consumers are increasingly demanding sustainable practices, from ingredient sourcing to packaging and waste reduction.</p>
      
      <h2>Global Fusion</h2>
      <p>Chefs are blending traditional techniques with global flavors, creating exciting new pastry experiences that celebrate cultural diversity.</p>
    `,
    status: 'published',
    tags: ['industry-trends', '2024', 'innovation', 'sustainability'],
    views: 756,
    likes: 45
  }
];

async function setupDatabase() {
  try {
    console.log('🔗 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/pastry-news');
    console.log('✅ Connected to MongoDB');

    // Clear existing data
    console.log('🧹 Clearing existing data...');
    await User.deleteMany({});
    await Category.deleteMany({});
    await Article.deleteMany({});

    // Create admin user
    console.log('👤 Creating admin user...');
    const hashedPassword = await bcrypt.hash('admin123', 12);
    const adminUser = new User({
      username: 'admin',
      firstName: 'Admin',
      lastName: 'User',
      email: 'admin@pastrynews.com',
      password: hashedPassword,
      role: 'admin',
      isActive: true,
      emailVerified: true
    });
    await adminUser.save();
    console.log('✅ Admin user created: admin@pastrynews.com / admin123');

    // Create categories
    console.log('📂 Creating sample categories...');
    const createdCategories = [];
    for (const categoryData of sampleCategories) {
      const category = new Category(categoryData);
      await category.save();
      createdCategories.push(category);
      console.log(`✅ Created category: ${category.name}`);
    }

    // Create articles
    console.log('📝 Creating sample articles...');
    for (const articleData of sampleArticles) {
      const article = new Article({
        ...articleData,
        author: adminUser._id,
        category: createdCategories[Math.floor(Math.random() * createdCategories.length)]._id
      });
      await article.save();
      console.log(`✅ Created article: ${article.title}`);
    }

    console.log('\n🎉 Setup completed successfully!');
    console.log('\n📋 Login Credentials:');
    console.log('Email: admin@pastrynews.com');
    console.log('Password: admin123');
    console.log('\n🌐 Access your application:');
    console.log('Frontend: http://localhost:3000');
    console.log('Admin: http://localhost:3000/admin');
    console.log('API: http://localhost:5000/api');

  } catch (error) {
    console.error('❌ Setup failed:', error.message);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
  }
}

// Run setup if this file is executed directly
if (require.main === module) {
  setupDatabase();
}

module.exports = setupDatabase; 