require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');
const Job = require('../models/Job');
const Match = require('../models/Match');

const viewUsers = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/skillmatchai', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('👥 User Database Analysis - SkillMatchAI');
    console.log('========================================\n');

    // Get total counts
    const totalUsers = await User.countDocuments({ role: 'user' });
    const totalAdmins = await User.countDocuments({ role: 'admin' });
    const totalJobs = await Job.countDocuments({ isActive: true });
    const totalMatches = await Match.countDocuments();

    console.log('📊 DATABASE OVERVIEW:');
    console.log('====================');
    console.log(`👥 Regular Users: ${totalUsers.toLocaleString()}`);
    console.log(`👑 Admin Users: ${totalAdmins.toLocaleString()}`);
    console.log(`💼 Active Jobs: ${totalJobs.toLocaleString()}`);
    console.log(`🎯 Total Matches: ${totalMatches.toLocaleString()}`);
    console.log(`📈 Total Records: ${(totalUsers + totalAdmins + totalJobs + totalMatches).toLocaleString()}\n`);

    // Get all users with details
    const users = await User.find({ role: 'user' })
      .select('name email skills createdAt lastLogin preferences')
      .sort({ createdAt: -1 });

    console.log('👤 USER DETAILS:');
    console.log('================');
    console.log(`Found ${users.length} users:\n`);

    // Display users in a table format
    console.log('┌─────┬─────────────────────┬─────────────────────────────────┬─────────────┬─────────────────┬─────────────┐');
    console.log('│ No. │ Name                │ Email                           │ Skills      │ Created         │ Last Login   │');
    console.log('├─────┼─────────────────────┼─────────────────────────────────┼─────────────┼─────────────────┼─────────────┤');

    users.forEach((user, index) => {
      const name = user.name.length > 20 ? user.name.substring(0, 17) + '...' : user.name.padEnd(20);
      const email = user.email.length > 30 ? user.email.substring(0, 27) + '...' : user.email.padEnd(30);
      const skills = user.skills ? user.skills.length.toString().padEnd(11) : '0'.padEnd(11);
      const created = user.createdAt ? user.createdAt.toLocaleDateString().padEnd(15) : 'N/A'.padEnd(15);
      const lastLogin = user.lastLogin ? user.lastLogin.toLocaleDateString().padEnd(15) : 'Never'.padEnd(15);
      
      console.log(`│ ${(index + 1).toString().padStart(3)} │ ${name} │ ${email} │ ${skills} │ ${created} │ ${lastLogin} │`);
    });

    console.log('└─────┴─────────────────────┴─────────────────────────────────┴─────────────┴─────────────────┴─────────────┘\n');

    // Show detailed info for first 5 users
    console.log('🔍 DETAILED USER INFORMATION (First 5 Users):');
    console.log('==============================================\n');

    for (let i = 0; i < Math.min(5, users.length); i++) {
      const user = users[i];
      console.log(`${i + 1}. ${user.name}`);
      console.log(`   📧 Email: ${user.email}`);
      console.log(`   🛠️  Skills (${user.skills.length}): ${user.skills.join(', ')}`);
      console.log(`   📅 Created: ${user.createdAt ? user.createdAt.toLocaleString() : 'N/A'}`);
      console.log(`   🔐 Last Login: ${user.lastLogin ? user.lastLogin.toLocaleString() : 'Never'}`);
      if (user.preferences) {
        console.log(`   💼 Job Types: ${user.preferences.jobTypes ? user.preferences.jobTypes.join(', ') : 'Not set'}`);
        console.log(`   📍 Locations: ${user.preferences.locations ? user.preferences.locations.join(', ') : 'Not set'}`);
        if (user.preferences.salaryRange) {
          console.log(`   💰 Salary Range: $${user.preferences.salaryRange.min?.toLocaleString() || 'N/A'} - $${user.preferences.salaryRange.max?.toLocaleString() || 'N/A'}`);
        }
      }
      console.log('');
    }

    // Show admin users
    const admins = await User.find({ role: 'admin' })
      .select('name email createdAt lastLogin');

    if (admins.length > 0) {
      console.log('👑 ADMIN USERS:');
      console.log('===============');
      admins.forEach((admin, index) => {
        console.log(`${index + 1}. ${admin.name}`);
        console.log(`   📧 Email: ${admin.email}`);
        console.log(`   📅 Created: ${admin.createdAt ? admin.createdAt.toLocaleString() : 'N/A'}`);
        console.log(`   🔐 Last Login: ${admin.lastLogin ? admin.lastLogin.toLocaleString() : 'Never'}`);
        console.log('');
      });
    }

    // Show skill statistics
    console.log('📈 SKILL STATISTICS:');
    console.log('====================');
    
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
      .slice(0, 10);

    console.log('Top 10 Most Common Skills:');
    topSkills.forEach(([skill, count], index) => {
      const percentage = ((count / users.length) * 100).toFixed(1);
      console.log(`${(index + 1).toString().padStart(2)}. ${skill.padEnd(20)} - ${count.toString().padStart(3)} users (${percentage}%)`);
    });

    console.log('\n📊 SUMMARY:');
    console.log('============');
    console.log(`• Average skills per user: ${(allSkills.length / users.length).toFixed(1)}`);
    console.log(`• Most common skill: ${topSkills[0] ? topSkills[0][0] : 'N/A'} (${topSkills[0] ? topSkills[0][1] : 0} users)`);
    console.log(`• Unique skills: ${Object.keys(skillCounts).length}`);
    console.log(`• Users with skills: ${users.filter(u => u.skills && u.skills.length > 0).length}`);

    await mongoose.connection.close();
    console.log('\n✅ Analysis complete!');

  } catch (error) {
    console.error('❌ Error:', error);
  }
};

viewUsers();
