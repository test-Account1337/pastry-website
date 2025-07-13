# Vercel Frontend Deployment Guide

## Prerequisites

1. **Vercel Account**: Sign up at [vercel.com](https://vercel.com)
2. **GitHub Repository**: Your code should be on GitHub
3. **Railway Backend**: Your backend should be deployed on Railway

## Deployment Steps

### 1. Connect to Vercel

1. Go to [vercel.com](https://vercel.com)
2. Click "New Project"
3. Import your GitHub repository
4. Select the repository containing your project

### 2. Configure Build Settings

Vercel will automatically detect this is a React project, but you can verify these settings:

- **Framework Preset**: Vite
- **Root Directory**: `./` (root of project)
- **Build Command**: `cd client && npm run build`
- **Output Directory**: `client/dist`
- **Install Command**: `npm install`

### 3. Environment Variables

Add these environment variables in your Vercel project settings:

```env
VITE_API_URL=http://localhost:5000
VITE_RAILWAY_URL=https://pastry-website-production.up.railway.app
VITE_USE_RAILWAY=true
```

### 4. Deploy

Click "Deploy" and wait for the build to complete.

## Configuration Files

### vercel.json
This file is already configured in your project root:

```json
{
  "buildCommand": "cd client && npm install && npm run build",
  "outputDirectory": "client/dist",
  "installCommand": "npm install",
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

## Troubleshooting

### 404 Errors on Direct Navigation
- ✅ **Fixed**: The `vercel.json` file handles client-side routing
- ✅ **All routes** like `/admin/dashboard` will now work

### CORS Errors
- ✅ **Fixed**: Backend CORS configuration includes your Vercel domain
- ✅ **Railway backend** allows requests from `https://uacp.vercel.app`

### Build Errors
- Check that all dependencies are in `client/package.json`
- Ensure `client/vite.config.js` is properly configured
- Verify environment variables are set in Vercel

## Environment Switching

To switch between Railway and localhost:

1. **For Railway**: Set `VITE_USE_RAILWAY=true` in Vercel environment variables
2. **For Localhost**: Set `VITE_USE_RAILWAY=false` in Vercel environment variables
3. **Redeploy**: Vercel will automatically redeploy when you change environment variables

## URLs

- **Frontend**: `https://uacp.vercel.app`
- **Backend**: `https://pastry-website-production.up.railway.app`
- **Admin**: `https://uacp.vercel.app/admin/dashboard`

## Auto-Deployment

Vercel will automatically redeploy when you:
- Push changes to your GitHub repository
- Update environment variables
- Trigger a manual redeploy

Your React app should now handle all routes correctly, including direct navigation to `/admin/dashboard`! 