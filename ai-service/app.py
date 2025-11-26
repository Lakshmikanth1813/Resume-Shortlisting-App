from flask import Flask, request, jsonify
from flask_cors import CORS
import spacy
import re
import json
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import nltk
from nltk.corpus import stopwords
import PyPDF2
import docx
from io import BytesIO
import requests
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

app = Flask(__name__)
CORS(app)

# Download required NLTK data
try:
    nltk.data.find('tokenizers/punkt')
    nltk.data.find('corpora/stopwords')
except LookupError:
    nltk.download('punkt')
    nltk.download('stopwords')

# Load spaCy model
try:
    nlp = spacy.load("en_core_web_sm")
except OSError:
    print("⚠️  spaCy English model not found. Please install it with: python -m spacy download en_core_web_sm")
    nlp = None

# Technical skills database
TECHNICAL_SKILLS = [
    # Programming Languages
    'python', 'javascript', 'java', 'c++', 'c#', 'ruby', 'php', 'go', 'rust', 'swift', 'kotlin',
    'typescript', 'scala', 'r', 'matlab', 'perl', 'haskell', 'clojure', 'erlang', 'elixir',
    
    # Web Technologies
    'html', 'css', 'react', 'angular', 'vue', 'node.js', 'express', 'django', 'flask', 'spring',
    'laravel', 'rails', 'asp.net', 'jquery', 'bootstrap', 'tailwind', 'sass', 'less',
    
    # Databases
    'mysql', 'postgresql', 'mongodb', 'redis', 'sqlite', 'oracle', 'sql server', 'cassandra',
    'elasticsearch', 'neo4j', 'dynamodb', 'firebase', 'supabase',
    
    # Cloud & DevOps
    'aws', 'azure', 'gcp', 'docker', 'kubernetes', 'jenkins', 'gitlab', 'github', 'terraform',
    'ansible', 'chef', 'puppet', 'vagrant', 'nginx', 'apache', 'linux', 'ubuntu', 'centos',
    
    # Mobile Development
    'react native', 'flutter', 'xamarin', 'ionic', 'cordova', 'android', 'ios',
    
    # Data Science & ML
    'machine learning', 'deep learning', 'tensorflow', 'pytorch', 'keras', 'scikit-learn',
    'pandas', 'numpy', 'matplotlib', 'seaborn', 'jupyter', 'rstudio', 'spark', 'hadoop',
    
    # Other Technologies
    'git', 'svn', 'mercurial', 'graphql', 'rest api', 'microservices', 'blockchain',
    'ethereum', 'solidity', 'web3', 'ipfs', 'figma', 'sketch', 'adobe xd', 'photoshop'
]

# Soft skills
SOFT_SKILLS = [
    'leadership', 'communication', 'teamwork', 'problem solving', 'critical thinking',
    'project management', 'agile', 'scrum', 'time management', 'mentoring',
    'public speaking', 'negotiation', 'collaboration', 'adaptability', 'creativity'
]

def extract_text_from_pdf(file_content):
    """Extract text from PDF file"""
    try:
        pdf_file = BytesIO(file_content)
        pdf_reader = PyPDF2.PdfReader(pdf_file)
        text = ""
        for page in pdf_reader.pages:
            text += page.extract_text()
        return text
    except Exception as e:
        print(f"Error extracting PDF: {e}")
        return ""

def extract_text_from_docx(file_content):
    """Extract text from DOCX file"""
    try:
        doc_file = BytesIO(file_content)
        doc = docx.Document(doc_file)
        text = ""
        for paragraph in doc.paragraphs:
            text += paragraph.text + "\n"
        return text
    except Exception as e:
        print(f"Error extracting DOCX: {e}")
        return ""

def extract_text_from_url(url):
    """Extract text from URL (for Cloudinary links)"""
    try:
        print(f"🔗 Fetching resume from URL: {url}")
        response = requests.get(url, timeout=30)
        print(f"📊 Response status: {response.status_code}")
        
        if response.status_code == 200:
            # Check content type from headers
            content_type = response.headers.get('content-type', '').lower()
            print(f"📄 Content-Type: {content_type}")
            
            # Try PDF first (check URL extension or content type)
            if (url.lower().endswith('.pdf') or 
                'pdf' in content_type or 
                'application/pdf' in content_type):
                print("📋 Extracting from PDF...")
                return extract_text_from_pdf(response.content)
            
            # Try DOCX (check URL extension or content type)
            elif (url.lower().endswith('.docx') or 
                  'application/vnd.openxmlformats-officedocument.wordprocessingml.document' in content_type):
                print("📋 Extracting from DOCX...")
                return extract_text_from_docx(response.content)
            
            # Try DOC
            elif (url.lower().endswith('.doc') or 
                  'application/msword' in content_type):
                print("📋 Extracting from DOC...")
                return extract_text_from_docx(response.content)
            
            # Default: try to extract as text
            else:
                print("📋 Extracting as plain text...")
                return response.text
                
        else:
            print(f"❌ Failed to fetch URL: HTTP {response.status_code}")
            
    except Exception as e:
        print(f"❌ Error extracting from URL: {e}")
    return ""

