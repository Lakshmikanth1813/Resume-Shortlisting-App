import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { 
  Upload, 
  TrendingUp, 
  Target, 
  BarChart3, 
  Briefcase,
  MapPin,
  DollarSign,
  Calendar,
  Star,
  ArrowRight
} from 'lucide-react';
import axios from 'axios';

const DashboardPage = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalJobs: 0,
    matchedJobs: 0,
    skillsExtracted: 0,
    matchScore: 0
  });
  const [recentJobs, setRecentJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // Fetch real dashboard data from API
      const response = await axios.get('/api/analytics/dashboard');
      const data = response.data.data;
      
      setStats({
        totalJobs: data.stats.totalJobs || 0,
        matchedJobs: data.stats.totalMatches || 0,
        skillsExtracted: data.user.skillsCount || 0,
        matchScore: Math.round(data.stats.avgMatchScore || 0)
      });
      
      // Set recent jobs from API or show empty state for new users
      const recentMatches = data.recentMatches || [];
      setRecentJobs(recentMatches.map(match => ({
        id: match.jobId._id,
        title: match.jobId.title,
        company: match.jobId.company,
        location: match.jobId.location,
        salary: match.jobId.salaryRange,
        matchScore: match.matchScore,
        skills: match.matchedSkills || [],
        postedDate: new Date(match.jobId.createdAt).toLocaleDateString()
      })));
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome back, {user?.name}!
          </h1>
          <p className="text-gray-600 mt-2">
            Here's your personalized job matching dashboard
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="card">
            <div className="flex items-center">
              <div className="p-2 bg-primary-100 rounded-lg">
                <Briefcase className="w-6 h-6 text-primary-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Jobs</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalJobs.toLocaleString()}</p>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <Target className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Matched Jobs</p>
                <p className="text-2xl font-bold text-gray-900">{stats.matchedJobs}</p>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <BarChart3 className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Skills Extracted</p>
                <p className="text-2xl font-bold text-gray-900">{stats.skillsExtracted}</p>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <TrendingUp className="w-6 h-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Avg Match Score</p>
                <p className="text-2xl font-bold text-gray-900">{stats.matchScore}%</p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <Link
                to="/upload-resume"
                className="flex items-center p-3 bg-primary-50 rounded-lg hover:bg-primary-100 transition-colors"
              >
                <Upload className="w-5 h-5 text-primary-600 mr-3" />
                <span className="text-primary-700 font-medium">Upload New Resume</span>
                <ArrowRight className="w-4 h-4 text-primary-600 ml-auto" />
              </Link>
              <Link
                to="/skill-analysis"
                className="flex items-center p-3 bg-green-50 rounded-lg hover:bg-green-100 transition-colors"
              >
                <BarChart3 className="w-5 h-5 text-green-600 mr-3" />
                <span className="text-green-700 font-medium">View Skill Analysis</span>
                <ArrowRight className="w-4 h-4 text-green-600 ml-auto" />
              </Link>
            </div>
          </div>

          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Skills</h3>
            <div className="flex flex-wrap gap-2">
              {user?.skills?.slice(0, 8).map((skill, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm font-medium"
                >
                  {skill}
                </span>
              ))}
              {user?.skills?.length > 8 && (
                <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm font-medium">
                  +{user.skills.length - 8} more
                </span>
              )}
            </div>
            <Link
              to="/skill-analysis"
              className="text-primary-600 hover:text-primary-700 text-sm font-medium mt-3 inline-block"
            >
              View all skills →
            </Link>
          </div>
        </div>

        {/* Recent Job Matches */}
        <div className="card">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Recent Job Matches</h3>
            <Link
              to="/skill-analysis"
              className="text-primary-600 hover:text-primary-700 text-sm font-medium"
            >
              View all matches →
            </Link>
          </div>
          
          <div className="space-y-4">
            {recentJobs.length === 0 ? (
              <div className="text-center py-8">
                <Briefcase className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h4 className="text-lg font-medium text-gray-900 mb-2">No Job Matches Yet</h4>
                <p className="text-gray-600 mb-4">
                  Upload your resume to get personalized job recommendations
                </p>
                <Link
                  to="/resume-upload"
                  className="btn-primary"
                >
                  Upload Resume
                </Link>
              </div>
            ) : (
              recentJobs.map((job) => (
              <div key={job.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className="text-lg font-semibold text-gray-900 mb-1">
                      {job.title}
                    </h4>
                    <p className="text-gray-600 mb-2">{job.company}</p>
                    <div className="flex items-center space-x-4 text-sm text-gray-500 mb-3">
                      <div className="flex items-center">
                        <MapPin className="w-4 h-4 mr-1" />
                        {job.location}
                      </div>
                      <div className="flex items-center">
                        <DollarSign className="w-4 h-4 mr-1" />
                        {job.salary}
                      </div>
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-1" />
                        {job.postedDate}
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {job.skills.map((skill, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs font-medium"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="ml-4 text-right">
                    <div className="flex items-center mb-2">
                      <Star className="w-4 h-4 text-yellow-400 mr-1" />
                      <span className="text-lg font-bold text-gray-900">{job.matchScore}%</span>
                    </div>
                    <button className="btn-primary text-sm px-4 py-2">
                      Apply Now
                    </button>
                  </div>
                </div>
              </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
