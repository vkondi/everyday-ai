from flask import Blueprint, request
from datetime import datetime
import logging
from services.deepseek_service import DeepSeekService
from services.ollama_service import OllamaService
from utils.env_utils import should_initialize_local_models
from utils.response_helpers import success_response, error_response, validate_json_request, validate_required_field
from config import logger

# Create Blueprint for travel routes
travel_bp = Blueprint('travel', __name__)

# Initialize services
deepseek_service = DeepSeekService()

# Only initialize Ollama service in development
is_development = should_initialize_local_models()
if is_development:
    ollama_service = OllamaService()
    logger.info("Travel routes: Ollama service initialized for development")
else:
    ollama_service = None
    logger.info("Travel routes: Ollama service not initialized in production")

@travel_bp.route('', methods=['POST'])
@travel_bp.route('/', methods=['POST'])
def generate_itinerary_root():
    """
    Generate travel itinerary using AI (root endpoint for backward compatibility)
    Expected input: JSON with travel details and model selection
    Returns: Generated itinerary in JSON format
    """
    return generate_itinerary()



@travel_bp.route('/generate', methods=['POST'])
def generate_itinerary():
    """
    Generate travel itinerary using selected AI model
    Expected input: JSON with destination, budget, start_date, end_date, travelers, preferences, and model
    Returns: Generated itinerary with daily breakdown in JSON format
    """
    request_id = datetime.now().strftime("%Y%m%d_%H%M%S_%f")[:-3]
    logger.info(f"[{request_id}] Travel itinerary generation API invoked")
    
    try:
        # Validate request format
        data, error = validate_json_request(request)
        if error:
            return error
        
        # Validate required fields
        field_validations = [
            ('destination', str),
            ('budget', int),
            ('start_date', str),
            ('end_date', str),
            ('travelers', int),
            ('preferences', list)
        ]
        
        for field_name, field_type in field_validations:
            field_value, error = validate_required_field(data, field_name, field_type)
            if error:
                return error
        
        # Get model selection (default to deepseek-api if not provided)
        selected_model = data.get('model', 'deepseek-api')
        logger.info(f"[{request_id}] Using model: {selected_model}")
        
        logger.info(f"[{request_id}] Generating itinerary for {data['destination']} with budget ${data['budget']}")
        
        # Route to appropriate service based on model selection
        if selected_model in ['local-deepseek-r1', 'local-llama3']:
            if not is_development:
                return error_response("Local models are not available in production environment. Please use DeepSeek API.", 400)
            if ollama_service is None:
                return error_response("Local Ollama service is not available.", 500)
            itinerary_data, error = ollama_service.generate_itinerary(data, selected_model, request_id)
        else:  # default to deepseek-api
            itinerary_data, error = deepseek_service.generate_itinerary(data, request_id)
        
        if error:
            logger.error(f"THIS ----- Error: {error}")
            return error_response(error, 500)
        
        return success_response(itinerary_data)
        
    except Exception as e:
        logger.error(f"[{request_id}] Internal server error: {str(e)}")
        return error_response(f'Internal server error: {str(e)}', 500)

 