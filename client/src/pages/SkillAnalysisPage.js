import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  Target, 
  BookOpen, 
  AlertCircle,
  CheckCircle,
  ExternalLink,
  BarChart3,
  Lightbulb,
  Plus,
  X
} from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';

const SkillAnalysisPage = () => {
  const [userSkills, setUserSkills] = useState([]);
  const [jobMatches, setJobMatches] = useState([]);
  const [skillGaps, setSkillGaps] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newSkill, setNewSkill] = useState('');
  const [showAddSkill, setShowAddSkill] = useState(false);
  const [matchStats, setMatchStats] = useState({
    totalMatches: 0,
    avgMatchScore: 0,
    highMatches: 0
  });
  const [error, setError] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    fetchSkillAnalysis();
  }, []);

  const handleAddSkill = async () => {
    if (!newSkill.trim()) {
      toast.error('Please enter a skill name');
      return;
    }

    if ((userSkills || []).includes(newSkill.trim())) {
      toast.error('Skill already exists');
      return;
    }

    if (isUpdating) {
      toast.error('Please wait, updating in progress...');
      return;
    }

    setIsUpdating(true);
    setError(null);

    try {
      // Add skill to user's skills
      const updatedSkills = [...(userSkills || []), newSkill.trim()];
      setUserSkills(updatedSkills);
      
      console.log('🔄 Saving skills to backend:', updatedSkills);
      
      // Save to backend with timeout
      const response = await axios.put('/api/users/profile', { skills: updatedSkills }, {
        timeout: 10000 // 10 second timeout
      });
      console.log('✅ Skills saved successfully:', response.data);
      
      // Automatically refresh job matches and recommendations
      await Promise.all([
        fetchJobMatches(updatedSkills),
        fetchRecommendations(updatedSkills)
      ]);
      
      toast.success(`Added skill: ${newSkill}`);
      setNewSkill('');
      setShowAddSkill(false);
    } catch (error) {
      console.error('❌ Add skill error:', error);
      console.error('Response:', error.response?.data);
      
      if (error.code === 'ECONNABORTED') {
        toast.error('Request timeout. Please try again.');
      } else {
        toast.error(`Failed to add skill: ${error.response?.data?.message || error.message}`);
      }
      
      // Revert the skill addition on error
      setUserSkills(userSkills || []);
      setError(error.message);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleRemoveSkill = async (skillToRemove) => {
    if (isUpdating) {
      toast.error('Please wait, updating in progress...');
      return;
    }

    setIsUpdating(true);
    setError(null);

    try {
      const updatedSkills = (userSkills || []).filter(skill => skill !== skillToRemove);
      setUserSkills(updatedSkills);
      
      // Save to backend with timeout
      await axios.put('/api/users/profile', { skills: updatedSkills }, {
        timeout: 10000 // 10 second timeout
      });
      
      // Automatically refresh job matches and recommendations
      await Promise.all([
        fetchJobMatches(updatedSkills),
        fetchRecommendations(updatedSkills)
      ]);
      
      toast.success(`Removed skill: ${skillToRemove}`);
    } catch (error) {
      console.error('❌ Remove skill error:', error);
      
      if (error.code === 'ECONNABORTED') {
        toast.error('Request timeout. Please try again.');
      } else {
        toast.error(`Failed to remove skill: ${error.response?.data?.message || error.message}`);
      }
      
      // Revert the skill removal on error
      setUserSkills([...(userSkills || []), skillToRemove]);
      setError(error.message);
    } finally {
      setIsUpdating(false);
    }
  };

  const fetchJobMatches = async (skillsToUse = null) => {
    try {
      const skills = skillsToUse || userSkills;
      
      if (skills.length === 0) {
        setJobMatches([]);
        setMatchStats({
          totalMatches: 0,
          avgMatchScore: 0,
          highMatches: 0
        });
        return;
      }

      // Use the quick-match endpoint for real-time matching
      const response = await axios.post('/api/ai/quick-match', {
        skills: skills
      }, {
        timeout: 15000 // 15 second timeout
      });

      const matches = response.data.data.matches || [];
      
      // Transform the response to match our expected format
      const transformedMatches = matches.map(match => ({
        id: match.id,
        title: match.title,
        company: match.company,
        location: match.location,
        salary: match.salary,
        matchScore: match.matchScore,
        requiredSkills: [...(match.matchedSkills || []), ...(match.missingSkills || [])],
        missingSkills: match.missingSkills || []
      }));

      setJobMatches(transformedMatches);

      // Calculate match statistics
      const totalMatches = transformedMatches.length;
      const avgMatchScore = totalMatches > 0 
        ? Math.round(transformedMatches.reduce((sum, match) => sum + match.matchScore, 0) / totalMatches)
        : 0;
      const highMatches = transformedMatches.filter(match => match.matchScore >= 80).length;

      setMatchStats({
        totalMatches,
        avgMatchScore,
        highMatches
      });
    } catch (error) {
      console.error('Error fetching job matches:', error);
      // Keep existing matches on error
    }
  };

  const fetchRecommendations = async (skillsToUse = null) => {
    try {
      const skills = skillsToUse || userSkills;
      
      if (skills.length === 0) {
        setRecommendations([]);
        setSkillGaps([]);
        return;
      }

      // Get skill recommendations
      const response = await axios.get('/api/ai/skill-recommendations', {
        timeout: 10000 // 10 second timeout
      });
      const recommendationsData = response.data.data || {};
      
      setRecommendations(recommendationsData.recommendations || []);
      setSkillGaps(recommendationsData.skillGaps || []);
    } catch (error) {
      console.error('Error fetching recommendations:', error);
      // Keep existing recommendations on error
    }
  };

  const fetchSkillAnalysis = async () => {
    try {
      console.log('🔄 Fetching user profile...');
      
      // Fetch user profile to get current skills
      const profileResponse = await axios.get('/api/users/profile', {
        timeout: 10000 // 10 second timeout
      });
      console.log('✅ Profile response:', profileResponse.data);
      
      const userSkillsFromAPI = profileResponse.data.data.skills || [];
      console.log('📋 User skills from API:', userSkillsFromAPI);
      
      setUserSkills(userSkillsFromAPI);
      
      // Fetch dynamic job matches and recommendations based on user's skills
      await fetchJobMatches(userSkillsFromAPI);
      await fetchRecommendations(userSkillsFromAPI);
      
    } catch (error) {
      console.error('❌ Error fetching skill analysis:', error);
      console.error('Response:', error.response?.data);
      toast.error('Failed to load skills. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getDemandColor = (demand) => {
    switch (demand) {
      case 'Very High': return 'text-red-600 bg-red-100';
      case 'High': return 'text-orange-600 bg-orange-100';
      case 'Medium': return 'text-yellow-600 bg-yellow-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'Hard': return 'text-red-600 bg-red-100';
      case 'Medium': return 'text-yellow-600 bg-yellow-100';
      case 'Easy': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your skill analysis...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Skill Analysis & Recommendations
          </h1>
          <p className="text-gray-600">
            Analyze your skills, identify gaps, and get personalized recommendations for career growth
          </p>
          
          {error && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-center">
                <AlertCircle className="w-5 h-5 text-red-600 mr-2" />
                <span className="text-red-700 font-medium">Error occurred</span>
              </div>
              <p className="text-red-600 text-sm mt-1">{error}</p>
              <button
                onClick={() => {
                  setError(null);
                  fetchSkillAnalysis();
                }}
                className="mt-2 px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700"
              >
                Retry
              </button>
            </div>
          )}
        </div>

        {/* Current Skills */}
        <div className="card mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900 flex items-center">
              <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
              Your Current Skills ({userSkills.length})
            </h2>
            <button
              onClick={() => setShowAddSkill(!showAddSkill)}
              className="flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Skill
            </button>
          </div>

          {/* Add Skill Input */}
          {showAddSkill && (
            <div className="mb-4 p-4 bg-gray-50 rounded-lg">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleAddSkill()}
                  placeholder="Enter skill name (e.g., Python, AWS, Docker)"
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
                <button
                  onClick={handleAddSkill}
                  disabled={isUpdating}
                  className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isUpdating ? (
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Adding...
                    </div>
                  ) : (
                    'Add'
                  )}
                </button>
                <button
                  onClick={() => {
                    setShowAddSkill(false);
                    setNewSkill('');
                  }}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {/* Skills List */}
          <div className="flex flex-wrap gap-2">
            {(userSkills || []).length === 0 ? (
              <p className="text-gray-500">No skills added yet. Click "Add Skill" to get started!</p>
            ) : (
              (userSkills || []).map((skill, index) => (
                <span
                  key={index}
                  className="group px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium flex items-center gap-2 hover:bg-green-200 transition-colors"
                >
                  {skill}
                  <button
                    onClick={() => handleRemoveSkill(skill)}
                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                    title="Remove skill"
                  >
                    <X className="w-3 h-3 text-green-700 hover:text-red-600" />
                  </button>
                </span>
              ))
            )}
          </div>
        </div>

        {/* Match Statistics */}
        <div className="card mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
            <BarChart3 className="w-5 h-5 text-blue-600 mr-2" />
            Your Match Statistics
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-3xl font-bold text-blue-600 mb-2">{matchStats.totalMatches}</div>
              <div className="text-sm text-blue-700">Total Job Matches</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-3xl font-bold text-green-600 mb-2">{matchStats.avgMatchScore}%</div>
              <div className="text-sm text-green-700">Average Match Score</div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-3xl font-bold text-purple-600 mb-2">{matchStats.highMatches}</div>
              <div className="text-sm text-purple-700">High Matches (80%+)</div>
            </div>
          </div>
          
          {(userSkills || []).length === 0 && (
            <div className="mt-4 p-4 bg-yellow-50 rounded-lg">
              <div className="flex items-center">
                <AlertCircle className="w-5 h-5 text-yellow-600 mr-2" />
                <span className="text-yellow-700 font-medium">No skills found!</span>
              </div>
              <p className="text-yellow-600 text-sm mt-1">
                Upload your resume or add skills manually to see job matches and statistics.
              </p>
            </div>
          )}
        </div>

        {/* Job Matches Analysis */}
        <div className="card mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
            <Target className="w-5 h-5 text-primary-600 mr-2" />
            Job Match Analysis
          </h2>
          
          <div className="space-y-4">
            {(jobMatches || []).map((job) => (
              <div key={job.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{job.title}</h3>
                    <p className="text-gray-600">{job.company}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-primary-600">{job.matchScore}%</div>
                    <div className="text-sm text-gray-500">Match Score</div>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Required Skills</h4>
                    <div className="flex flex-wrap gap-1">
                      {(job.requiredSkills || []).map((skill, index) => (
                        <span
                          key={index}
                          className={`px-2 py-1 rounded text-xs font-medium ${
                            userSkills.includes(skill)
                              ? 'bg-green-100 text-green-700'
                              : 'bg-gray-100 text-gray-600'
                          }`}
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Missing Skills</h4>
                    <div className="flex flex-wrap gap-1">
                      {(job.missingSkills || []).map((skill, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-red-100 text-red-700 rounded text-xs font-medium"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Skill Gaps */}
        <div className="card mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
            <AlertCircle className="w-5 h-5 text-orange-500 mr-2" />
            Skill Gaps Analysis
          </h2>
          
          <div className="space-y-4">
            {(skillGaps || []).map((gap, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-lg font-semibold text-gray-900">{gap.skill}</h3>
                  <div className="flex space-x-2">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${getDemandColor(gap.demand)}`}>
                      {gap.demand} Demand
                    </span>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${getDifficultyColor(gap.difficulty)}`}>
                      {gap.difficulty}
                    </span>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Learning Time</p>
                    <p className="font-medium text-gray-900">{gap.learningTime}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Resources</p>
                    <div className="space-y-1">
                      {(gap.resources || []).map((resource, idx) => (
                        <a
                          key={idx}
                          href={resource.url}
                          className="flex items-center text-sm text-primary-600 hover:text-primary-700"
                        >
                          <ExternalLink className="w-3 h-3 mr-1" />
                          {resource.name}
                          <span className="ml-1 text-xs text-gray-500">({resource.type})</span>
                        </a>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recommendations */}
        <div className="card">
          <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
            <Lightbulb className="w-5 h-5 text-yellow-500 mr-2" />
            Personalized Recommendations
          </h2>
          
          <div className="space-y-6">
            {(recommendations || []).map((rec, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {rec.category}
                </h3>
                <p className="text-gray-600 mb-3">{rec.reason}</p>
                <div className="flex flex-wrap gap-2">
                  {(rec.skills || []).map((skill, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-sm font-medium"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SkillAnalysisPage;
