from flask import Blueprint, request
from datetime import datetime
import logging
from services.news_service import NewsService
from utils.response_helpers import success_response, error_response, validate_json_request, validate_required_field
from config import logger

# Create Blueprint for news routes
news_bp = Blueprint('news', __name__)

# Initialize services
news_service = NewsService()

@news_bp.route('/digest', methods=['POST'])
def create_news_digest():
    """
    Create a news digest from a list of articles
    Expected input: JSON with 'articles' field (list of strings)
    Returns: News digest with analysis in JSON format
    """
    # Log API invocation with timestamp
    request_id = datetime.now().strftime("%Y%m%d_%H%M%S_%f")[:-3]
    logger.info(f"[{request_id}] News digest API invoked")
    
    try:
        # Validate request format
        data, error = validate_json_request(request)
        if error:
            logger.warning(f"[{request_id}] Invalid request format")
            return error
        
        # Validate articles list
        articles, error = validate_required_field(data, 'articles', list)
        if error:
            logger.warning(f"[{request_id}] Invalid articles field")
            return error
        
        # Validate that articles is not empty and contains strings
        if not articles:
            return error_response('articles list cannot be empty', 400)
        
        for i, article in enumerate(articles):
            if not isinstance(article, str) or not article.strip():
                return error_response(f'article at index {i} must be a non-empty string', 400)
        
        # Log articles count (for monitoring, not the actual content for privacy)
        logger.info(f"[{request_id}] Processing {len(articles)} articles")
        
        # Create news digest using service
        digest_data, error = news_service.create_news_digest(articles, request_id)
        if error:
            return error_response(error, 500)
        
        return success_response(digest_data)
        
    except Exception as e:
        logger.error(f"[{request_id}] Internal server error: {str(e)}")
        return error_response(f'Internal server error: {str(e)}', 500) 