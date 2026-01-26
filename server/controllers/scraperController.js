const jobScraperService = require('../services/jobScraperService');

// @desc    Trigger job scraping
// @route   POST /api/scraper/run
// @access  Private (Admin/TPO)
exports.runScraper = async (req, res) => {
  try {
    const { searchQueries } = req.body;
    
    const result = await jobScraperService.scrapeAllSources(searchQueries);

    res.status(200).json({
      success: true,
      message: 'Scraping completed',
      data: result
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Get scraping statistics
// @route   GET /api/scraper/stats
// @access  Private (Admin/TPO)
exports.getScraperStats = async (req, res) => {
  try {
    const stats = jobScraperService.getStats();

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
