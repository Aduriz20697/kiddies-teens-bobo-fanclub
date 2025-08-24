#!/usr/bin/env python3
"""
Setup script for Bobo Fan Club Database
Run this script to initialize the database and start the web server.

Requirements:
- Python 3.6+
- Flask (install with: pip install Flask)

Usage:
1. Install Python from python.org
2. Run: pip install Flask
3. Run: python setup.py
"""

import os
import sys

def check_requirements():
    try:
        import flask
        print("✅ Flask is installed")
        return True
    except ImportError:
        print("❌ Flask not found. Install with: pip install Flask")
        return False

def setup_database():
    from database import create_database
    create_database()
    print("✅ Database initialized")

def main():
    print("🎉 Bobo Fan Club Database Setup")
    print("=" * 40)
    
    if not check_requirements():
        print("\n📋 Setup Instructions:")
        print("1. Install Python from https://python.org")
        print("2. Run: pip install Flask")
        print("3. Run this script again")
        return
    
    setup_database()
    
    print("\n🚀 Starting web server...")
    print("Visit: http://localhost:5000")
    print("Press Ctrl+C to stop")
    
    from form_handler import app
    app.run(debug=True)

if __name__ == "__main__":
    main()