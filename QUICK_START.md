# Quick Start Guide - Selenium Job Scraper

## Overview

This guide will help you set up and use the Selenium Job Scraper to scrape job postings with geo-targeting capabilities.

## Prerequisites

1. **Python 3.7+** installed on your system
2. **Google Chrome** browser installed
3. **(Optional)** A proxy service if you need geo-targeting

## Installation Steps

### Step 1: Clone the Repository

```bash
git clone https://github.com/RajiSh21/TEch_X_prjct.git
cd TEch_X_prjct
```

### Step 2: Install Dependencies

```bash
pip install -r requirements.txt
```

This will install:
- selenium (for browser automation)
- fake-useragent (for user agent randomization)
- webdriver-manager (automatic ChromeDriver management)
- requests, beautifulsoup4, lxml (for the BeautifulSoup scraper)

## Configuration

### Step 3: Edit the Script

Open `job_scraper_selenium.py` in your text editor and locate the configuration section (around line 370):

```python
# ============================================================================
# INSERT YOUR CONFIGURATION HERE
# ============================================================================

# Proxy Configuration (Optional)
PROXY_URL = None  # <-- INSERT YOUR PROXY HERE

# Target Website Configuration
SEARCH_QUERY = "Python Developer"  # <-- INSERT YOUR JOB SEARCH QUERY
LOCATION = "Berlin, Germany"       # <-- INSERT YOUR TARGET LOCATION
NUM_PAGES = 1                      # <-- Number of pages to scrape

# Browser Configuration
HEADLESS_MODE = True  # Set to False to see the browser in action

# Output Configuration
OUTPUT_FILE = "scraped_jobs.csv"  # <-- OUTPUT CSV FILENAME
```

### Configuration Examples

#### Example 1: Without Proxy (Default)
```python
PROXY_URL = None
SEARCH_QUERY = "Software Engineer"
LOCATION = "London, UK"
NUM_PAGES = 2
HEADLESS_MODE = True
OUTPUT_FILE = "uk_jobs.csv"
```

#### Example 2: With Simple Proxy
```python
PROXY_URL = "123.45.67.89:8080"
SEARCH_QUERY = "Data Scientist"
LOCATION = "Munich, Germany"
NUM_PAGES = 3
HEADLESS_MODE = True
OUTPUT_FILE = "germany_jobs.csv"
```

#### Example 3: With Authenticated Proxy
```python
PROXY_URL = "myusername:mypassword@123.45.67.89:8080"
SEARCH_QUERY = "Backend Developer"
LOCATION = "Zurich, Switzerland"
NUM_PAGES = 1
HEADLESS_MODE = False  # See browser in action
OUTPUT_FILE = "switzerland_jobs.csv"
```

## Running the Scraper

### Step 4: Execute the Script

```bash
python job_scraper_selenium.py
```

### Expected Output

```
======================================================================
         SELENIUM JOB SCRAPER - GEO-TARGETING ENABLED
======================================================================

Configuration:
  Proxy: Not using proxy
  Search: Python Developer
  Location: Berlin, Germany
  Pages: 1
  Headless: True
  Output: scraped_jobs.csv
======================================================================
Using User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64)...
Running in headless mode
WebDriver initialized successfully

Scraping Indeed for: Python Developer in Berlin, Germany
============================================================

Page 1: https://www.indeed.com/jobs?q=Python+Developer&l=Berlin%2C+Germany&start=0
Found 15 job cards on this page
  [1] Senior Python Developer at Tech Corp
  [2] Python Backend Engineer at StartupXYZ
  ...

============================================================
Total jobs scraped: 15
WebDriver closed

✓ Successfully saved 15 jobs to 'scraped_jobs.csv'

======================================================================
Scraping completed!
======================================================================
```

## Output Format

The script creates a CSV file with the following structure:

```csv
title,company,location,link
Senior Python Developer,Tech Corp,Berlin Germany,https://indeed.com/viewjob?jk=abc123
Python Backend Engineer,StartupXYZ,Berlin Germany,https://indeed.com/viewjob?jk=def456
...
```

