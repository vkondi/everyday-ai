from flask import Blueprint, jsonify
from services.ollama_service import OllamaService
from config import logger, DEEPSEEK_API_KEY, GEMINI_API_KEY
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
        
        # Check Gemini API availability (from config)
        gemini_available = GEMINI_API_KEY is not None
        
        # Build models dictionary
        models_dict = {
            "deepseek-api": {
                "available": deepseek_available,
                "type": "cloud",
                "description": "DeepSeek API (cloud-based)"
            },
            "gemini-flash": {
                "available": gemini_available,
                "type": "cloud",
                "description": "Google Gemini 2.5 Flash (cloud-based)"
            }
        }
        
        # Check Ollama service availability and dynamically discover models
        ollama_available = False
        discovered_models = {}
        
        if is_development and ollama_service is not None:
            ollama_available = ollama_service.is_available()
            
            if ollama_available:
                # Get dynamically discovered models
                available_model_ids = ollama_service.get_available_model_ids()
                
                for model_id in available_model_ids:
                    is_model_available = ollama_service.is_model_available(model_id)
                    # Extract the base model name from model_id (e.g., "local-llama3" -> "llama3")
                    base_name = model_id.replace("local-", "").upper()
                    
                    discovered_models[model_id] = {
                        "available": is_model_available,
                        "type": "local",
                        "description": f"Local {base_name} (Ollama)",
                        "requires": "Development environment + Ollama + model loaded"
                    }
        
        # Merge discovered models with the base models dictionary
        models_dict.update(discovered_models)
        
        return jsonify({
            "models": models_dict,
            "ollama_service": {
                "available": ollama_available,
                "status": "running" if ollama_available else "not available",
                "discovered_models_count": len(discovered_models),
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