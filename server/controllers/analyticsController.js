const aiAnalyticsService = require('../services/aiAnalyticsService');
const Application = require('../models/Application');

// @desc    Generate placement report
// @route   GET /api/analytics/report
// @access  Private (Admin/TPO)
exports.generateReport = async (req, res) => {
  try {
    const report = await aiAnalyticsService.generatePlacementReport(req.query);

    res.status(200).json({
      success: true,
      data: report
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Get student insights
// @route   GET /api/analytics/student/:id
// @access  Private
exports.getStudentInsights = async (req, res) => {
  try {
    // Students can only view their own insights
    const studentId = req.user.role === 'student' ? req.user.id : req.params.id;
    
    const insights = await aiAnalyticsService.getStudentInsights(studentId);

    res.status(200).json({
      success: true,
      data: insights
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Analyze job match for student
// @route   GET /api/analytics/match/:jobId
// @access  Private (Student)
exports.analyzeJobMatch = async (req, res) => {
  try {
    const analysis = await aiAnalyticsService.analyzeJobMatch(req.user.id, req.params.jobId);

    res.status(200).json({
      success: true,
      data: analysis
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Get dashboard statistics
// @route   GET /api/analytics/dashboard
// @access  Private
exports.getDashboardStats = async (req, res) => {
  try {
    let stats = {};

    if (req.user.role === 'student') {
      // Student dashboard
      const applications = await Application.find({ student: req.user.id });
      stats = {
        totalApplications: applications.length,
        selected: applications.filter(a => a.status === 'selected').length,
        pending: applications.filter(a => ['applied', 'shortlisted', 'interview-scheduled'].includes(a.status)).length,
        rejected: applications.filter(a => a.status === 'rejected').length,
        avgMatchScore: applications.reduce((sum, a) => sum + (a.aiScore || 0), 0) / applications.length || 0
      };
    } else {
      // Admin/TPO dashboard
      const report = await aiAnalyticsService.generatePlacementReport();
      stats = report.summary;
    }

    res.status(200).json({
      success: true,
      data: stats
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};
