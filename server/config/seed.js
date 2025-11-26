const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Job = require('../models/Job');
const Match = require('../models/Match');

// Sample data for seeding
const sampleUsers = [
  {
    name: 'John Doe',
    email: 'john@example.com',
    password: 'password123',
    role: 'user',
    skills: ['JavaScript', 'React', 'Node.js', 'MongoDB', 'Express.js'],
    preferences: {
      jobTypes: ['full-time', 'remote'],
      locations: ['San Francisco', 'Remote'],
      salaryRange: { min: 80000, max: 120000 }
    }
  },
  {
    name: 'Jane Smith',
    email: 'jane@example.com',
    password: 'password123',
    role: 'user',
    skills: ['Python', 'Django', 'PostgreSQL', 'AWS', 'Docker'],
    preferences: {
      jobTypes: ['full-time', 'contract'],
      locations: ['New York', 'Boston'],
      salaryRange: { min: 90000, max: 130000 }
    }
  },
  {
    name: 'Admin User',
    email: 'admin@skillmatchai.com',
    password: 'admin123',
    role: 'admin',
    skills: ['JavaScript', 'Python', 'React', 'Node.js', 'MongoDB', 'AWS'],
    preferences: {
      jobTypes: ['full-time'],
      locations: ['Remote'],
      salaryRange: { min: 100000, max: 150000 }
    }
  }
];

const sampleJobs = [
  {
    title: 'Senior React Developer',
    company: 'TechCorp Inc.',
    description: 'We are looking for a senior React developer to join our growing team. You will be responsible for building user-facing features and components using React, Redux, and modern JavaScript.',
    requiredSkills: ['React', 'JavaScript', 'TypeScript', 'Redux', 'Node.js'],
    preferredSkills: ['GraphQL', 'AWS', 'Docker'],
    location: 'San Francisco, CA',
    salaryRange: { min: 120000, max: 150000, currency: 'USD' },
    employmentType: 'full-time',
    experienceLevel: 'senior',
    remoteWork: 'hybrid',
    benefits: ['Health Insurance', '401k', 'Flexible Hours', 'Remote Work'],
    requirements: [
      '5+ years of React experience',
      'Strong JavaScript fundamentals',
      'Experience with state management',
      'Knowledge of testing frameworks'
    ],
    responsibilities: [
      'Develop user-facing features using React',
      'Collaborate with design team',
      'Write clean, maintainable code',
      'Participate in code reviews'
    ],
    companyInfo: {
      website: 'https://techcorp.com',
      size: '100-500 employees',
      industry: 'Technology',
      description: 'Leading technology company focused on innovation'
    }
  },
  {
    title: 'Full Stack Engineer',
    company: 'StartupXYZ',
    description: 'Join our fast-growing startup as a full stack engineer. You will work on both frontend and backend systems, helping us scale our platform.',
    requiredSkills: ['JavaScript', 'Node.js', 'MongoDB', 'React', 'Express.js'],
    preferredSkills: ['AWS', 'Docker', 'GraphQL'],
    location: 'Remote',
    salaryRange: { min: 100000, max: 130000, currency: 'USD' },
    employmentType: 'full-time',
    experienceLevel: 'mid',
    remoteWork: 'remote',
    benefits: ['Equity', 'Health Insurance', 'Unlimited PTO'],
    requirements: [
      '3+ years full stack experience',
      'Proficiency in JavaScript and Node.js',
      'Database design experience',
      'Startup experience preferred'
    ],
    responsibilities: [
      'Build and maintain web applications',
      'Design and implement APIs',
      'Work with cross-functional teams',
      'Contribute to product decisions'
    ],
    companyInfo: {
      website: 'https://startupxyz.com',
      size: '10-50 employees',
      industry: 'SaaS',
      description: 'Innovative startup disrupting the industry'
    }
  },
  {
    title: 'Frontend Developer',
    company: 'DesignCo',
    description: 'We need a creative frontend developer with strong design skills. You will work closely with our design team to create beautiful, responsive user interfaces.',
    requiredSkills: ['React', 'CSS', 'JavaScript', 'Figma', 'Sass'],
    preferredSkills: ['TypeScript', 'Next.js', 'Storybook'],
    location: 'New York, NY',
    salaryRange: { min: 90000, max: 120000, currency: 'USD' },
    employmentType: 'full-time',
    experienceLevel: 'mid',
    remoteWork: 'on-site',
    benefits: ['Health Insurance', 'Dental', 'Vision', 'Gym Membership'],
    requirements: [
      '3+ years frontend development experience',
      'Strong CSS and design skills',
      'Experience with design tools',
      'Portfolio demonstrating UI/UX skills'
    ],
    responsibilities: [
      'Create responsive user interfaces',
      'Collaborate with designers',
      'Implement design systems',
      'Optimize for performance'
    ],
    companyInfo: {
      website: 'https://designco.com',
      size: '50-100 employees',
      industry: 'Design',
      description: 'Creative design agency with innovative projects'
    }
  },
  {
    title: 'Python Developer',
    company: 'DataTech Solutions',
    description: 'Join our data team as a Python developer. You will work on data processing pipelines, APIs, and machine learning models.',
    requiredSkills: ['Python', 'Django', 'PostgreSQL', 'Pandas', 'NumPy'],
    preferredSkills: ['Machine Learning', 'AWS', 'Docker', 'Redis'],
    location: 'Austin, TX',
    salaryRange: { min: 110000, max: 140000, currency: 'USD' },
    employmentType: 'full-time',
    experienceLevel: 'senior',
    remoteWork: 'hybrid',
    benefits: ['Health Insurance', '401k', 'Learning Budget', 'Flexible Schedule'],
    requirements: [
      '4+ years Python experience',
      'Strong database skills',
      'Experience with data processing',
      'Knowledge of ML libraries'
    ],
    responsibilities: [
      'Develop data processing pipelines',
      'Build and maintain APIs',
      'Work with ML models',
      'Optimize database queries'
    ],
    companyInfo: {
      website: 'https://datatech.com',
      size: '200-500 employees',
      industry: 'Data & Analytics',
      description: 'Leading data technology company'
    }
  },
  {
    title: 'DevOps Engineer',
    company: 'CloudScale Inc.',
    description: 'We are looking for a DevOps engineer to help us scale our infrastructure and improve our deployment processes.',
    requiredSkills: ['AWS', 'Docker', 'Kubernetes', 'Terraform', 'CI/CD'],
    preferredSkills: ['Python', 'Bash', 'Monitoring', 'Security'],
    location: 'Seattle, WA',
    salaryRange: { min: 130000, max: 160000, currency: 'USD' },
    employmentType: 'full-time',
    experienceLevel: 'senior',
    remoteWork: 'hybrid',
    benefits: ['Health Insurance', '401k', 'Stock Options', 'Home Office Budget'],
    requirements: [
      '5+ years DevOps experience',
      'Strong AWS knowledge',
      'Container orchestration experience',
      'Infrastructure as Code experience'
    ],
    responsibilities: [
      'Manage cloud infrastructure',
      'Automate deployment processes',
      'Monitor system performance',
      'Implement security best practices'
    ],
    companyInfo: {
      website: 'https://cloudscale.com',
      size: '100-200 employees',
      industry: 'Cloud Computing',
      description: 'Cloud infrastructure and platform company'
    }
  }
];

