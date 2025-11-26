# Cloudinary Setup Guide

This guide will help you set up Cloudinary for resume uploads in the SkillMatchAI platform.

## 1. Create a Cloudinary Account

1. Go to [Cloudinary.com](https://cloudinary.com)
2. Sign up for a free account
3. Verify your email address

## 2. Get Your Cloudinary Credentials

1. After logging in, go to your [Dashboard](https://cloudinary.com/console)
2. Copy the following credentials from your dashboard:
   - **Cloud Name**
   - **API Key** 
   - **API Secret**

## 3. Update Environment Variables

Add these credentials to your `.env` file in the `server` directory:

```env
# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your_cloud_name_here
CLOUDINARY_API_KEY=your_api_key_here
CLOUDINARY_API_SECRET=your_api_secret_here
```

## 4. Free Tier Limits

Cloudinary's free tier includes:
- **25 GB storage**
- **25 GB bandwidth per month**
- **25,000 transformations per month**
- **1,000 API requests per month**

This is more than enough for development and testing!

## 5. File Upload Features

### Supported File Types
- **Resumes**: PDF, DOC, DOCX (up to 5MB)
- **Profile Images**: JPG, PNG, GIF, WebP (up to 5MB)

### Upload Endpoints
- `POST /api/upload/resume` - Upload resume files
- `POST /api/upload/profile-image` - Upload profile images
- `DELETE /api/upload/resume` - Delete resume
- `DELETE /api/upload/profile-image` - Delete profile image

### File Organization
Files are organized in Cloudinary as:
```
skillmatchai/
├── resumes/
│   └── resume_[userId]_[timestamp]
└── profile-images/
    └── profile_[userId]_[timestamp]
```

## 6. Testing the Integration

### Test Resume Upload
```bash
curl -X POST http://localhost:5000/api/upload/resume \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -F "resume=@/path/to/your/resume.pdf"
```

### Test Profile Image Upload
```bash
curl -X POST http://localhost:5000/api/upload/profile-image \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -F "image=@/path/to/your/image.jpg"
```

## 7. Frontend Integration

The frontend automatically handles:
- ✅ **Drag & drop file uploads**
- ✅ **File type validation**
- ✅ **File size validation (5MB limit)**
- ✅ **Upload progress indication**
- ✅ **Error handling**
- ✅ **Automatic skill extraction after upload**

## 8. Security Features

- ✅ **JWT authentication required**
- ✅ **File type validation**
- ✅ **File size limits**
- ✅ **User-specific file organization**
- ✅ **Automatic cleanup on deletion**

## 9. Troubleshooting

### Common Issues

**"Cloudinary connection failed"**
- Check your credentials in `.env` file
- Ensure you're using the correct cloud name, API key, and API secret

**"File upload failed"**
- Check file size (must be under 5MB)
- Verify file type is supported (PDF, DOC, DOCX for resumes)
- Ensure user is authenticated

**"AI service not extracting skills"**
- Make sure the AI service is running on port 5001
- Check the `AI_SERVICE_URL` in your `.env` file

### Debug Mode

Enable debug logging by setting:
```env
NODE_ENV=development
```

## 10. Production Deployment

For production deployment:

1. **Upgrade Cloudinary Plan** if needed
2. **Set up CDN** for faster file delivery
3. **Configure backup strategies**
4. **Monitor usage** in Cloudinary dashboard

## 11. Cost Optimization

- **Compress images** before upload
- **Use appropriate file formats**
- **Implement file cleanup** for old uploads
- **Monitor bandwidth usage**

## 12. API Documentation

### Upload Resume
```javascript
POST /api/upload/resume
Content-Type: multipart/form-data
Authorization: Bearer <jwt_token>

Form Data:
- resume: File (PDF, DOC, DOCX, max 5MB)

Response:
{
  "status": "success",
  "message": "Resume uploaded successfully",
  "data": {
    "url": "https://res.cloudinary.com/...",
    "publicId": "skillmatchai/resumes/resume_123_456789"
  }
}
```

### Upload Profile Image
```javascript
POST /api/upload/profile-image
Content-Type: multipart/form-data
Authorization: Bearer <jwt_token>

Form Data:
- image: File (JPG, PNG, GIF, WebP, max 5MB)

Response:
{
  "status": "success",
  "message": "Profile image uploaded successfully",
  "data": {
    "url": "https://res.cloudinary.com/...",
    "publicId": "skillmatchai/profile-images/profile_123_456789"
  }
}
```

## 13. Next Steps

After setting up Cloudinary:

1. ✅ **Test file uploads** from the frontend
2. ✅ **Verify AI skill extraction** works
3. ✅ **Test file deletion** functionality
4. ✅ **Check file organization** in Cloudinary dashboard
5. ✅ **Monitor usage** and performance

Your SkillMatchAI platform now has full file upload capabilities! 🚀
