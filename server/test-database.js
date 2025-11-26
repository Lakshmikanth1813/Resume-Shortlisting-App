const mongoose = require('mongoose');
require('dotenv').config();

async function testDatabase() {
  try {
    console.log('🔍 Testing database connection...');
    
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/skillmatchai';
    console.log('📡 Connecting to:', mongoUri.replace(/\/\/.*@/, '//***:***@')); // Hide credentials
    
    await mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    console.log('✅ Database connected successfully!');
    console.log('📊 Database name:', mongoose.connection.name);
    console.log('🌐 Host:', mongoose.connection.host);
    console.log('🔌 Port:', mongoose.connection.port);
    
    // Test creating a simple document
    const testSchema = new mongoose.Schema({ name: String, timestamp: Date });
    const TestModel = mongoose.model('Test', testSchema);
    
    const testDoc = new TestModel({ 
      name: 'SkillMatchAI Test', 
      timestamp: new Date() 
    });
    
    await testDoc.save();
    console.log('✅ Test document created successfully');
    
    // Clean up test document
    await TestModel.deleteOne({ _id: testDoc._id });
    console.log('🧹 Test document cleaned up');
    
    await mongoose.connection.close();
    console.log('🔌 Database connection closed');
    console.log('🎉 Database test completed successfully!');
    
  } catch (error) {
    console.error('❌ Database test failed:', error.message);
    
    if (error.message.includes('ECONNREFUSED')) {
      console.log('\n💡 Troubleshooting tips:');
      console.log('1. Make sure MongoDB is running');
      console.log('2. Check if the connection string is correct');
      console.log('3. For local MongoDB: mongodb://localhost:27017/skillmatchai');
      console.log('4. For Atlas: Check your connection string and network access');
    }
    
    process.exit(1);
  }
}

testDatabase();
