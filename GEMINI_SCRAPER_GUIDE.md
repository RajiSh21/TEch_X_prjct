# Gemini AI Web Scraper Guide

## Overview

The College Placement System now includes an **intelligent web scraping tool powered by Google's Gemini AI** that automatically finds internships, apprenticeships, and job opportunities based on user location.

## Features

✅ **AI-Powered Extraction**: Uses Gemini AI to intelligently parse job listings from HTML content
✅ **Location-Based Search**: Scrapes opportunities near the user's city/location
✅ **Multiple Job Types**: Finds internships, apprenticeships, and full-time jobs
✅ **Automatic Filtering**: AI filters results based on proximity to user location (within 50km or same state)
✅ **Duplicate Prevention**: Automatically removes duplicate job listings
✅ **Auto-Notification**: Notifies users when new opportunities are found
✅ **Batch Processing**: Can scrape multiple locations simultaneously
✅ **Statistics Tracking**: Tracks scraping performance and results by location

## Getting Started

### 1. Get Your Gemini API Key

1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy your API key

### 2. Add API Key to Your Project

**Option A: Environment Variable (Recommended for Production)**

1. Open the `.env` file in the root directory of the project
2. Find the line that says `GEMINI_API_KEY=your_gemini_api_key_here`
3. Replace `your_gemini_api_key_here` with your actual API key

Example:
```bash
GEMINI_API_KEY=AIzaSyDXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
```

**Option B: Manual Initialization via API**

You can also initialize the scraper at runtime by calling the initialization endpoint:

```bash
curl -X POST http://localhost:5000/api/gemini-scraper/initialize \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{"apiKey": "YOUR_GEMINI_API_KEY"}'
```

### 3. Start the Server

```bash
cd server
npm install
npm start
```

You should see:
```
✓ Gemini AI scraper initialized successfully
```

If you see this message instead:
```
ℹ Gemini API key not configured. Add GEMINI_API_KEY to .env file
```

Then you need to add your API key to the `.env` file.

## API Endpoints

### 1. Initialize Gemini Scraper

**POST** `/api/gemini-scraper/initialize`

Initialize the scraper with an API key (Admin/TPO only).

**Request:**
```json
{
  "apiKey": "YOUR_GEMINI_API_KEY"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Gemini AI scraper initialized successfully"
}
```

### 2. Scrape by Location

**POST** `/api/gemini-scraper/scrape-by-location`

Scrape jobs for a specific location (Admin/TPO only).

**Request:**
```json
{
  "city": "Bangalore",
  "state": "Karnataka",
  "country": "India",
  "jobTypes": ["internship", "apprenticeship", "job"]
}
```

**Response:**
```json
{
  "success": true,
  "message": "Scraping completed for Bangalore, Karnataka",
  "data": {
    "totalScraped": 45,
    "saved": 38,
    "skipped": 7,
    "duration": 12.5,
    "location": {
      "city": "Bangalore",
      "state": "Karnataka",
      "country": "India"
    },
    "stats": {
      "totalScraped": 45,
      "successful": 38,
      "failed": 7,
      "lastRun": "2024-01-28T10:30:00.000Z",
      "byLocation": {
        "Bangalore, Karnataka": 38
      },
      "byType": {
        "internship": 20,
        "apprenticeship": 10,
        "job": 8
      }
    }
  }
}
```

### 3. Auto-Scrape for Current User

**POST** `/api/gemini-scraper/auto-scrape`

Automatically scrapes opportunities based on the logged-in user's location from their profile.

