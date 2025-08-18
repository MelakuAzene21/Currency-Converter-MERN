# 🚀 Deployment Guide

This guide will help you deploy the Currency Converter application to various platforms.

## 📋 Prerequisites

1. **ExchangeRate-API Key**: Get a free API key from [exchangerate-api.com](https://exchangerate-api.com)
2. **Git Repository**: Your code should be in a Git repository
3. **Node.js**: Ensure you have Node.js installed locally for testing

## 🔧 Environment Setup

### Backend Environment Variables

Create a `.env` file in the `back` directory:

```env
# ExchangeRate-API Configuration
EXCHANGE_RATE_API_KEY=your_api_key_here

# Server Configuration
PORT=5000
NODE_ENV=production

# CORS Configuration (update with your frontend URL)
FRONTEND_URL=https://your-frontend-domain.com
```

## 🌐 Frontend Deployment

### Option 1: Vercel (Recommended)

1. **Connect your repository to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Import your Git repository
   - Set the root directory to `fr/front`

2. **Configure build settings**
   - Framework Preset: `Vite`
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`

3. **Environment Variables**
   - Add `VITE_API_URL` with your backend URL

4. **Deploy**
   - Click "Deploy" and wait for the build to complete

### Option 2: Netlify

1. **Connect your repository to Netlify**
   - Go to [netlify.com](https://netlify.com)
   - Import your Git repository
   - Set the base directory to `fr/front`

2. **Configure build settings**
   - Build Command: `npm run build`
   - Publish Directory: `dist`

3. **Environment Variables**
   - Add `VITE_API_URL` with your backend URL

4. **Deploy**
   - Click "Deploy site"

### Option 3: GitHub Pages

1. **Update vite.config.js**
   ```javascript
   export default defineConfig({
     base: '/your-repo-name/',
     // ... other config
   })
   ```

2. **Add deployment script to package.json**
   ```json
   {
     "scripts": {
       "deploy": "npm run build && gh-pages -d dist"
     }
   }
   ```

3. **Install gh-pages**
   ```bash
   npm install --save-dev gh-pages
   ```

4. **Deploy**
   ```bash
   npm run deploy
   ```

## 🔧 Backend Deployment

### Option 1: Render (Recommended)

1. **Connect your repository to Render**
   - Go to [render.com](https://render.com)
   - Create a new Web Service
   - Connect your Git repository

2. **Configure the service**
   - Name: `currency-converter-api`
   - Root Directory: `back`
   - Runtime: `Node`
   - Build Command: `npm install`
   - Start Command: `npm start`

3. **Environment Variables**
   - Add all variables from your `.env` file
   - Set `NODE_ENV=production`

4. **Deploy**
   - Click "Create Web Service"

### Option 2: Railway

1. **Connect your repository to Railway**
   - Go to [railway.app](https://railway.app)
   - Import your Git repository
   - Set the root directory to `back`

2. **Configure the service**
   - Add environment variables
   - Set the start command to `npm start`

3. **Deploy**
   - Railway will automatically deploy on push

### Option 3: Heroku

1. **Install Heroku CLI**
   ```bash
   npm install -g heroku
   ```

2. **Create Heroku app**
   ```bash
   heroku create your-app-name
   ```

3. **Set environment variables**
   ```bash
   heroku config:set EXCHANGE_RATE_API_KEY=your_api_key
   heroku config:set NODE_ENV=production
   ```

4. **Deploy**
   ```bash
   git push heroku main
   ```

## 🔗 Connecting Frontend to Backend

After deploying both frontend and backend, update the API URL in your frontend:

1. **For Vercel/Netlify**: Add environment variable `VITE_API_URL`
2. **For GitHub Pages**: Update the API_BASE_URL in `App.jsx`

## 🔒 Security Considerations

1. **CORS Configuration**: Update CORS origins in `server.js`
2. **Rate Limiting**: Adjust rate limits for production
3. **Environment Variables**: Never commit `.env` files
4. **API Key Security**: Use environment variables for API keys

## 📊 Monitoring

### Health Check
Your backend includes a health check endpoint:
```
GET https://your-backend-url.com/api/health
```

### Logs
Monitor your application logs for:
- API errors
- Rate limiting
- Performance issues

## 🚨 Troubleshooting

### Common Issues

1. **CORS Errors**
   - Update CORS origins in backend
   - Check frontend URL configuration

2. **API Key Issues**
   - Verify API key is correct
   - Check API key permissions

3. **Build Failures**
   - Check Node.js version compatibility
   - Verify all dependencies are installed

4. **Environment Variables**
   - Ensure all required variables are set
   - Check variable names and values

### Debug Steps

1. **Test locally first**
   ```bash
   # Backend
   cd back
   npm start
   
   # Frontend
   cd fr/front
   npm run dev
   ```

2. **Check API endpoints**
   ```bash
   curl https://your-backend-url.com/api/health
   ```

3. **Verify environment variables**
   - Check deployment platform settings
   - Ensure variables are properly set

## 📈 Performance Optimization

1. **Enable caching**
2. **Use CDN for static assets**
3. **Optimize images and assets**
4. **Monitor API response times**

## 🔄 Continuous Deployment

Set up automatic deployments:
1. Connect your Git repository to deployment platform
2. Configure automatic deployments on push
3. Set up staging environment for testing

---

**Need help?** Create an issue in the repository or check the platform-specific documentation.
