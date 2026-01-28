const express = require('express');
const router = express.Router();
const {
  initializeGemini,
  scrapeByLocation,
  autoScrapeForUser,
  getScraperStats,
  batchScrapeLocations
} = require('../controllers/geminiScraperController');
const { protect, authorize } = require('../middleware/auth');

// Initialize Gemini AI with API key (Admin/TPO only)
router.post('/initialize', protect, authorize('admin', 'tpo'), initializeGemini);

// Scrape by specific location (Admin/TPO only)
router.post('/scrape-by-location', protect, authorize('admin', 'tpo'), scrapeByLocation);

// Batch scrape multiple locations (Admin/TPO only)
router.post('/batch-scrape', protect, authorize('admin', 'tpo'), batchScrapeLocations);

// Auto-scrape for current user's location (Student)
router.post('/auto-scrape', protect, autoScrapeForUser);

// Get scraper statistics (Admin/TPO only)
router.get('/stats', protect, authorize('admin', 'tpo'), getScraperStats);

module.exports = router;
