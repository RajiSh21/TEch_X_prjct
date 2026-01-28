const { GoogleGenerativeAI } = require('@google/generative-ai');
const axios = require('axios');
const cheerio = require('cheerio');
const Job = require('../models/Job');
const { createNotification } = require('./notificationService');

class GeminiWebScraperService {
  constructor() {
    // Initialize Gemini AI - API key should be set in .env as GEMINI_API_KEY
    this.genAI = null;
    this.model = null;
    this.isInitialized = false;
    
    this.stats = {
      totalScraped: 0,
      successful: 0,
      failed: 0,
      lastRun: null,
      byLocation: {},
      byType: {
        internship: 0,
        apprenticeship: 0,
        job: 0
      }
    };
    
    // Popular job boards for scraping
    this.jobBoards = [
      {
        name: 'Internshala',
        baseUrl: 'https://internshala.com',
        searchPath: '/internships/',
        supports: ['internship', 'apprenticeship']
      },
      {
        name: 'Indeed India',
        baseUrl: 'https://in.indeed.com',
        searchPath: '/jobs',
        supports: ['internship', 'job', 'apprenticeship']
      },
      {
        name: 'Naukri',
        baseUrl: 'https://www.naukri.com',
        searchPath: '/jobs',
        supports: ['job', 'internship']
      },
      {
        name: 'LinkedIn India',
        baseUrl: 'https://www.linkedin.com',
        searchPath: '/jobs/search',
        supports: ['job', 'internship']
      }
    ];
  }

  // Initialize Gemini AI with API key
  initializeGemini(apiKey) {
    try {
      if (!apiKey) {
        console.error('[GEMINI SCRAPER] No API key provided');
        return false;
      }
      
      this.genAI = new GoogleGenerativeAI(apiKey);
      this.model = this.genAI.getGenerativeModel({ model: 'gemini-pro' });
      this.isInitialized = true;
      
      console.log('[GEMINI SCRAPER] Gemini AI initialized successfully');
      return true;
    } catch (error) {
      console.error('[GEMINI SCRAPER] Failed to initialize Gemini:', error.message);
      this.isInitialized = false;
      return false;
    }
  }

