# Job Scraper Configuration Example

## Proxy Configuration

### Format 1: Simple IP:Port
```python
PROXY_URL = "203.0.113.0:8080"
```

### Format 2: Authenticated Proxy (User:Pass@IP:Port)
```python
PROXY_URL = "myusername:mypassword@203.0.113.0:8080"
```

### No Proxy
```python
PROXY_URL = None
```

## Target Website Configuration

### Example 1: Search for Python jobs in Germany
```python
SEARCH_QUERY = "Python Developer"
LOCATION = "Berlin, Germany"
NUM_PAGES = 3
```

### Example 2: Search for Data Scientist jobs in Switzerland
```python
SEARCH_QUERY = "Data Scientist"
LOCATION = "Zurich, Switzerland"
NUM_PAGES = 2
```

### Example 3: Search for Remote jobs
```python
SEARCH_QUERY = "Remote Software Engineer"
LOCATION = "Remote"
NUM_PAGES = 1
```

## Browser Configuration

### Run in visible mode (see browser actions)
```python
HEADLESS_MODE = False
```

### Run in headless mode (faster, no UI)
```python
HEADLESS_MODE = True
```

## Output Configuration

```python
OUTPUT_FILE = "scraped_jobs.csv"
```

## Complete Example Configuration

Here's a complete example for scraping Python Developer jobs in Germany using a proxy:

```python
# Proxy from Germany to appear as if you're browsing from Germany
PROXY_URL = "203.0.113.45:8080"  # Replace with your actual German proxy

# Job search parameters
SEARCH_QUERY = "Python Developer"
LOCATION = "Munich, Germany"
NUM_PAGES = 3

# Browser settings
HEADLESS_MODE = True

# Output file
OUTPUT_FILE = "python_jobs_germany.csv"
```

## Using Generic Scraper

For websites other than Indeed, you can use the `scrape_generic_jobs()` method:

```python
scraper = JobScraper(proxy=PROXY_URL, headless=True)

jobs = scraper.scrape_generic_jobs(
    url="https://careers.example.com/jobs",
    card_selector=".job-card",
    title_selector=".job-title",
    company_selector=".company-name",
    location_selector=".job-location",
    link_selector="a.job-link"
)

scraper.save_to_csv("company_jobs.csv")
```

## Important Notes

1. **Proxy Services**: You need to obtain a proxy from a service like:
   - Bright Data (formerly Luminati)
   - Oxylabs
   - SmartProxy
   - IPRoyal
   - ProxyMesh

2. **Geo-targeting**: Use a proxy located in the target country for accurate results

3. **Rate Limiting**: The script includes random delays to avoid being blocked

4. **Legal Compliance**: Always check the website's Terms of Service before scraping

5. **ChromeDriver**: The script automatically downloads the appropriate ChromeDriver version
