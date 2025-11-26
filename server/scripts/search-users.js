require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');

const searchUsers = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/skillmatchai', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('🔍 User Search Tool - SkillMatchAI');
    console.log('===================================\n');

    // Get search criteria from command line arguments
    const args = process.argv.slice(2);
    const searchTerm = args[0] || '';

    if (!searchTerm) {
      console.log('Usage: node search-users.js <search-term>');
      console.log('Examples:');
      console.log('  node search-users.js john          # Search by name');
      console.log('  node search-users.js @example.com  # Search by email domain');
      console.log('  node search-users.js react         # Search by skill');
      console.log('  node search-users.js admin         # Search by role');
      process.exit(1);
    }

    console.log(`🔍 Searching for: "${searchTerm}"\n`);

    // Build search query
    const searchQuery = {
      $or: [
        { name: { $regex: searchTerm, $options: 'i' } },
        { email: { $regex: searchTerm, $options: 'i' } },
        { skills: { $regex: searchTerm, $options: 'i' } },
        { role: { $regex: searchTerm, $options: 'i' } }
      ]
    };

    const users = await User.find(searchQuery)
      .select('name email role skills createdAt lastLogin preferences')
      .sort({ createdAt: -1 });

    console.log(`📊 Found ${users.length} users matching "${searchTerm}":\n`);

    if (users.length === 0) {
      console.log('❌ No users found matching your search criteria.');
      await mongoose.connection.close();
      return;
    }

    // Display results
    users.forEach((user, index) => {
      console.log(`${index + 1}. ${user.name} (${user.role})`);
      console.log(`   📧 Email: ${user.email}`);
      console.log(`   🛠️  Skills: ${user.skills ? user.skills.join(', ') : 'None'}`);
      console.log(`   📅 Created: ${user.createdAt ? user.createdAt.toLocaleString() : 'N/A'}`);
      console.log(`   🔐 Last Login: ${user.lastLogin ? user.lastLogin.toLocaleString() : 'Never'}`);
      console.log('');
    });

    // Show statistics
    const regularUsers = users.filter(u => u.role === 'user').length;
    const adminUsers = users.filter(u => u.role === 'admin').length;
    const usersWithSkills = users.filter(u => u.skills && u.skills.length > 0).length;

    console.log('📈 SEARCH STATISTICS:');
    console.log('=====================');
    console.log(`👥 Regular Users: ${regularUsers}`);
    console.log(`👑 Admin Users: ${adminUsers}`);
    console.log(`🛠️  Users with Skills: ${usersWithSkills}`);
    console.log(`📊 Total Found: ${users.length}`);

    await mongoose.connection.close();
    console.log('\n✅ Search complete!');

  } catch (error) {
    console.error('❌ Error:', error);
  }
};

searchUsers();
