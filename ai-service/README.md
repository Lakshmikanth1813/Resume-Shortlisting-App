# AI Service - NLP Skill Extraction

This is the Python Flask microservice that handles Natural Language Processing (NLP) for skill extraction from resumes and job matching.

## Features

- **Skill Extraction**: Extract technical and soft skills from resume text using spaCy NLP
- **Resume Analysis**: Complete resume parsing and analysis
- **Skill Matching**: Match user skills with job requirements
- **File Support**: Handle PDF and DOCX resume files
- **URL Processing**: Extract text from resume URLs (Cloudinary links)
- **Fallback Processing**: Regex-based skill extraction when spaCy is not available

## Tech Stack

- **Flask**: Web framework
- **spaCy**: Natural Language Processing
- **scikit-learn**: Machine learning utilities
- **NLTK**: Natural Language Toolkit
- **PyPDF2**: PDF text extraction
- **python-docx**: DOCX text extraction

## Setup

### 1. Install Python Dependencies

```bash
cd ai-service
pip install -r requirements.txt
```

### 2. Download spaCy Model

```bash
python -m spacy download en_core_web_sm
```

### 3. Run Setup Script (Optional)

```bash
python setup.py
```

## Running the Service

### Development Mode

```bash
python app.py
```

### Production Mode

```bash
gunicorn -w 4 -b 0.0.0.0:5001 app:app
```

The service will be available at: `http://localhost:5001`

## API Endpoints

### Health Check
```
GET /health
```
Returns service status and spaCy model availability.

### Extract Skills
```
POST /extract-skills
Content-Type: application/json

{
  "text": "resume text content",
  "resume_url": "optional_url_to_resume_file"
}
```

### Match Skills
```
POST /match-skills
Content-Type: application/json

{
  "user_skills": ["python", "react", "mongodb"],
  "job_requirements": ["python", "javascript", "react", "node.js"]
}
```

### Analyze Resume
```
POST /analyze-resume
Content-Type: application/json

{
  "text": "complete resume text",
  "resume_url": "optional_url_to_resume_file"
}
```

## Testing

Run the test script to verify all endpoints:

```bash
python test_service.py
```

## Environment Variables

Create a `.env` file:

```env
PORT=5001
FLASK_ENV=development
AI_SERVICE_URL=http://localhost:5001
```

## Supported Skills

### Technical Skills
- Programming Languages: Python, JavaScript, Java, C++, etc.
- Web Technologies: React, Angular, Vue, Node.js, Django, etc.
- Databases: MySQL, PostgreSQL, MongoDB, Redis, etc.
- Cloud & DevOps: AWS, Azure, Docker, Kubernetes, etc.
- Mobile: React Native, Flutter, Android, iOS
- Data Science: Machine Learning, TensorFlow, PyTorch, etc.

### Soft Skills
- Leadership, Communication, Teamwork
- Problem Solving, Critical Thinking
- Project Management, Agile, Scrum
- Time Management, Mentoring, etc.

## Integration with Main App

The Node.js backend can call this service using:

```javascript
const response = await axios.post('http://localhost:5001/extract-skills', {
  text: resumeText,
  resume_url: cloudinaryUrl
});

const skills = response.data.skills;
```

## Deployment

### Local Development
- Run `python app.py` for development
- Service runs on port 5001

### Production
- Use Gunicorn for production deployment
- Deploy to Render, Railway, or Heroku
- Set environment variables for production

## Troubleshooting

### spaCy Model Not Found
```bash
python -m spacy download en_core_web_sm
```

### NLTK Data Missing
```bash
python -c "import nltk; nltk.download('punkt'); nltk.download('stopwords')"
```

### Port Already in Use
Change the PORT in `.env` file or kill the process using port 5001.

## Performance Notes

- spaCy provides better accuracy but requires more memory
- Regex fallback is faster but less accurate
- File processing adds latency for large files
- Consider caching for frequently accessed resumes
