# Vercel Deployment Guide

## Prerequisites
1. Vercel account
2. MongoDB Atlas account (for database)
3. Git repository with your code

## Environment Variables Setup

### Backend Environment Variables (set in Vercel dashboard)
- `MONGO_URL`: Your MongoDB connection string (include database name)
- `JWT_SECRET`: A secure random string for JWT token signing
- `ADMIN_SECRET`: A secure admin secret key
- `NODE_ENV`: Set to `production`

### Frontend Environment Variables (set in Vercel dashboard)
- `NEXT_PUBLIC_API_URL`: Your backend API URL (will be `/api` in production)

## MongoDB Connection String Format
Your MongoDB connection string should include the database name:
```
mongodb+srv://username:password@cluster.afjkxgl.mongodb.net/taskmanagement?retryWrites=true&w=majority
```

**Important**: Add `/taskmanagement` (or your database name) before the `?` in your connection string.

## Deployment Steps

### Option 1: Deploy as Monorepo (Recommended)
1. Push your code to GitHub
2. Connect your repository to Vercel
3. Set the root directory to `/` (root of the project)
4. Configure environment variables in Vercel dashboard
5. Deploy

### Option 2: Deploy Backend and Frontend Separately
1. Deploy backend first:
   - Set root directory to `/backend`
   - Configure backend environment variables
   - Deploy

2. Deploy frontend:
   - Set root directory to `/frontend`
   - Update `frontend/services/api.js` with your backend URL
   - Configure frontend environment variables
   - Deploy

## API Routes
After deployment, your API will be available at:
- `/api/auth/*` - Authentication routes
- `/api/tasks/*` - Task management routes
- `/api/users/*` - User management routes

## Troubleshooting
- If you get 404 errors, check that your routes are properly configured
- Ensure MongoDB connection string is correct and includes database name
- Verify environment variables are set in Vercel dashboard
- Check Vercel function logs for any errors
- Test API endpoints directly in browser 