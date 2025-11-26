const axios = require('axios');

async function testSkillExtraction() {
  try {
    console.log('🧪 Testing Backend AI Integration...\n');
    
    // Test 1: Direct AI Service
    console.log('1. Testing AI Service directly...');
    const aiResponse = await axios.post('http://localhost:5001/extract-skills', {
      text: 'I have experience with Python, React, Node.js, MongoDB, AWS, and Docker. I am proficient in JavaScript, HTML, CSS, and Git.'
    });
    console.log('✅ AI Service Response:', aiResponse.data);
    
    // Test 2: Backend AI Integration (requires authentication)
    console.log('\n2. Testing Backend AI Integration...');
    console.log('⚠️  Note: This requires authentication. Please login through frontend first.');
    
    // You can test this by:
    // 1. Login through frontend
    // 2. Upload a resume
    // 3. Check browser console for AI service logs
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    if (error.response) {
      console.error('Response:', error.response.data);
    }
  }
}

testSkillExtraction();
