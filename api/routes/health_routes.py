from flask import Blueprint, jsonify
from services.ollama_service import OllamaService
from config import logger, DEEPSEEK_API_KEY
from utils.env_utils import should_initialize_local_models, get_environment_name
from utils.response_helpers import success_response

# Create Blueprint for health routes
health_bp = Blueprint('health', __name__)

# Only initialize Ollama service in development
is_development = should_initialize_local_models()
if is_development:
    ollama_service = OllamaService()
    logger.info("Health routes: Ollama service initialized for development")
else:
    ollama_service = None
    logger.info("Health routes: Ollama service not initialized in production")

@health_bp.route('/health', methods=['GET'])
def health_check():
    """
    Basic health check endpoint
    """
    return jsonify({
        "status": "healthy",
        "message": "Everyday AI API is running"
    })

@health_bp.route('/models', methods=['GET'])
def check_models():
    """
    Check available AI models and their status
    """
    try:
        # Check DeepSeek API availability (from config)
        deepseek_available = DEEPSEEK_API_KEY is not None
        
        # Check Ollama service availability (only in development)
        ollama_available = False
        deepseek_r1_available = False
        llama3_available = False
        
        if is_development and ollama_service is not None:
            ollama_available = ollama_service.is_available()
            if ollama_available:
                deepseek_r1_available = ollama_service.is_model_available("local-deepseek-r1")
                llama3_available = ollama_service.is_model_available("local-llama3")
        
        return jsonify({
            "models": {
                "deepseek-api": {
                    "available": deepseek_available,
                    "type": "cloud",
                    "description": "DeepSeek API (cloud-based)"
                },
                "local-deepseek-r1": {
                    "available": deepseek_r1_available,
                    "type": "local",
                    "description": "Local DeepSeek R1 (Ollama)",
                    "requires": "Development environment + Ollama + deepseek-r1 model"
                },
                "local-llama3": {
                    "available": llama3_available,
                    "type": "local", 
                    "description": "Local Llama 3 (Ollama)",
                    "requires": "Development environment + Ollama + llama3 model"
                }
            },
            "ollama_service": {
                "available": ollama_available,
                "status": "running" if ollama_available else "not available",
                "environment": get_environment_name()
            },
            "environment": get_environment_name()
        })
        
    except Exception as e:
        logger.error(f"Error checking models: {str(e)}")
        return jsonify({
            "error": "Failed to check model availability",
            "message": str(e)
        }), 500

@health_bp.route('/test', methods=['GET'])
def test():
    """
    Basic health check endpoint
    """
    logger.info("Test endpoint accessed")
    return success_response({
        'message': 'Hello, World!',
        'api_key_configured': bool(DEEPSEEK_API_KEY),
        'status': 'healthy'
    })

@health_bp.route('/status', methods=['GET'])
def status():
    """
    Detailed API status endpoint
    """
    logger.info("Status endpoint accessed")
    return success_response({
        'status': 'operational',
        'services': {
            'deepseek_ai': 'available' if DEEPSEEK_API_KEY else 'not_configured'
        },
        'version': '1.0.0'
    }) 