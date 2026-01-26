const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
  job: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Job',
    required: true
  },
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  status: {
    type: String,
    enum: ['applied', 'shortlisted', 'interview-scheduled', 'selected', 'rejected', 'withdrawn'],
    default: 'applied'
  },
  coverLetter: String,
  resume: String,
  answers: [{
    question: String,
    answer: String
  }],
  aiScore: {
    type: Number,
    min: 0,
    max: 100
  },
  aiAnalysis: {
    skillsMatch: Number,
    experienceMatch: Number,
    qualificationMatch: Number,
    recommendations: [String]
  },
  appliedAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update timestamp on save
applicationSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Index for efficient queries
applicationSchema.index({ student: 1, status: 1 });
applicationSchema.index({ job: 1, status: 1 });

module.exports = mongoose.model('Application', applicationSchema);
