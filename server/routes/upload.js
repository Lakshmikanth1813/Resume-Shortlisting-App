const express = require('express');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const { protect } = require('../middleware/auth');
const User = require('../models/User');

const router = express.Router();

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Configure multer for memory storage
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    // Check file type
    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];
    
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Only PDF, DOC, and DOCX files are allowed'), false);
    }
  }
});

// @desc    Upload resume
// @route   POST /api/upload/resume
// @access  Private
router.post('/resume', protect, upload.single('resume'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        status: 'error',
        message: 'No file uploaded'
      });
    }

    // Upload to Cloudinary
    const result = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        {
          resource_type: 'raw',
          folder: 'skillmatchai/resumes',
          public_id: `resume_${req.user.id}_${Date.now()}`,
          format: 'pdf'
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      ).end(req.file.buffer);
    });

    // Update user's resume URL
    await User.findByIdAndUpdate(req.user.id, {
      resumeURL: result.secure_url
    });

    res.json({
      status: 'success',
      message: 'Resume uploaded successfully',
      data: {
        url: result.secure_url,
        publicId: result.public_id
      }
    });
  } catch (error) {
    console.error('Resume upload error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error uploading resume'
    });
  }
});

// @desc    Upload profile image
// @route   POST /api/upload/profile-image
// @access  Private
router.post('/profile-image', protect, upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        status: 'error',
        message: 'No image uploaded'
      });
    }

    // Check if file is an image
    if (!req.file.mimetype.startsWith('image/')) {
      return res.status(400).json({
        status: 'error',
        message: 'Only image files are allowed'
      });
    }

    // Upload to Cloudinary
    const result = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        {
          resource_type: 'image',
          folder: 'skillmatchai/profile-images',
          public_id: `profile_${req.user.id}_${Date.now()}`,
          transformation: [
            { width: 300, height: 300, crop: 'fill', gravity: 'face' }
          ]
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      ).end(req.file.buffer);
    });

    // Update user's profile image
    await User.findByIdAndUpdate(req.user.id, {
      profileImage: result.secure_url
    });

    res.json({
      status: 'success',
      message: 'Profile image uploaded successfully',
      data: {
        url: result.secure_url,
        publicId: result.public_id
      }
    });
  } catch (error) {
    console.error('Profile image upload error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error uploading profile image'
    });
  }
});

// @desc    Delete resume
// @route   DELETE /api/upload/resume
// @access  Private
router.delete('/resume', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user.resumeURL) {
      return res.status(404).json({
        status: 'error',
        message: 'No resume found'
      });
    }

    // Extract public ID from URL
    const publicId = user.resumeURL.split('/').pop().split('.')[0];

    // Delete from Cloudinary
    await cloudinary.uploader.destroy(`skillmatchai/resumes/${publicId}`, {
      resource_type: 'raw'
    });

    // Update user's resume URL
    await User.findByIdAndUpdate(req.user.id, {
      resumeURL: null
    });

    res.json({
      status: 'success',
      message: 'Resume deleted successfully'
    });
  } catch (error) {
    console.error('Resume delete error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error deleting resume'
    });
  }
});

// @desc    Delete profile image
// @route   DELETE /api/upload/profile-image
// @access  Private
router.delete('/profile-image', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user.profileImage) {
      return res.status(404).json({
        status: 'error',
        message: 'No profile image found'
      });
    }

    // Extract public ID from URL
    const publicId = user.profileImage.split('/').pop().split('.')[0];

    // Delete from Cloudinary
    await cloudinary.uploader.destroy(`skillmatchai/profile-images/${publicId}`, {
      resource_type: 'image'
    });

    // Update user's profile image
    await User.findByIdAndUpdate(req.user.id, {
      profileImage: null
    });

    res.json({
      status: 'success',
      message: 'Profile image deleted successfully'
    });
  } catch (error) {
    console.error('Profile image delete error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error deleting profile image'
    });
  }
});

module.exports = router;
