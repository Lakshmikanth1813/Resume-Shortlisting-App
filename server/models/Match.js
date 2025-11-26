const mongoose = require('mongoose');

const matchSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  jobId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Job',
    required: true
  },
  matchScore: {
    type: Number,
    required: true,
    min: 0,
    max: 100
  },
  matchedSkills: [{
    type: String,
    trim: true
  }],
  missingSkills: [{
    type: String,
    trim: true
  }],
  skillBreakdown: [{
    skill: {
      type: String,
      required: true
    },
    isMatched: {
      type: Boolean,
      required: true
    },
    importance: {
      type: Number,
      min: 1,
      max: 5
    }
  }],
  recommendation: {
    type: String,
    enum: ['high', 'medium', 'low'],
    required: true
  },
  isViewed: {
    type: Boolean,
    default: false
  },
  isApplied: {
    type: Boolean,
    default: false
  },
  appliedAt: {
    type: Date,
    default: null
  },
  feedback: {
    rating: {
      type: Number,
      min: 1,
      max: 5
    },
    comment: String
  }
}, {
  timestamps: true
});

// Compound index for efficient queries
matchSchema.index({ userId: 1, jobId: 1 }, { unique: true });
matchSchema.index({ userId: 1, matchScore: -1 });
matchSchema.index({ jobId: 1, matchScore: -1 });
matchSchema.index({ recommendation: 1 });
matchSchema.index({ isViewed: 1 });
matchSchema.index({ isApplied: 1 });

module.exports = mongoose.model('Match', matchSchema);
