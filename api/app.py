from flask import Flask
from flask_cors import CORS
from config import logger
from routes.email_routes import email_bp
from routes.health_routes import health_bp
from routes.news_routes import news_bp

def create_app():
    """
    Application factory pattern for creating Flask app
    """
    app = Flask(__name__)
    
    # Configure CORS
    CORS(app, expose_headers=['Content-Disposition'])
    
    # Register blueprints
    app.register_blueprint(health_bp, url_prefix='/api')
    app.register_blueprint(email_bp, url_prefix='/api/email')
    app.register_blueprint(news_bp, url_prefix='/api/news')
    
    # Log registered routes
    logger.info("Registered API routes:")
    for rule in app.url_map.iter_rules():
        logger.info(f"  {rule.methods} {rule.rule}")
    
    return app

# Create the app instance
app = create_app()

if __name__ == '__main__':
    logger.info("Starting Flask API server...")
    app.run(debug=True) 