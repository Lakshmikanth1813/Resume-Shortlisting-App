Write-Host "🔧 Setting up environment variables..." -ForegroundColor Cyan

$env:PORT = "5000"
$env:NODE_ENV = "development"
$env:MONGODB_URI = "mongodb://localhost:27017/skillmatchai"
$env:JWT_SECRET = "your_super_secret_jwt_key_here_change_in_production"
$env:AI_SERVICE_URL = "http://localhost:5001"
$env:CLIENT_URL = "http://localhost:3000"
$env:CLOUDINARY_CLOUD_NAME = "dbkqdntjk"
$env:CLOUDINARY_API_KEY = "669987573739346"
$env:CLOUDINARY_API_SECRET = "mGTBMa-HLV3C-nBUZYXAy_Yjqfo"

Write-Host "✅ Environment variables set" -ForegroundColor Green
Write-Host ""
Write-Host "🚀 Starting server..." -ForegroundColor Green
Set-Location server
npm run dev