**Request:** No body required (uses user's profile location)

**Response:**
```json
{
  "success": true,
  "message": "Auto-scraping completed",
  "data": {
    "totalScraped": 25,
    "saved": 22,
    "skipped": 3,
    "duration": 8.2,
    "location": {
      "city": "Mumbai",
      "state": "Maharashtra",
      "country": "India"
    }
  }
}
```

**Note:** User will also receive a notification if new opportunities are found.

### 4. Batch Scrape Multiple Locations

**POST** `/api/gemini-scraper/batch-scrape`

Scrape multiple locations in one request (Admin/TPO only).

**Request:**
```json
{
  "locations": [
    {"city": "Bangalore", "state": "Karnataka"},
    {"city": "Mumbai", "state": "Maharashtra"},
    {"city": "Pune", "state": "Maharashtra"},
    {"city": "Delhi", "state": "Delhi"},
    {"city": "Hyderabad", "state": "Telangana"}
  ],
  "jobTypes": ["internship", "apprenticeship"]
}
```

**Response:**
```json
{
  "success": true,
  "message": "Batch scraping completed for 5 locations",
  "data": {
    "totalLocations": 5,
    "totalScraped": 180,
    "totalSaved": 156,
    "results": [
      {
        "location": "Bangalore, Karnataka",
        "totalScraped": 45,
        "saved": 40,
        "skipped": 5
      },
      {
        "location": "Mumbai, Maharashtra",
        "totalScraped": 38,
        "saved": 35,
        "skipped": 3
      }
      // ... more results
    ]
  }
}
```

### 5. Get Scraper Statistics

**GET** `/api/gemini-scraper/stats`

Get overall scraping statistics (Admin/TPO only).

**Response:**
```json
{
  "success": true,
  "data": {
    "totalScraped": 450,
    "successful": 398,
    "failed": 52,
    "lastRun": "2024-01-28T10:30:00.000Z",
    "byLocation": {
      "Bangalore, Karnataka": 120,
      "Mumbai, Maharashtra": 95,
      "Pune, Maharashtra": 85,
      "Delhi, Delhi": 98
    },
    "byType": {
      "internship": 180,
      "apprenticeship": 120,
      "job": 98
    }
  }
}
```

## Usage in Mobile App

### Add Location to Profile

Students should add their location to their profile to enable auto-scraping:

```javascript
// Update user profile with location
const updateProfile = async () => {
  await api.put('/auth/profile', {
    profile: {
      city: 'Bangalore',
      state: 'Karnataka',
      country: 'India',
      // ... other profile fields
    }
  });
};
```

### Trigger Auto-Scrape

```javascript
// In mobile app - trigger auto scraping
const autoScrape = async () => {
  try {
    setLoading(true);
    const response = await api.post('/gemini-scraper/auto-scrape');
    
    if (response.data.success) {
      Alert.alert(
        'Success',
        `Found ${response.data.data.saved} new opportunities near you!`
      );
      // Refresh job listings
      fetchJobs();
    }
  } catch (error) {
    Alert.alert('Error', error.response?.data?.message || 'Scraping failed');
  } finally {
    setLoading(false);
  }
};
```

### Create a Scraping Button

Add a button in the Jobs screen to trigger auto-scraping:

```javascript
<TouchableOpacity 
  style={styles.scrapeButton} 
  onPress={autoScrape}
>
  <Ionicons name="search" size={20} color={COLORS.white} />
  <Text style={styles.scrapeButtonText}>
    Find New Opportunities Near Me
  </Text>
</TouchableOpacity>
```

## How It Works

### 1. Location-Based Search

The scraper generates search queries based on:
- User's city and state
- Job type preferences (internship, apprenticeship, job)

Example queries:
- "internship in Bangalore Karnataka"
- "apprenticeship Mumbai Maharashtra"
- "fresher jobs Pune Maharashtra"

### 2. Multi-Source Scraping

Scrapes from popular Indian job boards:
- Internshala (internships & apprenticeships)
- Indeed India (all types)
- Naukri (jobs & internships)
- LinkedIn India (all types)

### 3. AI-Powered Extraction

Gemini AI analyzes HTML content and:
- Identifies job listings
- Extracts key information (title, company, location, salary, requirements)
- Filters by proximity to user location
- Validates data quality
- Returns structured JSON

### 4. Smart Filtering

- **Location Match**: Only includes jobs within 50km or same state
- **Type Filter**: Matches user's job type preferences
- **Duplicate Detection**: Removes duplicate listings
- **Quality Check**: Validates all required fields

### 5. Database Storage

- Saves new opportunities to MongoDB
- Skips duplicates (same title + company + location)
- Tags with source and scraping metadata
- Marks as active and available for applications

### 6. User Notification

When new opportunities are found:
- Creates in-app notification
- Shows count of new opportunities
- Links directly to job listings
- Can trigger push notifications (if configured)

## Configuration

### Environment Variables

```bash
# Gemini API Key (Required)
GEMINI_API_KEY=your_gemini_api_key_here

# Auto-scraping settings
AUTO_SCRAPE_ENABLED=true
SCRAPING_INTERVAL_HOURS=24

# Rate limiting (requests per minute)
SCRAPE_RATE_LIMIT=10
```

### Scraping Frequency

**Recommended Settings:**
- **Development**: Manual trigger only
- **Production**: Every 24 hours (midnight)
- **High-activity**: Every 12 hours

## Best Practices

### 1. API Key Security

❌ **DON'T:**
- Commit API keys to Git
- Share API keys publicly
- Hard-code API keys in mobile app

✅ **DO:**
- Store in `.env` file
- Use environment variables
- Keep `.env` in `.gitignore`
- Rotate keys periodically

### 2. Rate Limiting

- Gemini API has rate limits (check your quota)
- Add delays between scraping multiple locations
- Don't scrape too frequently (respect job boards)

### 3. Error Handling

```javascript
try {
  const result = await geminiScraperService.scrapeByLocation(location);
  if (result.saved === 0) {
    // Handle no results found
  }
} catch (error) {
  // Handle API errors, network issues, etc.
}
```

### 4. Data Quality

- Review scraped jobs periodically
- Remove outdated listings
- Validate scraped data accuracy
- Update selectors if needed

## Troubleshooting

### API Key Issues

**Problem:** "Gemini API key not configured"

**Solution:**
1. Check `.env` file has `GEMINI_API_KEY=...`
2. Restart server after adding key
3. Verify key is valid at Google AI Studio

### No Jobs Found

**Problem:** Scraping returns 0 results

**Possible causes:**
1. Location is too specific (try larger city)
2. No opportunities in that area
3. Job boards blocked scraping
4. Gemini API rate limit reached

**Solution:**
- Try broader location (state instead of small town)
- Check different job types
- Use mock data fallback (automatically enabled)
- Wait for rate limit reset

### Initialization Failed

**Problem:** "Failed to initialize Gemini AI scraper"

**Solution:**
1. Verify API key is correct
2. Check internet connection
3. Ensure `@google/generative-ai` package is installed
4. Check Gemini API status

## Cost & Limits

### Gemini API

- **Free Tier**: 60 requests per minute
- **Paid Tier**: Higher limits available
- **Pricing**: Check [Google AI Pricing](https://ai.google.dev/pricing)

### Recommendations

- Cache results for 24 hours
- Batch multiple locations together
- Use auto-scrape sparingly (once per day per user)
- Implement request queuing for high traffic

## Example Workflows

### Workflow 1: Admin Scrapes Multiple Cities

1. Admin logs in
2. Goes to Admin Panel > Job Scraping
3. Selects multiple cities
4. Clicks "Batch Scrape"
5. System scrapes all cities
6. Students see new jobs in their feed

### Workflow 2: Student Auto-Discovers Jobs

1. Student adds location to profile
2. Clicks "Find Jobs Near Me"
3. System auto-scrapes their location
4. Student receives notification
5. Student views and applies to new jobs

### Workflow 3: Scheduled Daily Scraping

1. System runs at midnight daily
2. Scrapes top 10 cities
3. Finds new opportunities
4. Notifies matching students
5. Updates statistics dashboard

## Support

For issues or questions:
1. Check troubleshooting section
2. Review API documentation
3. Check server logs
4. Contact system administrator

## Advanced Features (Coming Soon)

- 🔄 Real-time scraping triggers
- 📧 Email notifications for new jobs
- 🎯 ML-based job matching
- 📊 Enhanced analytics dashboard
- 🔔 Push notifications
- 🌐 Multi-language support
- 🤖 Chatbot for job queries

---

**Last Updated:** January 2024  
**Version:** 1.0.0
