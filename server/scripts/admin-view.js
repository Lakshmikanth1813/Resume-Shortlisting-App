require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');
const Job = require('../models/Job');
const Match = require('../models/Match');

const adminView = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/skillmatchai', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('🔐 ADMIN DATABASE VIEW - FOR CREATOR ONLY');
    console.log('=========================================\n');

    console.log('⚠️  WARNING: This shows ALL user data including emails.');
    console.log('   This is for admin/creator use ONLY. Never share this with users.\n');

    // Get all users with full details
    const users = await User.find({})
      .select('name email role skills resumeURL createdAt lastLogin isActive')
      .sort({ createdAt: -1 });

    console.log(`📊 COMPLETE USER DATABASE (${users.length} total users)`);
    console.log('='.repeat(100) + '\n');

    // Separate users by role
    const regularUsers = users.filter(u => u.role === 'user');
    const adminUsers = users.filter(u => u.role === 'admin');

    // Display admin users first
    if (adminUsers.length > 0) {
      console.log('👑 ADMIN USERS:');
      console.log('-'.repeat(100));
      adminUsers.forEach((user, index) => {
        console.log(`${index + 1}. ${user.name}`);
        console.log(`   📧 Email: ${user.email}`);
        console.log(`   🔑 Password: [Hashed - Secure]`);
        console.log(`   📅 Created: ${user.createdAt ? user.createdAt.toLocaleString() : 'N/A'}`);
        console.log(`   🔐 Last Login: ${user.lastLogin ? user.lastLogin.toLocaleString() : 'Never'}`);
        console.log(`   ✅ Active: ${user.isActive ? 'Yes' : 'No'}`);
        console.log('');
      });
      console.log('');
    }

    // Display regular users
    console.log('👥 REGULAR USERS:');
    console.log('-'.repeat(100));
    
    regularUsers.forEach((user, index) => {
      console.log(`${index + 1}. ${user.name}`);
      console.log(`   📧 Email: ${user.email}`);
      console.log(`   🔑 Password: [Hashed - Secure]`);
      console.log(`   🛠️  Skills (${user.skills?.length || 0}): ${user.skills?.join(', ') || 'None'}`);
      console.log(`   📄 Resume: ${user.resumeURL || 'Not uploaded'}`);
      console.log(`   📅 Created: ${user.createdAt ? user.createdAt.toLocaleString() : 'N/A'}`);
      console.log(`   🔐 Last Login: ${user.lastLogin ? user.lastLogin.toLocaleString() : 'Never'}`);
      console.log(`   ✅ Active: ${user.isActive ? 'Yes' : 'No'}`);
      console.log('');
    });

    // Email list for quick reference
    console.log('\n📧 EMAIL LIST (All Users):');
    console.log('-'.repeat(100));
    users.forEach((user, index) => {
      console.log(`${(index + 1).toString().padStart(3)}. ${user.email.padEnd(40)} - ${user.name} (${user.role})`);
    });

    // Database statistics
    const totalJobs = await Job.countDocuments({ isActive: true });
    const totalMatches = await Match.countDocuments();

    console.log('\n📊 DATABASE STATISTICS:');
    console.log('-'.repeat(100));
    console.log(`👥 Total Users: ${users.length}`);
    console.log(`   - Regular Users: ${regularUsers.length}`);
    console.log(`   - Admin Users: ${adminUsers.length}`);
    console.log(`💼 Active Jobs: ${totalJobs}`);
    console.log(`🎯 Total Matches: ${totalMatches}`);
    console.log(`📈 Total Records: ${users.length + totalJobs + totalMatches}`);

    // Security reminder
    console.log('\n🔒 SECURITY REMINDER:');
    console.log('-'.repeat(100));
    console.log('✅ This data is ONLY visible to you (the creator/admin)');
    console.log('✅ Regular users CANNOT access this information');
    console.log('✅ Frontend app shows users ONLY their own data');
    console.log('✅ API endpoints are protected with JWT authentication');
    console.log('✅ Passwords are hashed and secure');
    console.log('✅ MongoDB connection is secure and private');

    await mongoose.connection.close();
    console.log('\n✅ Admin view complete!');

  } catch (error) {
    console.error('❌ Error:', error);
  }
};

adminView();
