const axios = require('axios');

async function testBackendAI() {
  try {
    console.log('🧪 Testing Backend AI Integration...\n');
    
    // Test if server is running
    console.log('1. Testing server health...');
    const healthResponse = await axios.get('http://localhost:5000/api/health');
    console.log('✅ Server health:', healthResponse.data.message);
    
    // Test AI service directly
    console.log('\n2. Testing AI service directly...');
    const aiResponse = await axios.post('http://localhost:5001/extract-skills', {
      text: 'I have 5 years of experience with Python, Django, React, AWS, Docker, PostgreSQL, and Git. I am also proficient in JavaScript, HTML, CSS, and Node.js.'
    });
    console.log('✅ AI service skills:', aiResponse.data.skills);
    
    // Test if environment variable is accessible
    console.log('\n3. Checking environment variables...');
    console.log('AI_SERVICE_URL from env:', process.env.AI_SERVICE_URL);
    
    console.log('\n✅ All tests passed! The issue might be in the authentication or frontend integration.');
    console.log('📝 Next steps:');
    console.log('   1. Login through frontend');
    console.log('   2. Upload a resume');
    console.log('   3. Check browser console for AI service logs');
    console.log('   4. Check server console for error messages');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    }
  }
}

testBackendAI();
