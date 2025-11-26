# PowerShell script to start the AI Service
Write-Host "Starting AI Service for SkillMatchAI..." -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green

# Change to ai-service directory
Set-Location -Path "$PSScriptRoot\ai-service"

# Install Python dependencies
Write-Host "Installing Python dependencies..." -ForegroundColor Yellow
pip install -r requirements.txt

# Download spaCy English model
Write-Host "Downloading spaCy English model..." -ForegroundColor Yellow
python -m spacy download en_core_web_sm

# Download NLTK data
Write-Host "Downloading NLTK data..." -ForegroundColor Yellow
python -c "import nltk; nltk.download('punkt'); nltk.download('stopwords')"

# Start the AI service
Write-Host "Starting AI Service..." -ForegroundColor Green
python app.py

Read-Host "Press Enter to continue"
