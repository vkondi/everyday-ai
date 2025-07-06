from flask import Flask
from flask_cors import CORS
from config import logger, is_production
from routes.email_routes import email_bp
from routes.health_routes import health_bp
from routes.news_routes import news_bp
from routes.travel_routes import travel_bp

def create_app():
    """
    Application factory pattern for creating Flask app
    """
    app = Flask(__name__)
    
    # Configure Flask for better performance with large responses
    app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024  # 16MB max request size
    app.config['SEND_FILE_MAX_AGE_DEFAULT'] = 0
    
    # Configure CORS
    CORS(app, expose_headers=['Content-Disposition'])
    
    # Register blueprints
    app.register_blueprint(health_bp, url_prefix='/api')
    app.register_blueprint(email_bp, url_prefix='/api/email')
    app.register_blueprint(news_bp, url_prefix='/api/news')
    app.register_blueprint(travel_bp, url_prefix='/api/travel')
    
    # Log registered routes
    logger.info("Registered API routes:")
    for rule in app.url_map.iter_rules():
        logger.info(f"  {rule.methods} {rule.rule}")
    
    return app

# Create the app instance
app = create_app()

if __name__ == '__main__':
    logger.info("Starting Flask API server...")
    # Debug mode is True in development, False in production
    debug_mode = not is_production
    logger.info(f"Debug mode: {debug_mode}")
    app.run(debug=debug_mode, threaded=True, host='0.0.0.0', port=5328) 