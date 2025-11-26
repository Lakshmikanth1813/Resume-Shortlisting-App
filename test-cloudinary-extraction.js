const axios = require('axios');

async function testCloudinaryExtraction() {
  try {
    console.log('🧪 Testing AI Service with Cloudinary URL...\n');
    
    // Test with a sample Cloudinary URL format
    const testUrl = 'https://res.cloudinary.com/dbkqdntjk/raw/upload/v1736935304/skillmatchai/resumes/resume_test_1234567890.pdf';
    
    console.log('1. Testing AI service directly...');
    const response = await axios.post('http://localhost:5001/extract-skills', {
      resume_url: testUrl,
      text: '' // Empty text to force URL extraction
    });
    
    console.log('✅ AI service response:', response.data);
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    }
  }
}

testCloudinaryExtraction();

