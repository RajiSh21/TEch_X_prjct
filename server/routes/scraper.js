const express = require('express');
const router = express.Router();
const {
  runScraper,
  getScraperStats
} = require('../controllers/scraperController');
const { protect, authorize } = require('../middleware/auth');

router.post('/run', protect, authorize('admin', 'tpo'), runScraper);
router.get('/stats', protect, authorize('admin', 'tpo'), getScraperStats);

module.exports = router;
