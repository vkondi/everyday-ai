from flask import Blueprint, request
from datetime import datetime
import logging
from services.deepseek_service import DeepSeekService
from utils.response_helpers import success_response, error_response, validate_json_request, validate_required_field
from config import logger

# Create Blueprint for email routes
email_bp = Blueprint('email', __name__)

# Initialize services
deepseek_service = DeepSeekService()

@email_bp.route('/', methods=['POST'])
def enhance_email_root():
    """
    Enhance email content using DeepSeek AI (root endpoint for backward compatibility)
    Expected input: JSON with 'email_content' field
    Returns: Enhanced email with analysis in JSON format
    """
    return enhance_email()

@email_bp.route('/enhance', methods=['POST'])
def enhance_email():
    """
    Enhance email content using DeepSeek AI
    Expected input: JSON with 'email_content' field
    Returns: Enhanced email with analysis in JSON format
    """
    # Log API invocation with timestamp
    request_id = datetime.now().strftime("%Y%m%d_%H%M%S_%f")[:-3]
    logger.info(f"[{request_id}] Email enhancement API invoked")
    
    try:
        # Validate request format
        data, error = validate_json_request(request)
        if error:
            logger.warning(f"[{request_id}] Invalid request format")
            return error
        
        # Validate email content
        email_content, error = validate_required_field(data, 'email_content')
        if error:
            logger.warning(f"[{request_id}] Invalid email content")
            return error
        
        # Log email content length (for monitoring, not the actual content for privacy)
        logger.info(f"[{request_id}] Processing email content: {len(email_content)} characters")
        
        # Enhance email using DeepSeek service
        enhanced_data, error = deepseek_service.enhance_email(email_content, request_id)
        if error:
            return error_response(error, 500)
        
        return success_response(enhanced_data)
        
    except Exception as e:
        logger.error(f"[{request_id}] Internal server error: {str(e)}")
        return error_response(f'Internal server error: {str(e)}', 500) 