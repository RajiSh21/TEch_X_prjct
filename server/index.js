const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');
const jobScraperService = require('./services/jobScraperService');
const geminiScraperService = require('./services/geminiScraperService');

// Load env vars
dotenv.config();

// Connect to database
connectDB();

const app = express();

// Body parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Enable CORS
app.use(cors());

// Mount routers
app.use('/api/auth', require('./routes/auth'));
app.use('/api/jobs', require('./routes/jobs'));
app.use('/api/interviews', require('./routes/interviews'));
app.use('/api/notifications', require('./routes/notifications'));
app.use('/api/analytics', require('./routes/analytics'));
app.use('/api/scraper', require('./routes/scraper'));
app.use('/api/gemini-scraper', require('./routes/geminiScraper'));

// Root route
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'College Placement System API',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      jobs: '/api/jobs',
      interviews: '/api/interviews',
      notifications: '/api/notifications',
      analytics: '/api/analytics',
      scraper: '/api/scraper',
      geminiScraper: '/api/gemini-scraper'
    }
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Server Error',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
  
  // Initialize Gemini AI if API key is provided
  if (process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'your_gemini_api_key_here') {
    const initialized = geminiScraperService.initializeGemini(process.env.GEMINI_API_KEY);
    if (initialized) {
      console.log('✓ Gemini AI scraper initialized successfully');
    } else {
      console.log('✗ Failed to initialize Gemini AI scraper');
    }
  } else {
    console.log('ℹ Gemini API key not configured. Add GEMINI_API_KEY to .env file');
    console.log('  Get your API key from: https://makersuite.google.com/app/apikey');
  }
  
  // Schedule periodic job scraping (every 24 hours)
  const scrapingInterval = parseInt(process.env.SCRAPING_INTERVAL_HOURS) || 24;
  jobScraperService.schedulePeriodicScraping(scrapingInterval);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
  console.log(`Error: ${err.message}`);
  server.close(() => process.exit(1));
});

module.exports = app;
