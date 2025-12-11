import os
import logging
from dotenv import load_dotenv
from openai import OpenAI
from google import genai

# Load environment variables
load_dotenv()

# Configure logging
# In production (Vercel), only use StreamHandler due to read-only filesystem
# In development, use both FileHandler and StreamHandler
is_production = os.getenv('VERCEL') == '1' or os.getenv('ENVIRONMENT') == 'production'

if is_production:
    # Production: only console logging (Vercel captures this)
    logging.basicConfig(
        level=logging.INFO,
        format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
        handlers=[
            logging.StreamHandler()
        ]
    )
else:
    # Development: both file and console logging
    logging.basicConfig(
        level=logging.INFO,
        format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
        handlers=[
            logging.FileHandler('api.log'),
            logging.StreamHandler()
        ]
    )

# Create logger instance
logger = logging.getLogger(__name__)

# Log the environment for debugging
if is_production:
    logger.info("Running in PRODUCTION mode")
else:
    logger.info("Running in DEVELOPMENT mode")

# Access environment variables
DEEPSEEK_API_KEY = os.getenv("DEEPSEEK_API_KEY")
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

# Check if Deepseek API key is available
if not DEEPSEEK_API_KEY:
    logger.warning("DEEPSEEK_API_KEY environment variable is not set!")
    logger.warning("Please set your DeepSeek API key in a .env file or as an environment variable.")
    logger.warning("You can get your API key from: https://platform.deepseek.com/")
else:
    # Log success without revealing any part of the API key
    logger.info("DeepSeek API key loaded successfully.")

# Check if Gemini AI API key is available    
if not GEMINI_API_KEY:
    logger.warning("GEMINI_API_KEY environment variable is not set!")
    logger.warning("Please set your Gemini AI API key in a .env file or as an environment variable.")
    logger.warning("You can get your API key from: https://ai.google.dev/gemini-api/docs/api-key")
else:
    # Log success without revealing any part of the API key
    logger.info("Gemini AI API key loaded successfully.")
    
# Initialize OpenAI DeepSeek client
deepseek_client = OpenAI(api_key=DEEPSEEK_API_KEY, base_url="https://api.deepseek.com") if DEEPSEEK_API_KEY else None

# Initialize Gemini client if API key is available
gemini_client = genai.Client() if GEMINI_API_KEY else None