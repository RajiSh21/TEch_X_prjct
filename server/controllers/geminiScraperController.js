const geminiScraperService = require('../services/geminiScraperService');

// @desc    Initialize Gemini scraper with API key
// @route   POST /api/gemini-scraper/initialize
// @access  Private (Admin/TPO)
exports.initializeGemini = async (req, res) => {
  try {
    const { apiKey } = req.body;

    if (!apiKey) {
      return res.status(400).json({
        success: false,
        message: 'Gemini API key is required'
      });
    }

    const initialized = geminiScraperService.initializeGemini(apiKey);

    if (initialized) {
      res.status(200).json({
        success: true,
        message: 'Gemini AI scraper initialized successfully'
      });
    } else {
      res.status(500).json({
        success: false,
        message: 'Failed to initialize Gemini AI scraper'
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Scrape jobs by location
// @route   POST /api/gemini-scraper/scrape-by-location
// @access  Private (Admin/TPO)
exports.scrapeByLocation = async (req, res) => {
  try {
    const { city, state, country, jobTypes } = req.body;

    if (!city || !state) {
      return res.status(400).json({
        success: false,
        message: 'City and state are required'
      });
    }

    const location = {
      city,
      state,
      country: country || 'India'
    };

    const types = jobTypes || ['internship', 'apprenticeship', 'job'];

    console.log(`[API] Starting Gemini scraping for ${city}, ${state}`);

    const result = await geminiScraperService.scrapeByLocation(location, types);

    res.status(200).json({
      success: true,
      message: `Scraping completed for ${city}, ${state}`,
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

// @desc    Auto-scrape for current user based on their location
// @route   POST /api/gemini-scraper/auto-scrape
// @access  Private (Student)
exports.autoScrapeForUser = async (req, res) => {
  try {
    const userId = req.user.id;

    console.log(`[API] Auto-scraping for user ${userId}`);

    const result = await geminiScraperService.autoScrapeForUser(userId);

    res.status(200).json({
      success: true,
      message: 'Auto-scraping completed',
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

// @desc    Get Gemini scraper statistics
// @route   GET /api/gemini-scraper/stats
// @access  Private (Admin/TPO)
exports.getScraperStats = async (req, res) => {
  try {
    const stats = geminiScraperService.getStats();

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

// @desc    Scrape for multiple locations (batch scraping)
// @route   POST /api/gemini-scraper/batch-scrape
// @access  Private (Admin/TPO)
exports.batchScrapeLocations = async (req, res) => {
  try {
    const { locations, jobTypes } = req.body;

    if (!locations || !Array.isArray(locations) || locations.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Locations array is required'
      });
    }

    const results = [];
    const types = jobTypes || ['internship', 'apprenticeship', 'job'];

    for (const loc of locations) {
      try {
        const location = {
          city: loc.city,
          state: loc.state,
          country: loc.country || 'India'
        };

        const result = await geminiScraperService.scrapeByLocation(location, types);
        results.push({
          location: `${loc.city}, ${loc.state}`,
          ...result
        });

        // Delay between locations to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 3000));
      } catch (error) {
        results.push({
          location: `${loc.city}, ${loc.state}`,
          error: error.message
        });
      }
    }

    const totalSaved = results.reduce((sum, r) => sum + (r.saved || 0), 0);
    const totalScraped = results.reduce((sum, r) => sum + (r.totalScraped || 0), 0);

    res.status(200).json({
      success: true,
      message: `Batch scraping completed for ${locations.length} locations`,
      data: {
        totalLocations: locations.length,
        totalScraped,
        totalSaved,
        results
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};
