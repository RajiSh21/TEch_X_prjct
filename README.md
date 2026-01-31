# TEch_X_prjct

## Web Scraping Python Programs

A comprehensive collection of Python web scraping tools:

1. **BeautifulSoup Scraper** (`web_scraper.py`) - Lightweight scraper for static content
2. **Selenium Job Scraper** (`job_scraper_selenium.py`) - Advanced scraper with proxy support for dynamic job sites

---

## 1. BeautifulSoup Web Scraper

A flexible Python web scraping tool using `requests` and `BeautifulSoup4` for static content.

### Features

- **Flexible URL Handling**: Scrape single pages or multiple URLs
- **Link Extraction**: Extract and filter links from web pages
- **Text Extraction**: Extract all text or specific elements using CSS selectors
- **Structured Data Extraction**: Use CSS selectors to extract specific data fields
- **Table Scraping**: Extract data from HTML tables
- **Multiple Export Formats**: Save scraped data to JSON or CSV files
- **Error Handling**: Robust error handling for network requests
- **Customizable Headers**: Support for custom HTTP headers

### Installation

1. Clone the repository:
```bash
git clone https://github.com/RajiSh21/TEch_X_prjct.git
cd TEch_X_prjct
```

2. Install dependencies:
```bash
pip install -r requirements.txt
```

### Usage

#### Basic Usage

Run the example script:
```bash
python web_scraper.py
```

#### Custom Usage

```python
from web_scraper import WebScraper

# Initialize the scraper
scraper = WebScraper("https://example.com")

# Fetch a page
soup = scraper.fetch_page("https://example.com")

# Extract all links
links = scraper.extract_links(soup)

# Extract text from specific elements
text = scraper.extract_text(soup, selector="p.content")

# Extract structured data
selectors = {
    'title': 'h1',
    'description': 'p.description',
    'price': 'span.price'
}
data = scraper.extract_data(soup, selectors)

# Save to JSON
scraper.save_to_json(data, 'output.json')

# Save to CSV
scraper.save_to_csv([data], 'output.csv')
```

#### Scraping Tables

```python
# Scrape HTML tables
table_data = scraper.scrape_table(soup, 'table.data-table')

# Convert to list of dictionaries (using first row as headers)
if table_data:
    headers = table_data[0]
    rows = [dict(zip(headers, row)) for row in table_data[1:]]
    scraper.save_to_csv(rows, 'table_data.csv')
```

### Requirements

- Python 3.7+
- requests
- beautifulsoup4
- lxml

---

## 2. Selenium Job Scraper (Geo-Targeting Enabled)

An advanced Selenium-based scraper specifically designed for job posting websites with proxy support for geo-targeting.

### Key Features

- **🌍 Geo-Targeting**: Use proxies to search for jobs in specific countries (e.g., search German jobs from anywhere)
- **🔒 Proxy Support**: Handles both simple (`IP:Port`) and authenticated (`User:Pass@IP:Port`) proxies
- **🤖 Anti-Detection**: 
  - Random user agents via `fake_useragent`
  - Human-like random delays between actions
  - Disabled automation flags
  - Gradual page scrolling
- **👻 Headless Mode**: Optional headless browser operation
- **📊 Data Extraction**: Extracts job title, company, location, and link
- **💾 CSV Export**: Saves results to structured CSV files
- **🛡️ Error Handling**: Robust try/except blocks for proxy failures and missing elements

### Installation

Install all dependencies including Selenium:
```bash
pip install -r requirements.txt
```

### Quick Start

1. **Open `job_scraper_selenium.py`**

2. **Configure the script** (around line 370 in the `main()` function):

```python
# INSERT YOUR PROXY HERE
PROXY_URL = "203.0.113.0:8080"  # Your proxy IP:Port
# OR for authenticated proxy:
# PROXY_URL = "username:password@203.0.113.0:8080"

# INSERT YOUR SEARCH PARAMETERS
SEARCH_QUERY = "Python Developer"
LOCATION = "Berlin, Germany"
NUM_PAGES = 2

HEADLESS_MODE = True
OUTPUT_FILE = "scraped_jobs.csv"
```

