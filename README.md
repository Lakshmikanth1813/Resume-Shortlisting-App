# 🚀 SkillMatchAI - AI-Powered Job Recommendation Platform

A comprehensive MERN stack application with AI-powered skill extraction and job matching capabilities.

## 🌟 Features

### Core Features
- **🔐 User Authentication** - JWT-based secure login/registration
- **📄 Resume Upload** - Drag & drop PDF/DOCX upload with Cloudinary storage
- **🤖 AI Skill Extraction** - Python NLP service extracts skills from resumes
- **🎯 Job Matching** - AI-powered job recommendations based on skills
- **📊 Skill Analysis** - Gap analysis and personalized recommendations
- **👑 Admin Panel** - User and job management
- **📱 Responsive Design** - Modern UI with Tailwind CSS

### Technical Features
- **🔒 Security** - Helmet, CORS, rate limiting, input validation
- **☁️ Cloud Storage** - Cloudinary integration for file uploads
- **🧠 NLP Processing** - spaCy-based skill extraction
- **📈 Analytics** - User engagement and job match statistics
- **🔄 Real-time Updates** - Live skill management and job matching

## 🏗️ Architecture

```
SkillMatchAI/
├── client/          # React Frontend
├── server/          # Node.js/Express Backend
├── ai-service/      # Python Flask AI Service
└── docs/           # Documentation
```

### Tech Stack

**Frontend:**
- React 18 + Vite
- Tailwind CSS
- React Router
- Axios
- React Dropzone
- React Hot Toast

**Backend:**
- Node.js + Express.js
- MongoDB + Mongoose
- JWT Authentication
- Cloudinary Integration
- Helmet Security

**AI Service:**
- Python Flask
- spaCy NLP
- scikit-learn
- NLTK
- PyPDF2

## 🚀 Quick Start

### Prerequisites
- Node.js (v16+)
- Python (v3.8+)
- MongoDB
- Git

### 1. Clone & Install

```bash
git clone <repository-url>
cd SkillMatchAI

# Install frontend dependencies
cd client
npm install

# Install backend dependencies
cd ../server
npm install

# Install AI service dependencies
cd ../ai-service
pip install -r requirements.txt
python -m spacy download en_core_web_sm
```

### 2. Environment Setup

**Backend (.env in server/):**
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/skillmatchai
JWT_SECRET=your_super_secret_jwt_key_here
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
AI_SERVICE_URL=http://localhost:5001
CLIENT_URL=http://localhost:3000
```

**AI Service (.env in ai-service/):**
```env
PORT=5001
FLASK_ENV=development
AI_SERVICE_URL=http://localhost:5001
```

### 3. Start All Services

**Option 1: Use startup scripts**
```bash
# Windows
start-all-services.bat

# PowerShell
.\start-all-services.ps1
```

**Option 2: Manual start**
```bash
# Terminal 1: Backend
cd server && npm run dev

# Terminal 2: Frontend
cd client && npm start

# Terminal 3: AI Service
cd ai-service && python app.py
```

### 4. Access the Application

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000/api
- **AI Service**: http://localhost:5001

## 📋 Default Accounts

### Admin Account
- **Email**: admin@skillmatchai.com
- **Password**: admin123

### Regular User
- **Email**: user@skillmatchai.com
- **Password**: user123

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/verify` - Verify token

### Users
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile
- `GET /api/users` - Get all users (admin)

### Jobs
- `GET /api/jobs` - Get all jobs
- `POST /api/jobs` - Create job (admin)
- `PUT /api/jobs/:id` - Update job (admin)
- `DELETE /api/jobs/:id` - Delete job (admin)

### Upload
- `POST /api/upload/resume` - Upload resume
- `POST /api/upload/profile-image` - Upload profile image
- `DELETE /api/upload/resume` - Delete resume
- `DELETE /api/upload/profile-image` - Delete profile image

### AI Service
- `POST /api/ai/extract-skills` - Extract skills from resume
- `POST /api/ai/generate-matches` - Generate job matches
- `GET /api/ai/skill-recommendations` - Get skill recommendations

## 🛠️ Development

### Database Management
```bash
# Seed initial data
cd server && npm run seed

# Add more sample data
npm run add-data

# Create custom data
npm run create-data

# View database stats
npm run view-users

# Browse database
npm run browse-db
```

### Testing
```bash
# Test AI service
cd ai-service && python test_service.py

# Test backend endpoints
cd server && npm test
```

## 📊 Database Schema

### Users
```javascript
{
  name: String,
  email: String (unique),
  password: String (hashed),
  role: String (user/admin),
  skills: [String],
  resumeURL: String,
  profileImage: String,
  preferences: {
    jobTypes: [String],
    locations: [String],
    salaryRange: { min: Number, max: Number },
    notifications: Object
  }
}
```

### Jobs
```javascript
{
  title: String,
  company: String,
  description: String,
  requiredSkills: [String],
  location: String,
  salaryRange: String,
  isActive: Boolean
}
```

### Matches
```javascript
{
  userId: ObjectId,
  jobId: ObjectId,
  matchScore: Number,
  matchedSkills: [String],
  missingSkills: [String],
  recommendation: String
}
```

## 🚀 Deployment

### Frontend (Vercel/Netlify)
```bash
cd client
npm run build
# Deploy dist/ folder
```

### Backend (Render/Railway)
```bash
cd server
# Set environment variables
# Deploy with Node.js buildpack
```

### AI Service (Render/PythonAnywhere)
```bash
cd ai-service
# Set environment variables
# Deploy with Python buildpack
```

### Database (MongoDB Atlas)
- Create cluster on MongoDB Atlas
- Update MONGODB_URI in production environment

## 🔒 Security Features

- **JWT Authentication** - Secure token-based auth
- **Password Hashing** - bcrypt with salt rounds
- **Input Validation** - express-validator middleware
- **Rate Limiting** - Prevent abuse
- **CORS Protection** - Configured origins
- **Helmet Security** - Security headers
- **File Validation** - Type and size checks

## 📈 Performance Optimizations

- **Database Indexing** - Optimized queries
- **File Compression** - Efficient uploads
- **Caching** - Reduced API calls
- **Lazy Loading** - Faster page loads
- **Code Splitting** - Smaller bundles

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- spaCy for NLP capabilities
- Cloudinary for file storage
- MongoDB for database
- React team for the amazing framework
- Express.js for the robust backend

## 📞 Support

For support, email support@skillmatchai.com or create an issue on GitHub.

---

**Built with ❤️ by the SkillMatchAI Team**