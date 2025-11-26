const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Job title is required'],
    trim: true,
    maxlength: [100, 'Job title cannot be more than 100 characters']
  },
  company: {
    type: String,
    required: [true, 'Company name is required'],
    trim: true,
    maxlength: [100, 'Company name cannot be more than 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Job description is required'],
    maxlength: [5000, 'Job description cannot be more than 5000 characters']
  },
  requiredSkills: [{
    type: String,
    trim: true,
    required: true
  }],
  preferredSkills: [{
    type: String,
    trim: true
  }],
  location: {
    type: String,
    required: [true, 'Job location is required'],
    trim: true
  },
  salaryRange: {
    min: {
      type: Number,
      min: 0
    },
    max: {
      type: Number,
      min: 0
    },
    currency: {
      type: String,
      default: 'USD'
    }
  },
  employmentType: {
    type: String,
    enum: ['full-time', 'part-time', 'contract', 'internship', 'freelance'],
    default: 'full-time'
  },
  experienceLevel: {
    type: String,
    enum: ['entry', 'mid', 'senior', 'lead', 'executive'],
    default: 'mid'
  },
  remoteWork: {
    type: String,
    enum: ['on-site', 'remote', 'hybrid'],
    default: 'on-site'
  },
  postedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  isActive: {
    type: Boolean,
    default: true
  },
  applicationDeadline: {
    type: Date,
    default: null
  },
  benefits: [String],
  requirements: [String],
  responsibilities: [String],
  companyInfo: {
    website: String,
    size: String,
    industry: String,
    description: String
  },
  applicationCount: {
    type: Number,
    default: 0
  },
  viewCount: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Indexes for better query performance
jobSchema.index({ title: 'text', description: 'text', company: 'text' });
jobSchema.index({ requiredSkills: 1 });
jobSchema.index({ location: 1 });
jobSchema.index({ employmentType: 1 });
jobSchema.index({ experienceLevel: 1 });
jobSchema.index({ isActive: 1 });
jobSchema.index({ createdAt: -1 });

// Virtual for salary range display
jobSchema.virtual('salaryDisplay').get(function() {
  if (this.salaryRange.min && this.salaryRange.max) {
    return `${this.salaryRange.currency} ${this.salaryRange.min.toLocaleString()} - ${this.salaryRange.max.toLocaleString()}`;
  } else if (this.salaryRange.min) {
    return `${this.salaryRange.currency} ${this.salaryRange.min.toLocaleString()}+`;
  }
  return 'Salary not specified';
});

// Ensure virtual fields are serialized
jobSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('Job', jobSchema);
