require('dotenv').config();
const mongoose = require('mongoose');
const readline = require('readline');
const User = require('../models/User');
const Job = require('../models/Job');
const Match = require('../models/Match');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function askQuestion(question) {
  return new Promise((resolve) => {
    rl.question(question, resolve);
  });
}

const createCustomData = async () => {
  try {
    // Connect to database
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/skillmatchai', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('✅ Connected to MongoDB');
    console.log('\n🎯 Custom Data Creator for SkillMatchAI');
    console.log('=====================================\n');

    // Get admin user
    const adminUser = await User.findOne({ role: 'admin' });
    if (!adminUser) {
      console.log('❌ Admin user not found. Please run seed script first.');
      process.exit(1);
    }

    // Ask what to create
    const choice = await askQuestion('What would you like to create?\n1. Add more users\n2. Add more jobs\n3. Add both\n4. View current statistics\nEnter choice (1-4): ');

    if (choice === '4') {
      await showStatistics();
      rl.close();
      return;
    }

    if (choice === '1' || choice === '3') {
      await createUsers(adminUser);
    }

    if (choice === '2' || choice === '3') {
      await createJobs(adminUser);
    }

    // Create matches for new data
    if (choice !== '4') {
      await createMatches();
    }

    await showStatistics();
    rl.close();

  } catch (error) {
    console.error('❌ Error:', error);
    rl.close();
    process.exit(1);
  }
};

async function createUsers(adminUser) {
  console.log('\n👥 Creating Users');
  console.log('================\n');

  const numUsers = await askQuestion('How many users would you like to create? (1-20): ');
  const userCount = parseInt(numUsers) || 1;

  const firstNames = ['Alex', 'Blake', 'Casey', 'Drew', 'Eli', 'Finley', 'Gray', 'Harper', 'Indigo', 'Jordan', 'Kai', 'Lane', 'Morgan', 'Nova', 'Ocean', 'Parker', 'Quinn', 'River', 'Sage', 'Taylor'];
  const lastNames = ['Anderson', 'Brown', 'Clark', 'Davis', 'Evans', 'Foster', 'Garcia', 'Harris', 'Johnson', 'King', 'Lee', 'Miller', 'Nelson', 'Owen', 'Parker', 'Quinn', 'Roberts', 'Smith', 'Taylor', 'White'];
  const skills = ['JavaScript', 'Python', 'Java', 'C#', 'PHP', 'React', 'Vue.js', 'Angular', 'Node.js', 'Django', 'Spring Boot', 'Laravel', 'MongoDB', 'PostgreSQL', 'MySQL', 'AWS', 'Azure', 'Docker', 'Git', 'TypeScript'];
  const companies = ['TechCorp', 'InnovateLab', 'CodeCraft', 'DevStudio', 'WebWorks', 'DataFlow', 'CloudScale', 'AppBuilder', 'SoftTech', 'NextGen'];

  for (let i = 0; i < userCount; i++) {
    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
    const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}@example.com`;
    
    // Generate random skills (3-8 skills)
    const userSkills = [];
    const numSkills = Math.floor(Math.random() * 6) + 3;
    const shuffledSkills = [...skills].sort(() => 0.5 - Math.random());
    for (let j = 0; j < numSkills; j++) {
      userSkills.push(shuffledSkills[j]);
    }

    const user = new User({
      name: `${firstName} ${lastName}`,
      email: email,
      password: 'password123',
      role: 'user',
      skills: userSkills,
      preferences: {
        jobTypes: ['full-time', 'remote', 'contract'].slice(0, Math.floor(Math.random() * 3) + 1),
        locations: ['Remote', 'San Francisco', 'New York', 'Austin', 'Seattle'].slice(0, Math.floor(Math.random() * 3) + 1),
        salaryRange: {
          min: Math.floor(Math.random() * 30000) + 50000,
          max: Math.floor(Math.random() * 50000) + 100000
        }
      }
    });

    await user.save();
    console.log(`✅ Created user: ${user.name} (${user.email})`);
  }
}

async function createJobs(adminUser) {
  console.log('\n💼 Creating Jobs');
  console.log('================\n');

  const numJobs = await askQuestion('How many jobs would you like to create? (1-20): ');
  const jobCount = parseInt(numJobs) || 1;

  const jobTitles = [
    'Software Engineer', 'Full Stack Developer', 'Frontend Developer', 'Backend Developer',
    'DevOps Engineer', 'Data Scientist', 'Machine Learning Engineer', 'Mobile Developer',
    'UI/UX Developer', 'Cloud Engineer', 'Security Engineer', 'QA Engineer',
    'Technical Lead', 'Senior Developer', 'Junior Developer', 'Architect',
    'Product Manager', 'Scrum Master', 'Technical Writer', 'Solutions Architect'
  ];

  const companies = [
    'TechCorp Inc.', 'InnovateLab LLC', 'CodeCraft Solutions', 'DevStudio Pro',
    'WebWorks International', 'DataFlow Systems', 'CloudScale Technologies',
    'AppBuilder Co.', 'SoftTech Industries', 'NextGen Innovations',
    'Digital Dynamics', 'Future Systems', 'Smart Solutions', 'Elite Technologies',
    'Prime Development', 'Advanced Systems', 'Core Technologies', 'Peak Performance'
  ];

  const locations = [
    'San Francisco, CA', 'New York, NY', 'Austin, TX', 'Seattle, WA',
    'Boston, MA', 'Chicago, IL', 'Denver, CO', 'Remote',
    'Los Angeles, CA', 'Miami, FL', 'Portland, OR', 'Nashville, TN'
  ];

  const skills = ['JavaScript', 'Python', 'Java', 'C#', 'PHP', 'React', 'Vue.js', 'Angular', 'Node.js', 'Django', 'Spring Boot', 'Laravel', 'MongoDB', 'PostgreSQL', 'MySQL', 'AWS', 'Azure', 'Docker', 'Git', 'TypeScript', 'Ruby', 'Go', 'Rust', 'Swift', 'Kotlin'];

  for (let i = 0; i < jobCount; i++) {
    const title = jobTitles[Math.floor(Math.random() * jobTitles.length)];
    const company = companies[Math.floor(Math.random() * companies.length)];
    const location = locations[Math.floor(Math.random() * locations.length)];
    
    // Generate random required skills (3-8 skills)
    const requiredSkills = [];
    const numSkills = Math.floor(Math.random() * 6) + 3;
    const shuffledSkills = [...skills].sort(() => 0.5 - Math.random());
    for (let j = 0; j < numSkills; j++) {
      requiredSkills.push(shuffledSkills[j]);
    }

    const salaryMin = Math.floor(Math.random() * 50000) + 60000;
    const salaryMax = salaryMin + Math.floor(Math.random() * 40000) + 20000;

    const job = new Job({
      title: title,
      company: company,
      description: `We are looking for a ${title.toLowerCase()} to join our team. This position offers great opportunities for growth and development in a dynamic environment.`,
      requiredSkills: requiredSkills,
      preferredSkills: skills.slice(0, Math.floor(Math.random() * 3)),
      location: location,
      salaryRange: {
        min: salaryMin,
        max: salaryMax,
        currency: 'USD'
      },
      employmentType: ['full-time', 'part-time', 'contract'][Math.floor(Math.random() * 3)],
      experienceLevel: ['entry', 'mid', 'senior', 'lead'][Math.floor(Math.random() * 4)],
      remoteWork: ['on-site', 'remote', 'hybrid'][Math.floor(Math.random() * 3)],
      benefits: ['Health Insurance', '401k', 'Flexible Hours', 'Remote Work', 'Learning Budget'].slice(0, Math.floor(Math.random() * 3) + 2),
      requirements: [
        `${Math.floor(Math.random() * 5) + 2}+ years experience`,
        'Strong problem-solving skills',
        'Team collaboration experience',
        'Portfolio of relevant projects'
      ],
      responsibilities: [
        'Develop and maintain applications',
        'Collaborate with cross-functional teams',
        'Write clean, maintainable code',
        'Participate in code reviews'
      ],
      companyInfo: {
        website: `https://${company.toLowerCase().replace(/[^a-z0-9]/g, '')}.com`,
        size: ['10-50', '50-100', '100-500', '500+'][Math.floor(Math.random() * 4)] + ' employees',
        industry: ['Technology', 'Finance', 'Healthcare', 'E-commerce', 'Education'][Math.floor(Math.random() * 5)],
        description: 'Leading company in the industry'
      },
      postedBy: adminUser._id
    });

    await job.save();
    console.log(`✅ Created job: ${job.title} at ${job.company}`);
  }
}

