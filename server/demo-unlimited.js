require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const Job = require('./models/Job');
const Match = require('./models/Match');

async function demoUnlimited() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/skillmatchai', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('🚀 UNLIMITED Data Demo - SkillMatchAI');
    console.log('=====================================\n');

    // Get admin user
    const adminUser = await User.findOne({ role: 'admin' });
    if (!adminUser) {
      console.log('❌ Admin user not found. Please run seed script first.');
      process.exit(1);
    }

    // Show current stats
    let users = await User.countDocuments({ role: 'user' });
    let jobs = await Job.countDocuments({ isActive: true });
    let matches = await Match.countDocuments();

    console.log('📊 BEFORE:');
    console.log(`👥 Users: ${users}`);
    console.log(`💼 Jobs: ${jobs}`);
    console.log(`🎯 Matches: ${matches}\n`);

    // Create 50 users
    console.log('👥 Creating 50 users...');
    const userBatch = [];
    for (let i = 0; i < 50; i++) {
      const user = {
        name: `User ${i + 1}`,
        email: `user${i + 1}@example.com`,
        password: 'password123',
        role: 'user',
        skills: ['JavaScript', 'React', 'Node.js', 'MongoDB', 'Git'],
        preferences: {
          jobTypes: ['full-time'],
          locations: ['Remote'],
          salaryRange: { min: 60000, max: 100000 }
        }
      };
      userBatch.push(user);
    }
    await User.insertMany(userBatch);

    // Create 25 jobs
    console.log('💼 Creating 25 jobs...');
    const jobBatch = [];
    for (let i = 0; i < 25; i++) {
      const job = {
        title: `Software Engineer ${i + 1}`,
        company: `Company ${i + 1}`,
        description: `Job description for position ${i + 1}`,
        requiredSkills: ['JavaScript', 'React', 'Node.js', 'MongoDB'],
        location: 'Remote',
        salaryRange: { min: 70000, max: 120000, currency: 'USD' },
        employmentType: 'full-time',
        experienceLevel: 'mid',
        remoteWork: 'remote',
        benefits: ['Health Insurance', '401k'],
        requirements: ['3+ years experience'],
        responsibilities: ['Develop applications'],
        companyInfo: {
          website: `https://company${i + 1}.com`,
          size: '50-100 employees',
          industry: 'Technology',
          description: 'Tech company'
        },
        postedBy: adminUser._id
      };
      jobBatch.push(job);
    }
    await Job.insertMany(jobBatch);

    // Create matches for all users and jobs
    console.log('🎯 Creating job matches...');
    const allUsers = await User.find({ role: 'user' });
    const allJobs = await Job.find({ isActive: true });
    
    const matchBatch = [];
    for (const user of allUsers) {
      for (const job of allJobs) {
        const existingMatch = await Match.findOne({
          userId: user._id,
          jobId: job._id
        });
        
        if (!existingMatch) {
          const matchedSkills = job.requiredSkills.filter(skill =>
            user.skills.some(userSkill =>
              userSkill.toLowerCase().includes(skill.toLowerCase())
            )
          );
          
          const matchScore = Math.round((matchedSkills.length / job.requiredSkills.length) * 100);
          const recommendation = matchScore >= 80 ? 'high' : matchScore >= 60 ? 'medium' : 'low';
          
          const match = {
            userId: user._id,
            jobId: job._id,
            matchScore,
            matchedSkills,
            missingSkills: job.requiredSkills.filter(skill => !matchedSkills.includes(skill)),
            skillBreakdown: job.requiredSkills.map(skill => ({
              skill,
              isMatched: matchedSkills.includes(skill),
              importance: Math.floor(Math.random() * 5) + 1
            })),
            recommendation
          };
          
          matchBatch.push(match);
        }
      }
    }
    
    if (matchBatch.length > 0) {
      await Match.insertMany(matchBatch);
    }

    // Show final stats
    users = await User.countDocuments({ role: 'user' });
    jobs = await Job.countDocuments({ isActive: true });
    matches = await Match.countDocuments();

    console.log('\n📊 AFTER:');
    console.log(`👥 Users: ${users}`);
    console.log(`💼 Jobs: ${jobs}`);
    console.log(`🎯 Matches: ${matches}`);
    console.log(`📈 Total Records: ${users + jobs + matches + 1} (including 1 admin)`);

    console.log('\n🎉 Demo completed! You can create UNLIMITED data!');
    console.log('\nTo create more data, run:');
    console.log('cd server && npm run unlimited');

    await mongoose.connection.close();
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

demoUnlimited();
