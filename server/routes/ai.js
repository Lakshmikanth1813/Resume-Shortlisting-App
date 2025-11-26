const express = require('express');
const axios = require('axios');
const { protect } = require('../middleware/auth');
const User = require('../models/User');
const Job = require('../models/Job');
const Match = require('../models/Match');

const router = express.Router();

// @desc    Extract skills from resume
// @route   POST /api/ai/extract-skills
// @access  Private
router.post('/extract-skills', protect, async (req, res) => {
  try {
    const { resumeUrl, text, saveToProfile = true } = req.body;

    if (!resumeUrl && !text) {
      return res.status(400).json({
        status: 'error',
        message: 'Either resume URL or text is required'
      });
    }

    // Call AI service to extract skills
    try {
      console.log('🤖 Calling AI service for skill extraction...');
      console.log('📄 Resume URL:', resumeUrl);
      console.log('📝 Text provided:', text ? `${text.length} characters` : 'None');
      console.log('🔗 AI Service URL:', process.env.AI_SERVICE_URL);
      
      const aiResponse = await axios.post(`${process.env.AI_SERVICE_URL}/extract-skills`, {
        resume_url: resumeUrl || null,
        text: text || null
      }, {
        timeout: 30000 // 30 second timeout
      });

      console.log('✅ AI service response:', aiResponse.data);
      const extractedSkills = aiResponse.data.skills || [];

      // Update user's skills only if saveToProfile is true
      if (saveToProfile) {
        await User.findByIdAndUpdate(req.user.id, {
          skills: extractedSkills
        });
      }

      res.json({
        status: 'success',
        message: 'Skills extracted successfully',
        data: {
          skills: extractedSkills,
          count: extractedSkills.length,
          method: aiResponse.data.method || 'ai-service'
        }
      });
    } catch (aiError) {
      console.error('❌ AI service error:', aiError.message);
      console.error('❌ AI service response:', aiError.response?.data);
      console.error('❌ AI service status:', aiError.response?.status);
      
      // NO FALLBACK - Return error instead of mock skills
      res.status(500).json({
        status: 'error',
        message: `AI service error: ${aiError.message}`,
        debug: {
          aiServiceUrl: process.env.AI_SERVICE_URL,
          errorType: aiError.code || 'unknown',
          errorMessage: aiError.message
        }
      });
    }
  } catch (error) {
    console.error('Extract skills error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error extracting skills'
    });
  }
});

