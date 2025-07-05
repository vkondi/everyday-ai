import os
import logging
from dotenv import load_dotenv
from openai import OpenAI

# Load environment variables
load_dotenv()

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('api.log'),
        logging.StreamHandler()
    ]
)
logger = logging.getLogger(__name__)

# Access environment variables
DEEPSEEK_API_KEY = os.getenv("DEEPSEEK_API_KEY")

# Check if API key is available
if not DEEPSEEK_API_KEY:
    logger.warning("DEEPSEEK_API_KEY environment variable is not set!")
    logger.warning("Please set your DeepSeek API key in a .env file or as an environment variable.")
    logger.warning("You can get your API key from: https://platform.deepseek.com/")
else:
    # Log API key (first 8 characters for security)
    api_key_preview = DEEPSEEK_API_KEY[:8] + "..." if len(DEEPSEEK_API_KEY) > 8 else "***"
    logger.info(f"DeepSeek API key loaded successfully: {api_key_preview}")

# Initialize OpenAI DeepSeek client
client = OpenAI(api_key=DEEPSEEK_API_KEY, base_url="https://api.deepseek.com") if DEEPSEEK_API_KEY else None 