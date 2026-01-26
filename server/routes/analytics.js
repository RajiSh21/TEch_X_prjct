const express = require('express');
const router = express.Router();
const {
  generateReport,
  getStudentInsights,
  analyzeJobMatch,
  getDashboardStats
} = require('../controllers/analyticsController');
const { protect, authorize } = require('../middleware/auth');

router.get('/dashboard', protect, getDashboardStats);
router.get('/report', protect, authorize('admin', 'tpo'), generateReport);
router.get('/student/:id', protect, getStudentInsights);
router.get('/match/:jobId', protect, authorize('student'), analyzeJobMatch);

module.exports = router;
