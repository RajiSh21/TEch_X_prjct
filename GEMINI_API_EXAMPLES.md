# Gemini Scraper API Examples

## Quick Start Examples

### 1. Initialize Gemini Scraper

**For Admin/TPO users:**

```bash
# Initialize with your API key
curl -X POST http://localhost:5000/api/gemini-scraper/initialize \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "apiKey": "AIzaSyDXXXXXXXXXXXXXXXXXXXXXXXXXXXXX"
  }'

# Response:
# {
#   "success": true,
#   "message": "Gemini AI scraper initialized successfully"
# }
```

### 2. Auto-Scrape for Student (Based on Profile Location)

**For Students:**

```bash
# Scrape based on your profile location
curl -X POST http://localhost:5000/api/gemini-scraper/auto-scrape \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_STUDENT_JWT_TOKEN"

# Response:
# {
#   "success": true,
#   "message": "Auto-scraping completed",
#   "data": {
#     "totalScraped": 45,
#     "saved": 38,
#     "skipped": 7,
#     "duration": 12.5,
#     "location": {
#       "city": "Bangalore",
#       "state": "Karnataka",
#       "country": "India"
#     }
#   }
# }
```

### 3. Scrape by Specific Location

**For Admin/TPO users:**

```bash
# Scrape Bangalore
curl -X POST http://localhost:5000/api/gemini-scraper/scrape-by-location \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "city": "Bangalore",
    "state": "Karnataka",
    "country": "India",
    "jobTypes": ["internship", "apprenticeship", "job"]
  }'

# Scrape Mumbai (internships only)
curl -X POST http://localhost:5000/api/gemini-scraper/scrape-by-location \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "city": "Mumbai",
    "state": "Maharashtra",
    "jobTypes": ["internship"]
  }'

# Response:
# {
#   "success": true,
#   "message": "Scraping completed for Bangalore, Karnataka",
#   "data": {
#     "totalScraped": 45,
#     "saved": 38,
#     "skipped": 7,
#     "duration": 12.5,
#     "location": {
#       "city": "Bangalore",
#       "state": "Karnataka",
#       "country": "India"
#     },
#     "stats": {
#       "totalScraped": 45,
#       "successful": 38,
#       "failed": 7,
#       "lastRun": "2024-01-28T10:30:00.000Z",
#       "byLocation": {
#         "Bangalore, Karnataka": 38
#       },
#       "byType": {
#         "internship": 20,
#         "apprenticeship": 10,
#         "job": 8
#       }
#     }
#   }
# }
```

### 4. Batch Scrape Multiple Cities

**For Admin/TPO users:**

```bash
# Scrape multiple cities at once
curl -X POST http://localhost:5000/api/gemini-scraper/batch-scrape \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "locations": [
      {"city": "Bangalore", "state": "Karnataka"},
      {"city": "Mumbai", "state": "Maharashtra"},
      {"city": "Pune", "state": "Maharashtra"},
      {"city": "Delhi", "state": "Delhi"},
      {"city": "Hyderabad", "state": "Telangana"}
    ],
    "jobTypes": ["internship", "apprenticeship"]
  }'

# Response:
# {
#   "success": true,
#   "message": "Batch scraping completed for 5 locations",
#   "data": {
#     "totalLocations": 5,
#     "totalScraped": 180,
#     "totalSaved": 156,
#     "results": [
#       {
#         "location": "Bangalore, Karnataka",
#         "totalScraped": 45,
#         "saved": 40,
#         "skipped": 5,
#         "duration": 10.2
#       },
#       {
#         "location": "Mumbai, Maharashtra",
#         "totalScraped": 38,
#         "saved": 35,
#         "skipped": 3,
#         "duration": 9.8
#       }
#       // ... more results
#     ]
#   }
# }
```

### 5. Get Scraping Statistics

**For Admin/TPO users:**

```bash
# Get overall statistics
curl -X GET http://localhost:5000/api/gemini-scraper/stats \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"

# Response:
# {
#   "success": true,
#   "data": {
#     "totalScraped": 450,
#     "successful": 398,
#     "failed": 52,
#     "lastRun": "2024-01-28T10:30:00.000Z",
#     "byLocation": {
#       "Bangalore, Karnataka": 120,
#       "Mumbai, Maharashtra": 95,
#       "Pune, Maharashtra": 85,
#       "Delhi, Delhi": 98
#     },
#     "byType": {
#       "internship": 180,
#       "apprenticeship": 120,
#       "job": 98
#     }
#   }
# }
```

## Mobile App Usage Examples

### JavaScript/React Native

```javascript
import api from '../services/api';

// Auto-scrape for current user
const autoScrapeJobs = async () => {
  try {
    const response = await api.post('/gemini-scraper/auto-scrape');
    
    if (response.data.success) {
      const { saved, totalScraped, location } = response.data.data;
      
      Alert.alert(
        'Success!',
        `Found ${totalScraped} opportunities!\n${saved} new jobs near ${location.city}`
      );
      
      // Refresh job listings
      navigation.navigate('Jobs');
    }
  } catch (error) {
    Alert.alert('Error', error.response?.data?.message || 'Scraping failed');
  }
};

// Get statistics
const fetchStats = async () => {
  try {
    const response = await api.get('/gemini-scraper/stats');
    setStats(response.data.data);
  } catch (error) {
    console.error('Error fetching stats:', error);
  }
};
```

