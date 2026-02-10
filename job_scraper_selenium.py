#!/usr/bin/env python3
"""
Selenium Job Scraper - Advanced web scraping for job postings
This script uses Selenium with proxy support and anti-detection features.

Author: Senior Python Developer
"""

import csv
import time
import random
from typing import List, Dict, Optional
from urllib.parse import urlparse
from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.common.exceptions import TimeoutException, NoSuchElementException, WebDriverException
from fake_useragent import UserAgent
from webdriver_manager.chrome import ChromeDriverManager


class JobScraper:
    """
    A Selenium-based job scraper with proxy support and anti-detection features.
    """
    
    def __init__(self, proxy: Optional[str] = None, headless: bool = True):
        """
        Initialize the job scraper.
        
        Args:
            proxy: Proxy string in format 'IP:Port' or 'User:Pass@IP:Port'
            headless: Run browser in headless mode (default: True)
        """
        self.proxy = proxy
        self.headless = headless
        self.driver = None
        self.jobs = []
        
    def _setup_driver(self) -> webdriver.Chrome:
        """
        Set up Chrome WebDriver with proxy and anti-detection features.
        
        Returns:
            Configured Chrome WebDriver instance
        """
        chrome_options = Options()
        
        # Anti-detection: Random user agent
        ua = UserAgent()
        user_agent = ua.random
        chrome_options.add_argument(f'user-agent={user_agent}')
        print(f"Using User-Agent: {user_agent}")
        
        # Headless mode
        if self.headless:
            chrome_options.add_argument('--headless=new')
            print("Running in headless mode")
        
        # Proxy configuration
        if self.proxy:
            # Handle both IP:Port and User:Pass@IP:Port formats
            if '@' in self.proxy:
                # Format: User:Pass@IP:Port
                auth_part, server_part = self.proxy.split('@')
                username, password = auth_part.split(':')
                ip, port = server_part.split(':')
                
                # For authenticated proxies, use extension or configure differently
                # For simplicity, we'll use the direct proxy format
                proxy_string = f"{ip}:{port}"
                chrome_options.add_argument(f'--proxy-server={proxy_string}')
                print(f"Using authenticated proxy: {username}:****@{ip}:{port}")
                
                # Note: For full authentication support, you would need to create
                # a Chrome extension. This is a simplified version.
            else:
                # Format: IP:Port
                chrome_options.add_argument(f'--proxy-server={self.proxy}')
                print(f"Using proxy: {self.proxy}")
        
        # Additional anti-detection measures
        chrome_options.add_argument('--disable-blink-features=AutomationControlled')
        chrome_options.add_experimental_option("excludeSwitches", ["enable-automation"])
        chrome_options.add_experimental_option('useAutomationExtension', False)
        chrome_options.add_argument('--disable-dev-shm-usage')
        chrome_options.add_argument('--no-sandbox')
        chrome_options.add_argument('--disable-gpu')
        chrome_options.add_argument('--window-size=1920,1080')
        chrome_options.add_argument('--start-maximized')
        
        # Disable images for faster loading (optional)
        # chrome_options.add_argument('--blink-settings=imagesEnabled=false')
        
        try:
            # Use webdriver-manager to automatically handle ChromeDriver
            service = Service(ChromeDriverManager().install())
            driver = webdriver.Chrome(service=service, options=chrome_options)
            
            # Additional anti-detection: Modify navigator.webdriver flag
            driver.execute_cdp_cmd('Network.setUserAgentOverride', {
                "userAgent": user_agent
            })
            driver.execute_script("Object.defineProperty(navigator, 'webdriver', {get: () => undefined})")
            
            print("WebDriver initialized successfully")
            return driver
            
        except WebDriverException as e:
            print(f"Error initializing WebDriver: {e}")
            raise
    
    def _random_delay(self, min_seconds: float = 1.0, max_seconds: float = 3.0):
        """
        Add a random delay to simulate human behavior.
        
        Args:
            min_seconds: Minimum delay in seconds
            max_seconds: Maximum delay in seconds
        """
        delay = random.uniform(min_seconds, max_seconds)
        time.sleep(delay)
    
    def _scroll_page(self):
        """Scroll the page slowly to load dynamic content and appear more human-like."""
        try:
            # Get total page height
            total_height = self.driver.execute_script("return document.body.scrollHeight")
            
            # Scroll in increments
            for i in range(0, total_height, 300):
                self.driver.execute_script(f"window.scrollTo(0, {i});")
                time.sleep(random.uniform(0.1, 0.3))
            
            # Scroll back to top
            self.driver.execute_script("window.scrollTo(0, 0);")
            self._random_delay(0.5, 1.0)
            
        except Exception as e:
            print(f"Error scrolling page: {e}")
    
    def scrape_indeed_jobs(self, search_query: str, location: str, pages: int = 1) -> List[Dict[str, str]]:
        """
        Scrape job postings from Indeed.
        
        Args:
            search_query: Job search query (e.g., "Python Developer")
            location: Location to search (e.g., "Berlin, Germany")
            pages: Number of pages to scrape
            
        Returns:
            List of dictionaries containing job information
        """
        try:
            self.driver = self._setup_driver()
            self.jobs = []
            
            print(f"\nScraping Indeed for: {search_query} in {location}")
            print("=" * 60)
            
            for page in range(pages):
                # Construct Indeed URL
                # Note: Adjust the URL format based on your target Indeed site (e.g., de.indeed.com for Germany)
                start_param = page * 10
                url = f"https://www.indeed.com/jobs?q={search_query.replace(' ', '+')}&l={location.replace(' ', '+')}&start={start_param}"
                
                print(f"\nPage {page + 1}: {url}")
                
                try:
                    self.driver.get(url)
                    self._random_delay(2, 4)
                    
                    # Scroll to load content
                    self._scroll_page()
                    
                    # Wait for job cards to load
                    wait = WebDriverWait(self.driver, 10)
                    wait.until(EC.presence_of_element_located((By.CLASS_NAME, "job_seen_beacon")))
                    
                    # Extract job cards
                    job_cards = self.driver.find_elements(By.CLASS_NAME, "job_seen_beacon")
                    print(f"Found {len(job_cards)} job cards on this page")
                    
                    for idx, card in enumerate(job_cards, 1):
                        try:
                            job_data = self._extract_indeed_job_data(card)
                            if job_data:
                                self.jobs.append(job_data)
                                print(f"  [{idx}] {job_data['title']} at {job_data['company']}")
                            
                            # Random delay between processing cards
                            self._random_delay(0.5, 1.5)
                            
                        except Exception as e:
                            print(f"  Error extracting job {idx}: {e}")
                            continue
                    
                    # Delay between pages
                    if page < pages - 1:
                        self._random_delay(3, 5)
                        
                except TimeoutException:
                    print(f"Timeout loading page {page + 1}")
                    continue
                except Exception as e:
                    print(f"Error on page {page + 1}: {e}")
                    continue
            
            print(f"\n{'=' * 60}")
            print(f"Total jobs scraped: {len(self.jobs)}")
            return self.jobs
            
        except Exception as e:
            print(f"Fatal error during scraping: {e}")
            return []
        finally:
            if self.driver:
                self.driver.quit()
                print("WebDriver closed")
    
    def _extract_indeed_job_data(self, card) -> Optional[Dict[str, str]]:
        """
        Extract job data from an Indeed job card.
        
        Args:
            card: Selenium WebElement representing a job card
            
        Returns:
            Dictionary with job data or None if extraction fails
        """
        try:
            job_data = {}
            
            # Extract job title
            try:
                title_elem = card.find_element(By.CSS_SELECTOR, "h2.jobTitle span")
                job_data['title'] = title_elem.text.strip()
            except NoSuchElementException:
                job_data['title'] = "N/A"
            
            # Extract company name
            try:
                company_elem = card.find_element(By.CSS_SELECTOR, "span[data-testid='company-name']")
                job_data['company'] = company_elem.text.strip()
            except NoSuchElementException:
                job_data['company'] = "N/A"
            
            # Extract location
            try:
                location_elem = card.find_element(By.CSS_SELECTOR, "div[data-testid='text-location']")
                job_data['location'] = location_elem.text.strip()
            except NoSuchElementException:
                job_data['location'] = "N/A"
            
            # Extract job link
            try:
                link_elem = card.find_element(By.CSS_SELECTOR, "h2.jobTitle a")
                job_link = link_elem.get_attribute("href")
                # Clean up the link - ensure it's a valid Indeed URL
                if job_link:
                    # Parse URL to check domain properly using urlparse
                    # This extracts only the network location (domain) for validation
                    parsed = urlparse(job_link)
                    # Check if it's already a full Indeed URL with proper domain
                    # Using netloc.endswith() is safe here as netloc contains only the domain,
                    # not path or query parameters. This prevents malicious URLs like
                    # "https://evil.com/indeed.com" from passing validation.
                    if parsed.netloc and parsed.netloc.endswith('indeed.com'):
                        job_data['link'] = job_link
                    elif job_link.startswith('/'):
                        # Relative URL - prepend Indeed domain
                        job_data['link'] = f"https://www.indeed.com{job_link}"
                    else:
                        job_data['link'] = job_link  # Keep as-is if uncertain
                else:
                    job_data['link'] = "N/A"
            except NoSuchElementException:
                job_data['link'] = "N/A"
            
            return job_data if job_data.get('title') != "N/A" else None
            
        except Exception as e:
            print(f"    Error extracting job data: {e}")
            return None
    
    def scrape_generic_jobs(self, url: str, card_selector: str, 
                          title_selector: str, company_selector: str,
                          location_selector: str, link_selector: str) -> List[Dict[str, str]]:
        """
        Scrape job postings from a generic website using custom selectors.
        
        Args:
            url: Target website URL
            card_selector: CSS selector for job card containers
            title_selector: CSS selector for job title (relative to card)
            company_selector: CSS selector for company name (relative to card)
            location_selector: CSS selector for location (relative to card)
            link_selector: CSS selector for job link (relative to card)
            
        Returns:
            List of dictionaries containing job information
        """
        try:
            self.driver = self._setup_driver()
            self.jobs = []
            
            print(f"\nScraping jobs from: {url}")
            print("=" * 60)
            
            self.driver.get(url)
            self._random_delay(2, 4)
            
            # Scroll to load content
            self._scroll_page()
            
            # Wait for job cards
            wait = WebDriverWait(self.driver, 10)
            wait.until(EC.presence_of_element_located((By.CSS_SELECTOR, card_selector)))
            
            # Extract job cards
            job_cards = self.driver.find_elements(By.CSS_SELECTOR, card_selector)
            print(f"Found {len(job_cards)} job cards")
            
            for idx, card in enumerate(job_cards, 1):
                try:
                    job_data = {}
                    
                    # Extract title
                    try:
                        title_elem = card.find_element(By.CSS_SELECTOR, title_selector)
                        job_data['title'] = title_elem.text.strip()
                    except (NoSuchElementException, Exception):
                        job_data['title'] = "N/A"
                    
                    # Extract company
                    try:
                        company_elem = card.find_element(By.CSS_SELECTOR, company_selector)
                        job_data['company'] = company_elem.text.strip()
                    except (NoSuchElementException, Exception):
                        job_data['company'] = "N/A"
                    
                    # Extract location
                    try:
                        location_elem = card.find_element(By.CSS_SELECTOR, location_selector)
                        job_data['location'] = location_elem.text.strip()
                    except (NoSuchElementException, Exception):
                        job_data['location'] = "N/A"
                    
                    # Extract link
                    try:
                        link_elem = card.find_element(By.CSS_SELECTOR, link_selector)
                        job_data['link'] = link_elem.get_attribute("href")
                    except (NoSuchElementException, Exception):
                        job_data['link'] = "N/A"
                    
                    if job_data.get('title') != "N/A":
                        self.jobs.append(job_data)
                        print(f"  [{idx}] {job_data['title']} at {job_data['company']}")
                    
                    self._random_delay(0.5, 1.5)
                    
                except Exception as e:
                    print(f"  Error extracting job {idx}: {e}")
                    continue
            
            print(f"\n{'=' * 60}")
            print(f"Total jobs scraped: {len(self.jobs)}")
            return self.jobs
            
        except Exception as e:
            print(f"Fatal error during scraping: {e}")
            return []
        finally:
            if self.driver:
                self.driver.quit()
                print("WebDriver closed")
    
    def save_to_csv(self, filename: str = "jobs.csv"):
        """
        Save scraped jobs to a CSV file.
        
        Args:
            filename: Output CSV filename
        """
        if not self.jobs:
            print("No jobs to save!")
            return
        
        try:
            with open(filename, 'w', newline='', encoding='utf-8') as csvfile:
                fieldnames = ['title', 'company', 'location', 'link']
                writer = csv.DictWriter(csvfile, fieldnames=fieldnames)
                
                writer.writeheader()
                writer.writerows(self.jobs)
            
            print(f"\n✓ Successfully saved {len(self.jobs)} jobs to '{filename}'")
            
        except Exception as e:
            print(f"Error saving to CSV: {e}")


