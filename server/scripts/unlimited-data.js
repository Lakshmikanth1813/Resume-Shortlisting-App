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

const createUnlimitedData = async () => {
  try {
    // Connect to database
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/skillmatchai', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('✅ Connected to MongoDB');
    console.log('\n🚀 UNLIMITED Data Creator for SkillMatchAI');
    console.log('==========================================\n');

    // Get admin user
    const adminUser = await User.findOne({ role: 'admin' });
    if (!adminUser) {
      console.log('❌ Admin user not found. Please run seed script first.');
      process.exit(1);
    }

    // Show current stats
    await showStatistics();

    // Ask what to create
    const choice = await askQuestion('\nWhat would you like to create?\n1. Add unlimited users\n2. Add unlimited jobs\n3. Add both (unlimited)\n4. View current statistics\n5. Exit\nEnter choice (1-5): ');

    if (choice === '4') {
      await showStatistics();
      rl.close();
      return;
    }

    if (choice === '5') {
      console.log('Goodbye!');
      rl.close();
      return;
    }

    if (choice === '1' || choice === '3') {
      await createUnlimitedUsers(adminUser);
    }

    if (choice === '2' || choice === '3') {
      await createUnlimitedJobs(adminUser);
    }

    // Create matches for new data
    if (choice !== '4' && choice !== '5') {
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

async function createUnlimitedUsers(adminUser) {
  console.log('\n👥 Creating UNLIMITED Users');
  console.log('============================\n');

  const numUsers = await askQuestion('How many users would you like to create? (Enter any number): ');
  const userCount = parseInt(numUsers) || 0;

  if (userCount <= 0) {
    console.log('❌ Invalid number. Please enter a positive number.');
    return;
  }

  if (userCount > 1000) {
    const confirm = await askQuestion(`⚠️  You're about to create ${userCount} users. This might take a while. Continue? (y/n): `);
    if (confirm.toLowerCase() !== 'y' && confirm.toLowerCase() !== 'yes') {
      console.log('❌ Operation cancelled.');
      return;
    }
  }

  const firstNames = [
    'Alex', 'Blake', 'Casey', 'Drew', 'Eli', 'Finley', 'Gray', 'Harper', 'Indigo', 'Jordan',
    'Kai', 'Lane', 'Morgan', 'Nova', 'Ocean', 'Parker', 'Quinn', 'River', 'Sage', 'Taylor',
    'Avery', 'Cameron', 'Dakota', 'Emery', 'Hayden', 'Jamie', 'Kendall', 'Logan', 'Peyton', 'Reese',
    'Riley', 'Skyler', 'Tatum', 'Valentine', 'Winter', 'Zion', 'Adrian', 'Bailey', 'Carson', 'Dallas'
  ];
  
  const lastNames = [
    'Anderson', 'Brown', 'Clark', 'Davis', 'Evans', 'Foster', 'Garcia', 'Harris', 'Johnson', 'King',
    'Lee', 'Miller', 'Nelson', 'Owen', 'Parker', 'Quinn', 'Roberts', 'Smith', 'Taylor', 'White',
    'Adams', 'Baker', 'Campbell', 'Carter', 'Edwards', 'Green', 'Hall', 'Jackson', 'Jones', 'Martin',
    'Martinez', 'Mitchell', 'Phillips', 'Rodriguez', 'Thompson', 'Turner', 'Walker', 'Wilson', 'Wright', 'Young'
  ];
  
  const skills = [
    'JavaScript', 'Python', 'Java', 'C#', 'PHP', 'Ruby', 'Go', 'Rust', 'Swift', 'Kotlin',
    'React', 'Vue.js', 'Angular', 'Svelte', 'Next.js', 'Nuxt.js', 'SvelteKit', 'Gatsby',
    'Node.js', 'Django', 'Flask', 'Spring Boot', 'Laravel', 'Rails', 'Express.js', 'FastAPI',
    'MongoDB', 'PostgreSQL', 'MySQL', 'SQLite', 'Redis', 'Elasticsearch', 'Cassandra', 'DynamoDB',
    'AWS', 'Azure', 'Google Cloud', 'Docker', 'Kubernetes', 'Terraform', 'Ansible', 'Jenkins',
    'Git', 'GitHub', 'GitLab', 'Bitbucket', 'Jira', 'Confluence', 'Slack', 'Figma',
    'TypeScript', 'Sass', 'Less', 'Webpack', 'Vite', 'Babel', 'ESLint', 'Prettier',
    'Jest', 'Cypress', 'Selenium', 'Mocha', 'Chai', 'Enzyme', 'Testing Library', 'Playwright',
    'GraphQL', 'REST API', 'Microservices', 'Serverless', 'Lambda', 'API Gateway', 'Message Queues',
    'Machine Learning', 'Data Science', 'AI', 'TensorFlow', 'PyTorch', 'Pandas', 'NumPy', 'Scikit-learn'
  ];

  const companies = [
    'TechCorp', 'InnovateLab', 'CodeCraft', 'DevStudio', 'WebWorks', 'DataFlow', 'CloudScale', 'AppBuilder',
    'SoftTech', 'NextGen', 'Digital Dynamics', 'Future Systems', 'Smart Solutions', 'Elite Technologies',
    'Prime Development', 'Advanced Systems', 'Core Technologies', 'Peak Performance', 'Quantum Solutions',
    'Alpha Innovations', 'Beta Systems', 'Gamma Technologies', 'Delta Solutions', 'Epsilon Labs', 'Zeta Corp',
    'Eta Industries', 'Theta Systems', 'Iota Technologies', 'Kappa Solutions', 'Lambda Labs', 'Mu Corp',
    'Nu Industries', 'Xi Systems', 'Omicron Technologies', 'Pi Solutions', 'Rho Labs', 'Sigma Corp',
    'Tau Industries', 'Upsilon Systems', 'Phi Technologies', 'Chi Solutions', 'Psi Labs', 'Omega Corp'
  ];

  console.log(`🚀 Creating ${userCount} users...`);
  
  // Create users in batches to avoid memory issues
  const batchSize = 100;
  let created = 0;

  for (let batch = 0; batch < Math.ceil(userCount / batchSize); batch++) {
    const batchUsers = [];
    const currentBatchSize = Math.min(batchSize, userCount - created);

    for (let i = 0; i < currentBatchSize; i++) {
      const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
      const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
      const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}.${Date.now()}.${i}@example.com`;
      
      // Generate random skills (3-10 skills)
      const userSkills = [];
      const numSkills = Math.floor(Math.random() * 8) + 3;
      const shuffledSkills = [...skills].sort(() => 0.5 - Math.random());
      for (let j = 0; j < numSkills; j++) {
        userSkills.push(shuffledSkills[j]);
      }

      const user = {
        name: `${firstName} ${lastName}`,
        email: email,
        password: 'password123',
        role: 'user',
        skills: userSkills,
        preferences: {
          jobTypes: ['full-time', 'remote', 'contract', 'part-time'].slice(0, Math.floor(Math.random() * 4) + 1),
          locations: ['Remote', 'San Francisco', 'New York', 'Austin', 'Seattle', 'Boston', 'Chicago', 'Denver', 'Los Angeles', 'Miami'].slice(0, Math.floor(Math.random() * 4) + 1),
          salaryRange: {
            min: Math.floor(Math.random() * 40000) + 40000,
            max: Math.floor(Math.random() * 80000) + 80000
          }
        }
      };

      batchUsers.push(user);
    }

    // Insert batch
    await User.insertMany(batchUsers);
    created += currentBatchSize;
    
    console.log(`✅ Created ${created}/${userCount} users (${Math.round((created/userCount) * 100)}%)`);
  }

  console.log(`🎉 Successfully created ${created} users!`);
}

async function createUnlimitedJobs(adminUser) {
  console.log('\n💼 Creating UNLIMITED Jobs');
  console.log('===========================\n');

  const numJobs = await askQuestion('How many jobs would you like to create? (Enter any number): ');
  const jobCount = parseInt(numJobs) || 0;

  if (jobCount <= 0) {
    console.log('❌ Invalid number. Please enter a positive number.');
    return;
  }

  if (jobCount > 1000) {
    const confirm = await askQuestion(`⚠️  You're about to create ${jobCount} jobs. This might take a while. Continue? (y/n): `);
    if (confirm.toLowerCase() !== 'y' && confirm.toLowerCase() !== 'yes') {
      console.log('❌ Operation cancelled.');
      return;
    }
  }

  const jobTitles = [
    'Software Engineer', 'Full Stack Developer', 'Frontend Developer', 'Backend Developer',
    'DevOps Engineer', 'Data Scientist', 'Machine Learning Engineer', 'Mobile Developer',
    'UI/UX Developer', 'Cloud Engineer', 'Security Engineer', 'QA Engineer',
    'Technical Lead', 'Senior Developer', 'Junior Developer', 'Architect',
    'Product Manager', 'Scrum Master', 'Technical Writer', 'Solutions Architect',
    'Database Administrator', 'System Administrator', 'Network Engineer', 'Cybersecurity Specialist',
    'AI Engineer', 'Blockchain Developer', 'Game Developer', 'Web Developer',
    'API Developer', 'Integration Engineer', 'Platform Engineer', 'Infrastructure Engineer',
    'Site Reliability Engineer', 'Performance Engineer', 'Automation Engineer', 'Test Engineer',
    'Business Analyst', 'Data Analyst', 'UX Designer', 'UI Designer',
    'Product Designer', 'Graphic Designer', 'Motion Designer', 'Interaction Designer'
  ];

  const companies = [
    'TechCorp Inc.', 'InnovateLab LLC', 'CodeCraft Solutions', 'DevStudio Pro',
    'WebWorks International', 'DataFlow Systems', 'CloudScale Technologies',
    'AppBuilder Co.', 'SoftTech Industries', 'NextGen Innovations',
    'Digital Dynamics', 'Future Systems', 'Smart Solutions', 'Elite Technologies',
    'Prime Development', 'Advanced Systems', 'Core Technologies', 'Peak Performance',
    'Quantum Solutions', 'Alpha Innovations', 'Beta Systems', 'Gamma Technologies',
    'Delta Solutions', 'Epsilon Labs', 'Zeta Corp', 'Eta Industries',
    'Theta Systems', 'Iota Technologies', 'Kappa Solutions', 'Lambda Labs',
    'Mu Corp', 'Nu Industries', 'Xi Systems', 'Omicron Technologies',
    'Pi Solutions', 'Rho Labs', 'Sigma Corp', 'Tau Industries',
    'Upsilon Systems', 'Phi Technologies', 'Chi Solutions', 'Psi Labs', 'Omega Corp'
  ];

  const locations = [
    'San Francisco, CA', 'New York, NY', 'Austin, TX', 'Seattle, WA',
    'Boston, MA', 'Chicago, IL', 'Denver, CO', 'Remote',
    'Los Angeles, CA', 'Miami, FL', 'Portland, OR', 'Nashville, TN',
    'Phoenix, AZ', 'Dallas, TX', 'Houston, TX', 'Atlanta, GA',
    'Orlando, FL', 'Las Vegas, NV', 'Salt Lake City, UT', 'Minneapolis, MN',
    'Detroit, MI', 'Cleveland, OH', 'Pittsburgh, PA', 'Philadelphia, PA',
    'Washington, DC', 'Baltimore, MD', 'Charlotte, NC', 'Raleigh, NC',
    'Richmond, VA', 'Norfolk, VA', 'Jacksonville, FL', 'Tampa, FL'
  ];

  const skills = [
    'JavaScript', 'Python', 'Java', 'C#', 'PHP', 'Ruby', 'Go', 'Rust', 'Swift', 'Kotlin',
    'React', 'Vue.js', 'Angular', 'Svelte', 'Next.js', 'Nuxt.js', 'SvelteKit', 'Gatsby',
    'Node.js', 'Django', 'Flask', 'Spring Boot', 'Laravel', 'Rails', 'Express.js', 'FastAPI',
    'MongoDB', 'PostgreSQL', 'MySQL', 'SQLite', 'Redis', 'Elasticsearch', 'Cassandra', 'DynamoDB',
    'AWS', 'Azure', 'Google Cloud', 'Docker', 'Kubernetes', 'Terraform', 'Ansible', 'Jenkins',
    'Git', 'GitHub', 'GitLab', 'Bitbucket', 'Jira', 'Confluence', 'Slack', 'Figma',
    'TypeScript', 'Sass', 'Less', 'Webpack', 'Vite', 'Babel', 'ESLint', 'Prettier',
    'Jest', 'Cypress', 'Selenium', 'Mocha', 'Chai', 'Enzyme', 'Testing Library', 'Playwright',
    'GraphQL', 'REST API', 'Microservices', 'Serverless', 'Lambda', 'API Gateway', 'Message Queues',
    'Machine Learning', 'Data Science', 'AI', 'TensorFlow', 'PyTorch', 'Pandas', 'NumPy', 'Scikit-learn'
  ];

  const industries = [
    'Technology', 'Finance', 'Healthcare', 'E-commerce', 'Education', 'Entertainment',
    'Gaming', 'Media', 'Real Estate', 'Travel', 'Automotive', 'Manufacturing',
    'Retail', 'Food & Beverage', 'Energy', 'Telecommunications', 'Consulting',
    'Legal', 'Government', 'Non-profit', 'Sports', 'Fashion', 'Beauty', 'Lifestyle'
  ];

  console.log(`🚀 Creating ${jobCount} jobs...`);
  
  // Create jobs in batches
  const batchSize = 100;
  let created = 0;

  for (let batch = 0; batch < Math.ceil(jobCount / batchSize); batch++) {
    const batchJobs = [];
    const currentBatchSize = Math.min(batchSize, jobCount - created);

    for (let i = 0; i < currentBatchSize; i++) {
      const title = jobTitles[Math.floor(Math.random() * jobTitles.length)];
      const company = companies[Math.floor(Math.random() * companies.length)];
      const location = locations[Math.floor(Math.random() * locations.length)];
      
      // Generate random required skills (3-10 skills)
      const requiredSkills = [];
      const numSkills = Math.floor(Math.random() * 8) + 3;
      const shuffledSkills = [...skills].sort(() => 0.5 - Math.random());
      for (let j = 0; j < numSkills; j++) {
        requiredSkills.push(shuffledSkills[j]);
      }

      const salaryMin = Math.floor(Math.random() * 60000) + 40000;
      const salaryMax = salaryMin + Math.floor(Math.random() * 60000) + 20000;

      const job = {
        title: title,
        company: company,
        description: `We are looking for a ${title.toLowerCase()} to join our team. This position offers great opportunities for growth and development in a dynamic environment. You will work on exciting projects and collaborate with talented professionals.`,
        requiredSkills: requiredSkills,
        preferredSkills: skills.slice(0, Math.floor(Math.random() * 5)),
        location: location,
        salaryRange: {
          min: salaryMin,
          max: salaryMax,
          currency: 'USD'
        },
        employmentType: ['full-time', 'part-time', 'contract', 'internship', 'freelance'][Math.floor(Math.random() * 5)],
        experienceLevel: ['entry', 'mid', 'senior', 'lead', 'executive'][Math.floor(Math.random() * 5)],
        remoteWork: ['on-site', 'remote', 'hybrid'][Math.floor(Math.random() * 3)],
        benefits: ['Health Insurance', '401k', 'Flexible Hours', 'Remote Work', 'Learning Budget', 'Stock Options', 'Gym Membership', 'Unlimited PTO'].slice(0, Math.floor(Math.random() * 4) + 3),
        requirements: [
          `${Math.floor(Math.random() * 8) + 1}+ years experience`,
          'Strong problem-solving skills',
          'Team collaboration experience',
          'Portfolio of relevant projects',
          'Excellent communication skills',
          'Bachelor\'s degree preferred'
        ],
        responsibilities: [
          'Develop and maintain applications',
          'Collaborate with cross-functional teams',
          'Write clean, maintainable code',
          'Participate in code reviews',
          'Troubleshoot and debug issues',
          'Stay updated with latest technologies'
        ],
        companyInfo: {
          website: `https://${company.toLowerCase().replace(/[^a-z0-9]/g, '')}.com`,
          size: ['1-10', '10-50', '50-100', '100-500', '500-1000', '1000+'][Math.floor(Math.random() * 6)] + ' employees',
          industry: industries[Math.floor(Math.random() * industries.length)],
          description: 'Leading company in the industry with innovative solutions'
        },
        postedBy: adminUser._id
      };

      batchJobs.push(job);
    }

    // Insert batch
    await Job.insertMany(batchJobs);
    created += currentBatchSize;
    
    console.log(`✅ Created ${created}/${jobCount} jobs (${Math.round((created/jobCount) * 100)}%)`);
  }

  console.log(`🎉 Successfully created ${created} jobs!`);
}

async function createMatches() {
  console.log('\n🎯 Creating Job Matches');
  console.log('=======================\n');

  const users = await User.find({ role: 'user' });
  const jobs = await Job.find({ isActive: true });

  console.log(`📊 Found ${users.length} users and ${jobs.length} jobs`);
  console.log(`🎯 Will create up to ${users.length * jobs.length} matches...`);

  if (users.length * jobs.length > 10000) {
    const confirm = await askQuestion(`⚠️  This will create ${users.length * jobs.length} matches. This might take a while. Continue? (y/n): `);
    if (confirm.toLowerCase() !== 'y' && confirm.toLowerCase() !== 'yes') {
      console.log('❌ Operation cancelled.');
      return;
    }
  }

  let matchCount = 0;
  const batchSize = 1000;
  const matches = [];

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
        
        const match = {
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
        };
        
        matches.push(match);
        matchCount++;

        // Insert in batches
        if (matches.length >= batchSize) {
          await Match.insertMany(matches);
          console.log(`✅ Created ${matchCount} matches...`);
          matches.length = 0; // Clear array
        }
      }
    }
  }

  // Insert remaining matches
  if (matches.length > 0) {
    await Match.insertMany(matches);
  }

  console.log(`🎉 Successfully created ${matchCount} job matches!`);
}

async function showStatistics() {
  const totalUsers = await User.countDocuments({ role: 'user' });
  const totalJobs = await Job.countDocuments({ isActive: true });
  const totalMatches = await Match.countDocuments();
  const totalAdmins = await User.countDocuments({ role: 'admin' });

  console.log('\n📊 Current Database Statistics:');
  console.log('===============================');
  console.log(`👥 Users: ${totalUsers.toLocaleString()}`);
  console.log(`👑 Admins: ${totalAdmins.toLocaleString()}`);
  console.log(`💼 Jobs: ${totalJobs.toLocaleString()}`);
  console.log(`🎯 Matches: ${totalMatches.toLocaleString()}`);
  console.log(`📈 Total Records: ${(totalUsers + totalJobs + totalMatches + totalAdmins).toLocaleString()}`);
}

createUnlimitedData();
