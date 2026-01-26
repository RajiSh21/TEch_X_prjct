# API Testing Examples

This file contains example API requests for testing all endpoints.

## Setup
First, get your authentication token:

```bash
# Register/Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@college.edu",
    "password": "admin123"
  }'

# Save the token from the response
export TOKEN="your_jwt_token_here"
```

## Authentication Endpoints

### Register
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Jane Smith",
    "email": "jane@student.edu",
    "password": "password123",
    "role": "student",
    "profile": {
      "department": "Computer Science",
      "yearOfStudy": 3,
      "cgpa": 8.2,
      "skills": ["Python", "Java", "SQL"]
    }
  }'
```

### Get Current User Profile
```bash
curl http://localhost:5000/api/auth/me \
  -H "Authorization: Bearer $TOKEN"
```

### Update Profile
```bash
curl -X PUT http://localhost:5000/api/auth/profile \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "profile": {
      "skills": ["Python", "Java", "SQL", "Machine Learning"],
      "cgpa": 8.5
    }
  }'
```

## Job Endpoints

### Get All Jobs
```bash
# All jobs
curl http://localhost:5000/api/jobs

# Filter by type
curl "http://localhost:5000/api/jobs?type=internship"

# Search
curl "http://localhost:5000/api/jobs?search=software+engineer"

# Pagination
curl "http://localhost:5000/api/jobs?page=1&limit=10"
```

### Get Single Job
```bash
curl http://localhost:5000/api/jobs/JOB_ID
```

### Create Job (Admin/TPO only)
```bash
curl -X POST http://localhost:5000/api/jobs \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Software Engineer Intern",
    "company": "Tech Solutions Inc",
    "description": "Exciting internship opportunity for talented students",
    "type": "internship",
    "location": {
      "city": "Bangalore",
      "state": "Karnataka",
      "country": "India",
      "remote": false
    },
    "salary": {
      "min": 20000,
      "max": 30000,
      "currency": "INR"
    },
    "requirements": {
      "skills": ["JavaScript", "React", "Node.js"],
      "education": "Bachelor in Computer Science",
      "minCGPA": 7.0
    },
    "applicationDeadline": "2026-03-01",
    "status": "active"
  }'
```

### Update Job (Admin/TPO only)
```bash
curl -X PUT http://localhost:5000/api/jobs/JOB_ID \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "status": "closed"
  }'
```

### Apply for Job (Student only)
```bash
curl -X POST http://localhost:5000/api/jobs/JOB_ID/apply \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "coverLetter": "I am very interested in this position...",
    "resume": "https://example.com/resume.pdf"
  }'
```

## Interview Endpoints

### Get All Interviews
```bash
curl http://localhost:5000/api/interviews \
  -H "Authorization: Bearer $TOKEN"
```

### Schedule Interview (Admin/TPO only)
```bash
curl -X POST http://localhost:5000/api/interviews \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "job": "JOB_ID",
    "student": "STUDENT_ID",
    "scheduledDate": "2026-02-15T10:00:00Z",
    "type": "technical",
    "location": "online",
    "meetingLink": "https://meet.google.com/abc-defg-hij",
    "interviewer": "John Interviewer",
    "duration": 60
  }'
```

### Update Interview Result (Admin/TPO only)
```bash
curl -X PUT http://localhost:5000/api/interviews/INTERVIEW_ID/result \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "status": "selected",
    "feedback": "Excellent technical skills",
    "rating": 8
  }'
```

## Notification Endpoints

### Get Notifications
```bash
# All notifications
curl http://localhost:5000/api/notifications \
  -H "Authorization: Bearer $TOKEN"

# Only unread
curl "http://localhost:5000/api/notifications?isRead=false" \
  -H "Authorization: Bearer $TOKEN"
```

### Mark as Read
```bash
curl -X PUT http://localhost:5000/api/notifications/NOTIFICATION_ID/read \
  -H "Authorization: Bearer $TOKEN"
```

### Mark All as Read
```bash
curl -X PUT http://localhost:5000/api/notifications/read-all \
  -H "Authorization: Bearer $TOKEN"
```

## Analytics Endpoints

### Get Dashboard Stats
```bash
curl http://localhost:5000/api/analytics/dashboard \
  -H "Authorization: Bearer $TOKEN"
```

### Get Student Insights
```bash
curl http://localhost:5000/api/analytics/student/STUDENT_ID \
  -H "Authorization: Bearer $TOKEN"
```

### Analyze Job Match (Student only)
```bash
curl http://localhost:5000/api/analytics/match/JOB_ID \
  -H "Authorization: Bearer $TOKEN"
```

### Generate Placement Report (Admin/TPO only)
```bash
# Full report
curl http://localhost:5000/api/analytics/report \
  -H "Authorization: Bearer $TOKEN"

# Filtered by date
curl "http://localhost:5000/api/analytics/report?startDate=2026-01-01&endDate=2026-12-31" \
  -H "Authorization: Bearer $TOKEN"

# Filtered by department
curl "http://localhost:5000/api/analytics/report?department=Computer%20Science" \
  -H "Authorization: Bearer $TOKEN"
```

## Scraper Endpoints

### Trigger Job Scraping (Admin/TPO only)
```bash
curl -X POST http://localhost:5000/api/scraper/run \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "searchQueries": ["software engineer intern", "data analyst"]
  }'
```

### Get Scraping Stats (Admin/TPO only)
```bash
curl http://localhost:5000/api/scraper/stats \
  -H "Authorization: Bearer $TOKEN"
```

## Testing Workflow

### Complete Student Workflow
```bash
# 1. Register as student
# (Use register endpoint above)

# 2. Login and get token
# (Use login endpoint)

# 3. Update profile
# (Use update profile endpoint)

# 4. Browse jobs
curl http://localhost:5000/api/jobs

# 5. Get job match analysis
curl http://localhost:5000/api/analytics/match/JOB_ID \
  -H "Authorization: Bearer $TOKEN"

# 6. Apply for job
curl -X POST http://localhost:5000/api/jobs/JOB_ID/apply \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"coverLetter": "..."}'

# 7. Check notifications
curl http://localhost:5000/api/notifications \
  -H "Authorization: Bearer $TOKEN"

# 8. View dashboard
curl http://localhost:5000/api/analytics/dashboard \
  -H "Authorization: Bearer $TOKEN"
```

### Complete Admin Workflow
```bash
# 1. Login as admin
# (Use login endpoint with admin credentials)

# 2. Create job
# (Use create job endpoint)

# 3. Trigger job scraping
curl -X POST http://localhost:5000/api/scraper/run \
  -H "Authorization: Bearer $TOKEN"

# 4. Schedule interview
# (Use schedule interview endpoint)

# 5. Generate placement report
curl http://localhost:5000/api/analytics/report \
  -H "Authorization: Bearer $TOKEN"

# 6. Check scraping stats
curl http://localhost:5000/api/scraper/stats \
  -H "Authorization: Bearer $TOKEN"
```

## Notes

- Replace `JOB_ID`, `STUDENT_ID`, `INTERVIEW_ID`, `NOTIFICATION_ID` with actual IDs from your database
- Replace `$TOKEN` with your actual JWT token
- All dates should be in ISO 8601 format
- For production, use HTTPS instead of HTTP
