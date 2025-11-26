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

const databaseBrowser = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/skillmatchai', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('🗄️  SkillMatchAI Database Browser');
    console.log('=================================\n');

    while (true) {
      console.log('Choose an option:');
      console.log('1. View all users');
      console.log('2. Search users');
      console.log('3. View user details by email');
      console.log('4. View jobs');
      console.log('5. View matches');
      console.log('6. Database statistics');
      console.log('7. Export user data');
      console.log('8. Exit');
      console.log('');

      const choice = await askQuestion('Enter your choice (1-8): ');

      switch (choice) {
        case '1':
          await viewAllUsers();
          break;
        case '2':
          await searchUsers();
          break;
        case '3':
          await viewUserByEmail();
          break;
        case '4':
          await viewJobs();
          break;
        case '5':
          await viewMatches();
          break;
        case '6':
          await showStatistics();
          break;
        case '7':
          await exportUserData();
          break;
        case '8':
          console.log('👋 Goodbye!');
          rl.close();
          await mongoose.connection.close();
          return;
        default:
          console.log('❌ Invalid choice. Please try again.\n');
      }

      console.log('\n' + '='.repeat(50) + '\n');
    }

  } catch (error) {
    console.error('❌ Error:', error);
    rl.close();
    process.exit(1);
  }
};

async function viewAllUsers() {
  console.log('\n👥 ALL USERS');
  console.log('============\n');

  const users = await User.find({})
    .select('name email role skills createdAt lastLogin')
    .sort({ createdAt: -1 })
    .limit(20);

  if (users.length === 0) {
    console.log('❌ No users found.');
    return;
  }

  console.log(`Showing ${users.length} users:\n`);

  users.forEach((user, index) => {
    console.log(`${index + 1}. ${user.name} (${user.role})`);
    console.log(`   📧 ${user.email}`);
    console.log(`   🛠️  Skills: ${user.skills ? user.skills.length : 0}`);
    console.log(`   📅 Created: ${user.createdAt ? user.createdAt.toLocaleDateString() : 'N/A'}`);
    console.log(`   🔐 Last Login: ${user.lastLogin ? user.lastLogin.toLocaleDateString() : 'Never'}`);
    console.log('');
  });

  if (users.length === 20) {
    console.log('... (showing first 20 users)');
  }
}

async function searchUsers() {
  console.log('\n🔍 SEARCH USERS');
  console.log('===============\n');

  const searchTerm = await askQuestion('Enter search term (name, email, skill, or role): ');
  
  if (!searchTerm.trim()) {
    console.log('❌ Search term cannot be empty.');
    return;
  }

  const searchQuery = {
    $or: [
      { name: { $regex: searchTerm, $options: 'i' } },
      { email: { $regex: searchTerm, $options: 'i' } },
      { skills: { $regex: searchTerm, $options: 'i' } },
      { role: { $regex: searchTerm, $options: 'i' } }
    ]
  };

  const users = await User.find(searchQuery)
    .select('name email role skills createdAt lastLogin')
    .sort({ createdAt: -1 })
    .limit(10);

  console.log(`\n📊 Found ${users.length} users matching "${searchTerm}":\n`);

  if (users.length === 0) {
    console.log('❌ No users found matching your search criteria.');
    return;
  }

  users.forEach((user, index) => {
    console.log(`${index + 1}. ${user.name} (${user.role})`);
    console.log(`   📧 ${user.email}`);
    console.log(`   🛠️  Skills: ${user.skills ? user.skills.join(', ') : 'None'}`);
    console.log(`   📅 Created: ${user.createdAt ? user.createdAt.toLocaleDateString() : 'N/A'}`);
    console.log('');
  });
}

async function viewUserByEmail() {
  console.log('\n👤 USER BY EMAIL');
  console.log('================\n');

  const email = await askQuestion('Enter user email: ');
  
  if (!email.trim()) {
    console.log('❌ Email cannot be empty.');
    return;
  }

  const user = await User.findOne({ email: email })
    .select('-password');

  if (!user) {
    console.log(`❌ No user found with email: ${email}`);
    return;
  }

  console.log('\n👤 USER DETAILS:');
  console.log('================');
  console.log(`Name: ${user.name}`);
  console.log(`Email: ${user.email}`);
  console.log(`Role: ${user.role}`);
  console.log(`Created: ${user.createdAt ? user.createdAt.toLocaleString() : 'N/A'}`);
  console.log(`Last Login: ${user.lastLogin ? user.lastLogin.toLocaleString() : 'Never'}`);
  console.log(`Active: ${user.isActive ? 'Yes' : 'No'}`);
  
  if (user.skills && user.skills.length > 0) {
    console.log(`Skills (${user.skills.length}): ${user.skills.join(', ')}`);
  } else {
    console.log('Skills: None');
  }

  if (user.resumeURL) {
    console.log(`Resume: ${user.resumeURL}`);
  }

  if (user.preferences) {
    console.log('\nPreferences:');
    if (user.preferences.jobTypes) {
      console.log(`  Job Types: ${user.preferences.jobTypes.join(', ')}`);
    }
    if (user.preferences.locations) {
      console.log(`  Locations: ${user.preferences.locations.join(', ')}`);
    }
    if (user.preferences.salaryRange) {
      console.log(`  Salary Range: $${user.preferences.salaryRange.min?.toLocaleString() || 'N/A'} - $${user.preferences.salaryRange.max?.toLocaleString() || 'N/A'}`);
    }
  }
}

