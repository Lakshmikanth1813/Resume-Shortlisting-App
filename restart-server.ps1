Write-Host "🔄 Restarting SkillMatchAI Server..." -ForegroundColor Cyan
Write-Host ""

Write-Host "🛑 Stopping any running Node.js processes..." -ForegroundColor Yellow
Get-Process -Name "node" -ErrorAction SilentlyContinue | Stop-Process -Force -ErrorAction SilentlyContinue

Write-Host ""
Write-Host "⏳ Waiting 3 seconds..." -ForegroundColor Yellow
Start-Sleep -Seconds 3

Write-Host ""
Write-Host "🚀 Starting server..." -ForegroundColor Green
Set-Location server
Start-Process powershell -ArgumentList "-NoExit", "-Command", "npm run dev"

Write-Host ""
Write-Host "✅ Server restart initiated!" -ForegroundColor Green
Write-Host "📍 Check the new terminal window for server status" -ForegroundColor Blue
Write-Host ""
Read-Host "Press Enter to continue"
