import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Brain, 
  Target, 
  TrendingUp, 
  Users, 
  Upload, 
  BarChart3,
  CheckCircle,
  ArrowRight
} from 'lucide-react';

const LandingPage = () => {
  const features = [
    {
      icon: <Brain className="w-8 h-8 text-primary-600" />,
      title: "AI-Powered Skill Extraction",
      description: "Advanced NLP algorithms extract skills from your resume automatically"
    },
    {
      icon: <Target className="w-8 h-8 text-primary-600" />,
      title: "Smart Job Matching",
      description: "Get personalized job recommendations based on your skills and preferences"
    },
    {
      icon: <TrendingUp className="w-8 h-8 text-primary-600" />,
      title: "Skill Gap Analysis",
      description: "Identify missing skills and get recommendations for career growth"
    },
    {
      icon: <BarChart3 className="w-8 h-8 text-primary-600" />,
      title: "Analytics Dashboard",
      description: "Track your job matches, skill development, and market trends"
    }
  ];

  const steps = [
    {
      number: "01",
      title: "Upload Your Resume",
      description: "Upload your resume in PDF or DOCX format"
    },
    {
      number: "02",
      title: "AI Extracts Skills",
      description: "Our AI analyzes and extracts your technical skills"
    },
    {
      number: "03",
      title: "Get Job Matches",
      description: "Receive personalized job recommendations with match scores"
    },
    {
      number: "04",
      title: "Improve Your Skills",
      description: "Get suggestions for skills to learn for better opportunities"
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-50 to-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Find Your Perfect Job with
              <span className="text-primary-600"> AI-Powered</span> Matching
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Upload your resume, let our AI extract your skills, and get personalized job recommendations 
              with detailed skill gap analysis to boost your career.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/register"
                className="btn-primary text-lg px-8 py-3 inline-flex items-center"
              >
                Get Started Free
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
              <Link
                to="/login"
                className="btn-secondary text-lg px-8 py-3"
              >
                Sign In
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Choose SkillMatchAI?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Our platform combines cutting-edge AI technology with user-friendly design 
              to revolutionize how you find and land your dream job.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="card text-center hover:shadow-lg transition-shadow">
                <div className="flex justify-center mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Get started in minutes with our simple 4-step process
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-primary-600 text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                  {step.number}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {step.title}
                </h3>
                <p className="text-gray-600">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-primary-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Trusted by Job Seekers Worldwide
            </h2>
            <p className="text-xl text-primary-100 max-w-2xl mx-auto">
              Join thousands of professionals who have found their dream jobs with our platform
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-4xl md:text-5xl font-bold text-white mb-2">10K+</div>
              <div className="text-primary-100">Active Users</div>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-bold text-white mb-2">50K+</div>
              <div className="text-primary-100">Jobs Matched</div>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-bold text-white mb-2">95%</div>
              <div className="text-primary-100">Success Rate</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Ready to Find Your Dream Job?
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Join SkillMatchAI today and let AI help you discover the perfect career opportunity.
          </p>
          <Link
            to="/register"
            className="btn-primary text-lg px-8 py-3 inline-flex items-center"
          >
            Start Your Journey
            <ArrowRight className="ml-2 w-5 h-5" />
          </Link>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
