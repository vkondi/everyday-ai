from flask import Blueprint, request
from datetime import datetime
from services.deepseek_service import DeepSeekService
from services.ollama_service import OllamaService
from services.gemini_service import GeminiService
from utils.env_utils import should_initialize_local_models
from utils.response_helpers import success_response, error_response, validate_json_request, validate_required_field
from config import logger

# Create Blueprint for email routes
email_bp = Blueprint('email', __name__)

# Initialize services
deepseek_service = DeepSeekService()
gemini_service = GeminiService()

# Only initialize Ollama service in development
is_development = should_initialize_local_models()
if is_development:
    ollama_service = OllamaService()
    logger.info("Email routes: Ollama service initialized for development")
else:
    ollama_service = None
    logger.info("Email routes: Ollama service not initialized in production")

@email_bp.route('', methods=['POST'])
@email_bp.route('/', methods=['POST'])
def enhance_email_root():
    """
    Enhance email content using AI (root endpoint for backward compatibility)
    Expected input: JSON with 'email_content' and 'model' fields
    Returns: Enhanced email with analysis in JSON format
    """
    return enhance_email()

@email_bp.route('/enhance', methods=['POST'])
def enhance_email():
    """
    Enhance email content using selected AI model
    Expected input: JSON with 'email_content' and 'model' fields
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
        
        # Get model selection (default to deepseek-api if not provided)
        selected_model = data.get('model', 'deepseek-api')
        logger.info(f"[{request_id}] Using model: {selected_model}")
        
        # Log email content length (for monitoring, not the actual content for privacy)
        logger.info(f"[{request_id}] Processing email content: {len(email_content)} characters")
        
        # Route to appropriate service based on model selection
        if selected_model in ['local-deepseek-r1', 'local-llama3']:
            if not is_development:
                return error_response("Local models are not available in production environment. Please use DeepSeek API.", 400)
            if ollama_service is None:
                return error_response("Local Ollama service is not available.", 500)
            enhanced_data, error = ollama_service.enhance_email(email_content, selected_model, request_id)
        elif selected_model == 'gemini-flash':
            if not gemini_service.is_available():
                return error_response("Gemini AI API key is not configured. Please set GEMINI_AI_API_KEY environment variable.", 500)
            enhanced_data, error = gemini_service.enhance_email(email_content, request_id)
        else:  # default to deepseek-api
            enhanced_data, error = deepseek_service.enhance_email(email_content, request_id)
        
        if error:
            return error_response(error, 500)
        
        return success_response(enhanced_data)
        
    except Exception as e:
        logger.error(f"[{request_id}] Internal server error: {str(e)}")
        return error_response(f'Internal server error: {str(e)}', 500) 