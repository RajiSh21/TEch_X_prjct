const express = require('express');
const router = express.Router();
const {
  getJobs,
  getJob,
  createJob,
  updateJob,
  deleteJob,
  applyForJob
} = require('../controllers/jobController');
const { protect, authorize } = require('../middleware/auth');

router.route('/')
  .get(getJobs)
  .post(protect, authorize('admin', 'tpo'), createJob);

router.route('/:id')
  .get(getJob)
  .put(protect, authorize('admin', 'tpo'), updateJob)
  .delete(protect, authorize('admin', 'tpo'), deleteJob);

router.post('/:id/apply', protect, authorize('student'), applyForJob);

module.exports = router;
