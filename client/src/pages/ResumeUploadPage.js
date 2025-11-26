import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDropzone } from 'react-dropzone';
import { Upload, FileText, CheckCircle, AlertCircle, X } from 'lucide-react';
import toast from 'react-hot-toast';
import axios from 'axios';

const ResumeUploadPage = () => {
  const navigate = useNavigate();
  const [uploadedFile, setUploadedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [extractedSkills, setExtractedSkills] = useState([]);
  const [processing, setProcessing] = useState(false);
  const [uploadMode, setUploadMode] = useState('own'); // 'own' or 'friend'
  const [saveToProfile, setSaveToProfile] = useState(true);
  const [inputMethod, setInputMethod] = useState('file'); // 'file' or 'text'
  const [resumeText, setResumeText] = useState('');

  const onDrop = useCallback((acceptedFiles) => {
    const file = acceptedFiles[0];
    if (file) {
      // Validate file type
      const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
      if (!allowedTypes.includes(file.type)) {
        toast.error('Please upload a PDF or DOCX file');
        return;
      }
      
      // Validate file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('File size must be less than 5MB');
        return;
      }
      
      setUploadedFile(file);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx']
    },
    multiple: false
  });

  const handleTextExtraction = async () => {
    if (!resumeText.trim()) {
      toast.error('Please enter your resume text');
      return;
    }

    setProcessing(true);
    try {
      console.log('🔍 Extracting skills from text...');
      
      const skillsResponse = await axios.post('/api/ai/extract-skills', {
        text: resumeText.trim(),
        saveToProfile: saveToProfile
      }, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      const extractedSkills = skillsResponse.data.data.skills || [];
      console.log('✅ Extracted skills:', extractedSkills);
      
      setExtractedSkills(extractedSkills);
      
      if (saveToProfile) {
        toast.success('Skills extracted and saved to your profile!', {
          duration: 4000,
          action: {
            label: 'View Skills',
            onClick: () => navigate('/skill-analysis')
          }
        });
      } else {
        toast.success('Skills extracted! These are not saved to your profile.');
      }
      
    } catch (error) {
      console.error('Text extraction error:', error);
      toast.error(error.response?.data?.message || 'Failed to extract skills');
    } finally {
      setProcessing(false);
    }
  };

  const handleUpload = async () => {
    if (!uploadedFile) return;
    
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('resume', uploadedFile);
      
      // Upload to Cloudinary
      const uploadResponse = await axios.post('/api/upload/resume', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      toast.success('Resume uploaded successfully!');
      
      // Extract skills using AI service
      setProcessing(true);
      const skillsResponse = await axios.post('/api/ai/extract-skills', {
        resumeUrl: uploadResponse.data.data.url,
        saveToProfile: saveToProfile
      }, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      const extractedSkills = skillsResponse.data.data.skills || [];
      console.log('🔍 Extracted skills:', extractedSkills);
      console.log('💾 Save to profile:', saveToProfile);
      
      setExtractedSkills(extractedSkills);
      
      if (saveToProfile) {
        console.log('✅ Skills extracted and saved to profile');
        toast.success('Skills extracted and saved to your profile!', {
          duration: 4000,
          action: {
            label: 'View Skills',
            onClick: () => navigate('/skill-analysis')
          }
        });
      } else {
        console.log('ℹ️ Skills extracted but not saved to profile');
        toast.success('Skills extracted! These are not saved to your profile.');
      }
      
    } catch (error) {
      console.error('Upload error:', error);
      toast.error(error.response?.data?.message || 'Upload failed');
    } finally {
      setUploading(false);
      setProcessing(false);
    }
  };

  const removeFile = () => {
    setUploadedFile(null);
    setExtractedSkills([]);
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Upload Your Resume
          </h1>
          <p className="text-gray-600">
            Upload your resume to extract skills and get personalized job recommendations
          </p>
        </div>

        {/* Input Method Selection */}
        <div className="card mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Choose Input Method
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div 
              className={`p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                inputMethod === 'text' 
                  ? 'border-primary-500 bg-primary-50' 
                  : 'border-gray-200 hover:border-gray-300'
              }`}
              onClick={() => {
                setInputMethod('text');
                setUploadedFile(null);
                setExtractedSkills([]);
              }}
            >
              <h3 className="font-semibold text-gray-900 mb-2">📝 Paste Resume Text</h3>
              <p className="text-sm text-gray-600">
                Copy and paste your resume content for instant skill extraction
              </p>
            </div>
            <div 
              className={`p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                inputMethod === 'file' 
                  ? 'border-primary-500 bg-primary-50' 
                  : 'border-gray-200 hover:border-gray-300'
              }`}
              onClick={() => {
                setInputMethod('file');
                setResumeText('');
                setExtractedSkills([]);
              }}
            >
              <h3 className="font-semibold text-gray-900 mb-2">📁 Upload File</h3>
              <p className="text-sm text-gray-600">
                Upload your resume file (PDF, DOC, DOCX)
              </p>
            </div>
          </div>
        </div>

        {/* Upload Mode Selection */}
        <div className="card mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Choose Upload Mode
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div 
              className={`p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                uploadMode === 'own' 
                  ? 'border-primary-500 bg-primary-50' 
                  : 'border-gray-200 hover:border-gray-300'
              }`}
              onClick={() => {
                setUploadMode('own');
                setSaveToProfile(true);
              }}
            >
              <h3 className="font-semibold text-gray-900 mb-2">My Own Resume</h3>
              <p className="text-sm text-gray-600">
                Upload your resume and save skills to your profile for personalized job matches
              </p>
            </div>
            <div 
              className={`p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                uploadMode === 'friend' 
                  ? 'border-primary-500 bg-primary-50' 
                  : 'border-gray-200 hover:border-gray-300'
              }`}
              onClick={() => {
                setUploadMode('friend');
                setSaveToProfile(false);
              }}
            >
              <h3 className="font-semibold text-gray-900 mb-2">Friend's CV</h3>
              <p className="text-sm text-gray-600">
                Upload a friend's CV to find matching jobs without affecting your profile
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Section */}
          <div className="card">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              {inputMethod === 'text' ? 'Paste Resume Text' : 'Upload Resume'}
            </h2>
            
            {inputMethod === 'text' ? (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Resume Content
                  </label>
                  <textarea
                    value={resumeText}
                    onChange={(e) => setResumeText(e.target.value)}
                    placeholder="Copy and paste your resume content here... Include your skills, experience, education, etc."
                    className="w-full h-64 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
                  />
                  <p className="text-sm text-gray-500 mt-2">
                    Characters: {resumeText.length}
                  </p>
                </div>
                
                <button
                  onClick={handleTextExtraction}
                  disabled={processing || !resumeText.trim()}
                  className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {processing ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                      Extracting Skills...
                    </div>
                  ) : (
                    'Extract Skills from Text'
                  )}
                </button>
              </div>
            ) : (
              <>
            
            {!uploadedFile ? (
              <div
                {...getRootProps()}
                className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
                  isDragActive
                    ? 'border-primary-500 bg-primary-50'
                    : 'border-gray-300 hover:border-primary-400 hover:bg-gray-50'
                }`}
              >
                <input {...getInputProps()} />
                <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-lg font-medium text-gray-900 mb-2">
                  {isDragActive ? 'Drop your resume here' : 'Drag & drop your resume'}
                </p>
                <p className="text-gray-600 mb-4">
                  or click to browse files
                </p>
                <p className="text-sm text-gray-500">
                  Supports PDF, DOC, and DOCX files up to 5MB
                </p>
              </div>
            ) : (
              <div className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <FileText className="w-8 h-8 text-primary-600 mr-3" />
                    <div>
                      <p className="font-medium text-gray-900">{uploadedFile.name}</p>
                      <p className="text-sm text-gray-500">{formatFileSize(uploadedFile.size)}</p>
                    </div>
                  </div>
                  <button
                    onClick={removeFile}
                    className="text-gray-400 hover:text-red-500"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                
                <button
                  onClick={handleUpload}
                  disabled={uploading || processing}
                  className="w-full mt-4 btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {uploading ? 'Uploading...' : processing ? 'Processing...' : 'Upload & Extract Skills'}
                </button>
              </div>
            )}
              </>
            )}
          </div>

          {/* Skills Extraction Section */}
          <div className="card">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Extracted Skills
            </h2>
            
            {extractedSkills && extractedSkills.length > 0 ? (
              <div>
                <div className="flex items-center mb-4">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                  <span className="text-green-700 font-medium">
                    Successfully extracted {extractedSkills.length} skills
                  </span>
                </div>
                
                <div className="flex flex-wrap gap-2">
                  {extractedSkills && extractedSkills.map((skill, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm font-medium"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
                
                <div className="mt-6 p-4 bg-green-50 rounded-lg">
                  <h3 className="font-medium text-green-900 mb-2">Next Steps</h3>
                  <ul className="text-sm text-green-700 space-y-1 mb-3">
                    <li>• Skills have been saved to your profile</li>
                    <li>• Job matching algorithm is now active</li>
                    <li>• Check your dashboard for job recommendations</li>
                  </ul>
                  <div className="flex gap-2">
                    <button
                      onClick={() => navigate('/skill-analysis')}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
                    >
                      View Skill Analysis
                    </button>
                    <button
                      onClick={() => navigate('/dashboard')}
                      className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors text-sm"
                    >
                      Go to Dashboard
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">
                  Upload a resume to see extracted skills
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Instructions */}
        <div className="mt-8 card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            How it works
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-primary-600 font-bold">1</span>
              </div>
              <h4 className="font-medium text-gray-900 mb-2">Upload Resume</h4>
              <p className="text-sm text-gray-600">
                Upload your resume in PDF or DOCX format
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-primary-600 font-bold">2</span>
              </div>
              <h4 className="font-medium text-gray-900 mb-2">AI Analysis</h4>
              <p className="text-sm text-gray-600">
                Our AI extracts skills and keywords from your resume
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-primary-600 font-bold">3</span>
              </div>
              <h4 className="font-medium text-gray-900 mb-2">Get Matches</h4>
              <p className="text-sm text-gray-600">
                Receive personalized job recommendations
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResumeUploadPage;
