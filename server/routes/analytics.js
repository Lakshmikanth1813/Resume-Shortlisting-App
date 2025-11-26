const express = require('express');
const User = require('../models/User');
const Job = require('../models/Job');
const Match = require('../models/Match');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// @desc    Get dashboard analytics
// @route   GET /api/analytics/dashboard
// @access  Private
router.get('/dashboard', protect, async (req, res) => {
  try {
    const userId = req.user.id;

    // Get user's job matches
    const userMatches = await Match.find({ userId })
      .populate('jobId', 'title company location salaryRange createdAt')
      .sort({ matchScore: -1 })
      .limit(10);

    // Get user's skills
    const user = await User.findById(userId);
    const userSkills = user.skills || [];

    // Get total jobs in system
    const totalJobs = await Job.countDocuments({ isActive: true });
    
    // Get match statistics
    const totalMatches = await Match.countDocuments({ userId });
    const highMatches = await Match.countDocuments({ 
      userId, 
      recommendation: 'high' 
    });
    const appliedJobs = await Match.countDocuments({ 
      userId, 
      isApplied: true 
    });

    // Calculate average match score
    const avgMatchScore = await Match.aggregate([
      { $match: { userId: userId } },
      { $group: { _id: null, avgScore: { $avg: '$matchScore' } } }
    ]);

    res.json({
      status: 'success',
      data: {
        user: {
          name: user.name,
          skills: userSkills,
          skillsCount: userSkills.length
        },
        stats: {
          totalJobs,
          totalMatches,
          highMatches,
          appliedJobs,
          avgMatchScore: avgMatchScore[0]?.avgScore || 0
        },
        recentMatches: userMatches
      }
    });
  } catch (error) {
    console.error('Get dashboard analytics error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error getting dashboard analytics'
    });
  }
});

// @desc    Get platform analytics (Admin only)
// @route   GET /api/analytics/platform
// @access  Private/Admin
router.get('/platform', protect, authorize('admin'), async (req, res) => {
  try {
    // User statistics
    const totalUsers = await User.countDocuments({ isActive: true });
    const newUsersThisMonth = await User.countDocuments({
      isActive: true,
      createdAt: { $gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1) }
    });
    const usersWithResumes = await User.countDocuments({
      isActive: true,
      resumeURL: { $exists: true, $ne: null }
    });

    // Job statistics
    const totalJobs = await Job.countDocuments({ isActive: true });
    const newJobsThisMonth = await Job.countDocuments({
      isActive: true,
      createdAt: { $gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1) }
    });
    const totalApplications = await Match.countDocuments({ isApplied: true });

    // Match statistics
    const totalMatches = await Match.countDocuments();
    const avgMatchScore = await Match.aggregate([
      { $group: { _id: null, avgScore: { $avg: '$matchScore' } } }
    ]);

    // Top skills in demand
    const topSkills = await Job.aggregate([
      { $match: { isActive: true } },
      { $unwind: '$requiredSkills' },
      { $group: { _id: '$requiredSkills', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ]);

    // User growth over time (last 6 months)
    const userGrowth = await User.aggregate([
      {
        $match: {
          isActive: true,
          createdAt: { $gte: new Date(Date.now() - 6 * 30 * 24 * 60 * 60 * 1000) }
        }
      },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' }
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } }
    ]);

    // Job growth over time (last 6 months)
    const jobGrowth = await Job.aggregate([
      {
        $match: {
          isActive: true,
          createdAt: { $gte: new Date(Date.now() - 6 * 30 * 24 * 60 * 60 * 1000) }
        }
      },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' }
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } }
    ]);

    res.json({
      status: 'success',
      data: {
        users: {
          total: totalUsers,
          newThisMonth: newUsersThisMonth,
          withResumes: usersWithResumes,
          withoutResumes: totalUsers - usersWithResumes
        },
        jobs: {
          total: totalJobs,
          newThisMonth: newJobsThisMonth,
          totalApplications
        },
        matches: {
          total: totalMatches,
          avgScore: avgMatchScore[0]?.avgScore || 0
        },
        topSkills,
        growth: {
          users: userGrowth,
          jobs: jobGrowth
        }
      }
    });
  } catch (error) {
    console.error('Get platform analytics error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error getting platform analytics'
    });
  }
});

// @desc    Get skill analytics
// @route   GET /api/analytics/skills
// @access  Private
router.get('/skills', protect, async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId);
    const userSkills = user.skills || [];

    if (userSkills.length === 0) {
      return res.json({
        status: 'success',
        data: {
          currentSkills: [],
          skillGaps: [],
          recommendations: [],
          message: 'No skills found. Upload a resume to get skill analysis.'
        }
      });
    }

    // Get all job skills
    const allJobSkills = await Job.aggregate([
      { $match: { isActive: true } },
      { $unwind: '$requiredSkills' },
      { $group: { _id: '$requiredSkills', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    // Find skill gaps
    const skillGaps = allJobSkills
      .filter(jobSkill => !userSkills.some(userSkill => 
        userSkill.toLowerCase().includes(jobSkill._id.toLowerCase())
      ))
      .slice(0, 10)
      .map(skill => ({
        skill: skill._id,
        demand: skill.count,
        importance: Math.min(5, Math.ceil(skill.count / 10))
      }));

    // Generate recommendations
    const recommendations = skillGaps.slice(0, 5).map(gap => ({
      skill: gap.skill,
      demand: gap.demand > 20 ? 'High' : gap.demand > 10 ? 'Medium' : 'Low',
      difficulty: ['Easy', 'Medium', 'Hard'][Math.floor(Math.random() * 3)],
      learningTime: ['1-2 weeks', '1 month', '2-3 months'][Math.floor(Math.random() * 3)],
      resources: [
        { name: `${gap.skill} Documentation`, type: 'Documentation' },
        { name: `${gap.skill} Course`, type: 'Course' }
      ]
    }));

    res.json({
      status: 'success',
      data: {
        currentSkills: userSkills,
        skillGaps,
        recommendations,
        totalSkillsInMarket: allJobSkills.length,
        userSkillCoverage: Math.round((userSkills.length / allJobSkills.length) * 100)
      }
    });
  } catch (error) {
    console.error('Get skill analytics error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error getting skill analytics'
    });
  }
});

module.exports = router;