// @desc    Quick job match with manual skills
// @route   POST /api/ai/quick-match
// @access  Private
router.post('/quick-match', protect, async (req, res) => {
  try {
    const { skills } = req.body;

    if (!skills || skills.length === 0) {
      return res.status(400).json({
        status: 'error',
        message: 'Skills array is required'
      });
    }

    // Get all active jobs
    const jobs = await Job.find({ isActive: true });

    if (jobs.length === 0) {
      return res.status(404).json({
        status: 'error',
        message: 'No jobs found'
      });
    }

    try {
      // Call AI service to generate matches
      const aiResponse = await axios.post(`${process.env.AI_SERVICE_URL}/match-skills`, {
        user_skills: skills,
        job_requirements: jobs.map(job => job.requiredSkills).flat()
      });

      const matches = [];
      
      // Generate matches for each job
      for (const job of jobs) {
        const matchedSkills = job.requiredSkills.filter(skill => 
          skills.some(userSkill => 
            userSkill.toLowerCase().includes(skill.toLowerCase()) ||
            skill.toLowerCase().includes(userSkill.toLowerCase())
          )
        );
        
        const missingSkills = job.requiredSkills.filter(skill => 
          !matchedSkills.includes(skill)
        );
        
        const matchScore = Math.round((matchedSkills.length / job.requiredSkills.length) * 100);
        
        // Only include jobs with at least some match
        if (matchScore > 0) {
          matches.push({
            id: job._id,
            title: job.title,
            company: job.company,
            location: job.location,
            salary: job.salaryRange,
            matchScore,
            matchedSkills,
            missingSkills,
            description: job.description
          });
        }
      }

      // Sort by match score
      matches.sort((a, b) => b.matchScore - a.matchScore);

      // Calculate statistics
      const totalMatches = matches.length;
      const avgMatchScore = totalMatches > 0 
        ? Math.round(matches.reduce((sum, match) => sum + match.matchScore, 0) / totalMatches)
        : 0;
      const highMatches = matches.filter(match => match.matchScore >= 80).length;

      res.json({
        status: 'success',
        message: 'Job matches generated successfully',
        data: {
          matches: matches.slice(0, 20), // Limit to top 20 matches
          totalMatches,
          avgMatchScore,
          highMatches,
          userSkills: skills
        }
      });

    } catch (aiError) {
      console.error('AI service error:', aiError.message);
      
      // Fallback: generate basic matches
      const matches = [];
      
      for (const job of jobs) {
        const matchedSkills = job.requiredSkills.filter(skill => 
          skills.some(userSkill => 
            userSkill.toLowerCase().includes(skill.toLowerCase()) ||
            skill.toLowerCase().includes(userSkill.toLowerCase())
          )
        );
        
        const missingSkills = job.requiredSkills.filter(skill => 
          !matchedSkills.includes(skill)
        );
        
        const matchScore = Math.round((matchedSkills.length / job.requiredSkills.length) * 100);
        
        if (matchScore > 0) {
          matches.push({
            id: job._id,
            title: job.title,
            company: job.company,
            location: job.location,
            salary: job.salaryRange,
            matchScore,
            matchedSkills,
            missingSkills,
            description: job.description
          });
        }
      }

      matches.sort((a, b) => b.matchScore - a.matchScore);

      const totalMatches = matches.length;
      const avgMatchScore = totalMatches > 0 
        ? Math.round(matches.reduce((sum, match) => sum + match.matchScore, 0) / totalMatches)
        : 0;
      const highMatches = matches.filter(match => match.matchScore >= 80).length;
      
      res.json({
        status: 'success',
        message: 'Job matches generated successfully (demo mode)',
        data: {
          matches: matches.slice(0, 20),
          totalMatches,
          avgMatchScore,
          highMatches,
          userSkills: skills
        }
      });
    }

  } catch (error) {
    console.error('Quick match error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error generating quick matches'
    });
  }
});

// @desc    Generate job matches for user
// @route   POST /api/ai/generate-matches
// @access  Private
router.post('/generate-matches', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    
    if (!user.skills || user.skills.length === 0) {
      return res.status(400).json({
        status: 'error',
        message: 'No skills found. Please upload a resume first.'
      });
    }

    // Get all active jobs
    const jobs = await Job.find({ isActive: true });

    if (jobs.length === 0) {
      return res.status(404).json({
        status: 'error',
        message: 'No jobs found'
      });
    }

    try {
      // Call AI service to generate matches
      const aiResponse = await axios.post(`${process.env.AI_SERVICE_URL}/generate-matches`, {
        user_skills: user.skills,
        jobs: jobs.map(job => ({
          id: job._id,
          title: job.title,
          company: job.company,
          required_skills: job.requiredSkills,
          description: job.description
        }))
      });

      const matches = aiResponse.data.matches || [];

      // Save matches to database
      for (const match of matches) {
        await Match.findOneAndUpdate(
          { userId: req.user.id, jobId: match.job_id },
          {
            userId: req.user.id,
            jobId: match.job_id,
            matchScore: match.score,
            matchedSkills: match.matched_skills,
            missingSkills: match.missing_skills,
            skillBreakdown: match.skill_breakdown,
            recommendation: match.recommendation
          },
          { upsert: true, new: true }
        );
      }

      res.json({
        status: 'success',
        message: 'Job matches generated successfully',
        data: {
          matches: matches.length,
          userSkills: user.skills
        }
      });
    } catch (aiError) {
      console.error('AI service error:', aiError.message);
      
      // Fallback: generate mock matches
      const mockMatches = await generateMockMatches(user.skills, jobs);
      
      res.json({
        status: 'success',
        message: 'Job matches generated successfully (demo mode)',
        data: {
          matches: mockMatches.length,
          userSkills: user.skills
        }
      });
    }
  } catch (error) {
    console.error('Generate matches error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error generating matches'
    });
  }
});

