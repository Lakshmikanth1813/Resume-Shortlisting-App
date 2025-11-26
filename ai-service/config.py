import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    """Configuration class for the AI service"""
    
    # Flask settings
    PORT = int(os.environ.get('PORT', 5001))
    FLASK_ENV = os.environ.get('FLASK_ENV', 'development')
    DEBUG = FLASK_ENV == 'development'
    
    # Service URLs
    AI_SERVICE_URL = os.environ.get('AI_SERVICE_URL', 'http://localhost:5001')
    
    # NLP Settings
    SPACY_MODEL = 'en_core_web_sm'
    
    # File processing settings
    MAX_FILE_SIZE = 10 * 1024 * 1024  # 10MB
    ALLOWED_EXTENSIONS = {'pdf', 'docx', 'txt'}
    
    # Request timeout
    REQUEST_TIMEOUT = 10
