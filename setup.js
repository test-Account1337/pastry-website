#!/usr/bin/env node

const { db } = require('./server/config/firebase');
const bcrypt = require('bcryptjs');

// Import models
const User = require('./server/models/User');
const Category = require('./server/models/Category');
const Article = require('./server/models/Article');

const sampleCategories = [
  {
    name: 'African Cuisine',
    slug: 'african-cuisine',
    description: 'Traditional and modern African culinary techniques',
    color: '#2D5A27',
    isActive: true
  },
  {
    name: 'Chef Profiles',
    slug: 'chef-profiles',
    description: 'Exclusive interviews with African culinary professionals',
    color: '#8B4513',
    isActive: true
  },
  {
    name: 'Industry News',
    slug: 'industry-news',
    description: 'Latest updates from the African culinary industry',
    color: '#D2691E',
    isActive: true
  },
  {
    name: 'Culinary Innovation',
    slug: 'culinary-innovation',
    description: 'Innovative African recipes and development processes',
    color: '#228B22',
    isActive: true
  },
  {
    name: 'Events & Competitions',
    slug: 'events-competitions',
    description: 'Coverage of African culinary competitions and events',
    color: '#CD853F',
    isActive: true
  }
];

const sampleArticles = [
  {
    title: 'The Art of West African Jollof Rice: A Complete Guide',
    slug: 'art-of-west-african-jollof-rice-complete-guide',
    excerpt: 'Master the art of creating authentic West African Jollof rice with our comprehensive guide covering techniques, tips, and regional variations.',
    featuredImage: 'https://images.unsplash.com/photo-1563379091339-03246963d4a9?w=800&h=600&fit=crop',
    content: `
      <h2>Introduction to Jollof Rice</h2>
      <p>Jollof rice is one of the most celebrated dishes in West African cuisine. This flavorful one-pot rice dish, cooked in a rich tomato sauce with aromatic spices, is a staple at celebrations and gatherings across the region.</p>
      
      <h2>Essential Ingredients</h2>
      <ul>
        <li>Long-grain rice (preferably parboiled)</li>
        <li>Fresh tomatoes and tomato paste</li>
        <li>Scotch bonnet peppers</li>
        <li>Onions and garlic</li>
        <li>African spices and herbs</li>
      </ul>
      
      <h2>Step-by-Step Process</h2>
      <p>The key to perfect Jollof rice lies in the layering technique - building flavors through careful timing and the right balance of ingredients. This process creates the signature smoky, rich taste that makes Jollof rice so beloved.</p>
      
      <h2>Common Mistakes to Avoid</h2>
      <p>Over-stirring the rice, using the wrong rice variety, insufficient seasoning, and improper heat control are common pitfalls that can lead to mushy or bland Jollof rice.</p>
      
      <h2>Tips for Success</h2>
      <ul>
        <li>Use parboiled rice for better texture</li>
        <li>Allow the tomato base to cook down properly</li>
        <li>Don't stir too much once rice is added</li>
        <li>Use a heavy-bottomed pot for even cooking</li>
      </ul>
    `,
    status: 'published',
    tags: ['jollof-rice', 'west-african-cuisine', 'techniques', 'cooking'],
    views: 1250,
    likes: 89
  },
  {
    title: 'Interview with Chef Fatou Ndiaye: Modern African Cuisine Innovation',
    slug: 'interview-chef-fatou-ndiaye-modern-african-cuisine-innovation',
    excerpt: 'An exclusive conversation with renowned Senegalese chef Fatou Ndiaye about innovation, sustainability, and the future of African cuisine.',
    featuredImage: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&h=600&fit=crop',
    content: `
      <h2>Meet Chef Fatou Ndiaye</h2>
      <p>Chef Fatou Ndiaye has been at the forefront of African cuisine innovation for over two decades. Her Dakar-based restaurant has earned international recognition and is known for pushing the boundaries of traditional African cooking.</p>
      
      <h2>On Innovation in African Cuisine</h2>
      <p>"Innovation doesn't mean abandoning tradition," says Chef Ndiaye. "It means understanding the fundamentals so well that you can respectfully evolve them. Every new technique I develop is built on centuries of African culinary knowledge."</p>
      
      <h2>Sustainability in the Kitchen</h2>
      <p>Chef Ndiaye has been a pioneer in sustainable African cooking practices, from sourcing local ingredients to reducing food waste through creative techniques.</p>
      
      <h2>The Future of African Cuisine</h2>
      <p>"I see a future where African cuisine becomes even more personal and experiential. Technology will help us create textures and flavors we never thought possible, but the human touch will always be essential."</p>
    `,
    status: 'published',
    tags: ['chef-interview', 'innovation', 'sustainability', 'african-cuisine'],
    views: 890,
    likes: 67
  },
  {
    title: '2024 African Culinary Industry Trends: What\'s Next?',
    slug: '2024-african-culinary-industry-trends-whats-next',
    excerpt: 'Explore the latest trends shaping the African culinary industry in 2024, from traditional revival to modern innovation.',
    featuredImage: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=800&h=600&fit=crop',
    content: `
      <h2>Traditional Revival</h2>
      <p>The revival of traditional African cooking methods and ingredients continues to gain momentum, with chefs rediscovering ancient techniques and forgotten ingredients.</p>
      
      <h2>Technology Integration</h2>
      <p>From modern cooking equipment to digital platforms for sharing recipes, technology is transforming how African chefs work and preserve culinary traditions.</p>
      
      <h2>Sustainability Focus</h2>
      <p>Consumers are increasingly demanding sustainable practices, from local ingredient sourcing to traditional preservation methods and waste reduction.</p>
      
      <h2>Global Recognition</h2>
      <p>African cuisine is gaining international recognition, with chefs blending traditional techniques with modern approaches, creating exciting new culinary experiences that celebrate African diversity.</p>
    `,
    status: 'published',
    tags: ['industry-trends', '2024', 'innovation', 'sustainability'],
    views: 756,
    likes: 45
  }
];

async function setupDatabase() {
  try {
    console.log('🔗 Connecting to Firebase...');
    console.log('✅ Connected to Firebase');

    // Clear existing data
    console.log('🧹 Clearing existing data...');
    
    // Clear all data
    await db.ref().remove();
    
    console.log('✅ Cleared existing data');

    // Create admin user
    console.log('👤 Creating admin user...');
    const adminUser = new User({
      username: 'admin',
      firstName: 'Admin',
      lastName: 'User',
      email: 'admin@uacp.org',
      password: 'admin123',
      role: 'admin',
      isActive: true,
      emailVerified: true
    });
    await adminUser.save();
    console.log('✅ Admin user created: admin@uacp.org / admin123');

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
        author: adminUser.id,
        category: createdCategories[Math.floor(Math.random() * createdCategories.length)].id
      });
      await article.save();
      console.log(`✅ Created article: ${article.title}`);
    }

    console.log('\n🎉 Setup completed successfully!');
    console.log('\n📋 Login Credentials:');
    console.log('Email: admin@uacp.org');
    console.log('Password: admin123');
    console.log('\n🌐 Access your application:');
    console.log('Frontend: http://localhost:3000');
    console.log('Admin: http://localhost:3000/admin');
    console.log('API: http://localhost:5000/api');

  } catch (error) {
    console.error('❌ Setup failed:', error.message);
    process.exit(1);
  }
}

// Run setup if this file is executed directly
if (require.main === module) {
  setupDatabase();
}

module.exports = setupDatabase; 