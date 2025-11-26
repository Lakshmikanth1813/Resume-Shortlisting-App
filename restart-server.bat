@echo off
echo 🔄 Restarting SkillMatchAI Server...
echo.

echo 🛑 Stopping any running Node.js processes...
taskkill /f /im node.exe 2>nul

echo.
echo ⏳ Waiting 3 seconds...
timeout /t 3 /nobreak >nul

echo.
echo 🚀 Starting server...
cd server
start "SkillMatchAI Server" cmd /k "npm run dev"

echo.
echo ✅ Server restart initiated!
echo 📍 Check the new terminal window for server status
echo.
pause
