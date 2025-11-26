# PowerShell script to start all SkillMatchAI services
Write-Host "Starting all SkillMatchAI services..." -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green

# Start AI Service (Python Flask)
Write-Host "Starting AI Service (Python Flask)..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PSScriptRoot\ai-service'; python app.py" -WindowStyle Normal

# Wait for AI service to start
Start-Sleep -Seconds 3

# Start Backend Server (Node.js)
Write-Host "Starting Backend Server (Node.js)..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PSScriptRoot\server'; npm run dev" -WindowStyle Normal

# Wait for backend to start
Start-Sleep -Seconds 3

# Start Frontend (React)
Write-Host "Starting Frontend (React)..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PSScriptRoot\client'; npm start" -WindowStyle Normal

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "All services are starting up!" -ForegroundColor Green
Write-Host ""
Write-Host "AI Service: http://localhost:5001" -ForegroundColor Cyan
Write-Host "Backend API: http://localhost:5000/api" -ForegroundColor Cyan
Write-Host "Frontend: http://localhost:3000" -ForegroundColor Cyan
Write-Host ""
Write-Host "Press Enter to continue..." -ForegroundColor White
Read-Host
