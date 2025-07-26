from flask import Blueprint, request
from datetime import datetime
from services.deepseek_service import DeepSeekService
from services.gemini_service import GeminiService
from services.ollama_service import OllamaService
from services.iplocation_service import IpLocationService
from utils.env_utils import should_initialize_local_models
from utils.response_helpers import success_response, error_response, validate_json_request, validate_required_field
from config import logger

# Create Blueprint for news routes
news_bp = Blueprint('news', __name__)

# Initialize services
deepseek_service = DeepSeekService()
gemini_service = GeminiService()
iplocation_service = IpLocationService()

# Only initialize Ollama service in development
is_development = should_initialize_local_models()
if is_development:
    ollama_service = OllamaService()
    logger.info("News routes: Ollama service initialized for development")
else:
    ollama_service = None
    logger.info("News routes: Ollama service not initialized in production")

@news_bp.route('/fetch', methods=['POST'])
def fetch_news_by_category():
    """
    Fetch news articles by category and region using selected AI model
    Expected input: JSON with 'categories' field (list of strings), 'region' field (string), and 'model' field (string)
    Returns: List of news articles in JSON format
    """
    # Log API invocation with timestamp
    request_id = datetime.now().strftime("%Y%m%d_%H%M%S_%f")[:-3]
    logger.info(f"[{request_id}] News fetch API invoked")
    
    # Get client IP address from request headers
    client_ip = request.headers.get('X-Forwarded-For', request.remote_addr)
    if client_ip and ',' in client_ip:
        client_ip = client_ip.split(',')[0].strip()
    
    try:
        # Validate request format
        data, error = validate_json_request(request)
        if error:
            logger.warning(f"[{request_id}] Invalid request format")
            return error
        
        # Validate categories list
        categories, error = validate_required_field(data, 'categories', list)
        if error:
            logger.warning(f"[{request_id}] Invalid categories field")
            return error
        
        # Retrieve region based on client IP address
        region = iplocation_service.get_location(client_ip,request_id)
        
        # Validate that categories is not empty and contains strings
        if not categories:
            return error_response('categories list cannot be empty', 400)
        
        for i, category in enumerate(categories):
            if not isinstance(category, str) or not category.strip():
                return error_response(f'category at index {i} must be a non-empty string', 400)
        
        # Get model selection (default to deepseek-api if not provided)
        selected_model = data.get('model', 'deepseek-api')
        logger.info(f"[{request_id}] Using model: {selected_model}")
        
        # Log categories and region (for monitoring, not the actual content for privacy)
        logger.info(f"[{request_id}] Fetching news for categories: {categories} in region: {region}")
        
        # Route to appropriate service based on model selection
        if selected_model in ['local-deepseek-r1', 'local-llama3']:
            if not is_development:
                return error_response("Local models are not available in production environment. Please use DeepSeek API.", 400)
            if ollama_service is None:
                return error_response("Local Ollama service is not available.", 500)
            news_data, error = ollama_service.fetch_news_by_category(categories, region, selected_model, request_id)
        elif selected_model == 'gemini-flash':
            if not gemini_service.is_available():
                return error_response("Gemini AI API key is not configured. Please set GEMINI_API_KEY environment variable.", 500)
            news_data, error = gemini_service.fetch_news_by_category(categories, region, request_id)
        else:  # default to deepseek-api
            news_data, error = deepseek_service.fetch_news_by_category(categories, region, request_id)
        
        if error:
            return error_response(error, 500)
        
        return success_response({"articles": news_data})
        
    except Exception as e:
        logger.error(f"[{request_id}] Internal server error: {str(e)}")
        return error_response(f'Internal server error: {str(e)}', 500) 