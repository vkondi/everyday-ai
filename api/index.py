# Main entry point for the API
# This file maintains backward compatibility while using the new modular structure

# Import the Flask app from the local app.py file
import sys
import os

# Add the current directory to Python path for imports
current_dir = os.path.dirname(os.path.abspath(__file__))
if current_dir not in sys.path:
    sys.path.insert(0, current_dir)

from app import app

if __name__ == '__main__':
    app.run(debug=True)