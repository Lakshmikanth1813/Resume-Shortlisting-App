require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const Job = require('./models/Job');
const Match = require('./models/Match');

async function checkStats() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/skillmatchai', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    const users = await User.countDocuments({ role: 'user' });
    const jobs = await Job.countDocuments({ isActive: true });
    const matches = await Match.countDocuments();
    const admins = await User.countDocuments({ role: 'admin' });

    console.log('📊 Current Database Statistics:');
    console.log('===============================');
    console.log(`👥 Users: ${users}`);
    console.log(`👑 Admins: ${admins}`);
    console.log(`💼 Jobs: ${jobs}`);
    console.log(`🎯 Matches: ${matches}`);

    await mongoose.connection.close();
  } catch (error) {
    console.error('Error:', error);
  }
}

checkStats();
