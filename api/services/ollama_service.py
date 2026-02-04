import json
import requests
from typing import Dict, Any, Optional, List
from config import logger
from utils.env_utils import should_initialize_local_models
from utils.prompts import EMAIL_ENHANCEMENT_PROMPT, TRAVEL_ITINERARY_PROMPT, NEWS_FETCH_PROMPT, MODEL_CONFIGS
from utils.response_utils import (
    safe_json_parse, 
    validate_response_structure, 
    format_error_message,
    log_request_start,
    log_request_success
)

class OllamaService:
    """
    Service class for interacting with local Ollama models
    Only available in development environment
    Dynamically discovers available models from Ollama
    """
    
    def __init__(self, base_url: str = "http://localhost:11434"):
        # Only initialize in development environment
        self.is_development = should_initialize_local_models()
        
        if not self.is_development:
            logger.info("OllamaService: Not initializing in production environment")
            self.base_url = None
            self.supported_models = {}
            return
            
        self.base_url = base_url
        self.supported_models = {}
        
        # Dynamically discover available models
        self._discover_available_models()
        
        if self.supported_models:
            logger.info(f"OllamaService: Initialized with {len(self.supported_models)} discovered model(s): {list(self.supported_models.keys())}")
        else:
            logger.warning("OllamaService: No models discovered. Ensure Ollama is running and models are loaded.")
    
    def _discover_available_models(self) -> None:
        """
        Dynamically discover available models from Ollama
        Queries the /api/tags endpoint and creates dynamic model IDs
        """
        try:
            response = requests.get(f"{self.base_url}/api/tags", timeout=5)
            if response.status_code == 200:
                data = response.json()
                models = data.get("models", [])
                
                if not models:
                    logger.warning("OllamaService: No models found in Ollama")
                    return
                
                # Dynamically create model IDs and map to Ollama model names
                for model in models:
                    model_name = model.get("name", "")
                    if model_name:
                        # Extract the base model name (without version tags)
                        # e.g., "llama3:7b" -> "llama3"
                        base_name = model_name.split(":")[0]
                        
                        # Create a friendly dynamic ID
                        # e.g., "llama3:7b" -> "local-llama3"
                        model_id = f"local-{base_name}"
                        
                        # Store mapping (use full model name including tags for accuracy)
                        self.supported_models[model_id] = model_name
                        
                        logger.info(f"OllamaService: Discovered model - {model_id} -> {model_name}")
            else:
                logger.warning(f"OllamaService: Failed to fetch models from Ollama (status {response.status_code})")
        except requests.exceptions.ConnectionError:
            logger.warning("OllamaService: Cannot connect to Ollama service. Ensure Ollama is running.")
        except requests.exceptions.Timeout:
            logger.warning("OllamaService: Timeout connecting to Ollama service.")
        except Exception as e:
            logger.warning(f"OllamaService: Error discovering available models: {str(e)}")
    
    def _get_model_config(self, model_id: str) -> Dict[str, Any]:
        """
        Get model configuration from MODEL_CONFIGS or create default configuration
        
        Args:
            model_id: The model ID to get configuration for
            
        Returns:
            Dictionary containing model configuration with temperature, timeout, etc.
        """
        # Check if configuration exists in MODEL_CONFIGS
        if model_id in MODEL_CONFIGS:
            return MODEL_CONFIGS[model_id]
        
        # Return default configuration for dynamically discovered models
        logger.info(f"Using default configuration for model: {model_id}")
        return {
            "temperature": 0.7,
            "top_p": 0.9,
            "max_tokens": 2000,
            "timeout": 60
        }
    
    def get_available_model_ids(self) -> List[str]:
        """
        Get list of all available local model IDs
        
        Returns:
            List of model IDs (e.g., ['local-llama3', 'local-deepseek-r1'])
        """
        return list(self.supported_models.keys())
    
    def is_available(self) -> bool:
        """
        Check if the Ollama service is available
        Always returns False in production
        """
        if not self.is_development:
            return False
            
        try:
            response = requests.get(f"{self.base_url}/api/tags", timeout=5)
            return response.status_code == 200
        except Exception as e:
            logger.warning(f"Ollama service check failed: {str(e)}")
            return False
    
    def is_model_available(self, model_id: str) -> bool:
        """
        Check if a specific model is available in Ollama
        Always returns False in production
        """
        if not self.is_development:
            return False
            
        try:
            response = requests.get(f"{self.base_url}/api/tags", timeout=5)
            if response.status_code == 200:
                models = response.json().get("models", [])
                ollama_model_name = self.supported_models.get(model_id)
                if ollama_model_name:
                    return any(model.get("name", "").startswith(ollama_model_name) for model in models)
            return False
        except Exception as e:
            logger.warning(f"Model availability check failed for {model_id}: {str(e)}")
            return False
    
    def _call_ollama(self, prompt: str, model_id: str, request_id: str) -> tuple[Optional[str], Optional[str]]:
        """
        Make a call to the local Ollama API
        Returns: (response_text, error_message)
        """
        if not self.is_development:
            return None, "Local models are not available in production environment"
            
        try:
            ollama_model_name = self.supported_models.get(model_id)
            if not ollama_model_name:
                return None, f"Unsupported model: {model_id}"
            
            # Get model configuration (will use defaults if not in MODEL_CONFIGS)
            config = self._get_model_config(model_id)
            
            payload = {
                "model": ollama_model_name,
                "prompt": prompt,
                "stream": False,
                "options": {
                    "temperature": config.get("temperature", 0.7),
                    "top_p": config.get("top_p", 0.9),
                    "max_tokens": config.get("max_tokens", 2000)
                }
            }
            
            logger.info(f"[{request_id}] Calling Ollama API with model: {ollama_model_name}")
            
            response = requests.post(
                f"{self.base_url}/api/generate",
                json=payload,
                timeout=config.get("timeout", 60)
            )
            
            if response.status_code != 200:
                logger.error(f"[{request_id}] Ollama API error: {response.status_code} - {response.text}")
                return None, f"Ollama API error: {response.status_code} - {response.text}"
            
            result = response.json()
            ai_response = result.get("response", "")
            
            if not ai_response:
                logger.error(f"[{request_id}] Ollama returned empty response")
                return None, "Ollama returned empty response"
            
            logger.info(f"[{request_id}] Ollama response received: {len(ai_response)} characters")
            logger.debug(f"[{request_id}] Ollama response preview: {ai_response[:200]}...")
            
            return ai_response, None
            
        except requests.exceptions.Timeout:
            logger.error(f"[{request_id}] Ollama request timed out")
            return None, "Ollama request timed out. Please try again."
        except requests.exceptions.ConnectionError:
            logger.error(f"[{request_id}] Cannot connect to Ollama service")
            return None, "Cannot connect to Ollama service. Please ensure Ollama is running and the model is loaded."
        except json.JSONDecodeError as e:
            logger.error(f"[{request_id}] Failed to parse Ollama response as JSON: {str(e)}")
            logger.error(f"[{request_id}] Raw Ollama response: {response.text[:500]}...")
            return None, f"Ollama API returned invalid JSON: {str(e)}"
        except Exception as e:
            logger.error(f"[{request_id}] Ollama API error: {str(e)}")
            return None, f"Ollama API error: {str(e)}"
    
    def enhance_email(self, email_content: str, model_id: str, request_id: str) -> tuple[Optional[Dict[str, Any]], Optional[str]]:
        """
        Enhance email content using local Ollama model
        
        Args:
            email_content: The original email content to enhance
            request_id: Unique identifier for logging
            
        Returns:
            (enhanced_data, error_message) - if error_message is not None, the request failed
            
        Only available in development environment
        """
        if not self.is_development:
            return None, "Local models are not available in production environment. Please use DeepSeek API."
        
        if not self.is_available():
            logger.error(f"[{request_id}] Ollama service not available")
            return None, "Local Ollama service not available. Please ensure Ollama is running."
        
        if not self.is_model_available(model_id):
            logger.error(f"[{request_id}] Model {model_id} not available in Ollama")
            return None, f"Model {model_id} not available. Please ensure the model is loaded in Ollama."
        
        # Use common prompt from prompts module
        prompt = EMAIL_ENHANCEMENT_PROMPT.format(email_content=email_content)
        
        try:
            log_request_start(request_id, model_id, "email enhancement")
            
            # Call Ollama API
            ai_response, error = self._call_ollama(prompt, model_id, request_id)
            if error:
                return None, error
            
            log_request_success(request_id, model_id, len(ai_response), "email enhancement")
            
            # Parse and validate response using common utilities
            enhanced_data, error = safe_json_parse(ai_response, request_id, model_id)
            if error:
                return None, error
            
            # Validate the response structure
            required_fields = ['original_email_score', 'enhanced_email', 'recommended_subject', 'key_improvements', 'analysis']
            validation_error = validate_response_structure(enhanced_data, required_fields)
            
            if validation_error:
                logger.error(f"[{request_id}] {validation_error}")
                return None, validation_error
            
            return enhanced_data, None
            
        except Exception as e:
            return None, format_error_message(e, model_id, request_id)
    
    def generate_itinerary(self, travel_data: Dict[str, Any], model_id: str, request_id: str) -> tuple[Optional[Dict[str, Any]], Optional[str]]:
        """
        Generate travel itinerary using local Ollama model
        Only available in development environment
        """
        if not self.is_development:
            return None, "Local models are not available in production environment. Please use DeepSeek API."
        
        if not self.is_available():
            return None, "Local Ollama service not available. Please ensure Ollama is running."
        
        if not self.is_model_available(model_id):
            return None, f"Model {model_id} not available. Please ensure the model is loaded in Ollama."
        
        # Extract travel details
        destination = travel_data['destination']
        budget = travel_data['budget']
        start_date = travel_data['start_date']
        end_date = travel_data['end_date']
        travelers = travel_data['travelers']
        preferences = travel_data['preferences']
        
        # Calculate trip duration
        from datetime import datetime
        start_dt = datetime.strptime(start_date, '%Y-%m-%d')
        end_dt = datetime.strptime(end_date, '%Y-%m-%d')
        trip_days = (end_dt - start_dt).days + 1
        
        # Use common prompt from prompts module
        prompt = TRAVEL_ITINERARY_PROMPT.format(
            trip_days=trip_days,
            start_date=start_date,
            end_date=end_date,
            destination=destination,
            budget=budget,
            travelers=travelers,
            preferences_text=', '.join(preferences) if isinstance(preferences, list) else str(preferences)
        )
        
        try:
            log_request_start(request_id, model_id, "itinerary generation")
            
            # Call Ollama API
            ai_response, error = self._call_ollama(prompt, model_id, request_id)
            if error:
                return None, error
            
            log_request_success(request_id, model_id, len(ai_response), "itinerary generation")
            
            # Parse and validate response using common utilities
            itinerary_data, error = safe_json_parse(ai_response, request_id, model_id)
            if error:
                return None, error
            
            # Validate the response structure
            required_fields = ['destination', 'total_cost', 'budget_status', 'daily_itinerary', 'travel_tips', 'budget_breakdown']
            validation_error = validate_response_structure(itinerary_data, required_fields)
            
            if validation_error:
                logger.error(f"[{request_id}] {validation_error}")
                return None, validation_error
            
            return itinerary_data, None
            
        except Exception as e:
            return None, format_error_message(e, model_id, request_id)
    
    def fetch_news_by_category(self, categories: List[str], region: str, model_id: str, request_id: str) -> tuple[Optional[List[Dict[str, Any]]], Optional[str]]:
        """
        Fetch news articles by category and region using local Ollama model
        Only available in development environment
        """
        if not self.is_development:
            return None, "Local models are not available in production environment. Please use DeepSeek API."
        
        if not self.is_available():
            return None, "Local Ollama service not available. Please ensure Ollama is running."
        
        if not self.is_model_available(model_id):
            return None, f"Model {model_id} not available. Please ensure the model is loaded in Ollama."
        
        # Use common prompt from prompts module
        categories_text = ", ".join(categories)
        prompt = NEWS_FETCH_PROMPT.format(categories=categories_text, region=region)
        
        try:
            log_request_start(request_id, model_id, "news fetching")
            
            # Call Ollama API
            ai_response, error = self._call_ollama(prompt, model_id, request_id)
            if error:
                return None, error
            
            log_request_success(request_id, model_id, len(ai_response), "news fetching")
            
            # Parse and validate response using common utilities
            news_data, error = safe_json_parse(ai_response, request_id, model_id)
            if error:
                return None, error
            
            # Validate the response structure
            if 'articles' not in news_data:
                logger.error(f"[{request_id}] Invalid AI response: missing 'articles' field")
                return None, 'Invalid AI response: missing "articles" field'
            
            articles = news_data['articles']
            if not isinstance(articles, list):
                logger.error(f"[{request_id}] Invalid AI response: 'articles' is not a list")
                return None, 'Invalid AI response: "articles" is not a list'
            
            # Validate each article
            for i, article in enumerate(articles):
                required_fields = ['title', 'description', 'category', 'source']
                for field in required_fields:
                    if field not in article:
                        logger.error(f"[{request_id}] Invalid article at index {i}: missing field '{field}'")
                        return None, f'Invalid article at index {i}: missing field "{field}"'
            
            logger.info(f"[{request_id}] Successfully fetched {len(articles)} news articles")
            return articles, None
            
        except Exception as e:
            return None, format_error_message(e, model_id, request_id) 