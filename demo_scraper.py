#!/usr/bin/env python3
"""
Web Scraper Demo - Demonstrates scraping with local HTML content
"""

from bs4 import BeautifulSoup
from web_scraper import WebScraper


def demo_with_local_html():
    """Demonstrate scraping with local HTML content."""
    
    # Sample HTML content
    sample_html = """
    <!DOCTYPE html>
    <html>
    <head>
        <title>Sample Product Page</title>
    </head>
    <body>
        <h1>Product Catalog</h1>
        <div class="product">
            <h2 class="product-name">Laptop</h2>
            <p class="product-description">High-performance laptop with 16GB RAM</p>
            <span class="product-price">$999.99</span>
            <span class="product-stock">In Stock</span>
        </div>
        <div class="product">
            <h2 class="product-name">Mouse</h2>
            <p class="product-description">Wireless ergonomic mouse</p>
            <span class="product-price">$29.99</span>
            <span class="product-stock">In Stock</span>
        </div>
        <div class="product">
            <h2 class="product-name">Keyboard</h2>
            <p class="product-description">Mechanical keyboard with RGB lighting</p>
            <span class="product-price">$89.99</span>
            <span class="product-stock">Out of Stock</span>
        </div>
        
        <h2>Product Comparison Table</h2>
        <table class="comparison-table">
            <tr>
                <th>Product</th>
                <th>Category</th>
                <th>Price</th>
                <th>Rating</th>
            </tr>
            <tr>
                <td>Laptop</td>
                <td>Computers</td>
                <td>$999.99</td>
                <td>4.5/5</td>
            </tr>
            <tr>
                <td>Mouse</td>
                <td>Accessories</td>
                <td>$29.99</td>
                <td>4.2/5</td>
            </tr>
            <tr>
                <td>Keyboard</td>
                <td>Accessories</td>
                <td>$89.99</td>
                <td>4.7/5</td>
            </tr>
        </table>
        
        <footer>
            <p>&copy; 2024 Sample Store</p>
            <a href="/contact">Contact Us</a>
            <a href="/about">About Us</a>
        </footer>
    </body>
    </html>
    """
    
    print("=" * 60)
    print("Web Scraper Demo - Local HTML Content")
    print("=" * 60)
    print()
    
    # Parse the HTML
    soup = BeautifulSoup(sample_html, 'lxml')
    scraper = WebScraper("https://example.com")
    
    # Demo 1: Extract page title
    print("1. Extracting Page Title:")
    print("-" * 60)
    title = soup.find('title')
    if title:
        print(f"   Title: {title.get_text()}")
    print()
    
    # Demo 2: Extract all product information
    print("2. Extracting Product Information:")
    print("-" * 60)
    products = []
    for product_div in soup.find_all('div', class_='product'):
        product_data = {
            'name': product_div.find('h2', class_='product-name').get_text(strip=True),
            'description': product_div.find('p', class_='product-description').get_text(strip=True),
            'price': product_div.find('span', class_='product-price').get_text(strip=True),
            'stock': product_div.find('span', class_='product-stock').get_text(strip=True)
        }
        products.append(product_data)
        print(f"   Product: {product_data['name']}")
        print(f"   Description: {product_data['description']}")
        print(f"   Price: {product_data['price']}")
        print(f"   Stock Status: {product_data['stock']}")
        print()
    
    # Demo 3: Extract table data
    print("3. Extracting Table Data:")
    print("-" * 60)
    table_data = scraper.scrape_table(soup, 'table.comparison-table')
    for row in table_data:
        print(f"   {' | '.join(row)}")
    print()
    
    # Demo 4: Save to JSON
    print("4. Saving Data to JSON:")
    print("-" * 60)
    scraper.save_to_json(products, 'products.json')
    print()
    
    # Demo 5: Save to CSV
    print("5. Saving Data to CSV:")
    print("-" * 60)
    scraper.save_to_csv(products, 'products.csv')
    print()
    
    # Demo 6: Extract all links
    print("6. Extracting Links:")
    print("-" * 60)
    links = soup.find_all('a', href=True)
    for link in links:
        print(f"   Link: {link.get_text()} -> {link['href']}")
    print()
    
    # Demo 7: Using CSS selectors
    print("7. Using CSS Selectors:")
    print("-" * 60)
    selectors = {
        'main_heading': 'h1',
        'first_product': 'div.product h2',
        'footer_text': 'footer p'
    }
    extracted_data = scraper.extract_data(soup, selectors)
    for key, value in extracted_data.items():
        print(f"   {key}: {value}")
    print()
    
    print("=" * 60)
    print("Demo completed successfully!")
    print("=" * 60)
    print()
    print("Files created:")
    print("  - products.json (Product data in JSON format)")
    print("  - products.csv (Product data in CSV format)")
    

if __name__ == "__main__":
    demo_with_local_html()
