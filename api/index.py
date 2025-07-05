# Main entry point for the API
# This file maintains backward compatibility while using the new modular structure

from app import app

if __name__ == '__main__':
    app.run(debug=True)