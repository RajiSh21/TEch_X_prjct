const mongoose = require('mongoose');

const interviewSchema = new mongoose.Schema({
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
  company: String,
  type: {
    type: String,
    enum: ['technical', 'hr', 'aptitude', 'group-discussion', 'final'],
    default: 'technical'
  },
  scheduledDate: {
    type: Date,
    required: true
  },
  duration: {
    type: Number, // in minutes
    default: 60
  },
  location: {
    type: String,
    enum: ['online', 'on-campus', 'off-campus'],
    default: 'online'
  },
  venue: String,
  meetingLink: String,
  interviewer: String,
  status: {
    type: String,
    enum: ['scheduled', 'completed', 'cancelled', 'rescheduled', 'no-show'],
    default: 'scheduled'
  },
  result: {
    status: {
      type: String,
      enum: ['pending', 'selected', 'rejected', 'on-hold']
    },
    feedback: String,
    rating: Number
  },
  assignedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Index for efficient queries
interviewSchema.index({ student: 1, scheduledDate: -1 });
interviewSchema.index({ status: 1, scheduledDate: 1 });

module.exports = mongoose.model('Interview', interviewSchema);
