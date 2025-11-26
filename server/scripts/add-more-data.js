require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');
const Job = require('../models/Job');
const Match = require('../models/Match');

const addMoreData = async () => {
  try {
    // Connect to database
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/skillmatchai', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('✅ Connected to MongoDB');

    // Get admin user for posting jobs
    const adminUser = await User.findOne({ role: 'admin' });
    if (!adminUser) {
      console.log('❌ Admin user not found. Please run seed script first.');
      process.exit(1);
    }

    // Add more users
    const newUsers = [
      {
        name: 'Alice Johnson',
        email: 'alice@example.com',
        password: 'password123',
        role: 'user',
        skills: ['Vue.js', 'JavaScript', 'CSS', 'HTML', 'Bootstrap', 'Git'],
        preferences: {
          jobTypes: ['full-time', 'remote'],
          locations: ['Remote', 'San Francisco'],
          salaryRange: { min: 70000, max: 100000 }
        }
      },
      {
        name: 'Bob Wilson',
        email: 'bob@example.com',
        password: 'password123',
        role: 'user',
        skills: ['Java', 'Spring Boot', 'MySQL', 'Hibernate', 'Maven', 'JUnit'],
        preferences: {
          jobTypes: ['full-time', 'contract'],
          locations: ['New York', 'Boston'],
          salaryRange: { min: 90000, max: 130000 }
        }
      },
      {
        name: 'Carol Davis',
        email: 'carol@example.com',
        password: 'password123',
        role: 'user',
        skills: ['C#', '.NET', 'SQL Server', 'Entity Framework', 'Azure', 'Docker'],
        preferences: {
          jobTypes: ['full-time'],
          locations: ['Seattle', 'Remote'],
          salaryRange: { min: 85000, max: 120000 }
        }
      },
      {
        name: 'David Brown',
        email: 'david@example.com',
        password: 'password123',
        role: 'user',
        skills: ['PHP', 'Laravel', 'MySQL', 'Redis', 'AWS', 'Linux'],
        preferences: {
          jobTypes: ['full-time', 'part-time'],
          locations: ['Austin', 'Dallas'],
          salaryRange: { min: 75000, max: 110000 }
        }
      },
      {
        name: 'Emma Garcia',
        email: 'emma@example.com',
        password: 'password123',
        role: 'user',
        skills: ['Angular', 'TypeScript', 'RxJS', 'Sass', 'Webpack', 'Jest'],
        preferences: {
          jobTypes: ['full-time', 'remote'],
          locations: ['Remote', 'Chicago'],
          salaryRange: { min: 80000, max: 115000 }
        }
      }
    ];

    console.log('👥 Adding more users...');
    const createdUsers = [];
    for (const userData of newUsers) {
      const user = new User(userData);
      await user.save();
      createdUsers.push(user);
      console.log(`✅ Created user: ${user.name}`);
    }

    // Add more jobs
    const newJobs = [
      {
        title: 'Vue.js Developer',
        company: 'Frontend Masters',
        description: 'We are looking for a Vue.js developer to join our frontend team. You will work on building modern web applications using Vue.js, Vuex, and Vue Router.',
        requiredSkills: ['Vue.js', 'JavaScript', 'CSS', 'HTML', 'Git'],
        preferredSkills: ['Nuxt.js', 'Vuetify', 'TypeScript'],
        location: 'Remote',
        salaryRange: { min: 80000, max: 110000, currency: 'USD' },
        employmentType: 'full-time',
        experienceLevel: 'mid',
        remoteWork: 'remote',
        benefits: ['Health Insurance', '401k', 'Remote Work', 'Learning Budget'],
        requirements: [
          '3+ years Vue.js experience',
          'Strong JavaScript fundamentals',
          'Experience with state management',
          'Portfolio of Vue.js projects'
        ],
        responsibilities: [
          'Develop Vue.js applications',
          'Collaborate with design team',
          'Write clean, maintainable code',
          'Participate in code reviews'
        ],
        companyInfo: {
          website: 'https://frontendmasters.com',
          size: '50-100 employees',
          industry: 'Education',
          description: 'Leading online platform for frontend development courses'
        }
      },
      {
        title: 'Java Backend Developer',
        company: 'Enterprise Solutions Inc.',
        description: 'Join our backend team as a Java developer. You will work on enterprise-level applications using Java, Spring Boot, and microservices architecture.',
        requiredSkills: ['Java', 'Spring Boot', 'MySQL', 'Hibernate', 'Maven'],
        preferredSkills: ['Docker', 'Kubernetes', 'Redis', 'Apache Kafka'],
        location: 'New York, NY',
        salaryRange: { min: 100000, max: 140000, currency: 'USD' },
        employmentType: 'full-time',
        experienceLevel: 'senior',
        remoteWork: 'hybrid',
        benefits: ['Health Insurance', '401k', 'Stock Options', 'Flexible Hours'],
        requirements: [
          '5+ years Java experience',
          'Spring Boot and Spring Framework',
          'Database design and optimization',
          'Microservices architecture experience'
        ],
        responsibilities: [
          'Develop REST APIs',
          'Design database schemas',
          'Implement microservices',
          'Code review and mentoring'
        ],
        companyInfo: {
          website: 'https://enterprisesolutions.com',
          size: '500+ employees',
          industry: 'Enterprise Software',
          description: 'Leading provider of enterprise software solutions'
        }
      },
      {
        title: '.NET Developer',
        company: 'Microsoft Partners',
        description: 'We are seeking a .NET developer to join our development team. You will work on building scalable applications using C#, .NET Core, and Azure services.',
        requiredSkills: ['C#', '.NET', 'SQL Server', 'Entity Framework', 'Azure'],
        preferredSkills: ['Docker', 'Kubernetes', 'Redis', 'RabbitMQ'],
        location: 'Seattle, WA',
        salaryRange: { min: 95000, max: 130000, currency: 'USD' },
        employmentType: 'full-time',
        experienceLevel: 'mid',
        remoteWork: 'hybrid',
        benefits: ['Health Insurance', '401k', 'Microsoft Stock', 'Gym Membership'],
        requirements: [
          '4+ years .NET experience',
          'C# and .NET Core proficiency',
          'SQL Server and Entity Framework',
          'Azure cloud services experience'
        ],
        responsibilities: [
          'Develop .NET applications',
          'Work with Azure services',
          'Design database schemas',
          'Collaborate with cross-functional teams'
        ],
        companyInfo: {
          website: 'https://microsoftpartners.com',
          size: '200-500 employees',
          industry: 'Technology',
          description: 'Microsoft Gold Partner specializing in enterprise solutions'
        }
      },
      {
        title: 'PHP Laravel Developer',
        company: 'WebCraft Studios',
        description: 'Join our web development team as a PHP Laravel developer. You will work on building robust web applications and APIs using Laravel framework.',
        requiredSkills: ['PHP', 'Laravel', 'MySQL', 'Redis', 'Git'],
        preferredSkills: ['Vue.js', 'Docker', 'AWS', 'Elasticsearch'],
        location: 'Austin, TX',
        salaryRange: { min: 75000, max: 105000, currency: 'USD' },
        employmentType: 'full-time',
        experienceLevel: 'mid',
        remoteWork: 'hybrid',
        benefits: ['Health Insurance', '401k', 'Flexible Schedule', 'Remote Work'],
        requirements: [
          '3+ years PHP experience',
          'Laravel framework proficiency',
          'MySQL database skills',
          'REST API development experience'
        ],
        responsibilities: [
          'Develop Laravel applications',
          'Build REST APIs',
          'Database design and optimization',
          'Frontend integration'
        ],
        companyInfo: {
          website: 'https://webcraftstudios.com',
          size: '20-50 employees',
          industry: 'Web Development',
          description: 'Creative web development agency'
        }
      },
      {
        title: 'Angular Developer',
        company: 'UI/UX Innovations',
        description: 'We are looking for an Angular developer to join our frontend team. You will work on building modern single-page applications using Angular and TypeScript.',
        requiredSkills: ['Angular', 'TypeScript', 'RxJS', 'Sass', 'Git'],
        preferredSkills: ['NgRx', 'Jest', 'Cypress', 'Storybook'],
        location: 'Chicago, IL',
        salaryRange: { min: 85000, max: 120000, currency: 'USD' },
        employmentType: 'full-time',
        experienceLevel: 'mid',
        remoteWork: 'hybrid',
        benefits: ['Health Insurance', '401k', 'Learning Budget', 'Flexible Hours'],
        requirements: [
          '3+ years Angular experience',
          'TypeScript proficiency',
          'RxJS and state management',
          'Testing frameworks experience'
        ],
        responsibilities: [
          'Develop Angular applications',
          'Implement responsive designs',
          'Write unit and integration tests',
          'Collaborate with UX designers'
        ],
        companyInfo: {
          website: 'https://uiuxinnovations.com',
          size: '50-100 employees',
          industry: 'Design & Development',
          description: 'UI/UX design and development agency'
        }
      }
    ];

    console.log('\n💼 Adding more jobs...');
    const createdJobs = [];
    for (const jobData of newJobs) {
      const job = new Job({
        ...jobData,
        postedBy: adminUser._id
      });
      await job.save();
      createdJobs.push(job);
      console.log(`✅ Created job: ${job.title}`);
    }

    // Create matches for all users with all jobs
    console.log('\n🎯 Creating job matches...');
    const allUsers = await User.find({ role: 'user' });
    const allJobs = await Job.find({ isActive: true });
    
    let matchCount = 0;
    for (const user of allUsers) {
      for (const job of allJobs) {
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

    // Display final statistics
    const totalUsers = await User.countDocuments({ role: 'user' });
    const totalJobs = await Job.countDocuments({ isActive: true });
    const totalMatches = await Match.countDocuments();

    console.log('\n📊 Final Database Statistics:');
    console.log(`👥 Total Users: ${totalUsers}`);
    console.log(`💼 Total Jobs: ${totalJobs}`);
    console.log(`🎯 Total Matches: ${totalMatches}`);

    await mongoose.connection.close();
    console.log('\n✅ Database updated successfully!');

  } catch (error) {
    console.error('❌ Error adding data:', error);
    process.exit(1);
  }
};

addMoreData();
