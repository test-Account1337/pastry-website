# Pastry News Portal 🍰

A modern, responsive website dedicated to news, articles, and updates about pastry chefs and the pastry industry. Features a public news portal and a secure admin dashboard for content management.

## 🌟 Features

### Public Website
- **Homepage**: Latest articles with hero section and categories
- **Article Pages**: Full content with social sharing
- **Search & Filter**: Advanced filtering by category, date, author, and tags
- **About & Contact**: Mission statement and contact forms
- **Responsive Design**: Optimized for all devices

### Admin Dashboard
- **Authentication**: Secure login with JWT
- **Content Management**: CRUD operations for articles
- **Media Management**: Image/video uploads with Cloudinary
- **Category & Tag Management**: Organize content
- **User Management**: Role-based access control
- **Analytics**: View statistics and insights

## 🛠 Tech Stack

- **Frontend**: React.js with Tailwind CSS
- **Backend**: Node.js with Express
- **Database**: Firebase Realtime Database
- **Authentication**: JWT with bcrypt
- **File Upload**: Cloudinary integration
- **Email**: Nodemailer for contact forms
- **State Management**: React Query for server state
- **Animations**: Framer Motion
- **Icons**: React Icons

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or Atlas)
- Cloudinary account (for image uploads)

### Installation

1. **Clone and install dependencies**
   ```bash
   git clone <repository-url>
   cd pastry-news-portal
   npm run install-all
   ```

2. **Environment Setup**
   ```bash
   cp .env.example .env
   ```
   Fill in your environment variables:
   ```env
   # Database
   MONGODB_URI=mongodb://localhost:27017/pastry-news
   
   # JWT
   JWT_SECRET=your-super-secret-jwt-key
   
   # Cloudinary
   CLOUDINARY_CLOUD_NAME=your-cloud-name
   CLOUDINARY_API_KEY=your-api-key
   CLOUDINARY_API_SECRET=your-api-secret
   
   # Email (Gmail example)
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASS=your-app-password
   
   # Server
   PORT=5000
   NODE_ENV=development
   ```

3. **Run Development Server**
   ```bash
   npm run dev
   ```

4. **Access the Application**
   - Public site: http://localhost:3000
   - Admin dashboard: http://localhost:3000/admin
   - API: http://localhost:5000/api

## 📁 Project Structure

```
pastry-news-portal/
├── client/                 # React frontend
│   ├── public/
│   └── src/
│       ├── components/     # Reusable components
│       │   ├── articles/   # Article-related components
│       │   ├── categories/ # Category components
│       │   ├── layout/     # Layout components
│       │   ├── auth/       # Authentication components
│       │   └── common/     # Common UI components
│       ├── pages/         # Page components
│       │   └── admin/     # Admin pages
│       ├── context/       # React context
│       └── utils/         # Utility functions
├── server/                # Node.js backend
│   ├── controllers/       # Route controllers
│   ├── middleware/        # Custom middleware
│   ├── models/           # MongoDB models
│   ├── routes/           # API routes
│   └── utils/            # Utility functions
├── uploads/              # File uploads (development)
└── docs/                 # Documentation
```

## 🎨 Design System

### Color Palette
- **Primary**: Warm cream (#FDF6E3)
- **Secondary**: Soft pink (#F8BBD9)
- **Accent**: Mocha brown (#8D6E63)
- **Text**: Dark chocolate (#3E2723)
- **Background**: Light vanilla (#FFF8E1)

### Typography
- **Headings**: Playfair Display (serif)
- **Body**: Inter (sans-serif)

## 🔐 Security Features

- JWT authentication
- Password hashing with bcrypt
- Rate limiting
- CORS protection
- Helmet security headers
- Input validation and sanitization

## 📱 Responsive Design

The website is fully responsive and optimized for:
- Desktop (1200px+)
- Tablet (768px - 1199px)
- Mobile (320px - 767px)

## 🚀 Deployment

### Production Build
```bash
npm run build
npm start
```

### Environment Variables for Production
- Set `NODE_ENV=production`
- Configure production database
- Set up proper CORS origins
- Configure email service

## 🍰 Sample Data

To get started quickly, you can create some sample data:

1. **Create an admin user** via the registration endpoint
2. **Add categories** like:
   - Pastry Techniques
   - Chef Interviews
   - Industry News
   - Recipe Development
   - Competition Coverage

3. **Create sample articles** with different statuses (draft, published)

## 🔧 Development

### Available Scripts
- `npm run dev` - Start both frontend and backend
- `npm run server` - Start backend only
- `npm run client` - Start frontend only
- `npm run build` - Build for production
- `npm run install-all` - Install all dependencies

### Code Style
- Use ESLint and Prettier
- Follow React best practices
- Use TypeScript for better type safety (optional)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🍰 About

Created with love for the pastry community. Share your passion for pastry arts with the world!

---

**Note**: Make sure to set up your MongoDB database and Cloudinary account before running the application. The application will create the necessary collections and indexes automatically on first run. 