def clean_text(text):
    """Clean and normalize text"""
    if not text:
        return ""
    
    # Remove extra whitespace and normalize
    text = re.sub(r'\s+', ' ', text)
    text = text.strip()
    
    # Remove common resume artifacts
    text = re.sub(r'\b(phone|email|address|linkedin|github):\s*[^\n]*', '', text, flags=re.IGNORECASE)
    text = re.sub(r'\b\d{4}\b', '', text)  # Remove years
    text = re.sub(r'\b(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s+\d{4}\b', '', text, flags=re.IGNORECASE)
    
    return text

def extract_skills_with_spacy(text):
    """Extract skills using spaCy NER and pattern matching"""
    if not nlp or not text:
        return []
    
    doc = nlp(text.lower())
    skills = set()
    
    # Extract named entities
    for ent in doc.ents:
        if ent.label_ in ['ORG', 'PRODUCT', 'TECH']:
            skill = ent.text.lower().strip()
            if len(skill) > 2 and skill in TECHNICAL_SKILLS:
                skills.add(skill)
    
    # Pattern matching for technical skills
    for skill in TECHNICAL_SKILLS:
        if skill in text.lower():
            skills.add(skill)
    
    # Extract soft skills
    for skill in SOFT_SKILLS:
        if skill in text.lower():
            skills.add(skill)
    
    return list(skills)

def extract_skills_with_regex(text):
    """Fallback skill extraction using regex patterns"""
    if not text:
        return []
    
    skills = set()
    text_lower = text.lower()
    
    # Technical skills pattern matching
    for skill in TECHNICAL_SKILLS:
        if skill in text_lower:
            skills.add(skill)
    
    # Soft skills pattern matching
    for skill in SOFT_SKILLS:
        if skill in text_lower:
            skills.add(skill)
    
    # Additional patterns for common skills
    skill_patterns = [
        r'\b(?:proficient|experienced|skilled|expert)\s+in\s+([a-zA-Z\s]+?)(?:\s|,|\.|$)',
        r'\b(?:knowledge|experience)\s+(?:of|with|in)\s+([a-zA-Z\s]+?)(?:\s|,|\.|$)',
        r'\b(?:worked\s+with|used|utilized)\s+([a-zA-Z\s]+?)(?:\s|,|\.|$)',
    ]
    
    for pattern in skill_patterns:
        matches = re.findall(pattern, text_lower)
        for match in matches:
            skill = match.strip()
            if len(skill) > 2 and skill in TECHNICAL_SKILLS + SOFT_SKILLS:
                skills.add(skill)
    
    return list(skills)

def calculate_skill_similarity(user_skills, job_requirements):
    """Calculate similarity between user skills and job requirements"""
    if not user_skills or not job_requirements:
        return 0.0
    
    # Convert to lowercase for comparison
    user_skills_lower = [skill.lower() for skill in user_skills]
    job_requirements_lower = [req.lower() for req in job_requirements]
    
    # Calculate intersection
    common_skills = set(user_skills_lower) & set(job_requirements_lower)
    
    if not job_requirements_lower:
        return 0.0
    
    # Calculate match percentage
    match_score = len(common_skills) / len(job_requirements_lower) * 100
    return round(match_score, 2)

@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        'status': 'healthy',
        'service': 'NLP Skill Extraction',
        'spacy_loaded': nlp is not None
    })