async function viewJobs() {
  console.log('\n💼 JOBS');
  console.log('=======\n');

  const jobs = await Job.find({ isActive: true })
    .select('title company location salaryRange requiredSkills createdAt')
    .sort({ createdAt: -1 })
    .limit(10);

  if (jobs.length === 0) {
    console.log('❌ No jobs found.');
    return;
  }

  console.log(`Showing ${jobs.length} jobs:\n`);

  jobs.forEach((job, index) => {
    console.log(`${index + 1}. ${job.title}`);
    console.log(`   🏢 Company: ${job.company}`);
    console.log(`   📍 Location: ${job.location}`);
    console.log(`   💰 Salary: ${job.salaryRange ? `$${job.salaryRange.min?.toLocaleString() || 'N/A'} - $${job.salaryRange.max?.toLocaleString() || 'N/A'}` : 'Not specified'}`);
    console.log(`   🛠️  Skills: ${job.requiredSkills ? job.requiredSkills.length : 0} required`);
    console.log(`   📅 Posted: ${job.createdAt ? job.createdAt.toLocaleDateString() : 'N/A'}`);
    console.log('');
  });
}

async function viewMatches() {
  console.log('\n🎯 MATCHES');
  console.log('==========\n');

  const matches = await Match.find({})
    .populate('userId', 'name email')
    .populate('jobId', 'title company')
    .sort({ matchScore: -1 })
    .limit(10);

  if (matches.length === 0) {
    console.log('❌ No matches found.');
    return;
  }

  console.log(`Showing ${matches.length} matches:\n`);

  matches.forEach((match, index) => {
    console.log(`${index + 1}. ${match.userId?.name || 'Unknown User'} → ${match.jobId?.title || 'Unknown Job'}`);
    console.log(`   🏢 Company: ${match.jobId?.company || 'Unknown'}`);
    console.log(`   📊 Match Score: ${match.matchScore}%`);
    console.log(`   🎯 Recommendation: ${match.recommendation}`);
    console.log(`   ✅ Matched Skills: ${match.matchedSkills ? match.matchedSkills.length : 0}`);
    console.log(`   ❌ Missing Skills: ${match.missingSkills ? match.missingSkills.length : 0}`);
    console.log('');
  });
}

async function showStatistics() {
  console.log('\n📊 DATABASE STATISTICS');
  console.log('======================\n');

  const totalUsers = await User.countDocuments({ role: 'user' });
  const totalAdmins = await User.countDocuments({ role: 'admin' });
  const totalJobs = await Job.countDocuments({ isActive: true });
  const totalMatches = await Match.countDocuments();
  const usersWithResumes = await User.countDocuments({ resumeURL: { $exists: true, $ne: null } });

  console.log('📈 OVERVIEW:');
  console.log(`👥 Regular Users: ${totalUsers.toLocaleString()}`);
  console.log(`👑 Admin Users: ${totalAdmins.toLocaleString()}`);
  console.log(`💼 Active Jobs: ${totalJobs.toLocaleString()}`);
  console.log(`🎯 Total Matches: ${totalMatches.toLocaleString()}`);
  console.log(`📄 Users with Resumes: ${usersWithResumes.toLocaleString()}`);
  console.log(`📊 Total Records: ${(totalUsers + totalAdmins + totalJobs + totalMatches).toLocaleString()}`);

  // Recent activity
  const recentUsers = await User.countDocuments({
    createdAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) }
  });

  const recentJobs = await Job.countDocuments({
    createdAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) }
  });

  console.log('\n📅 RECENT ACTIVITY (Last 7 days):');
  console.log(`👥 New Users: ${recentUsers}`);
  console.log(`💼 New Jobs: ${recentJobs}`);

  // Top skills
  const users = await User.find({ role: 'user', skills: { $exists: true, $ne: [] } });
  const allSkills = [];
  users.forEach(user => {
    if (user.skills) {
      allSkills.push(...user.skills);
    }
  });

  const skillCounts = {};
  allSkills.forEach(skill => {
    skillCounts[skill] = (skillCounts[skill] || 0) + 1;
  });

  const topSkills = Object.entries(skillCounts)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 5);

  console.log('\n🛠️  TOP SKILLS:');
  topSkills.forEach(([skill, count], index) => {
    const percentage = ((count / users.length) * 100).toFixed(1);
    console.log(`${index + 1}. ${skill} - ${count} users (${percentage}%)`);
  });
}

async function exportUserData() {
  console.log('\n📤 EXPORT USER DATA');
  console.log('===================\n');

  const users = await User.find({ role: 'user' })
    .select('name email skills createdAt lastLogin preferences')
    .sort({ createdAt: -1 });

  if (users.length === 0) {
    console.log('❌ No users found to export.');
    return;
  }

  console.log(`📊 Exporting ${users.length} users...\n`);

  // Create CSV-like output
  console.log('CSV Format:');
  console.log('Name,Email,Skills,Skills Count,Created,Last Login,Job Types,Locations,Salary Min,Salary Max');
  
  users.forEach(user => {
    const name = user.name.replace(/,/g, ';');
    const email = user.email;
    const skills = user.skills ? user.skills.join(';') : '';
    const skillsCount = user.skills ? user.skills.length : 0;
    const created = user.createdAt ? user.createdAt.toISOString().split('T')[0] : '';
    const lastLogin = user.lastLogin ? user.lastLogin.toISOString().split('T')[0] : '';
    const jobTypes = user.preferences?.jobTypes ? user.preferences.jobTypes.join(';') : '';
    const locations = user.preferences?.locations ? user.preferences.locations.join(';') : '';
    const salaryMin = user.preferences?.salaryRange?.min || '';
    const salaryMax = user.preferences?.salaryRange?.max || '';

    console.log(`${name},${email},${skills},${skillsCount},${created},${lastLogin},${jobTypes},${locations},${salaryMin},${salaryMax}`);
  });

  console.log('\n✅ Export complete! Copy the data above to a CSV file.');
}

databaseBrowser();
