const axios = require('axios');

async function testAIConnection() {
  try {
    console.log('🧪 Testing Backend -> AI Service Connection...\n');
    
    const aiServiceUrl = process.env.AI_SERVICE_URL || 'http://localhost:5001';
    console.log('🔗 AI Service URL:', aiServiceUrl);
    
    // Test direct AI service call
    console.log('1. Testing direct AI service call...');
    const directResponse = await axios.post(`${aiServiceUrl}/extract-skills`, {
      text: 'I have experience with Python, React, Node.js, MongoDB, AWS, and Docker.'
    });
    console.log('✅ Direct AI service response:', directResponse.data);
    
    // Test if backend can make the same call
    console.log('\n2. Testing backend AI service call...');
    const backendResponse = await axios.post(`${aiServiceUrl}/extract-skills`, {
      resume_url: 'https://example.com/test.pdf',
      text: 'I have experience with Python, React, Node.js, MongoDB, AWS, and Docker.'
    });
    console.log('✅ Backend AI service response:', backendResponse.data);
    
  } catch (error) {
    console.error('❌ Connection test failed:', error.message);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    }
  }
}

testAIConnection();
