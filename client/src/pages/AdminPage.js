import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Search, 
  Filter,
  Briefcase,
  MapPin,
  DollarSign,
  Calendar,
  Users,
  BarChart3
} from 'lucide-react';
import axios from 'axios';

const AdminPage = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddJob, setShowAddJob] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [stats, setStats] = useState({
    totalJobs: 0,
    totalUsers: 0,
    totalMatches: 0,
    avgMatchScore: 0
  });

  const [newJob, setNewJob] = useState({
    title: '',
    company: '',
    description: '',
    requiredSkills: '',
    location: '',
    salaryRange: ''
  });

  useEffect(() => {
    fetchJobs();
    fetchStats();
  }, []);

  const fetchJobs = async () => {
    try {
      // Mock data - replace with actual API calls
      const mockJobs = [
        {
          id: 1,
          title: 'Senior React Developer',
          company: 'TechCorp Inc.',
          description: 'We are looking for a senior React developer to join our team...',
          requiredSkills: ['React', 'JavaScript', 'TypeScript', 'Node.js'],
          location: 'San Francisco, CA',
          salaryRange: '$120k - $150k',
          postedDate: '2024-01-15',
          applicants: 45,
          matches: 12
        },
        {
          id: 2,
          title: 'Full Stack Engineer',
          company: 'StartupXYZ',
          description: 'Join our fast-growing startup as a full stack engineer...',
          requiredSkills: ['React', 'Node.js', 'MongoDB', 'AWS'],
          location: 'Remote',
          salaryRange: '$100k - $130k',
          postedDate: '2024-01-10',
          applicants: 32,
          matches: 8
        },
        {
          id: 3,
          title: 'Frontend Developer',
          company: 'DesignCo',
          description: 'We need a creative frontend developer with strong design skills...',
          requiredSkills: ['React', 'CSS', 'Figma', 'JavaScript'],
          location: 'New York, NY',
          salaryRange: '$90k - $120k',
          postedDate: '2024-01-08',
          applicants: 28,
          matches: 15
        }
      ];
      
      setJobs(mockJobs);
    } catch (error) {
      console.error('Error fetching jobs:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      // Mock data - replace with actual API calls
      setStats({
        totalJobs: 1250,
        totalUsers: 3420,
        totalMatches: 12500,
        avgMatchScore: 78
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const handleAddJob = async (e) => {
    e.preventDefault();
    try {
      const jobData = {
        ...newJob,
        requiredSkills: newJob.requiredSkills.split(',').map(skill => skill.trim())
      };
      
      // Mock API call
      const newJobWithId = {
        ...jobData,
        id: jobs.length + 1,
        postedDate: new Date().toISOString().split('T')[0],
        applicants: 0,
        matches: 0
      };
      
      setJobs([newJobWithId, ...jobs]);
      setShowAddJob(false);
      setNewJob({
        title: '',
        company: '',
        description: '',
        requiredSkills: '',
        location: '',
        salaryRange: ''
      });
    } catch (error) {
      console.error('Error adding job:', error);
    }
  };

  const handleDeleteJob = async (jobId) => {
    if (window.confirm('Are you sure you want to delete this job?')) {
      try {
        setJobs(jobs.filter(job => job.id !== jobId));
      } catch (error) {
        console.error('Error deleting job:', error);
      }
    }
  };

  const filteredJobs = jobs.filter(job =>
    job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
    job.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Admin Dashboard
          </h1>
          <p className="text-gray-600">
            Manage job postings and view platform analytics
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
                <Users className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Users</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalUsers.toLocaleString()}</p>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <BarChart3 className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Matches</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalMatches.toLocaleString()}</p>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <BarChart3 className="w-6 h-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Avg Match Score</p>
                <p className="text-2xl font-bold text-gray-900">{stats.avgMatchScore}%</p>
              </div>
            </div>
          </div>
        </div>

        {/* Jobs Management */}
        <div className="card">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Job Management</h2>
            <button
              onClick={() => setShowAddJob(true)}
              className="btn-primary flex items-center"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add New Job
            </button>
          </div>

          {/* Search and Filter */}
          <div className="flex items-center space-x-4 mb-6">
            <div className="flex-1 relative">
              <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search jobs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input-field pl-10"
              />
            </div>
            <button className="btn-secondary flex items-center">
              <Filter className="w-4 h-4 mr-2" />
              Filter
            </button>
          </div>

          {/* Jobs List */}
          <div className="space-y-4">
            {filteredJobs.map((job) => (
              <div key={job.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">
                      {job.title}
                    </h3>
                    <p className="text-gray-600 mb-2">{job.company}</p>
                    <div className="flex items-center space-x-4 text-sm text-gray-500 mb-3">
                      <div className="flex items-center">
                        <MapPin className="w-4 h-4 mr-1" />
                        {job.location}
                      </div>
                      <div className="flex items-center">
                        <DollarSign className="w-4 h-4 mr-1" />
                        {job.salaryRange}
                      </div>
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-1" />
                        {job.postedDate}
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2 mb-3">
                      {job.requiredSkills.map((skill, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs font-medium"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <span>{job.applicants} applicants</span>
                      <span>{job.matches} matches</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 ml-4">
                    <button className="p-2 text-gray-400 hover:text-primary-600">
                      <Edit className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => handleDeleteJob(job.id)}
                      className="p-2 text-gray-400 hover:text-red-600"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Add Job Modal */}
        {showAddJob && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Add New Job</h3>
                <form onSubmit={handleAddJob} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Job Title
                      </label>
                      <input
                        type="text"
                        required
                        value={newJob.title}
                        onChange={(e) => setNewJob({...newJob, title: e.target.value})}
                        className="input-field"
                        placeholder="e.g. Senior React Developer"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Company
                      </label>
                      <input
                        type="text"
                        required
                        value={newJob.company}
                        onChange={(e) => setNewJob({...newJob, company: e.target.value})}
                        className="input-field"
                        placeholder="e.g. TechCorp Inc."
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Description
                    </label>
                    <textarea
                      required
                      rows={4}
                      value={newJob.description}
                      onChange={(e) => setNewJob({...newJob, description: e.target.value})}
                      className="input-field"
                      placeholder="Job description..."
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Required Skills (comma-separated)
                    </label>
                    <input
                      type="text"
                      required
                      value={newJob.requiredSkills}
                      onChange={(e) => setNewJob({...newJob, requiredSkills: e.target.value})}
                      className="input-field"
                      placeholder="e.g. React, JavaScript, TypeScript, Node.js"
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Location
                      </label>
                      <input
                        type="text"
                        required
                        value={newJob.location}
                        onChange={(e) => setNewJob({...newJob, location: e.target.value})}
                        className="input-field"
                        placeholder="e.g. San Francisco, CA"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Salary Range
                      </label>
                      <input
                        type="text"
                        required
                        value={newJob.salaryRange}
                        onChange={(e) => setNewJob({...newJob, salaryRange: e.target.value})}
                        className="input-field"
                        placeholder="e.g. $120k - $150k"
                      />
                    </div>
                  </div>
                  
                  <div className="flex justify-end space-x-3 pt-4">
                    <button
                      type="button"
                      onClick={() => setShowAddJob(false)}
                      className="btn-secondary"
                    >
                      Cancel
                    </button>
                    <button type="submit" className="btn-primary">
                      Add Job
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPage;
