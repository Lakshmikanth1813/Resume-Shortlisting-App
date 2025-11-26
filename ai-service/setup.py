#!/usr/bin/env python3
"""
Setup script for the AI service
Installs required dependencies and downloads spaCy model
"""

import subprocess
import sys
import os

def run_command(command, description):
    """Run a command and handle errors"""
    print(f"🔧 {description}...")
    try:
        result = subprocess.run(command, shell=True, check=True, capture_output=True, text=True)
        print(f"✅ {description} completed successfully")
        return True
    except subprocess.CalledProcessError as e:
        print(f"❌ {description} failed: {e}")
        if e.stdout:
            print(f"Output: {e.stdout}")
        if e.stderr:
            print(f"Error: {e.stderr}")
        return False

def main():
    """Main setup function"""
    print("🚀 Setting up AI Service for SkillMatchAI...")
    print("=" * 50)
    
    # Check Python version
    python_version = sys.version_info
    if python_version.major < 3 or (python_version.major == 3 and python_version.minor < 8):
        print("❌ Python 3.8 or higher is required")
        sys.exit(1)
    
    print(f"✅ Python {python_version.major}.{python_version.minor}.{python_version.micro} detected")
    
    # Install Python dependencies
    if not run_command("pip install -r requirements.txt", "Installing Python dependencies"):
        print("❌ Failed to install dependencies")
        sys.exit(1)
    
    # Download spaCy English model
    if not run_command("python -m spacy download en_core_web_sm", "Downloading spaCy English model"):
        print("⚠️  Warning: Could not download spaCy model. The service will use regex fallback.")
    
    # Download NLTK data
    if not run_command("python -c \"import nltk; nltk.download('punkt'); nltk.download('stopwords')\"", "Downloading NLTK data"):
        print("⚠️  Warning: Could not download NLTK data. Some features may not work.")
    
    print("=" * 50)
    print("🎉 AI Service setup completed!")
    print("\n📋 Next steps:")
    print("1. Run the service: python app.py")
    print("2. Test the service: curl http://localhost:5001/health")
    print("3. The service will be available at: http://localhost:5001")
    print("\n🔗 API Endpoints:")
    print("   - GET  /health - Health check")
    print("   - POST /extract-skills - Extract skills from text")
    print("   - POST /match-skills - Match user skills with job requirements")
    print("   - POST /analyze-resume - Complete resume analysis")

if __name__ == "__main__":
    main()
