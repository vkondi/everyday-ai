"""
Environment utilities for consistent environment checking
This module provides utilities to check if the application is running in development or production.
"""

import os

def is_development() -> bool:
    """
    Check if the application is running in development environment
    
    Returns:
        True if in development, False if in production
    """
    # Check multiple environment variables for flexibility
    node_env = os.getenv('NODE_ENV')
    flask_env = os.getenv('FLASK_ENV')
    vercel_env = os.getenv('VERCEL')
    
    # Development conditions
    if node_env == 'development':
        return True
    if flask_env == 'development':
        return True
    if vercel_env == '0':  # Vercel development
        return True
    
    # Production conditions
    if node_env == 'production':
        return False
    if flask_env == 'production':
        return False
    if vercel_env == '1':  # Vercel production
        return False
    
    # Default to development if no clear indication
    return True

def is_production() -> bool:
    """
    Check if the application is running in production environment
    
    Returns:
        True if in production, False if in development
    """
    return not is_development()

def get_environment_name() -> str:
    """
    Get the current environment name
    
    Returns:
        'development' or 'production'
    """
    return 'development' if is_development() else 'production'

def should_initialize_local_models() -> bool:
    """
    Check if local models should be initialized
    
    Returns:
        True if local models should be available (development only)
    """
    return is_development() 