"""
Common utilities for AI response processing
This module contains shared functions for cleaning, validating, and processing AI responses.
"""

import json
import logging
import re
from typing import Dict, Any, Optional, List
from config import logger

def clean_ai_response(response: str) -> str:
    """
    Clean AI response by removing markdown formatting if present
    
    Args:
        response: Raw AI response string
        
    Returns:
        Cleaned response string
    """
    if not response:
        return ""
        
    response = response.strip()
    
    # Remove markdown code blocks
    if response.startswith('```json'):
        response = response[7:]
    elif response.startswith('```'):
        response = response[3:]
    if response.endswith('```'):
        response = response[:-3]
    
    # Remove any leading/trailing whitespace
    response = response.strip()
    
    # Try to find JSON content if response contains other text
    json_match = re.search(r'\{.*\}', response, re.DOTALL)
    if json_match:
        response = json_match.group(0)
    
    return response

def validate_response_structure(data: Dict[str, Any], required_fields: List[str]) -> Optional[str]:
    """
    Validate that the AI response contains all required fields
    
    Args:
        data: Parsed JSON response data
        required_fields: List of required field names
        
    Returns:
        Error message if validation fails, None if successful
    """
    for field in required_fields:
        if field not in data:
            return f'Invalid AI response: missing field "{field}"'
    return None

def safe_json_parse(response_text: str, request_id: str, model_id: str) -> tuple[Optional[Dict[str, Any]], Optional[str]]:
    """
    Safely parse JSON response with enhanced error handling
    
    Args:
        response_text: Raw response text
        request_id: Request identifier for logging
        model_id: Model identifier for logging
        
    Returns:
        (parsed_data, error_message) - if error_message is not None, parsing failed
    """
    if not response_text:
        logger.error(f"[{request_id}] {model_id} returned empty response")
        return None, f"{model_id} returned empty response"
    
    try:
        # First attempt: direct JSON parsing
        try:
            parsed_data = json.loads(response_text)
            logger.info(f"[{request_id}] Successfully parsed {model_id} response as JSON")
            return parsed_data, None
        except json.JSONDecodeError:
            pass
        
        # Second attempt: clean and parse
        cleaned_response = clean_ai_response(response_text)
        if not cleaned_response:
            logger.error(f"[{request_id}] {model_id} response could not be cleaned")
            return None, f"{model_id} response could not be cleaned"
        
        try:
            parsed_data = json.loads(cleaned_response)
            logger.info(f"[{request_id}] Successfully parsed {model_id} response after cleaning")
            return parsed_data, None
        except json.JSONDecodeError as e:
            logger.error(f"[{request_id}] Failed to parse {model_id} response as JSON after cleaning: {str(e)}")
            logger.error(f"[{request_id}] Raw {model_id} response: {response_text[:1000]}...")
            logger.error(f"[{request_id}] Cleaned {model_id} response: {cleaned_response[:1000]}...")
            return None, f"Failed to parse {model_id} response as JSON: {str(e)}"
            
    except Exception as e:
        logger.error(f"[{request_id}] Unexpected error parsing {model_id} response: {str(e)}")
        logger.error(f"[{request_id}] Raw {model_id} response: {response_text[:500]}...")
        return None, f"Unexpected error parsing {model_id} response: {str(e)}"

def format_error_message(error: Exception, model_id: str, request_id: str) -> str:
    """
    Format error messages consistently across services
    
    Args:
        error: The exception that occurred
        model_id: Model identifier for logging
        request_id: Request identifier for logging
        
    Returns:
        Formatted error message
    """
    error_msg = str(error)
    
    if "timeout" in error_msg.lower() or "timed out" in error_msg.lower():
        logger.error(f"[{request_id}] {model_id} call timed out: {error_msg}")
        return f"The {model_id} service is taking longer than expected. Please try again in a moment."
    elif "connection" in error_msg.lower() or "socket" in error_msg.lower():
        logger.error(f"[{request_id}] {model_id} connection error: {error_msg}")
        return f"Unable to connect to the {model_id} service. Please check your internet connection and try again."
    else:
        logger.error(f"[{request_id}] {model_id} call failed: {error_msg}")
        return f"{model_id} service error: {error_msg}"

def log_request_start(request_id: str, model_id: str, operation: str = "processing") -> None:
    """
    Log the start of a request
    
    Args:
        request_id: Request identifier
        model_id: Model identifier
        operation: Operation description
    """
    logger.info(f"[{request_id}] Calling {model_id} for {operation}...")

def log_request_success(request_id: str, model_id: str, response_length: int, operation: str = "processing") -> None:
    """
    Log successful request completion
    
    Args:
        request_id: Request identifier
        model_id: Model identifier
        response_length: Length of response in characters
        operation: Operation description
    """
    logger.info(f"[{request_id}] {model_id} response received: {response_length} characters")
    logger.info(f"[{request_id}] {operation} completed successfully")

def log_request_error(request_id: str, model_id: str, error: str, operation: str = "processing") -> None:
    """
    Log request error
    
    Args:
        request_id: Request identifier
        model_id: Model identifier
        error: Error message
        operation: Operation description
    """
    logger.error(f"[{request_id}] {model_id} {operation} failed: {error}") 