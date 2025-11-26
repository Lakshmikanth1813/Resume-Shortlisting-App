const express = require('express');
const Job = require('../models/Job');
const Match = require('../models/Match');
const { protect, authorize, optionalAuth } = require('../middleware/auth');
const { validateJob } = require('../middleware/validation');

const router = express.Router();

// @desc    Get all jobs
// @route   GET /api/jobs
// @access  Public
router.get('/', optionalAuth, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Build filter object
    const filter = { isActive: true };

    // Search by title, company, or description
    if (req.query.search) {
      filter.$text = { $search: req.query.search };
    }

    // Filter by skills
    if (req.query.skills) {
      const skills = req.query.skills.split(',').map(skill => skill.trim());
      filter.requiredSkills = { $in: skills };
    }

    // Filter by location
    if (req.query.location) {
      filter.location = { $regex: req.query.location, $options: 'i' };
    }

    // Filter by employment type
    if (req.query.employmentType) {
      filter.employmentType = req.query.employmentType;
    }

    // Filter by experience level
    if (req.query.experienceLevel) {
      filter.experienceLevel = req.query.experienceLevel;
    }

    // Filter by remote work
    if (req.query.remoteWork) {
      filter.remoteWork = req.query.remoteWork;
    }

    // Filter by salary range
    if (req.query.minSalary) {
      filter['salaryRange.max'] = { $gte: parseInt(req.query.minSalary) };
    }

    if (req.query.maxSalary) {
      filter['salaryRange.min'] = { $lte: parseInt(req.query.maxSalary) };
    }

    const jobs = await Job.find(filter)
      .populate('postedBy', 'name email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Job.countDocuments(filter);

    res.json({
      status: 'success',
      count: jobs.length,
      total,
      page,
      pages: Math.ceil(total / limit),
      data: jobs
    });
  } catch (error) {
    console.error('Get jobs error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error getting jobs'
    });
  }
});

// @desc    Get job by ID
// @route   GET /api/jobs/:id
// @access  Public
router.get('/:id', optionalAuth, async (req, res) => {
  try {
    const job = await Job.findById(req.params.id)
      .populate('postedBy', 'name email companyInfo');

    if (!job || !job.isActive) {
      return res.status(404).json({
        status: 'error',
        message: 'Job not found'
      });
    }

    // Increment view count
    job.viewCount += 1;
    await job.save();

    res.json({
      status: 'success',
      data: job
    });
  } catch (error) {
    console.error('Get job error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error getting job'
    });
  }
});

// @desc    Create new job
// @route   POST /api/jobs
// @access  Private/Admin
router.post('/', protect, authorize('admin'), validateJob, async (req, res) => {
  try {
    const jobData = {
      ...req.body,
      postedBy: req.user.id
    };

    const job = await Job.create(jobData);

    res.status(201).json({
      status: 'success',
      message: 'Job created successfully',
      data: job
    });
  } catch (error) {
    console.error('Create job error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error creating job'
    });
  }
});

// @desc    Update job
// @route   PUT /api/jobs/:id
// @access  Private/Admin
router.put('/:id', protect, authorize('admin'), async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({
        status: 'error',
        message: 'Job not found'
      });
    }

    const updatedJob = await Job.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('postedBy', 'name email');

    res.json({
      status: 'success',
      message: 'Job updated successfully',
      data: updatedJob
    });
  } catch (error) {
    console.error('Update job error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error updating job'
    });
  }
});

// @desc    Delete job
// @route   DELETE /api/jobs/:id
// @access  Private/Admin
router.delete('/:id', protect, authorize('admin'), async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({
        status: 'error',
        message: 'Job not found'
      });
    }

    // Soft delete - deactivate job
    job.isActive = false;
    await job.save();

    res.json({
      status: 'success',
      message: 'Job deleted successfully'
    });
  } catch (error) {
    console.error('Delete job error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error deleting job'
    });
  }
});

// @desc    Get job matches for user
// @route   GET /api/jobs/matches/user
// @access  Private
router.get('/matches/user', protect, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const matches = await Match.find({ userId: req.user.id })
      .populate('jobId')
      .sort({ matchScore: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Match.countDocuments({ userId: req.user.id });

    res.json({
      status: 'success',
      count: matches.length,
      total,
      page,
      pages: Math.ceil(total / limit),
      data: matches
    });
  } catch (error) {
    console.error('Get job matches error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error getting job matches'
    });
  }
});

// @desc    Apply to job
// @route   POST /api/jobs/:id/apply
// @access  Private
router.post('/:id/apply', protect, async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job || !job.isActive) {
      return res.status(404).json({
        status: 'error',
        message: 'Job not found'
      });
    }

    // Check if user already applied
    const existingMatch = await Match.findOne({
      userId: req.user.id,
      jobId: req.params.id
    });

    if (existingMatch && existingMatch.isApplied) {
      return res.status(400).json({
        status: 'error',
        message: 'You have already applied to this job'
      });
    }

    // Update or create match record
    if (existingMatch) {
      existingMatch.isApplied = true;
      existingMatch.appliedAt = new Date();
      await existingMatch.save();
    } else {
      await Match.create({
        userId: req.user.id,
        jobId: req.params.id,
        matchScore: 0, // Will be calculated by AI service
        matchedSkills: [],
        missingSkills: [],
        recommendation: 'low',
        isApplied: true,
        appliedAt: new Date()
      });
    }

    // Increment application count
    job.applicationCount += 1;
    await job.save();

    res.json({
      status: 'success',
      message: 'Application submitted successfully'
    });
  } catch (error) {
    console.error('Apply to job error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error applying to job'
    });
  }
});

// @desc    Get job statistics
// @route   GET /api/jobs/stats/overview
// @access  Private/Admin
router.get('/stats/overview', protect, authorize('admin'), async (req, res) => {
  try {
    const totalJobs = await Job.countDocuments({ isActive: true });
    const newJobsThisMonth = await Job.countDocuments({
      isActive: true,
      createdAt: { $gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1) }
    });
    const totalApplications = await Match.countDocuments({ isApplied: true });
    const totalMatches = await Match.countDocuments();

    // Get top skills
    const skillStats = await Job.aggregate([
      { $match: { isActive: true } },
      { $unwind: '$requiredSkills' },
      { $group: { _id: '$requiredSkills', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ]);

    res.json({
      status: 'success',
      data: {
        totalJobs,
        newJobsThisMonth,
        totalApplications,
        totalMatches,
        topSkills: skillStats
      }
    });
  } catch (error) {
    console.error('Get job stats error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error getting job statistics'
    });
  }
});

module.exports = router;
