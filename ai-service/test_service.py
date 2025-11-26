#!/usr/bin/env python3
"""
Test script for the AI service
Tests all endpoints with sample data
"""

import requests
import json
import time

# Service URL
BASE_URL = "http://localhost:5001"

def test_health():
    """Test health endpoint"""
    print("🔍 Testing health endpoint...")
    try:
        response = requests.get(f"{BASE_URL}/health")
        if response.status_code == 200:
            data = response.json()
            print(f"✅ Health check passed: {data['status']}")
            print(f"   spaCy loaded: {data['spacy_loaded']}")
            return True
        else:
            print(f"❌ Health check failed: {response.status_code}")
            return False
    except Exception as e:
        print(f"❌ Health check error: {e}")
        return False

def test_extract_skills():
    """Test skill extraction endpoint"""
    print("\n🔍 Testing skill extraction...")
    
    sample_resume = """
    John Doe
    Software Engineer
    
    Experience:
    - 5 years of experience in Python development
    - Worked with React, JavaScript, and Node.js
    - Proficient in MongoDB and PostgreSQL
    - Experience with AWS and Docker
    - Led agile development teams
    - Strong communication and leadership skills
    
    Skills:
    - Python, JavaScript, React, Node.js
    - MongoDB, PostgreSQL, Redis
    - AWS, Docker, Kubernetes
    - Git, Jenkins, CI/CD
    - Agile, Scrum, Project Management
    """
    
    try:
        response = requests.post(f"{BASE_URL}/extract-skills", json={
            "text": sample_resume
        })
        
        if response.status_code == 200:
            data = response.json()
            print(f"✅ Skill extraction successful")
            print(f"   Found {data['skill_count']} skills")
            print(f"   Method: {data['method']}")
            print(f"   Skills: {', '.join(data['skills'][:10])}{'...' if len(data['skills']) > 10 else ''}")
            return data['skills']
        else:
            print(f"❌ Skill extraction failed: {response.status_code}")
            print(f"   Error: {response.text}")
            return []
    except Exception as e:
        print(f"❌ Skill extraction error: {e}")
        return []

def test_match_skills(user_skills):
    """Test skill matching endpoint"""
    print("\n🔍 Testing skill matching...")
    
    job_requirements = [
        "python", "javascript", "react", "node.js", "mongodb", 
        "aws", "docker", "typescript", "kubernetes", "git"
    ]
    
    try:
        response = requests.post(f"{BASE_URL}/match-skills", json={
            "user_skills": user_skills,
            "job_requirements": job_requirements
        })
        
        if response.status_code == 200:
            data = response.json()
            print(f"✅ Skill matching successful")
            print(f"   Match score: {data['match_score']}%")
            print(f"   Matching skills: {', '.join(data['matching_skills'])}")
            print(f"   Missing skills: {', '.join(data['missing_skills'])}")
            return True
        else:
            print(f"❌ Skill matching failed: {response.status_code}")
            print(f"   Error: {response.text}")
            return False
    except Exception as e:
        print(f"❌ Skill matching error: {e}")
        return False

def test_analyze_resume():
    """Test complete resume analysis"""
    print("\n🔍 Testing resume analysis...")
    
    sample_resume = """
    Jane Smith
    Full Stack Developer
    
    Technical Skills:
    - Frontend: React, Vue.js, HTML5, CSS3, JavaScript, TypeScript
    - Backend: Node.js, Python, Django, Flask, Express.js
    - Databases: MongoDB, PostgreSQL, Redis, MySQL
    - Cloud: AWS, Azure, Google Cloud Platform
    - DevOps: Docker, Kubernetes, Jenkins, GitLab CI
    - Tools: Git, VS Code, Postman, Figma
    
    Soft Skills:
    - Team leadership and mentoring
    - Agile project management
    - Excellent communication skills
    - Problem-solving and critical thinking
    """
    
    try:
        response = requests.post(f"{BASE_URL}/analyze-resume", json={
            "text": sample_resume
        })
        
        if response.status_code == 200:
            data = response.json()
            print(f"✅ Resume analysis successful")
            print(f"   Total skills: {data['statistics']['total_skills']}")
            print(f"   Technical skills: {data['statistics']['technical_skills_count']}")
            print(f"   Soft skills: {data['statistics']['soft_skills_count']}")
            print(f"   Word count: {data['statistics']['word_count']}")
            return True
        else:
            print(f"❌ Resume analysis failed: {response.status_code}")
            print(f"   Error: {response.text}")
            return False
    except Exception as e:
        print(f"❌ Resume analysis error: {e}")
        return False

def main():
    """Main test function"""
    print("🧪 Testing AI Service...")
    print("=" * 50)
    
    # Wait a moment for service to be ready
    print("⏳ Waiting for service to be ready...")
    time.sleep(2)
    
    # Test all endpoints
    tests_passed = 0
    total_tests = 4
    
    # Test health
    if test_health():
        tests_passed += 1
    
    # Test skill extraction
    user_skills = test_extract_skills()
    if user_skills:
        tests_passed += 1
    
    # Test skill matching
    if user_skills and test_match_skills(user_skills):
        tests_passed += 1
    
    # Test resume analysis
    if test_analyze_resume():
        tests_passed += 1
    
    print("\n" + "=" * 50)
    print(f"📊 Test Results: {tests_passed}/{total_tests} tests passed")
    
    if tests_passed == total_tests:
        print("🎉 All tests passed! AI Service is working correctly.")
    else:
        print("⚠️  Some tests failed. Check the service logs for details.")
    
    print("\n🔗 Service is ready at: http://localhost:5001")

if __name__ == "__main__":
    main()