3. **Run the scraper**:
```bash
python job_scraper_selenium.py
```

### Configuration Guide

#### Proxy Configuration

The script supports two proxy formats:

**Simple Proxy (IP:Port)**
```python
PROXY_URL = "203.0.113.0:8080"
```

**Authenticated Proxy (User:Pass@IP:Port)**
```python
PROXY_URL = "myusername:mypassword@203.0.113.0:8080"
```

**No Proxy**
```python
PROXY_URL = None
```

#### Target Website

The script is pre-configured for **Indeed.com** but includes a generic scraper method for other sites.

**For Indeed:**
```python
SEARCH_QUERY = "Data Scientist"
LOCATION = "Munich, Germany"
NUM_PAGES = 3
```

**For Custom Websites:**
```python
scraper = JobScraper(proxy=PROXY_URL, headless=True)
jobs = scraper.scrape_generic_jobs(
    url="https://careers.company.com/jobs",
    card_selector=".job-listing",
    title_selector="h2.title",
    company_selector=".company",
    location_selector=".location",
    link_selector="a.apply"
)
```

### Usage Examples

See `CONFIG_EXAMPLE.md` for detailed configuration examples including:
- Searching jobs in different countries
- Using different proxy configurations
- Customizing for specific job boards
- Rate limiting and anti-detection tips

### Output

The scraper creates a CSV file with the following columns:
- **title**: Job title
- **company**: Company name
- **location**: Job location
- **link**: Direct link to the job posting

Example output:
```csv
title,company,location,link
Senior Python Developer,Tech Corp,Berlin Germany,https://indeed.com/viewjob?jk=...
Data Scientist,Analytics Inc,Munich Germany,https://indeed.com/viewjob?jk=...
```

### Anti-Detection Features

1. **Random User Agents**: Each run uses a different browser fingerprint
2. **Human-like Delays**: Random 1-3 second delays between actions
3. **Gradual Scrolling**: Mimics human reading behavior
4. **Disabled Automation Flags**: Removes Selenium detection markers
5. **Randomized Timing**: Variable delays prevent pattern detection

### Troubleshooting

**Proxy Connection Failed**
- Verify proxy credentials and format
- Check if proxy is active and accessible
- Try without proxy first to test the script

**ChromeDriver Issues**
- The script auto-installs ChromeDriver via `webdriver-manager`
- Ensure Chrome browser is installed on your system

**No Jobs Found**
- The website structure may have changed
- Check CSS selectors for the target site
- Try running in non-headless mode to see what's happening

**Getting Blocked**
- Increase delay times between requests
- Use a proxy from the target country
- Reduce the number of pages scraped per session

### Legal Considerations

⚠️ **Important**: Web scraping must comply with:
- Website Terms of Service
- robots.txt file
- Local and international laws (GDPR, CCPA, etc.)
- Rate limiting to avoid server overload

Always verify you have permission before scraping any website.

---

## General Requirements

## General Requirements

- Python 3.7+
- requests
- beautifulsoup4
- lxml
- selenium
- fake-useragent
- webdriver-manager

Install all dependencies:
```bash
pip install -r requirements.txt
```

---

## Project Structure

```
TEch_X_prjct/
├── web_scraper.py              # BeautifulSoup-based scraper
├── demo_scraper.py             # Demo for BeautifulSoup scraper
├── job_scraper_selenium.py     # Selenium job scraper with proxy
├── CONFIG_EXAMPLE.md           # Configuration examples
├── requirements.txt            # Python dependencies
└── README.md                   # This file
```

---

## Legal and Ethical Considerations

**Important**: Always ensure you have permission to scrape a website and respect its `robots.txt` file. Web scraping should be done responsibly and ethically:

- Check the website's Terms of Service
- Respect rate limits to avoid overloading servers
- Use appropriate delays between requests
- Identify your bot with a proper User-Agent
- Don't scrape personal or sensitive information without permission

### License

MIT License - Feel free to use and modify as needed.