const seedDatabase = async () => {
  try {
    console.log('🌱 Starting database seeding...');

    // Clear existing data
    await User.deleteMany({});
    await Job.deleteMany({});
    await Match.deleteMany({});

    console.log('🗑️ Cleared existing data');

    // Create users
    const users = [];
    for (const userData of sampleUsers) {
      const user = new User(userData);
      await user.save();
      users.push(user);
      console.log(`👤 Created user: ${user.name}`);
    }

    // Create jobs
    const jobs = [];
    for (const jobData of sampleJobs) {
      const job = new Job({
        ...jobData,
        postedBy: users[2]._id // Admin user posts all jobs
      });
      await job.save();
      jobs.push(job);
      console.log(`💼 Created job: ${job.title}`);
    }

    // Create some sample matches
    const matches = [];
    for (let i = 0; i < users.length - 1; i++) { // Exclude admin user
      const user = users[i];
      for (const job of jobs) {
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
        matches.push(match);
      }
    }

    console.log(`🎯 Created ${matches.length} job matches`);

    console.log('✅ Database seeding completed successfully!');
    console.log(`📊 Created:`);
    console.log(`   - ${users.length} users`);
    console.log(`   - ${jobs.length} jobs`);
    console.log(`   - ${matches.length} matches`);

  } catch (error) {
    console.error('❌ Error seeding database:', error);
  }
};

module.exports = { seedDatabase };