## Python Examples

```python
import requests

BASE_URL = "http://localhost:5000/api"
TOKEN = "your_jwt_token_here"

headers = {
    "Content-Type": "application/json",
    "Authorization": f"Bearer {TOKEN}"
}

# Auto-scrape
response = requests.post(
    f"{BASE_URL}/gemini-scraper/auto-scrape",
    headers=headers
)
print(response.json())

# Scrape specific location
data = {
    "city": "Bangalore",
    "state": "Karnataka",
    "jobTypes": ["internship", "apprenticeship"]
}
response = requests.post(
    f"{BASE_URL}/gemini-scraper/scrape-by-location",
    headers=headers,
    json=data
)
print(response.json())

# Get stats
response = requests.get(
    f"{BASE_URL}/gemini-scraper/stats",
    headers=headers
)
print(response.json())
```

## Node.js Examples

```javascript
const axios = require('axios');

const BASE_URL = 'http://localhost:5000/api';
const TOKEN = 'your_jwt_token_here';

const headers = {
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${TOKEN}`
};

// Auto-scrape
async function autoScrape() {
  try {
    const response = await axios.post(
      `${BASE_URL}/gemini-scraper/auto-scrape`,
      {},
      { headers }
    );
    console.log(response.data);
  } catch (error) {
    console.error(error.response?.data || error.message);
  }
}

// Batch scrape
async function batchScrape() {
  try {
    const response = await axios.post(
      `${BASE_URL}/gemini-scraper/batch-scrape`,
      {
        locations: [
          { city: 'Bangalore', state: 'Karnataka' },
          { city: 'Mumbai', state: 'Maharashtra' }
        ],
        jobTypes: ['internship', 'apprenticeship']
      },
      { headers }
    );
    console.log(response.data);
  } catch (error) {
    console.error(error.response?.data || error.message);
  }
}

autoScrape();
batchScrape();
```

## Common Use Cases

### Use Case 1: Daily Scheduled Scraping

```bash
# Add to cron job (runs at midnight daily)
0 0 * * * curl -X POST http://localhost:5000/api/gemini-scraper/batch-scrape \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -d '{"locations": [{"city": "Bangalore", "state": "Karnataka"}], "jobTypes": ["internship"]}'
```

### Use Case 2: Student Onboarding

```javascript
// When student adds location to profile, trigger auto-scrape
const onLocationUpdate = async (location) => {
  // Update profile with location
  await api.put('/auth/profile', {
    profile: {
      city: location.city,
      state: location.state,
      country: 'India'
    }
  });
  
  // Trigger auto-scrape
  const result = await api.post('/gemini-scraper/auto-scrape');
  
  if (result.data.success && result.data.data.saved > 0) {
    showNotification(`${result.data.data.saved} jobs found near you!`);
  }
};
```

### Use Case 3: Admin Dashboard

```javascript
// Scrape all major cities and display results
const scrapeAllCities = async () => {
  const cities = [
    { city: 'Bangalore', state: 'Karnataka' },
    { city: 'Mumbai', state: 'Maharashtra' },
    { city: 'Delhi', state: 'Delhi' },
    { city: 'Hyderabad', state: 'Telangana' },
    { city: 'Chennai', state: 'Tamil Nadu' },
    { city: 'Pune', state: 'Maharashtra' }
  ];
  
  const response = await api.post('/gemini-scraper/batch-scrape', {
    locations: cities,
    jobTypes: ['internship', 'apprenticeship', 'job']
  });
  
  // Display results in admin dashboard
  displayResults(response.data.data.results);
};
```

## Error Handling

### Common Errors and Solutions

```javascript
// Error: API key not configured
{
  "success": false,
  "message": "Gemini API key not configured"
}
// Solution: Add GEMINI_API_KEY to .env file

// Error: Location not found in profile
{
  "success": false,
  "message": "User or profile not found"
}
// Solution: Update user profile with city and state

// Error: Rate limit exceeded
{
  "success": false,
  "message": "Rate limit exceeded. Please try again later."
}
// Solution: Wait before making another request

// Error: No jobs found
{
  "success": true,
  "data": {
    "totalScraped": 0,
    "saved": 0,
    "message": "No jobs found for this location"
  }
}
// Solution: Try a larger city or different job types
```

## Testing

### Test Gemini Initialization

```bash
# Should return success if API key is valid
curl -X POST http://localhost:5000/api/gemini-scraper/initialize \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -d '{"apiKey": "test_key"}'
```

### Test Auto-Scrape (Mock Data)

```bash
# Even without Gemini API, should return mock data
curl -X POST http://localhost:5000/api/gemini-scraper/auto-scrape \
  -H "Authorization: Bearer $STUDENT_TOKEN"
```

### View Scraped Jobs

```bash
# After scraping, view jobs in database
curl -X GET http://localhost:5000/api/jobs?source=scraped \
  -H "Authorization: Bearer $TOKEN"
```

---

**For complete documentation, see GEMINI_SCRAPER_GUIDE.md**
