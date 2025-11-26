const axios = require('axios');

async function testTextExtraction() {
  try {
    console.log('🧪 Testing Text-Based Skill Extraction...\n');
    
    // Test with sample resume text
    const sampleResumeText = `
John Doe
Software Engineer
Email: john.doe@email.com
Phone: (555) 123-4567

EXPERIENCE:
- 5 years of experience with Python, Django, and Flask
- Proficient in JavaScript, React, Node.js, and Express.js
- Database management with PostgreSQL, MongoDB, and Redis
- Cloud platforms: AWS, Azure, Google Cloud
- DevOps: Docker, Kubernetes, CI/CD pipelines
- Version control: Git, GitHub, GitLab

EDUCATION:
Bachelor of Computer Science
University of Technology, 2018

SKILLS:
- Programming Languages: Python, JavaScript, Java, C++, SQL
- Web Technologies: HTML, CSS, React, Angular, Vue.js
- Databases: MySQL, PostgreSQL, MongoDB, Redis
- Cloud: AWS, Azure, Google Cloud Platform
- Tools: Docker, Kubernetes, Jenkins, Git
    `;
    
    console.log('1. Testing AI service with text input...');
    const response = await axios.post('http://localhost:5001/extract-skills', {
      text: sampleResumeText
    });
    
    console.log('✅ AI service response:', response.data);
    console.log('🎯 Extracted skills:', response.data.skills);
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    }
  }
}

testTextExtraction();
