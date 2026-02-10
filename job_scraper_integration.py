#!/usr/bin/env python3
"""
Job Scraper Integration Module
Integrates the Selenium job scraper with the Flask app database
"""

import sys
from datetime import datetime


def scrape_and_store_jobs(search_query, location, job_type='placement', num_pages=1, proxy=None):
    """
    Scrape jobs and store them in the database
    
    Args:
        search_query: Job search query (e.g., "Software Engineer")
        location: Location to search (e.g., "Berlin, Germany")
        job_type: Type of job - 'placement' or 'internship'
        num_pages: Number of pages to scrape
        proxy: Optional proxy URL
        
    Returns:
        Number of jobs added to database
    """
    # Import the scraper and database models
    from job_scraper_selenium import JobScraper
    from app import db, JobOpportunity
    
    # Initialize the scraper
    scraper = JobScraper(proxy=proxy, headless=True)
    
    print(f"\nScraping {job_type}s for: {search_query} in {location}")
    print(f"Pages to scrape: {num_pages}")
    
    try:
        # Scrape jobs from Indeed
        jobs = scraper.scrape_indeed_jobs(
            search_query=search_query,
            location=location,
            pages=num_pages
        )
        
        # Store jobs in database
        count = 0
        duplicates = 0
        
        for job in jobs:
            # Check if job already exists (by link)
            existing = JobOpportunity.query.filter_by(link=job['link']).first()
            
            if not existing:
                # Create new job opportunity
                new_job = JobOpportunity(
                    title=job['title'],
                    company=job['company'],
                    location=job['location'],
                    link=job['link'],
                    job_type=job_type,
                    date_added=datetime.utcnow(),
                    is_active=True
                )
                db.session.add(new_job)
                count += 1
            else:
                duplicates += 1
        
        # Commit all new jobs
        db.session.commit()
        
        print(f"\n✓ Successfully added {count} new jobs to database")
        if duplicates > 0:
            print(f"  (Skipped {duplicates} duplicates)")
        
        return count
        
    except Exception as e:
        print(f"\n✗ Error during scraping: {e}")
        raise


def bulk_import_from_csv(csv_file, job_type='placement'):
    """
    Import jobs from a CSV file (from standalone scraper)
    
    Args:
        csv_file: Path to CSV file with scraped jobs
        job_type: Type of jobs in the CSV
        
    Returns:
        Number of jobs imported
    """
    import csv
    from app import db, JobOpportunity
    
    count = 0
    duplicates = 0
    
    with open(csv_file, 'r', encoding='utf-8') as f:
        reader = csv.DictReader(f)
        
        for row in reader:
            # Check if job already exists
            existing = JobOpportunity.query.filter_by(link=row['link']).first()
            
            if not existing:
                new_job = JobOpportunity(
                    title=row['title'],
                    company=row['company'],
                    location=row['location'],
                    link=row['link'],
                    job_type=job_type,
                    date_added=datetime.utcnow(),
                    is_active=True
                )
                db.session.add(new_job)
                count += 1
            else:
                duplicates += 1
    
    db.session.commit()
    
    print(f"\n✓ Successfully imported {count} jobs from CSV")
    if duplicates > 0:
        print(f"  (Skipped {duplicates} duplicates)")
    
    return count


# CLI script for manual import
if __name__ == '__main__':
    from app import app, db
    
    with app.app_context():
        if len(sys.argv) < 2:
            print("Usage:")
            print("  python job_scraper_integration.py scrape <query> <location> <type> [pages]")
            print("  python job_scraper_integration.py import <csv_file> <type>")
            print("\nExamples:")
            print("  python job_scraper_integration.py scrape 'Python Developer' 'Berlin, Germany' placement 2")
            print("  python job_scraper_integration.py import jobs.csv internship")
            sys.exit(1)
        
        command = sys.argv[1]
        
        if command == 'scrape':
            if len(sys.argv) < 5:
                print("Error: scrape requires: <query> <location> <type> [pages]")
                sys.exit(1)
            
            query = sys.argv[2]
            location = sys.argv[3]
            job_type = sys.argv[4]
            num_pages = int(sys.argv[5]) if len(sys.argv) > 5 else 1
            
            count = scrape_and_store_jobs(query, location, job_type, num_pages)
            print(f"\nDone! {count} jobs added to database.")
            
        elif command == 'import':
            if len(sys.argv) < 4:
                print("Error: import requires: <csv_file> <type>")
                sys.exit(1)
            
            csv_file = sys.argv[2]
            job_type = sys.argv[3]
            
            count = bulk_import_from_csv(csv_file, job_type)
            print(f"\nDone! {count} jobs imported from CSV.")
            
        else:
            print(f"Unknown command: {command}")
            sys.exit(1)
