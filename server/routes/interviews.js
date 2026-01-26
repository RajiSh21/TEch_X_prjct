const express = require('express');
const router = express.Router();
const {
  getInterviews,
  getInterview,
  scheduleInterview,
  updateInterview,
  updateInterviewResult
} = require('../controllers/interviewController');
const { protect, authorize } = require('../middleware/auth');

router.route('/')
  .get(protect, getInterviews)
  .post(protect, authorize('admin', 'tpo'), scheduleInterview);

router.route('/:id')
  .get(protect, getInterview)
  .put(protect, authorize('admin', 'tpo'), updateInterview);

router.put('/:id/result', protect, authorize('admin', 'tpo'), updateInterviewResult);

module.exports = router;
