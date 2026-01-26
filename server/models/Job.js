const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please provide a job title'],
    trim: true
  },
  company: {
    type: String,
    required: [true, 'Please provide a company name'],
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['internship', 'full-time', 'part-time', 'contract'],
    default: 'full-time'
  },
  location: {
    city: String,
    state: String,
    country: String,
    remote: {
      type: Boolean,
      default: false
    }
  },
  salary: {
    min: Number,
    max: Number,
    currency: {
      type: String,
      default: 'INR'
    }
  },
  requirements: {
    skills: [String],
    education: String,
    experience: String,
    minCGPA: Number
  },
  benefits: [String],
  applicationDeadline: Date,
  source: {
    type: String,
    enum: ['scraped', 'manual', 'company'],
    default: 'manual'
  },
  sourceUrl: String,
  scrapedAt: Date,
  status: {
    type: String,
    enum: ['active', 'closed', 'draft'],
    default: 'active'
  },
  applicants: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  postedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Index for efficient searches
jobSchema.index({ title: 'text', company: 'text', description: 'text' });
jobSchema.index({ status: 1, type: 1 });
jobSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Job', jobSchema);
