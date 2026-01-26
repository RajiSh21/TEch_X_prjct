const Interview = require('../models/Interview');
const User = require('../models/User');
const Job = require('../models/Job');
const { createNotification } = require('../services/notificationService');

// @desc    Get all interviews
// @route   GET /api/interviews
// @access  Private
exports.getInterviews = async (req, res) => {
  try {
    let query = {};

    // Students see only their interviews
    if (req.user.role === 'student') {
      query.student = req.user.id;
    }

    const interviews = await Interview.find(query)
      .populate('job', 'title company')
      .populate('student', 'name email profile')
      .sort({ scheduledDate: 1 });

    res.status(200).json({
      success: true,
      count: interviews.length,
      data: interviews
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Get single interview
// @route   GET /api/interviews/:id
// @access  Private
exports.getInterview = async (req, res) => {
  try {
    const interview = await Interview.findById(req.params.id)
      .populate('job')
      .populate('student', 'name email profile');

    if (!interview) {
      return res.status(404).json({
        success: false,
        message: 'Interview not found'
      });
    }

    // Check if user is authorized to view this interview
    if (req.user.role === 'student' && interview.student._id.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this interview'
      });
    }

    res.status(200).json({
      success: true,
      data: interview
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Schedule interview
// @route   POST /api/interviews
// @access  Private (Admin/TPO)
exports.scheduleInterview = async (req, res) => {
  try {
    const { job, student, scheduledDate, type, location, venue, meetingLink, interviewer } = req.body;

    // Verify job and student exist
    const jobExists = await Job.findById(job);
    const studentExists = await User.findById(student);

    if (!jobExists || !studentExists) {
      return res.status(404).json({
        success: false,
        message: 'Job or student not found'
      });
    }

    const interview = await Interview.create({
      job,
      student,
      company: jobExists.company,
      scheduledDate,
      type,
      location,
      venue,
      meetingLink,
      interviewer,
      assignedBy: req.user.id
    });

    // Create notification for student
    await createNotification({
      user: student,
      title: 'Interview Scheduled',
      message: `Your interview for ${jobExists.title} at ${jobExists.company} has been scheduled for ${new Date(scheduledDate).toLocaleString()}`,
      type: 'interview',
      relatedInterview: interview._id,
      priority: 'high'
    });

    res.status(201).json({
      success: true,
      data: interview
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Update interview
// @route   PUT /api/interviews/:id
// @access  Private (Admin/TPO)
exports.updateInterview = async (req, res) => {
  try {
    const interview = await Interview.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    if (!interview) {
      return res.status(404).json({
        success: false,
        message: 'Interview not found'
      });
    }

    // Notify student if rescheduled
    if (req.body.scheduledDate) {
      await createNotification({
        user: interview.student,
        title: 'Interview Rescheduled',
        message: `Your interview has been rescheduled to ${new Date(req.body.scheduledDate).toLocaleString()}`,
        type: 'interview',
        relatedInterview: interview._id,
        priority: 'high'
      });
    }

    res.status(200).json({
      success: true,
      data: interview
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Update interview result
// @route   PUT /api/interviews/:id/result
// @access  Private (Admin/TPO)
exports.updateInterviewResult = async (req, res) => {
  try {
    const { status, feedback, rating } = req.body;

    const interview = await Interview.findById(req.params.id);

    if (!interview) {
      return res.status(404).json({
        success: false,
        message: 'Interview not found'
      });
    }

    interview.result = {
      status,
      feedback,
      rating
    };
    interview.status = 'completed';

    await interview.save();

    // Notify student of result
    await createNotification({
      user: interview.student,
      title: 'Interview Result',
      message: `Your interview result is now available`,
      type: 'interview',
      relatedInterview: interview._id,
      priority: 'high'
    });

    res.status(200).json({
      success: true,
      data: interview
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};
