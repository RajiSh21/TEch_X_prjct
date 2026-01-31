#!/usr/bin/env python3
"""
Web Scraper - A Python program for web scraping
This script demonstrates web scraping using requests and BeautifulSoup.
"""

import requests
from bs4 import BeautifulSoup
import json
import csv
from typing import Dict, List, Optional
from urllib.parse import urljoin, urlparse
import time


class WebScraper:
    """A flexible web scraping class that can extract data from websites."""
    
    def __init__(self, base_url: str, headers: Optional[Dict[str, str]] = None):
        """
        Initialize the web scraper.
        
        Args:
            base_url: The base URL to scrape
            headers: Optional HTTP headers to use in requests
        """
        self.base_url = base_url
        self.headers = headers or {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
        self.session = requests.Session()
        self.session.headers.update(self.headers)
    
    def fetch_page(self, url: str) -> Optional[BeautifulSoup]:
        """
        Fetch a webpage and return a BeautifulSoup object.
        
        Args:
            url: The URL to fetch
            
        Returns:
            BeautifulSoup object or None if request fails
        """
        try:
            response = self.session.get(url, timeout=10)
            response.raise_for_status()
            return BeautifulSoup(response.content, 'lxml')
        except requests.RequestException as e:
            print(f"Error fetching {url}: {e}")
            return None
    
    def extract_links(self, soup: BeautifulSoup, filter_domain: bool = True) -> List[str]:
        """
        Extract all links from a page.
        
        Args:
            soup: BeautifulSoup object of the page
            filter_domain: If True, only return links from the same domain
            
        Returns:
            List of URLs
        """
        links = []
        for link in soup.find_all('a', href=True):
            url = urljoin(self.base_url, link['href'])
            if filter_domain:
                if urlparse(url).netloc == urlparse(self.base_url).netloc:
                    links.append(url)
            else:
                links.append(url)
        return list(set(links))  # Remove duplicates
    
    def extract_text(self, soup: BeautifulSoup, selector: str = None) -> str:
        """
        Extract text from a page or specific element.
        
        Args:
            soup: BeautifulSoup object of the page
            selector: CSS selector to find specific elements
            
        Returns:
            Extracted text
        """
        if selector:
            elements = soup.select(selector)
            return ' '.join([elem.get_text(strip=True) for elem in elements])
        return soup.get_text(strip=True)
    
    def extract_data(self, soup: BeautifulSoup, selectors: Dict[str, str]) -> Dict[str, str]:
        """
        Extract structured data using CSS selectors.
        
        Args:
            soup: BeautifulSoup object of the page
            selectors: Dictionary mapping field names to CSS selectors
            
        Returns:
            Dictionary of extracted data
        """
        data = {}
        for field, selector in selectors.items():
            element = soup.select_one(selector)
            if element:
                data[field] = element.get_text(strip=True)
            else:
                data[field] = None
        return data
    
    def scrape_table(self, soup: BeautifulSoup, table_selector: str = 'table') -> List[List[str]]:
        """
        Extract data from an HTML table.
        
        Args:
            soup: BeautifulSoup object of the page
            table_selector: CSS selector for the table
            
        Returns:
            List of rows, where each row is a list of cell values
        """
        table = soup.select_one(table_selector)
        if not table:
            return []
        
        rows = []
        for tr in table.find_all('tr'):
            cells = [td.get_text(strip=True) for td in tr.find_all(['td', 'th'])]
            if cells:
                rows.append(cells)
        return rows
    
    def save_to_json(self, data: any, filename: str):
        """Save data to a JSON file."""
        with open(filename, 'w', encoding='utf-8') as f:
            json.dump(data, f, indent=2, ensure_ascii=False)
        print(f"Data saved to {filename}")
    
    def save_to_csv(self, data: List[Dict], filename: str):
        """Save data to a CSV file."""
        if not data:
            print("No data to save")
            return
        
        keys = data[0].keys()
        with open(filename, 'w', newline='', encoding='utf-8') as f:
            writer = csv.DictWriter(f, fieldnames=keys)
            writer.writeheader()
            writer.writerows(data)
        print(f"Data saved to {filename}")


def example_usage():
    """Example usage of the WebScraper class."""
    print("Web Scraper - Example Usage\n")
    
    # Example 1: Scraping a simple page
    print("Example 1: Scraping a basic webpage")
    print("-" * 50)
    scraper = WebScraper("https://example.com")
    soup = scraper.fetch_page("https://example.com")
    
    if soup:
        # Extract title
        title = soup.find('title')
        if title:
            print(f"Page Title: {title.get_text()}")
        
        # Extract all paragraph text
        paragraphs = soup.find_all('p')
        print(f"Found {len(paragraphs)} paragraphs")
        
        # Extract links
        links = scraper.extract_links(soup, filter_domain=False)
        print(f"Found {len(links)} links")
        
        # Extract all text
        text = scraper.extract_text(soup)
        print(f"Total text length: {len(text)} characters\n")
    
    # Example 2: Using custom selectors
    print("Example 2: Using CSS selectors")
    print("-" * 50)
    selectors = {
        'title': 'h1',
        'description': 'p',
    }
    
    if soup:
        data = scraper.extract_data(soup, selectors)
        print("Extracted data:")
        for key, value in data.items():
            print(f"  {key}: {value[:100] if value else 'N/A'}...")
        
        # Save to JSON
        scraper.save_to_json(data, 'scraped_data.json')
    
    print("\nWeb scraping completed!")


if __name__ == "__main__":
    example_usage()
