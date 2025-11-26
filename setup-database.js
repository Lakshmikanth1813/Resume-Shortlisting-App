#!/usr/bin/env node

const readline = require('readline');
const fs = require('fs');
const path = require('path');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log('🗄️  SkillMatchAI Database Setup');
console.log('================================\n');

async function askQuestion(question) {
  return new Promise((resolve) => {
    rl.question(question, resolve);
  });
}

async function setupDatabase() {
  try {
    console.log('Choose your MongoDB setup:');
    console.log('1. MongoDB Atlas (Cloud) - Recommended');
    console.log('2. Local MongoDB');
    console.log('3. Skip setup (use existing configuration)\n');

    const choice = await askQuestion('Enter your choice (1-3): ');

    switch (choice) {
      case '1':
        await setupAtlas();
        break;
      case '2':
        await setupLocal();
        break;
      case '3':
        console.log('✅ Skipping database setup');
        break;
      default:
        console.log('❌ Invalid choice. Please run the script again.');
        process.exit(1);
    }

    console.log('\n🎉 Database setup completed!');
    console.log('\nNext steps:');
    console.log('1. Start the backend server: cd server && npm run dev');
    console.log('2. Seed the database: cd server && npm run seed');
    console.log('3. Start the frontend: cd client && npm start');

  } catch (error) {
    console.error('❌ Setup error:', error.message);
  } finally {
    rl.close();
  }
}

async function setupAtlas() {
  console.log('\n🌐 MongoDB Atlas Setup');
  console.log('=====================\n');
  
  console.log('1. Go to https://www.mongodb.com/atlas');
  console.log('2. Create a free account and cluster');
  console.log('3. Create a database user');
  console.log('4. Whitelist your IP address (0.0.0.0/0 for development)');
  console.log('5. Get your connection string\n');

  const connectionString = await askQuestion('Enter your MongoDB Atlas connection string: ');
  
  if (connectionString && connectionString.includes('mongodb+srv://')) {
    updateEnvFile(connectionString);
    console.log('✅ MongoDB Atlas connection string saved');
  } else {
    console.log('❌ Invalid connection string format');
  }
}

async function setupLocal() {
  console.log('\n💻 Local MongoDB Setup');
  console.log('=====================\n');
  
  console.log('1. Install MongoDB Community Server');
  console.log('2. Start MongoDB service');
  console.log('3. Default connection: mongodb://localhost:27017/skillmatchai\n');

  const useDefault = await askQuestion('Use default local connection? (y/n): ');
  
  if (useDefault.toLowerCase() === 'y' || useDefault.toLowerCase() === 'yes') {
    updateEnvFile('mongodb://localhost:27017/skillmatchai');
    console.log('✅ Local MongoDB connection configured');
  } else {
    const customUri = await askQuestion('Enter custom MongoDB URI: ');
    if (customUri) {
      updateEnvFile(customUri);
      console.log('✅ Custom MongoDB URI saved');
    }
  }
}

function updateEnvFile(mongodbUri) {
  const envPath = path.join(__dirname, 'server', '.env');
  
  try {
    let envContent = '';
    
    if (fs.existsSync(envPath)) {
      envContent = fs.readFileSync(envPath, 'utf8');
    }
    
    // Update or add MONGODB_URI
    if (envContent.includes('MONGODB_URI=')) {
      envContent = envContent.replace(/MONGODB_URI=.*/, `MONGODB_URI=${mongodbUri}`);
    } else {
      envContent += `\nMONGODB_URI=${mongodbUri}\n`;
    }
    
    fs.writeFileSync(envPath, envContent);
    console.log('📝 Updated .env file');
    
  } catch (error) {
    console.error('❌ Error updating .env file:', error.message);
  }
}

setupDatabase();
