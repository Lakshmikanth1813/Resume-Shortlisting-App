import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Plus, 
  X, 
  Search, 
  Briefcase, 
  TrendingUp, 
  MapPin, 
  DollarSign,
  Star,
  Target,
  BarChart3,
  Upload
} from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';

const QuickMatchPage = () => {
  const [skills, setSkills] = useState([]);
  const [newSkill, setNewSkill] = useState('');
  const [showAddSkill, setShowAddSkill] = useState(false);
  const [jobMatches, setJobMatches] = useState([]);
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({
    totalMatches: 0,
    avgMatchScore: 0,
    highMatches: 0
  });

  const handleAddSkill = () => {
    if (!newSkill.trim()) {
      toast.error('Please enter a skill name');
      return;
    }

    if (skills.includes(newSkill.trim())) {
      toast.error('Skill already exists');
      return;
    }

    setSkills([...skills, newSkill.trim()]);
    setNewSkill('');
    setShowAddSkill(false);
  };

  const handleRemoveSkill = (skillToRemove) => {
    setSkills(skills.filter(skill => skill !== skillToRemove));
  };

  const findJobMatches = async () => {
    if (skills.length === 0) {
      toast.error('Please add at least one skill');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post('/api/ai/quick-match', {
        skills: skills
      }, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      setJobMatches(response.data.data.matches || []);
      setStats({
        totalMatches: response.data.data.totalMatches || 0,
        avgMatchScore: Math.round(response.data.data.avgMatchScore || 0),
        highMatches: response.data.data.highMatches || 0
      });

      toast.success(`Found ${response.data.data.totalMatches || 0} job matches!`);
    } catch (error) {
      console.error('Quick match error:', error);
      toast.error('Failed to find job matches');
      
      // Fallback: show mock data
      setJobMatches([
        {
          id: 1,
          title: 'Senior React Developer',
          company: 'TechCorp Inc.',
          location: 'San Francisco, CA',
          salary: '$120k - $150k',
          matchScore: 85,
          matchedSkills: skills.slice(0, 3),
          missingSkills: ['TypeScript', 'Redux']
        },
        {
          id: 2,
          title: 'Full Stack Engineer',
          company: 'StartupXYZ',
          location: 'Remote',
          salary: '$100k - $130k',
          matchScore: 78,
          matchedSkills: skills.slice(0, 2),
          missingSkills: ['AWS', 'Docker']
        }
      ]);
      setStats({
        totalMatches: 2,
        avgMatchScore: 82,
        highMatches: 1
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Quick Job Match
          </h1>
          <p className="text-gray-600">
            Enter your skills to get instant job matches and recommendations
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Skills Input */}
          <div className="lg:col-span-1">
            <div className="card">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <Target className="w-5 h-5 text-primary-600 mr-2" />
                Your Skills ({skills.length})
              </h2>

              {/* Add Skill Input */}
              <div className="mb-4">
                {!showAddSkill ? (
                  <button
                    onClick={() => setShowAddSkill(true)}
                    className="w-full flex items-center justify-center px-4 py-2 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-primary-400 hover:text-primary-600 transition-colors"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Skill
                  </button>
                ) : (
                  <div className="space-y-2">
                    <input
                      type="text"
                      value={newSkill}
                      onChange={(e) => setNewSkill(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleAddSkill()}
                      placeholder="Enter skill name (e.g., React, Python, AWS)"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      autoFocus
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={handleAddSkill}
                        className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                      >
                        Add
                      </button>
                      <button
                        onClick={() => {
                          setShowAddSkill(false);
                          setNewSkill('');
                        }}
                        className="flex-1 px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Skills List */}
              <div className="space-y-2 mb-6">
                {skills.length === 0 ? (
                  <p className="text-gray-500 text-center py-4">
                    No skills added yet. Click "Add Skill" to get started!
                  </p>
                ) : (
                  skills.map((skill, index) => (
                    <div
                      key={index}
                      className="group flex items-center justify-between px-3 py-2 bg-primary-100 text-primary-700 rounded-lg"
                    >
                      <span className="font-medium">{skill}</span>
                      <button
                        onClick={() => handleRemoveSkill(skill)}
                        className="opacity-0 group-hover:opacity-100 transition-opacity text-primary-500 hover:text-red-600"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))
                )}
              </div>

              {/* Find Matches Button */}
              <button
                onClick={findJobMatches}
                disabled={skills.length === 0 || loading}
                className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Finding Matches...
                  </div>
                ) : (
                  <div className="flex items-center justify-center">
                    <Search className="w-4 h-4 mr-2" />
                    Find Job Matches
                  </div>
                )}
              </button>
            </div>

            {/* Quick Stats */}
            {stats.totalMatches > 0 && (
              <div className="card mt-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <BarChart3 className="w-5 h-5 text-blue-600 mr-2" />
                  Match Statistics
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Matches:</span>
                    <span className="font-semibold">{stats.totalMatches}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Avg Match Score:</span>
                    <span className="font-semibold text-primary-600">{stats.avgMatchScore}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">High Matches:</span>
                    <span className="font-semibold text-green-600">{stats.highMatches}</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Job Matches Results */}
          <div className="lg:col-span-2">
            <div className="card">
              <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                <Briefcase className="w-5 h-5 text-green-600 mr-2" />
                Job Matches
              </h2>

              {jobMatches.length === 0 ? (
                <div className="text-center py-12">
                  <Briefcase className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No Job Matches Yet</h3>
                  <p className="text-gray-600 mb-4">
                    Add your skills and click "Find Job Matches" to see personalized recommendations
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {jobMatches.map((job) => (
                    <div key={job.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <h3 className="text-xl font-semibold text-gray-900 mb-1">{job.title}</h3>
                          <p className="text-gray-600 mb-2">{job.company}</p>
                          <div className="flex items-center space-x-4 text-sm text-gray-500">
                            <div className="flex items-center">
                              <MapPin className="w-4 h-4 mr-1" />
                              {job.location}
                            </div>
                            <div className="flex items-center">
                              <DollarSign className="w-4 h-4 mr-1" />
                              {job.salary}
                            </div>
                          </div>
                        </div>
                        <div className="ml-4 text-right">
                          <div className="flex items-center mb-2">
                            <Star className="w-5 h-5 text-yellow-400 mr-1" />
                            <span className="text-2xl font-bold text-primary-600">{job.matchScore}%</span>
                          </div>
                          <button className="btn-primary text-sm px-4 py-2">
                            Apply Now
                          </button>
                        </div>
                      </div>

                      {/* Matched Skills */}
                      {job.matchedSkills && job.matchedSkills.length > 0 && (
                        <div className="mb-3">
                          <p className="text-sm font-medium text-green-700 mb-2">✅ Matched Skills:</p>
                          <div className="flex flex-wrap gap-2">
                            {job.matchedSkills.map((skill, index) => (
                              <span
                                key={index}
                                className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium"
                              >
                                {skill}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Missing Skills */}
                      {job.missingSkills && job.missingSkills.length > 0 && (
                        <div>
                          <p className="text-sm font-medium text-red-700 mb-2">⚠️ Missing Skills:</p>
                          <div className="flex flex-wrap gap-2">
                            {job.missingSkills.map((skill, index) => (
                              <span
                                key={index}
                                className="px-2 py-1 bg-red-100 text-red-700 rounded-full text-xs font-medium"
                              >
                                {skill}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8 card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link
              to="/resume-upload"
              className="flex items-center p-4 bg-primary-50 rounded-lg hover:bg-primary-100 transition-colors"
            >
              <Upload className="w-5 h-5 text-primary-600 mr-3" />
              <div>
                <h4 className="font-medium text-gray-900">Upload Resume</h4>
                <p className="text-sm text-gray-600">Extract skills automatically</p>
              </div>
            </Link>
            <Link
              to="/skill-analysis"
              className="flex items-center p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
            >
              <TrendingUp className="w-5 h-5 text-blue-600 mr-3" />
              <div>
                <h4 className="font-medium text-gray-900">Skill Analysis</h4>
                <p className="text-sm text-gray-600">Analyze your skill gaps</p>
              </div>
            </Link>
            <Link
              to="/dashboard"
              className="flex items-center p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors"
            >
              <BarChart3 className="w-5 h-5 text-green-600 mr-3" />
              <div>
                <h4 className="font-medium text-gray-900">Dashboard</h4>
                <p className="text-sm text-gray-600">View your profile stats</p>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuickMatchPage;
