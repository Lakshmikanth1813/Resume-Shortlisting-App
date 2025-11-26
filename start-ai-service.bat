@echo off
echo Starting AI Service for SkillMatchAI...
echo ========================================

cd /d "%~dp0\ai-service"

echo Installing Python dependencies...
pip install -r requirements.txt

echo Downloading spaCy English model...
python -m spacy download en_core_web_sm

echo Downloading NLTK data...
python -c "import nltk; nltk.download('punkt'); nltk.download('stopwords')"

echo Starting AI Service...
python app.py

pause
