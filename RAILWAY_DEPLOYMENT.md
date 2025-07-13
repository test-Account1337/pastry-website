# Railway Deployment Guide

## Backend Deployment

### 1. Environment Variables
Set these environment variables in your Railway project:

```env
NODE_ENV=production
PORT=5000
FIREBASE_PROJECT_ID=your-firebase-project-id
FIREBASE_PRIVATE_KEY_ID=your-private-key-id
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYour Private Key Here\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=your-service-account-email
FIREBASE_CLIENT_ID=your-client-id
FIREBASE_AUTH_URI=https://accounts.google.com/o/oauth2/auth
FIREBASE_TOKEN_URI=https://oauth2.googleapis.com/token
FIREBASE_AUTH_PROVIDER_X509_CERT_URL=https://www.googleapis.com/oauth2/v1/certs
FIREBASE_CLIENT_X509_CERT_URL=your-cert-url
FIREBASE_DATABASE_URL=https://your-project-id-default-rtdb.firebaseio.com
JWT_SECRET=your-jwt-secret
CLOUDINARY_CLOUD_NAME=your-cloudinary-cloud-name
CLOUDINARY_API_KEY=your-cloudinary-api-key
CLOUDINARY_API_SECRET=your-cloudinary-api-secret
```

### 2. Build Command
```bash
npm install
```

### 3. Start Command
```bash
npm start
```

## Frontend Configuration

### 1. Environment Variables
Create a `.env` file in the `client` directory:

```env
VITE_API_URL=http://localhost:5000
VITE_RAILWAY_URL=https://your-railway-backend-app.up.railway.app
VITE_FRONTEND_URL=http://localhost:3000
```

### 2. Update CORS in Backend
Make sure your Railway backend URL is included in the CORS configuration in `server/index.js`:

```javascript
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? [
        'https://yourdomain.com',
        'https://your-railway-frontend.up.railway.app',
        'https://your-vercel-app.vercel.app'
      ] 
    : ['http://localhost:3000'],
  credentials: true
}));
```

## How It Works

The frontend automatically detects the best available API endpoint:

1. **Railway URL** (if `VITE_RAILWAY_URL` is set and healthy)
2. **Environment URL** (if `VITE_API_URL` is set and healthy)
3. **Localhost fallback** (if Railway is unavailable)

### Features:
- ✅ Automatic health checks on startup
- ✅ Automatic fallback to localhost if Railway is down
- ✅ Visual indicator showing which API is being used (development only)
- ✅ Automatic retry with fallback on timeout errors
- ✅ Real-time API status monitoring

### Development Indicator
In development mode, you'll see a small indicator in the bottom-right corner showing:
- Current API URL being used
- Connection status (Connected/Error/Checking)

This indicator is automatically hidden in production builds.

## Troubleshooting

### Backend Issues:
1. Check Railway logs for Firebase connection errors
2. Verify all environment variables are set correctly
3. Ensure Firebase service account has proper permissions

### Frontend Issues:
1. Check browser console for CORS errors
2. Verify Railway URL is correct in `.env`
3. Check if Railway backend is responding to health checks

### Common Errors:
- **ECONNREFUSED**: Railway backend is down or URL is incorrect
- **CORS errors**: Backend CORS configuration doesn't include frontend URL
- **401 errors**: JWT token issues or authentication problems 