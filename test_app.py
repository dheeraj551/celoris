#!/usr/bin/env python3
"""
Script to test the Next.js application and capture any errors
"""
import requests
import json
import time
import sys
from urllib.parse import urljoin

def test_page(url, page_name):
    """Test a specific page and check for errors"""
    print(f"\n🧪 Testing {page_name}: {url}")
    try:
        response = requests.get(url, timeout=10)
        print(f"   Status: {response.status_code}")
        
        if response.status_code == 200:
            content = response.text
            # Check for common error indicators
            if "error" in content.lower():
                print(f"   ⚠️  'Error' found in response")
            if "cannot read" in content.lower():
                print(f"   ⚠️  'Cannot read' found in response")
            if "null" in content.lower():
                print(f"   ⚠️  'Null' found in response")
            
            # Check for JavaScript bundle size (indicates compilation issues)
            js_files = [line for line in content.split('\n') if 'script' in line and '.js' in line]
            if js_files:
                print(f"   📦 Found {len(js_files)} script references")
            
        return response.status_code
        
    except Exception as e:
        print(f"   ❌ Error: {str(e)}")
        return None

def main():
    base_url = "http://localhost:3000"
    
    # Test main pages
    pages_to_test = [
        ("/", "Home Page"),
        ("/admin", "Admin Dashboard"),
        ("/admin/apps", "Admin Apps"),
        ("/admin/automation", "Admin Automation"),
        ("/admin/blog", "Admin Blog"),
        ("/admin/earn", "Admin Earn"),
        ("/admin/inquiries", "Admin Inquiries"),
        ("/admin/learn", "Admin Learn"),
        ("/admin/testimonials", "Admin Testimonials"),
        ("/login", "Login Page"),
        ("/register", "Register Page"),
    ]
    
    print("🚀 Starting Application Tests")
    print("=" * 50)
    
    results = {}
    for path, name in pages_to_test:
        url = urljoin(base_url, path)
        status = test_page(url, name)
        results[name] = status
        time.sleep(0.5)  # Brief pause between requests
    
    print("\n" + "=" * 50)
    print("📊 Test Results Summary:")
    failed_pages = []
    for name, status in results.items():
        if status is None:
            print(f"   ❌ {name}: Connection Failed")
            failed_pages.append(name)
        elif status >= 400:
            print(f"   ⚠️  {name}: HTTP {status}")
            failed_pages.append(name)
        else:
            print(f"   ✅ {name}: HTTP {status}")
    
    if failed_pages:
        print(f"\n🚨 Failed Pages: {', '.join(failed_pages)}")
        print("💡 This indicates where the application errors are occurring")
    else:
        print("\n✅ All pages loaded successfully!")
        print("🔍 If errors still occur, they might be:")
        print("   - Runtime JavaScript errors (not visible in HTTP response)")
        print("   - Database connection issues")
        print("   - Authentication-related errors")

if __name__ == "__main__":
    main()