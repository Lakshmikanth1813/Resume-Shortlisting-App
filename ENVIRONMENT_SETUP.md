# Environment Setup Guide

## Quick Setup for Development

### 1. Create Server Environment File

Create a file named `.env` in the `server` directory with the following content:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database
MONGODB_URI=mongodb://localhost:27017/skillmatchai

# JWT Secret (Change this in production!)
JWT_SECRET=your_super_secret_jwt_key_here_change_in_production

# Cloudinary Configuration (Optional - for file uploads)
# Get these from https://cloudinary.com/console
CLOUDINARY_CLOUD_NAME=your_cloud_name_here
CLOUDINARY_API_KEY=your_api_key_here
CLOUDINARY_API_SECRET=your_api_secret_here

# AI Service URL
AI_SERVICE_URL=http://localhost:5001

# Frontend URL
CLIENT_URL=http://localhost:3000
```

### 2. Create AI Service Environment File

Create a file named `.env` in the `ai-service` directory with the following content:

```env
PORT=5001
FLASK_ENV=development
AI_SERVICE_URL=http://localhost:5001
```

## Current Status Check

Based on your terminal output, here's what's working and what needs attention:

### ✅ **Working:**
- ✅ Backend server running on port 5000
- ✅ MongoDB connected successfully
- ✅ Authentication working (login endpoint responding)

### ⚠️ **Needs Setup:**
- ⚠️ Cloudinary credentials not configured (optional)
- ⚠️ AI service not running (optional)

## Quick Fix Commands

### 1. Create the .env file manually:

**For Windows PowerShell:**
```powershell
# Navigate to server directory
cd server

# Create .env file
@"
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/skillmatchai
JWT_SECRET=your_super_secret_jwt_key_here_change_in_production
AI_SERVICE_URL=http://localhost:5001
CLIENT_URL=http://localhost:3000
"@ | Out-File -FilePath ".env" -Encoding UTF8
```

**For Command Prompt:**
```cmd
cd server
echo PORT=5000 > .env
echo NODE_ENV=development >> .env
echo MONGODB_URI=mongodb://localhost:27017/skillmatchai >> .env
echo JWT_SECRET=your_super_secret_jwt_key_here_change_in_production >> .env
echo AI_SERVICE_URL=http://localhost:5001 >> .env
echo CLIENT_URL=http://localhost:3000 >> .env
```

### 2. Restart the server:
```bash
# Stop the current server (Ctrl+C)
# Then restart:
npm run dev
```

## Optional: Cloudinary Setup (for file uploads)

If you want file upload functionality:

1. **Sign up at [cloudinary.com](https://cloudinary.com)**
2. **Get your credentials from the dashboard**
3. **Add them to your `.env` file:**
   ```env
   CLOUDINARY_CLOUD_NAME=your_actual_cloud_name
   CLOUDINARY_API_KEY=your_actual_api_key
   CLOUDINARY_API_SECRET=your_actual_api_secret
   ```

## Optional: AI Service Setup (for skill extraction)

If you want AI-powered skill extraction:

1. **Install Python dependencies:**
   ```bash
   cd ai-service
   pip install -r requirements.txt
   python -m spacy download en_core_web_sm
   ```

2. **Start the AI service:**
   ```bash
   python app.py
   ```

## Testing the Setup

After creating the `.env` file and restarting the server, you should see:

```
🚀 Server running on port 5000
📊 Environment: development
🌐 API URL: http://localhost:5000/api
✅ MongoDB Connected: localhost
⚠️  Cloudinary credentials not configured
```

The server will work without Cloudinary and AI service - those are optional features!
