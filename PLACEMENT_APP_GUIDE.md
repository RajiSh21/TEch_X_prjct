# Placement & Internship Portal - User Guide

## Overview

The Placement & Internship Portal is a web-based application that integrates the Selenium job scraper to help students and job seekers discover and manage placement and internship opportunities.

## Features

- 🎓 **Web Interface**: Easy-to-use web dashboard
- 💼 **Placement Opportunities**: Browse full-time job openings
- 🎯 **Internship Opportunities**: Explore internship positions
- 🔍 **Integrated Scraper**: Scrape jobs directly from the web interface
- 💾 **Database Storage**: All jobs are stored in SQLite database
- 📊 **Statistics Dashboard**: View opportunity counts and recent additions
- 🗑️ **Job Management**: Remove outdated opportunities

## Installation

### Prerequisites

- Python 3.7+
- Chrome/Chromium browser (for scraping)
- All dependencies from requirements.txt

### Setup Steps

1. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

2. **Initialize the database:**
   ```bash
   python app.py
   ```
   The database will be created automatically on first run.

3. **Access the application:**
   Open your browser and go to:
   ```
   http://127.0.0.1:5000
   ```

## Using the Portal

### 1. Home Page

The home page displays:
- Total number of placements and internships
- Recently added opportunities
- Quick access to all sections

### 2. Viewing Opportunities

**Placements:**
- Navigate to "Placements" in the menu
- Browse all placement (full-time) opportunities
- Click "Apply Now" to open the job link in a new tab

**Internships:**
- Navigate to "Internships" in the menu
- Browse all internship opportunities
- Click "Apply Now" to open the job link

### 3. Scraping New Jobs

1. Click "Scrape Jobs" in the menu
2. Fill in the form:
   - **Job Search Query**: e.g., "Python Developer", "Data Scientist"
   - **Location**: e.g., "Berlin, Germany", "Remote", "United States"
   - **Job Type**: Select "Placement" or "Internship"
   - **Number of Pages**: How many pages to scrape (1-5 recommended)
3. Click "Start Scraping"
4. Wait for the scraper to complete (30-60 seconds per page)
5. Jobs will be automatically added and displayed

### 4. Managing Jobs

**Remove Individual Job:**
- Go to Placements or Internships page
- Click "Remove" button next to any job
- Confirm the deletion

**View Job Details:**
- Click on any job title or "Apply Now" button
- Opens the original job posting in a new tab

## API Endpoints

The portal also provides a REST API:

### Get All Jobs (JSON)
```bash
curl http://127.0.0.1:5000/api/jobs
```

### Get Placements Only
```bash
curl http://127.0.0.1:5000/api/jobs?type=placement
```

### Get Internships Only
```bash
curl http://127.0.0.1:5000/api/jobs?type=internship
```

## Command-Line Tools

### Manual Job Import

You can also use the command-line interface:

**Scrape and store jobs:**
```bash
python job_scraper_integration.py scrape "Python Developer" "Berlin, Germany" placement 2
```

**Import from CSV:**
```bash
python job_scraper_integration.py import jobs.csv internship
```

## Configuration

### Database Location

By default, the database is stored as `placement_opportunities.db` in the application directory.

### Port Configuration

To change the port, edit `app.py`:
```python
app.run(debug=True, host='0.0.0.0', port=5000)  # Change port here
```

### Secret Key

For production use, change the secret key in `app.py`:
```python
app.config['SECRET_KEY'] = 'your-secure-random-key-here'
```

## Troubleshooting

### Issue: Database not found

**Solution:**
```bash
python -c "from app import app, db, init_db; init_db()"
```

### Issue: Port already in use

**Solution:** Either:
1. Stop the process using port 5000
2. Change the port in app.py to another number (e.g., 5001)

### Issue: Scraping fails

**Solutions:**
1. Ensure Chrome/Chromium is installed
2. Check internet connection
3. Try with fewer pages (start with 1)
4. Run in non-headless mode for debugging:
   - Edit `job_scraper_integration.py`
   - Change `headless=True` to `headless=False`

### Issue: Jobs not appearing

**Solution:**
1. Check if scraping completed successfully
2. Refresh the page
3. Check database: `sqlite3 placement_opportunities.db "SELECT COUNT(*) FROM job_opportunity;"`

## Architecture

### Components

1. **app.py**: Main Flask application with routes and models
2. **job_scraper_integration.py**: Bridge between scraper and database
3. **templates/**: HTML templates for the web interface
4. **placement_opportunities.db**: SQLite database

### Database Schema

**JobOpportunity Table:**
- `id`: Primary key
- `title`: Job title
- `company`: Company name
- `location`: Job location
- `link`: URL to job posting
- `job_type`: 'placement' or 'internship'
- `date_added`: Timestamp when added
- `is_active`: Boolean for soft delete

## Best Practices

1. **Start Small**: Scrape 1-2 pages initially to test
2. **Regular Updates**: Scrape new jobs weekly
3. **Clean Old Jobs**: Remove outdated opportunities regularly
4. **Use Specific Queries**: More specific searches yield better results
5. **Respect Websites**: Don't scrape too frequently

## Security Notes

⚠️ **Important:**
- Change the SECRET_KEY before deploying to production
- Use a proper database (PostgreSQL/MySQL) for production
- Add authentication for admin features in production
- Use HTTPS in production environments

## Future Enhancements

Potential features to add:
- User authentication and accounts
- Job bookmarking/favorites
- Email notifications for new jobs
- Advanced filtering and search
- Resume upload and management
- Application tracking

## Support

For issues or questions:
1. Check the troubleshooting section
2. Review the main README.md
3. Check QUICK_START.md for scraper details

---

**Happy Job Hunting! 🎉**
