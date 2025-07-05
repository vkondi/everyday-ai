from flask import Blueprint
from config import logger, DEEPSEEK_API_KEY
from utils.response_helpers import success_response

# Create Blueprint for health routes
health_bp = Blueprint('health', __name__)

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