def main():
    """
    Example usage of the JobScraper class.
    
    *** CONFIGURATION SECTION - MODIFY THESE VALUES ***
    """
    
    # ============================================================================
    # INSERT YOUR CONFIGURATION HERE
    # ============================================================================
    
    # Proxy Configuration (Optional)
    # Format 1: "IP:Port" - Example: "203.0.113.0:8080"
    # Format 2: "User:Pass@IP:Port" - Example: "username:password@203.0.113.0:8080"
    # Set to None if you don't want to use a proxy
    PROXY_URL = None  # <-- INSERT YOUR PROXY HERE
    
    # Target Website Configuration
    # For Indeed: Specify search parameters
    SEARCH_QUERY = "Python Developer"  # <-- INSERT YOUR JOB SEARCH QUERY
    LOCATION = "Berlin, Germany"       # <-- INSERT YOUR TARGET LOCATION
    NUM_PAGES = 1                      # <-- Number of pages to scrape
    
    # Browser Configuration
    HEADLESS_MODE = True  # Set to False to see the browser in action
    
    # Output Configuration
    OUTPUT_FILE = "scraped_jobs.csv"  # <-- OUTPUT CSV FILENAME
    
    # ============================================================================
    # END OF CONFIGURATION SECTION
    # ============================================================================
    
    print("=" * 70)
    print("         SELENIUM JOB SCRAPER - GEO-TARGETING ENABLED")
    print("=" * 70)
    print("\nConfiguration:")
    print(f"  Proxy: {PROXY_URL if PROXY_URL else 'Not using proxy'}")
    print(f"  Search: {SEARCH_QUERY}")
    print(f"  Location: {LOCATION}")
    print(f"  Pages: {NUM_PAGES}")
    print(f"  Headless: {HEADLESS_MODE}")
    print(f"  Output: {OUTPUT_FILE}")
    print("=" * 70)
    
    try:
        # Initialize the scraper
        scraper = JobScraper(proxy=PROXY_URL, headless=HEADLESS_MODE)
        
        # Scrape Indeed jobs
        jobs = scraper.scrape_indeed_jobs(
            search_query=SEARCH_QUERY,
            location=LOCATION,
            pages=NUM_PAGES
        )
        
        # Save results to CSV
        if jobs:
            scraper.save_to_csv(OUTPUT_FILE)
        else:
            print("\n⚠ No jobs were scraped. Check your configuration and try again.")
        
        print("\n" + "=" * 70)
        print("Scraping completed!")
        print("=" * 70)
        
    except KeyboardInterrupt:
        print("\n\nScraping interrupted by user.")
    except Exception as e:
        print(f"\n⚠ Error during execution: {e}")
        print("Please check your configuration and try again.")


if __name__ == "__main__":
    main()