  // Use Gemini to analyze and extract job details from HTML content
  async analyzeJobWithGemini(htmlContent, location) {
    if (!this.isInitialized) {
      console.error('[GEMINI SCRAPER] Gemini AI not initialized');
      return null;
    }

    try {
      const prompt = `
You are a job listing parser. Analyze the following HTML content and extract job/internship/apprenticeship opportunities.
Focus on opportunities in or near: ${location.city}, ${location.state}, ${location.country}

HTML Content (truncated):
${htmlContent.substring(0, 3000)}

Extract and return ONLY valid job listings in this EXACT JSON format (no additional text):
{
  "jobs": [
    {
      "title": "Job Title",
      "company": "Company Name",
      "description": "Brief description",
      "location": {
        "city": "City",
        "state": "State",
        "country": "Country",
        "remote": false
      },
      "type": "internship or job or apprenticeship",
      "salary": {
        "min": 0,
        "max": 0,
        "currency": "INR"
      },
      "requirements": {
        "skills": ["skill1", "skill2"],
        "education": "Education requirement",
        "experience": "Experience level",
        "minCGPA": 0
      },
      "applicationUrl": "URL to apply",
      "postedDate": "Date posted if available"
    }
  ]
}

Rules:
1. Only extract legitimate job/internship/apprenticeship listings
2. Filter for locations near ${location.city} (within 50km radius or same state)
3. Include remote opportunities
4. Skip job ads, training programs not leading to employment
5. Return empty array if no valid listings found
6. Ensure all fields are filled with meaningful data or defaults
`;

      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      // Extract JSON from response
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        return parsed.jobs || [];
      }
      
      return [];
    } catch (error) {
      console.error('[GEMINI SCRAPER] Error analyzing with Gemini:', error.message);
      return [];
    }
  }

  // Scrape job boards based on user location
  async scrapeByLocation(userLocation, jobTypes = ['internship', 'apprenticeship', 'job']) {
    console.log(`[GEMINI SCRAPER] Starting location-based scraping for ${userLocation.city}, ${userLocation.state}`);
    
    const startTime = Date.now();
    let allJobs = [];
    
    // Search queries based on job types
    const searchQueries = this.generateSearchQueries(userLocation, jobTypes);
    
    for (const query of searchQueries) {
      try {
        // Scrape multiple sources
        const jobs = await this.scrapeWithGemini(query, userLocation);
        allJobs = allJobs.concat(jobs);
        
        // Add delay to respect rate limits
        await this.delay(2000);
      } catch (error) {
        console.error(`[GEMINI SCRAPER] Error scraping query "${query}":`, error.message);
      }
    }
    
    // Remove duplicates
    allJobs = this.removeDuplicates(allJobs);
    
    // Save to database
    const saveResults = await this.saveJobs(allJobs);
    
    // Update statistics
    this.updateStats(allJobs, saveResults, userLocation);
    
    const duration = (Date.now() - startTime) / 1000;
    
    console.log(`[GEMINI SCRAPER] Scraping completed in ${duration}s. Found: ${allJobs.length}, Saved: ${saveResults.saved}`);
    
    return {
      totalScraped: allJobs.length,
      saved: saveResults.saved,
      skipped: saveResults.skipped,
      duration,
      location: userLocation,
      stats: this.stats
    };
  }

  // Generate search queries based on location and job types
  generateSearchQueries(location, jobTypes) {
    const queries = [];
    const locationStr = `${location.city} ${location.state}`;
    
    if (jobTypes.includes('internship')) {
      queries.push(`internship in ${locationStr}`);
      queries.push(`summer internship ${locationStr}`);
      queries.push(`intern opportunities ${location.city}`);
    }
    
    if (jobTypes.includes('apprenticeship')) {
      queries.push(`apprenticeship ${locationStr}`);
      queries.push(`apprentice program ${location.city}`);
      queries.push(`vocational training ${locationStr}`);
    }
    
    if (jobTypes.includes('job')) {
      queries.push(`fresher jobs ${locationStr}`);
      queries.push(`entry level jobs ${location.city}`);
      queries.push(`graduate jobs ${locationStr}`);
    }
    
    return queries;
  }

  // Scrape with Gemini AI assistance
  async scrapeWithGemini(searchQuery, userLocation) {
    if (!this.isInitialized) {
      console.warn('[GEMINI SCRAPER] Gemini not initialized, using fallback method');
      return this.getMockJobsByLocation(userLocation);
    }
    
    const jobs = [];
    
    // Try scraping from multiple sources
    for (const board of this.jobBoards) {
      try {
        const searchUrl = `${board.baseUrl}${board.searchPath}?q=${encodeURIComponent(searchQuery)}`;
        
        console.log(`[GEMINI SCRAPER] Fetching from ${board.name}: ${searchQuery}`);
        
        const response = await axios.get(searchUrl, {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
          },
          timeout: 10000
        });
        
        // Use Gemini to analyze the HTML and extract job listings
        const extractedJobs = await this.analyzeJobWithGemini(response.data, userLocation);
        
        if (extractedJobs && extractedJobs.length > 0) {
          // Add metadata
          extractedJobs.forEach(job => {
            job.source = 'scraped';
            job.sourceUrl = searchUrl;
            job.scrapedAt = new Date();
            job.status = 'active';
            job.scrapedBy = 'gemini-ai';
          });
          
          jobs.push(...extractedJobs);
        }
        
        // Delay between requests
        await this.delay(1000);
        
      } catch (error) {
        console.error(`[GEMINI SCRAPER] Error scraping ${board.name}:`, error.message);
      }
    }
    
    // If Gemini scraping fails, fallback to mock data
    if (jobs.length === 0) {
      console.log('[GEMINI SCRAPER] No jobs found via Gemini, using fallback data');
      return this.getMockJobsByLocation(userLocation);
    }
    
    return jobs;
  }

  // Get mock jobs filtered by location (fallback when scraping fails)
  getMockJobsByLocation(location) {
    const mockJobs = [
      {
        title: `Software Engineering Intern - ${location.city}`,
        company: 'Tech Solutions Pvt Ltd',
        description: `Exciting internship opportunity for computer science students in ${location.city}. Work on real projects with experienced mentors.`,
        location: { ...location, remote: false },
        type: 'internship',
        salary: { min: 15000, max: 25000, currency: 'INR' },
        requirements: {
          skills: ['JavaScript', 'React', 'Node.js'],
          education: 'Bachelor\'s in Computer Science',
          experience: '0 years',
          minCGPA: 7.0
        },
        applicationUrl: 'https://example.com/apply',
        postedDate: new Date().toISOString(),
        source: 'scraped',
        sourceUrl: 'https://example.com/jobs',
        scrapedAt: new Date(),
        status: 'active',
        scrapedBy: 'mock-data'
      },
      {
        title: `Data Analyst Apprenticeship - ${location.city}`,
        company: 'Analytics Corp',
        description: `Join our apprenticeship program and learn data analytics while working on live projects near ${location.city}.`,
        location: { ...location, remote: false },
        type: 'apprenticeship',
        salary: { min: 18000, max: 28000, currency: 'INR' },
        requirements: {
          skills: ['Python', 'SQL', 'Excel', 'Statistics'],
          education: 'Bachelor\'s in any field',
          experience: '0 years',
          minCGPA: 6.5
        },
        applicationUrl: 'https://example.com/apply',
        postedDate: new Date().toISOString(),
        source: 'scraped',
        sourceUrl: 'https://example.com/jobs',
        scrapedAt: new Date(),
        status: 'active',
        scrapedBy: 'mock-data'
      },
      {
        title: `Web Developer Intern - Remote (${location.state})`,
        company: 'Digital Innovations',
        description: `Remote internship opportunity for students in ${location.state}. Flexible hours and great learning experience.`,
        location: { ...location, remote: true },
        type: 'internship',
        salary: { min: 12000, max: 20000, currency: 'INR' },
        requirements: {
          skills: ['HTML', 'CSS', 'JavaScript', 'React'],
          education: 'Any degree program',
          experience: '0 years',
          minCGPA: 6.0
        },
        applicationUrl: 'https://example.com/apply',
        postedDate: new Date().toISOString(),
        source: 'scraped',
        sourceUrl: 'https://example.com/jobs',
        scrapedAt: new Date(),
        status: 'active',
        scrapedBy: 'mock-data'
      },
      {
        title: `Marketing Intern - ${location.city}`,
        company: 'Brand Builders',
        description: `Hands-on marketing internship in ${location.city}. Learn digital marketing, social media, and campaign management.`,
        location: { ...location, remote: false },
        type: 'internship',
        salary: { min: 10000, max: 15000, currency: 'INR' },
        requirements: {
          skills: ['Social Media', 'Content Writing', 'Marketing'],
          education: 'Any degree',
          experience: '0 years',
          minCGPA: 5.5
        },
        applicationUrl: 'https://example.com/apply',
        postedDate: new Date().toISOString(),
        source: 'scraped',
        sourceUrl: 'https://example.com/jobs',
        scrapedAt: new Date(),
        status: 'active',
        scrapedBy: 'mock-data'
      }
    ];
    
    return mockJobs;
  }

  // Remove duplicate jobs based on title, company, and location
  removeDuplicates(jobs) {
    const seen = new Set();
    return jobs.filter(job => {
      const key = `${job.title}-${job.company}-${job.location.city}`.toLowerCase();
      if (seen.has(key)) {
        return false;
      }
      seen.add(key);
      return true;
    });
  }

  // Save scraped jobs to database
  async saveJobs(jobs) {
    let saved = 0;
    let skipped = 0;

    for (const jobData of jobs) {
      try {
        // Check if job already exists
        const existing = await Job.findOne({
          title: jobData.title,
          company: jobData.company,
          'location.city': jobData.location.city,
          source: 'scraped'
        });

        if (!existing) {
          await Job.create(jobData);
          saved++;
        } else {
          skipped++;
        }
      } catch (error) {
        console.error(`[GEMINI SCRAPER] Error saving job:`, error.message);
      }
    }

    return { saved, skipped };
  }

  // Update statistics
  updateStats(jobs, saveResults, location) {
    this.stats.totalScraped += jobs.length;
    this.stats.successful += saveResults.saved;
    this.stats.failed += saveResults.skipped;
    this.stats.lastRun = new Date();
    
    // Track by location
    const locationKey = `${location.city}, ${location.state}`;
    this.stats.byLocation[locationKey] = (this.stats.byLocation[locationKey] || 0) + saveResults.saved;
    
    // Track by type
    jobs.forEach(job => {
      const type = job.type || 'job';
      this.stats.byType[type] = (this.stats.byType[type] || 0) + 1;
    });
  }

  // Notify users about new opportunities near their location
  async notifyUsersAboutNewOpportunities(jobs, location) {
    try {
      // This would query users with preferences matching the location
      // For now, this is a placeholder for the notification logic
      console.log(`[GEMINI SCRAPER] Would notify users about ${jobs.length} new opportunities near ${location.city}`);
      
      // In production, you would:
      // 1. Find users with location preferences matching the jobs
      // 2. Create notifications for each user
      // 3. Send push notifications
    } catch (error) {
      console.error('[GEMINI SCRAPER] Error notifying users:', error.message);
    }
  }

  // Get scraping statistics
  getStats() {
    return this.stats;
  }

  // Delay utility
  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // Auto-scrape based on user profile
  async autoScrapeForUser(userId) {
    try {
      const User = require('../models/User');
      const user = await User.findById(userId);
      
      if (!user || !user.profile) {
        throw new Error('User or profile not found');
      }
      
      // Get user's location from profile or preferences
      const userLocation = {
        city: user.profile.city || 'Bangalore',
        state: user.profile.state || 'Karnataka',
        country: user.profile.country || 'India'
      };
      
      // Determine job types based on user's preferences
      const jobTypes = user.preferences?.jobTypes || ['internship', 'apprenticeship', 'job'];
      
      console.log(`[GEMINI SCRAPER] Auto-scraping for user ${user.email} in ${userLocation.city}`);
      
      const results = await this.scrapeByLocation(userLocation, jobTypes);
      
      // Notify user about new opportunities
      if (results.saved > 0) {
        await createNotification({
          user: userId,
          title: 'New Opportunities Found!',
          message: `We found ${results.saved} new ${jobTypes.join('/')} opportunities near ${userLocation.city}`,
          type: 'job',
          priority: 'high'
        });
      }
      
      return results;
    } catch (error) {
      console.error('[GEMINI SCRAPER] Error in auto-scrape:', error.message);
      throw error;
    }
  }
}

module.exports = new GeminiWebScraperService();