## Getting a Proxy for Geo-Targeting

To search for jobs in a specific country (e.g., Germany while you're in Nepal), you need a proxy server located in that country.

### Recommended Proxy Services

1. **Bright Data** (formerly Luminati) - https://brightdata.com
   - Professional-grade proxy service
   - Country-specific proxies available
   - Residential and datacenter options

2. **Oxylabs** - https://oxylabs.io
   - High-quality proxies
   - Geo-targeting support
   - Free trial available

3. **SmartProxy** - https://smartproxy.com
   - Affordable pricing
   - Easy to use
   - Multiple locations

4. **IPRoyal** - https://iproyal.com
   - Budget-friendly
   - Residential proxies
   - Pay-as-you-go options

### Proxy Format

Once you have a proxy, use it in one of these formats:

**Simple Proxy:**
```python
PROXY_URL = "proxy.example.com:8080"
# or with IP
PROXY_URL = "203.0.113.45:8080"
```

**Authenticated Proxy:**
```python
PROXY_URL = "username:password@proxy.example.com:8080"
```

## Troubleshooting

### Issue: ChromeDriver not found

**Solution:** The script automatically downloads ChromeDriver via `webdriver-manager`. Ensure you have Chrome browser installed.

### Issue: Proxy connection failed

**Solutions:**
1. Verify proxy credentials are correct
2. Check if the proxy is active
3. Try without proxy first to test the script
4. Ensure proxy format is correct (IP:Port or User:Pass@IP:Port)

### Issue: No jobs found

**Solutions:**
1. Run in non-headless mode to see what's happening: `HEADLESS_MODE = False`
2. Check if the website structure has changed
3. Try a different search query or location
4. Increase delay times in the script

### Issue: Getting blocked by website

**Solutions:**
1. Increase random delays in the script
2. Use a proxy from the target country
3. Reduce the number of pages scraped
4. Add more time between requests

## Advanced Usage

### Scraping Custom Websites

To scrape job boards other than Indeed, use the generic scraper:

```python
from job_scraper_selenium import JobScraper

scraper = JobScraper(proxy=PROXY_URL, headless=True)

jobs = scraper.scrape_generic_jobs(
    url="https://careers.company.com/jobs",
    card_selector=".job-listing",      # CSS selector for job card container
    title_selector=".job-title",       # CSS selector for job title
    company_selector=".company-name",  # CSS selector for company
    location_selector=".location",     # CSS selector for location
    link_selector="a.apply-link"       # CSS selector for job link
)

scraper.save_to_csv("custom_jobs.csv")
```

### Finding CSS Selectors

1. Open the target website in Chrome
2. Right-click on the job title → Inspect
3. Find the appropriate CSS selector in the developer tools
4. Test it with: `$$(".your-selector")` in the Console tab

## Best Practices

1. **Start Small:** Test with 1-2 pages first
2. **Use Delays:** Don't scrape too fast - respect the website
3. **Check Legality:** Review the website's Terms of Service
4. **Respect robots.txt:** Check if scraping is allowed
5. **Use Proxy Responsibly:** Follow proxy service terms
6. **Save Results:** The script overwrites the output file each run

## Legal Compliance

⚠️ **Important Reminders:**

- Web scraping must comply with the website's Terms of Service
- Respect robots.txt files
- Follow GDPR and data protection laws
- Don't overload servers with requests
- Use scraped data responsibly

## Need Help?

- Check `CONFIG_EXAMPLE.md` for more configuration examples
- Review the script comments for inline documentation
- Test with `HEADLESS_MODE = False` to see browser behavior

## Example Complete Workflow

```bash
# 1. Install dependencies
pip install -r requirements.txt

# 2. Edit job_scraper_selenium.py
# Set PROXY_URL, SEARCH_QUERY, LOCATION, etc.

# 3. Run the scraper
python job_scraper_selenium.py

# 4. Check the output
cat scraped_jobs.csv
# or
open scraped_jobs.csv  # On Mac
# or
start scraped_jobs.csv  # On Windows
```

Happy scraping! 🚀
