# TEch_X_prjct

## Web Scraping Python Program

A comprehensive Python web scraping tool using `requests` and `BeautifulSoup4`. This program provides a flexible and easy-to-use interface for scraping websites, extracting data, and saving it in various formats.

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

### Legal and Ethical Considerations

**Important**: Always ensure you have permission to scrape a website and respect its `robots.txt` file. Web scraping should be done responsibly and ethically:

- Check the website's Terms of Service
- Respect rate limits to avoid overloading servers
- Use appropriate delays between requests
- Identify your bot with a proper User-Agent
- Don't scrape personal or sensitive information without permission

### License

MIT License - Feel free to use and modify as needed.