async function createMatches() {
  console.log('\n🎯 Creating Job Matches');
  console.log('======================\n');

  const users = await User.find({ role: 'user' });
  const jobs = await Job.find({ isActive: true });

  let matchCount = 0;
  for (const user of users) {
    for (const job of jobs) {
      // Check if match already exists
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
        
        const missingSkills = job.requiredSkills.filter(skill =>
          !matchedSkills.includes(skill)
        );
        
        const matchScore = Math.round((matchedSkills.length / job.requiredSkills.length) * 100);
        const recommendation = matchScore >= 80 ? 'high' : matchScore >= 60 ? 'medium' : 'low';
        
        const match = new Match({
          userId: user._id,
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
        });
        
        await match.save();
        matchCount++;
      }
    }
  }

  console.log(`✅ Created ${matchCount} additional job matches`);
}

async function showStatistics() {
  const totalUsers = await User.countDocuments({ role: 'user' });
  const totalJobs = await Job.countDocuments({ isActive: true });
  const totalMatches = await Match.countDocuments();

  console.log('\n📊 Current Database Statistics:');
  console.log('===============================');
  console.log(`👥 Total Users: ${totalUsers}`);
  console.log(`💼 Total Jobs: ${totalJobs}`);
  console.log(`🎯 Total Matches: ${totalMatches}`);
  console.log(`👑 Admin Users: ${await User.countDocuments({ role: 'admin' })}`);
}

createCustomData();
