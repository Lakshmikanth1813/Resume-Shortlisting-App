@echo off
echo Starting SkillMatchAI Development Servers...
echo.

echo Starting Backend Server (Port 5000)...
start "Backend Server" cmd /k "cd server && npm run dev"

timeout /t 3 /nobreak >nul

echo Starting Frontend Server (Port 3000)...
start "Frontend Server" cmd /k "cd client && npm start"

echo.
echo Both servers are starting...
echo Backend: http://localhost:5000
echo Frontend: http://localhost:3000
echo.
echo Press any key to exit...
pause >nul