// @desc    Get skill recommendations
// @route   GET /api/ai/skill-recommendations
// @access  Private
router.get('/skill-recommendations', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    
    if (!user.skills || user.skills.length === 0) {
      return res.status(400).json({
        status: 'error',
        message: 'No skills found. Please upload a resume first.'
      });
    }

    try {
      // Call AI service for skill recommendations
      const aiResponse = await axios.post(`${process.env.AI_SERVICE_URL}/skill-recommendations`, {
        user_skills: user.skills
      });

      res.json({
        status: 'success',
        data: aiResponse.data
      });
    } catch (aiError) {
      console.error('AI service error:', aiError.message);
      
      // Fallback: return mock recommendations
      const mockRecommendations = generateMockSkillRecommendations(user.skills);
      
      res.json({
        status: 'success',
        data: mockRecommendations
      });
    }
  } catch (error) {
    console.error('Get skill recommendations error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error getting skill recommendations'
    });
  }
});

// Helper function to generate mock matches
async function generateMockMatches(userSkills, jobs) {
  const matches = [];
  
  for (const job of jobs) {
    const matchedSkills = job.requiredSkills.filter(skill => 
      userSkills.some(userSkill => 
        userSkill.toLowerCase().includes(skill.toLowerCase()) ||
        skill.toLowerCase().includes(userSkill.toLowerCase())
      )
    );
    
    const missingSkills = job.requiredSkills.filter(skill => 
      !matchedSkills.includes(skill)
    );
    
    const matchScore = Math.round((matchedSkills.length / job.requiredSkills.length) * 100);
    
    const recommendation = matchScore >= 80 ? 'high' : matchScore >= 60 ? 'medium' : 'low';
    
    const match = await Match.findOneAndUpdate(
      { userId: userSkills.userId, jobId: job._id },
      {
        userId: userSkills.userId,
        jobId: job._id,
        matchScore,
        matchedSkills,
        missingSkills,
        skillBreakdown: job.requiredSkills.map(skill => ({
          skill,
          isMatched: matchedSkills.includes(skill),
          importance: Math.floor(Math.random() * 5) + 1
        })),
        recommendation
      },
      { upsert: true, new: true }
    );
    
    matches.push(match);
  }
  
  return matches;
}

// Helper function to generate mock skill recommendations
function generateMockSkillRecommendations(userSkills) {
  const allSkills = [
    'TypeScript', 'Python', 'Java', 'C#', 'Go', 'Rust',
    'React', 'Vue.js', 'Angular', 'Svelte',
    'Node.js', 'Django', 'Spring Boot', 'Laravel',
    'PostgreSQL', 'MySQL', 'Redis', 'Elasticsearch',
    'AWS', 'Azure', 'Google Cloud', 'Docker', 'Kubernetes',
    'GraphQL', 'REST API', 'Microservices',
    'Machine Learning', 'Data Science', 'AI',
    'DevOps', 'CI/CD', 'Testing', 'Agile'
  ];
  
  const missingSkills = allSkills.filter(skill => 
    !userSkills.some(userSkill => 
      userSkill.toLowerCase().includes(skill.toLowerCase())
    )
  );
  
  const recommendations = missingSkills.slice(0, 5).map(skill => ({
    skill,
    demand: ['High', 'Medium', 'Low'][Math.floor(Math.random() * 3)],
    difficulty: ['Easy', 'Medium', 'Hard'][Math.floor(Math.random() * 3)],
    learningTime: ['1-2 weeks', '1 month', '2-3 months'][Math.floor(Math.random() * 3)],
    resources: [
      { name: `${skill} Documentation`, type: 'Documentation' },
      { name: `${skill} Course on Udemy`, type: 'Course' }
    ]
  }));
  
  return {
    currentSkills: userSkills,
    recommendations,
    skillGaps: missingSkills.slice(0, 10)
  };
}

module.exports = router;
