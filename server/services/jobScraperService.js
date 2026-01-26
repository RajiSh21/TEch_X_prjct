const axios = require('axios');
const cheerio = require('cheerio');
const Job = require('../models/Job');
const cron = require('node-cron');

// Job boards to scrape
const JOB_SOURCES = [
  {
    name: 'Indeed',
    baseUrl: 'https://www.indeed.com/jobs',
    selectors: {
      jobCard: '.job_seen_beacon',
      title: '.jobTitle',
      company: '.companyName',
      location: '.companyLocation',
      description: '.job-snippet'
    }
  },
  {
    name: 'LinkedIn',
    baseUrl: 'https://www.linkedin.com/jobs/search',
    selectors: {
      jobCard: '.job-card-container',
      title: '.job-card-list__title',
      company: '.job-card-container__company-name',
      location: '.job-card-container__metadata-item',
      description: '.job-card-list__description'
    }
  }
];

class JobScraperService {
  constructor() {
    this.scrapedJobs = [];
    this.stats = {
      totalScraped: 0,
      successful: 0,
      failed: 0,
      lastRun: null
    };
  }

  // Generic scraper function
  async scrapeJobBoard(source, searchQuery = 'software engineer intern') {
    try {
      console.log(`Scraping ${source.name}...`);
      
      // Note: In production, you'd need to handle anti-scraping measures
      // and respect robots.txt. This is a simplified example.
      const url = `${source.baseUrl}?q=${encodeURIComponent(searchQuery)}`;
      
      const response = await axios.get(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        },
        timeout: 10000
      });

      const $ = cheerio.load(response.data);
      const jobs = [];

      $(source.selectors.jobCard).each((i, element) => {
        try {
          const title = $(element).find(source.selectors.title).text().trim();
          const company = $(element).find(source.selectors.company).text().trim();
          const location = $(element).find(source.selectors.location).text().trim();
          const description = $(element).find(source.selectors.description).text().trim();

          if (title && company) {
            jobs.push({
              title,
              company,
              description: description || 'No description available',
              location: this.parseLocation(location),
              source: 'scraped',
              sourceUrl: url,
              scrapedAt: new Date(),
              status: 'active',
              type: this.determineJobType(title, description)
            });
          }
        } catch (err) {
          console.error(`Error parsing job element: ${err.message}`);
        }
      });

      return jobs;
    } catch (error) {
      console.error(`Error scraping ${source.name}: ${error.message}`);
      return [];
    }
  }

  // Parse location string into structured format
  parseLocation(locationStr) {
    const parts = locationStr.split(',').map(s => s.trim());
    return {
      city: parts[0] || '',
      state: parts[1] || '',
      country: parts[2] || 'India',
      remote: locationStr.toLowerCase().includes('remote')
    };
  }

  // Determine job type from title and description
  determineJobType(title, description) {
    const text = `${title} ${description}`.toLowerCase();
    if (text.includes('intern')) return 'internship';
    if (text.includes('contract')) return 'contract';
    if (text.includes('part-time') || text.includes('part time')) return 'part-time';
    return 'full-time';
  }

  // Save scraped jobs to database
  async saveJobs(jobs) {
    let saved = 0;
    let skipped = 0;

    for (const jobData of jobs) {
      try {
        // Check if job already exists (avoid duplicates)
        const existing = await Job.findOne({
          title: jobData.title,
          company: jobData.company,
          source: 'scraped'
        });

        if (!existing) {
          await Job.create(jobData);
          saved++;
        } else {
          skipped++;
        }
      } catch (error) {
        console.error(`Error saving job: ${error.message}`);
      }
    }

    return { saved, skipped };
  }

  // Main scraping function
  async scrapeAllSources(searchQueries = ['software engineer intern', 'data analyst intern', 'web developer']) {
    console.log('Starting job scraping...');
    const startTime = Date.now();
    let allJobs = [];

    // Note: In production, you'd implement rate limiting and rotation
    // For now, we'll use a mock data approach for demonstration
    allJobs = this.getMockJobs();

    const saveResults = await this.saveJobs(allJobs);

    this.stats.totalScraped = allJobs.length;
    this.stats.successful = saveResults.saved;
    this.stats.failed = allJobs.length - saveResults.saved;
    this.stats.lastRun = new Date();

    const duration = (Date.now() - startTime) / 1000;

    console.log(`Scraping completed in ${duration}s. Saved: ${saveResults.saved}, Skipped: ${saveResults.skipped}`);

    return {
      totalScraped: allJobs.length,
      saved: saveResults.saved,
      skipped: saveResults.skipped,
      duration,
      stats: this.stats
    };
  }

  // Get mock jobs for demonstration (since actual scraping may be blocked)
  getMockJobs() {
    return [
      {
        title: 'Software Engineering Intern',
        company: 'Tech Corp',
        description: 'Looking for talented software engineering interns to join our team. Work on cutting-edge projects with modern technologies.',
        location: { city: 'Bangalore', state: 'Karnataka', country: 'India', remote: false },
        type: 'internship',
        salary: { min: 15000, max: 25000, currency: 'INR' },
        requirements: {
          skills: ['JavaScript', 'React', 'Node.js'],
          education: 'Bachelor\'s in Computer Science',
          experience: '0-1 years',
          minCGPA: 7.0
        },
        source: 'scraped',
        sourceUrl: 'https://example.com/jobs',
        scrapedAt: new Date(),
        status: 'active'
      },
      {
        title: 'Data Science Intern',
        company: 'Analytics Inc',
        description: 'Join our data science team and work on real-world machine learning projects.',
        location: { city: 'Mumbai', state: 'Maharashtra', country: 'India', remote: true },
        type: 'internship',
        salary: { min: 20000, max: 30000, currency: 'INR' },
        requirements: {
          skills: ['Python', 'Machine Learning', 'SQL'],
          education: 'Bachelor\'s in any field',
          experience: '0 years',
          minCGPA: 7.5
        },
        source: 'scraped',
        sourceUrl: 'https://example.com/jobs',
        scrapedAt: new Date(),
        status: 'active'
      },
      {
        title: 'Full Stack Developer',
        company: 'Startup XYZ',
        description: 'Looking for a full-stack developer to build scalable web applications.',
        location: { city: 'Hyderabad', state: 'Telangana', country: 'India', remote: false },
        type: 'full-time',
        salary: { min: 600000, max: 900000, currency: 'INR' },
        requirements: {
          skills: ['React', 'Node.js', 'MongoDB', 'AWS'],
          education: 'Bachelor\'s in Computer Science',
          experience: '0-2 years',
          minCGPA: 7.0
        },
        source: 'scraped',
        sourceUrl: 'https://example.com/jobs',
        scrapedAt: new Date(),
        status: 'active'
      }
    ];
  }

  // Get scraping statistics
  getStats() {
    return this.stats;
  }

  // Schedule periodic scraping
  schedulePeriodicScraping(intervalHours = 24) {
    const cronExpression = `0 */${intervalHours} * * *`;
    
    cron.schedule(cronExpression, async () => {
      console.log('Running scheduled job scraping...');
      await this.scrapeAllSources();
    });

    console.log(`Job scraping scheduled to run every ${intervalHours} hours`);
  }
}

module.exports = new JobScraperService();
