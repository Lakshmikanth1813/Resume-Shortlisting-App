const cloudinary = require('cloudinary').v2;

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Test Cloudinary connection
const testConnection = async () => {
  try {
    // Check if Cloudinary credentials are configured
    if (!process.env.CLOUDINARY_CLOUD_NAME || 
        !process.env.CLOUDINARY_API_KEY || 
        !process.env.CLOUDINARY_API_SECRET) {
      console.log('⚠️  Cloudinary credentials not configured');
      console.log('   Set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET in your .env file');
      console.log('   Get credentials from: https://cloudinary.com/console');
      return false;
    }
    
    const result = await cloudinary.api.ping();
    console.log('✅ Cloudinary connected successfully');
    return true;
  } catch (error) {
    console.error('❌ Cloudinary connection failed:', error.message);
    console.log('   Please check your Cloudinary credentials in the .env file');
    return false;
  }
};

// Upload helper functions
const uploadResume = async (fileBuffer, userId) => {
  try {
    const result = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        {
          resource_type: 'raw',
          folder: 'skillmatchai/resumes',
          public_id: `resume_${userId}_${Date.now()}`,
          format: 'pdf'
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      ).end(fileBuffer);
    });
    
    return {
      success: true,
      url: result.secure_url,
      publicId: result.public_id
    };
  } catch (error) {
    console.error('Resume upload error:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

const uploadProfileImage = async (fileBuffer, userId) => {
  try {
    const result = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        {
          resource_type: 'image',
          folder: 'skillmatchai/profile-images',
          public_id: `profile_${userId}_${Date.now()}`,
          transformation: [
            { width: 300, height: 300, crop: 'fill', gravity: 'face' }
          ]
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      ).end(fileBuffer);
    });
    
    return {
      success: true,
      url: result.secure_url,
      publicId: result.public_id
    };
  } catch (error) {
    console.error('Profile image upload error:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

const deleteFile = async (publicId, resourceType = 'raw') => {
  try {
    const result = await cloudinary.uploader.destroy(publicId, {
      resource_type: resourceType
    });
    
    return {
      success: result.result === 'ok',
      result: result.result
    };
  } catch (error) {
    console.error('File deletion error:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

module.exports = {
  cloudinary,
  testConnection,
  uploadResume,
  uploadProfileImage,
  deleteFile
};