@app.route('/extract-skills', methods=['POST'])
def extract_skills():
    """Extract skills from resume text"""
    try:
        data = request.get_json()
        print(f"📥 Received request data: {data}")
        
        if not data:
            print("❌ No data provided")
            return jsonify({'error': 'No data provided'}), 400
        
        text = data.get('text', '')
        resume_url = data.get('resume_url', '')
        
        print(f"📄 Text provided: {len(text) if text else 0} characters")
        print(f"🔗 Resume URL provided: {resume_url}")
        
        # Extract text from URL if provided
        if resume_url and not text:
            print("🔄 Extracting text from resume URL...")
            text = extract_text_from_url(resume_url)
            print(f"📄 Extracted text length: {len(text) if text else 0} characters")
        
        if not text:
            print("❌ No text available after extraction")
            return jsonify({'error': 'No text or resume URL provided'}), 400
        
        # Clean text
        cleaned_text = clean_text(text)
        
        # Extract skills using spaCy if available, otherwise use regex
        if nlp:
            skills = extract_skills_with_spacy(cleaned_text)
        else:
            skills = extract_skills_with_regex(cleaned_text)
        
        # Remove duplicates and sort
        skills = sorted(list(set(skills)))
        
        return jsonify({
            'success': True,
            'skills': skills,
            'skill_count': len(skills),
            'text_length': len(cleaned_text),
            'method': 'spacy' if nlp else 'regex'
        })
        
    except Exception as e:
        return jsonify({
            'error': f'Error extracting skills: {str(e)}'
        }), 500

@app.route('/match-skills', methods=['POST'])
def match_skills():
    """Match user skills with job requirements"""
    try:
        data = request.get_json()
        
        if not data:
            return jsonify({'error': 'No data provided'}), 400
        
        user_skills = data.get('user_skills', [])
        job_requirements = data.get('job_requirements', [])
        
        if not user_skills or not job_requirements:
            return jsonify({'error': 'Both user_skills and job_requirements are required'}), 400
        
        # Calculate match score
        match_score = calculate_skill_similarity(user_skills, job_requirements)
        
        # Find missing skills
        user_skills_lower = [skill.lower() for skill in user_skills]
        job_requirements_lower = [req.lower() for req in job_requirements]
        
        missing_skills = [req for req in job_requirements_lower if req not in user_skills_lower]
        matching_skills = [req for req in job_requirements_lower if req in user_skills_lower]
        
        return jsonify({
            'success': True,
            'match_score': match_score,
            'matching_skills': matching_skills,
            'missing_skills': missing_skills,
            'user_skills_count': len(user_skills),
            'job_requirements_count': len(job_requirements)
        })
        
    except Exception as e:
        return jsonify({
            'error': f'Error matching skills: {str(e)}'
        }), 500

@app.route('/analyze-resume', methods=['POST'])
def analyze_resume():
    """Complete resume analysis with skills extraction"""
    try:
        data = request.get_json()
        
        if not data:
            return jsonify({'error': 'No data provided'}), 400
        
        text = data.get('text', '')
        resume_url = data.get('resume_url', '')
        
        # Extract text from URL if provided
        if resume_url and not text:
            text = extract_text_from_url(resume_url)
        
        if not text:
            return jsonify({'error': 'No text or resume URL provided'}), 400
        
        # Clean text
        cleaned_text = clean_text(text)
        
        # Extract skills
        if nlp:
            skills = extract_skills_with_spacy(cleaned_text)
        else:
            skills = extract_skills_with_regex(cleaned_text)
        
        # Categorize skills
        technical_skills = [skill for skill in skills if skill in TECHNICAL_SKILLS]
        soft_skills = [skill for skill in skills if skill in SOFT_SKILLS]
        
        # Calculate text statistics
        word_count = len(cleaned_text.split())
        char_count = len(cleaned_text)
        
        return jsonify({
            'success': True,
            'skills': {
                'all': skills,
                'technical': technical_skills,
                'soft': soft_skills
            },
            'statistics': {
                'total_skills': len(skills),
                'technical_skills_count': len(technical_skills),
                'soft_skills_count': len(soft_skills),
                'word_count': word_count,
                'character_count': char_count
            },
            'text_length': len(cleaned_text),
            'method': 'spacy' if nlp else 'regex'
        })
        
    except Exception as e:
        return jsonify({
            'error': f'Error analyzing resume: {str(e)}'
        }), 500

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5001))
    debug = os.environ.get('FLASK_ENV') == 'development'
    
    print(f"🚀 Starting NLP Skill Extraction Service on port {port}")
    print(f"📊 spaCy model loaded: {nlp is not None}")
    print(f"🔧 Available endpoints:")
    print(f"   - GET  /health")
    print(f"   - POST /extract-skills")
    print(f"   - POST /match-skills")
    print(f"   - POST /analyze-resume")
    
    app.run(host='0.0.0.0', port=port, debug=debug)
