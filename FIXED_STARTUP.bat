@echo off
echo 🔧 FIXED STARTUP - Real Skill Extraction
echo ==========================================

echo.
echo 1. Setting environment variables...
set PORT=5000
set NODE_ENV=development
set MONGODB_URI=mongodb://localhost:27017/skillmatchai
set JWT_SECRET=your_super_secret_jwt_key_here_change_in_production
set AI_SERVICE_URL=http://localhost:5001
set CLIENT_URL=http://localhost:3000
set CLOUDINARY_CLOUD_NAME=dbkqdntjk
set CLOUDINARY_API_KEY=669987573739346
set CLOUDINARY_API_SECRET=mGTBMa-HLV3C-nBUZYXAy_Yjqfo

echo ✅ Environment variables set

echo.
echo 2. Starting server with real AI integration...
cd server
start "SkillMatchAI Server" cmd /k "npm run dev"

echo.
echo ✅ Server started! 
echo 📍 Check the new terminal window
echo 🎯 NO MORE MOCK SKILLS - Only real CV skills will be extracted!
echo.
pause
