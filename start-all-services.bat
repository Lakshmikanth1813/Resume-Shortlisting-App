@echo off
echo Starting all SkillMatchAI services...
echo ========================================

echo Starting AI Service (Python Flask)...
start "AI Service" cmd /k "cd /d %~dp0\ai-service && python app.py"

echo Waiting for AI service to start...
timeout /t 3 /nobreak > nul

echo Starting Backend Server (Node.js)...
start "Backend Server" cmd /k "cd /d %~dp0\server && npm run dev"

echo Waiting for backend to start...
timeout /t 3 /nobreak > nul

echo Starting Frontend (React)...
start "Frontend" cmd /k "cd /d %~dp0\client && npm start"

echo.
echo ========================================
echo All services are starting up!
echo.
echo AI Service: http://localhost:5001
echo Backend API: http://localhost:5000/api
echo Frontend: http://localhost:3000
echo.
echo Press any key to continue...
pause > nul
