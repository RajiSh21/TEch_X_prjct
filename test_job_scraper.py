#!/usr/bin/env python3
"""
Test script for job_scraper_selenium.py
Validates imports and basic structure without requiring browser/proxy
"""

import sys
import importlib.util

def test_imports():
    """Test that all required modules can be imported."""
    print("Testing imports...")
    
    required_modules = [
        'csv',
        'time',
        'random',
        'typing',
    ]
    
    # Test optional Selenium imports (may not be installed in test environment)
    optional_modules = [
        'selenium',
        'fake_useragent',
        'webdriver_manager',
    ]
    
    # Test basic imports
    for module in required_modules:
        try:
            __import__(module)
            print(f"  ✓ {module}")
        except ImportError as e:
            print(f"  ✗ {module}: {e}")
            return False
    
    # Test optional imports
    for module in optional_modules:
        try:
            __import__(module)
            print(f"  ✓ {module}")
        except ImportError:
            print(f"  ⚠ {module} (optional - will be needed at runtime)")
    
    return True

def test_script_structure():
    """Test that the script has proper structure."""
    print("\nTesting script structure...")
    
    try:
        # Load the module
        spec = importlib.util.spec_from_file_location("job_scraper", "job_scraper_selenium.py")
        module = importlib.util.module_from_spec(spec)
        
        # Check for JobScraper class
        if hasattr(module, '__file__'):
            with open('job_scraper_selenium.py', 'r') as f:
                content = f.read()
                
                # Check for key components
                checks = {
                    'JobScraper class': 'class JobScraper',
                    '__init__ method': 'def __init__',
                    '_setup_driver method': 'def _setup_driver',
                    'scrape_indeed_jobs method': 'def scrape_indeed_jobs',
                    'scrape_generic_jobs method': 'def scrape_generic_jobs',
                    'save_to_csv method': 'def save_to_csv',
                    'main function': 'def main',
                    'Proxy support': 'PROXY_URL',
                    'Anti-detection': 'fake_useragent',
                    'Random delays': '_random_delay',
                }
                
                for check_name, check_string in checks.items():
                    if check_string in content:
                        print(f"  ✓ {check_name}")
                    else:
                        print(f"  ✗ {check_name}")
                        return False
        
        return True
        
    except Exception as e:
        print(f"  ✗ Error: {e}")
        return False

def test_configuration_file():
    """Test that configuration example file exists."""
    print("\nTesting configuration file...")
    
    try:
        with open('CONFIG_EXAMPLE.md', 'r') as f:
            content = f.read()
            
            checks = [
                'Proxy Configuration',
                'PROXY_URL',
                'SEARCH_QUERY',
                'LOCATION',
            ]
            
            for check in checks:
                if check in content:
                    print(f"  ✓ {check}")
                else:
                    print(f"  ✗ {check}")
                    return False
        
        return True
        
    except Exception as e:
        print(f"  ✗ Error: {e}")
        return False

def main():
    """Run all tests."""
    print("=" * 60)
    print("Job Scraper Selenium - Structure Validation Tests")
    print("=" * 60)
    
    results = []
    
    # Run tests
    results.append(("Imports", test_imports()))
    results.append(("Script Structure", test_script_structure()))
    results.append(("Configuration File", test_configuration_file()))
    
    # Summary
    print("\n" + "=" * 60)
    print("Test Summary")
    print("=" * 60)
    
    all_passed = True
    for test_name, passed in results:
        status = "✓ PASS" if passed else "✗ FAIL"
        print(f"{status}: {test_name}")
        if not passed:
            all_passed = False
    
    print("=" * 60)
    
    if all_passed:
        print("\n✓ All structure tests passed!")
        print("\nNote: Runtime tests require:")
        print("  - Chrome/Chromium browser installed")
        print("  - selenium, fake-useragent, webdriver-manager packages")
        print("  - (Optional) Valid proxy for full functionality")
        return 0
    else:
        print("\n✗ Some tests failed!")
        return 1

if __name__ == "__main__":
    sys.exit(main())
