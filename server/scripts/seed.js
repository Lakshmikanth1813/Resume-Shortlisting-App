require('dotenv').config();
const mongoose = require('mongoose');
const { seedDatabase } = require('../config/seed');

const runSeed = async () => {
  try {
    // Connect to database
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/skillmatchai', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('✅ Connected to MongoDB for seeding');

    // Run seeding
    await seedDatabase();

    // Close connection
    await mongoose.connection.close();
    console.log('🔌 Database connection closed');
    process.exit(0);

  } catch (error) {
    console.error('❌ Seeding error:', error);
    process.exit(1);
  }
};

runSeed();
