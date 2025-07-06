from flask import jsonify
from typing import Dict, Any, Optional
import logging

logger = logging.getLogger(__name__)

def success_response(data: Dict[str, Any], status_code: int = 200) -> tuple:
    """
    Create a standardized success response
    """
    response = jsonify(data)
    response.headers['Content-Type'] = 'application/json'
    response.headers['Cache-Control'] = 'no-cache'
    return response, status_code

def error_response(message: str, status_code: int = 400, details: Optional[Dict[str, Any]] = None) -> tuple:
    """
    Create a standardized error response
    """
    response = {'error': message}
    if details:
        response['details'] = details
    return jsonify(response), status_code

def validate_json_request(request) -> tuple[Optional[Dict], Optional[tuple]]:
    """
    Validate that the request contains valid JSON
    Returns: (data, error_response) - if error_response is not None, return it
    """
    if not request.is_json:
        return None, error_response('Content-Type must be application/json', 400)
    
    data = request.get_json()
    if not data:
        return None, error_response('Request body must contain valid JSON', 400)
    
    return data, None

def validate_required_field(data: Dict, field_name: str, field_type: type = str) -> tuple[Optional[Any], Optional[tuple]]:
    """
    Validate that a required field exists and is of the correct type
    Returns: (field_value, error_response) - if error_response is not None, return it
    """
    if field_name not in data:
        return None, error_response(f'Missing required field: {field_name}', 400)
    
    field_value = data[field_name]
    
    if field_type == str:
        if not field_value or not isinstance(field_value, str):
            return None, error_response(f'{field_name} must be a non-empty string', 400)
    elif field_type == int:
        if not isinstance(field_value, int) or field_value <= 0:
            return None, error_response(f'{field_name} must be a positive integer', 400)
    elif field_type == list:
        if not isinstance(field_value, list) or len(field_value) == 0:
            return None, error_response(f'{field_name} must be a non-empty list', 400)
    elif not isinstance(field_value, field_type):
        return None, error_response(f'{field_name} must be of type {field_type.__name__}', 400)
    
    return field_value, None 