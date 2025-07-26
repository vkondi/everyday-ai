from config import logger
from utils.prompts import EMAIL_ENHANCEMENT_PROMPT, EMAIL_RESPONSE_JSON_SCHEMA, MODEL_CONFIGS, SYSTEM_MESSAGES, TRAVEL_ITINERARY_PROMPT, TRAVEL_ITINERARY_JSON_SCHEMA, NEWS_FETCH_PROMPT, NEWS_JSON_SCHEMA
from utils.response_utils import (
    log_request_start, log_request_success, safe_json_parse, validate_response_structure, format_error_message)
from typing import Dict, Any, Optional, List
from google.genai import types

class GeminiService:
    """
    Service class for interacting with Gemini AI API
    """
    
    def __init__(self):
        from config import gemini_client
        self.client = gemini_client
        self.model_id = "gemini-flash"
        
    def is_available(self):
        """
        Check if Gemini AI client is available
        """
        return self.client is not None
    
    def enhance_email(self, email_content: str, request_id: str) -> tuple[Optional[Dict[str, Any]], Optional[str]]:
        """
        Enhance email content using Gemini Flash AI
        
        Args:
            email_content: The original email content to enhance
            request_id: Unique identifier for logging
            
        Returns:
            (enhanced_data, error_message) - if error_message is not None, the request failed
        """
        if not self.is_available():
            logger.error(f"[{request_id}] API key not configured. Cannot proceed with enhancement.")
            return None, "API key not configured. Please set GEMINI_API_KEY environment variable."
        
        # Use common prompt from prompts module
        prompt = EMAIL_ENHANCEMENT_PROMPT.format(email_content=email_content)
        
        try:
            log_request_start(request_id, self.model_id, "email enhancement")
            
            # Get model configuration
            config = MODEL_CONFIGS[self.model_id]
            
            # Call Gemini API
            response = self.client.models.generate_content(
                model=config["model"],
                contents=prompt,
                config=types.GenerateContentConfig(
                    responseMimeType="application/json",
                    response_json_schema=EMAIL_RESPONSE_JSON_SCHEMA,
                    temperature=config["temperature"],
                    maxOutputTokens=config["max_tokens"],
                    topP=config.get("top_p", 0.9),
                    system_instruction=SYSTEM_MESSAGES[self.model_id],
                    thinking_config=types.ThinkingConfig(thinking_budget=0) # Disables thinking
                )
            )
            
            # Extract AI response
            ai_response = response.text.strip()
            log_request_success(request_id, self.model_id, len(ai_response), "email enhancement")
            
            # Parse and validate response using common utilities
            enhanced_data, error = safe_json_parse(ai_response, request_id, self.model_id)
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
            return None, format_error_message(e, self.model_id, request_id)
        
    def generate_itinerary(self, travel_data: Dict[str, Any], request_id: str) -> tuple[Optional[Dict[str, Any]], Optional[str]]:
        """
        Generate travel itinerary using Gemini AI with enhanced reliability
        
        Args:
            travel_data: Dictionary containing destination, budget, start_date, end_date, travelers, preferences
            request_id: Unique identifier for logging
            
        Returns:
            (itinerary_data, error_message) - if error_message is not None, the request failed
        """
        if not self.is_available():
            return None, "API key not configured. Please set GEMINI_API_KEY environment variable."
        
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
            log_request_start(request_id, self.model_id, "itinerary generation")
            
            # Get model configuration
            config = MODEL_CONFIGS[self.model_id]
            
            # Call Gemini API
            response = self.client.models.generate_content(
                model=config["model"],
                contents=prompt,
                config=types.GenerateContentConfig(
                    responseMimeType="application/json",
                    response_json_schema=TRAVEL_ITINERARY_JSON_SCHEMA,
                    temperature=config["temperature"],
                    maxOutputTokens=config["max_tokens"],
                    topP=config.get("top_p", 0.9),
                    system_instruction="You are an expert travel planner. Create detailed, realistic travel itineraries in the exact JSON format requested.",
                    thinking_config=types.ThinkingConfig(thinking_budget=0) # Disables thinking
                )
            )
            
            # Extract AI response
            ai_response = response.text.strip()
            log_request_success(request_id, self.model_id, len(ai_response), "itinerary generation")
            
            # Parse and validate response using common utilities
            itinerary_data, error = safe_json_parse(ai_response, request_id, self.model_id)
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
            return None, format_error_message(e, self.model_id, request_id)
    
    def fetch_news_by_category(self, categories: List[str], region: str, request_id: str) -> tuple[Optional[List[Dict[str, Any]]], Optional[str]]:
        """
        Fetch news articles by category and region using Gemini AI
        
        Args:
            categories: List of news categories to fetch
            region: User's region/country for localized news
            request_id: Unique identifier for logging
            
        Returns:
            (news_articles, error_message) - if error_message is not None, the request failed
        """
        if not self.is_available():
            logger.error(f"[{request_id}] API key not configured. Cannot fetch news.")
            return None, "API key not configured. Please set GEMINI_API_KEY environment variable."
        
        # Use common prompt from prompts module
        categories_text = ", ".join(categories)
        prompt = NEWS_FETCH_PROMPT.format(categories=categories_text, region=region)
        
        try:
            log_request_start(request_id, self.model_id, "news fetching")
            
            # Get model configuration
            config = MODEL_CONFIGS[self.model_id]
            
            # Call Gemini API
            response = self.client.models.generate_content(
                model=config["model"],
                contents=prompt,
                config=types.GenerateContentConfig(
                    responseMimeType="application/json",
                    response_json_schema=NEWS_JSON_SCHEMA,
                    temperature=config["temperature"],
                    maxOutputTokens=config["max_tokens"],
                    topP=config.get("top_p", 0.9),
                    system_instruction="You are an expert news aggregator. You generate realistic news articles based on specified categories and regions. Always respond in the exact JSON format requested.",
                    thinking_config=types.ThinkingConfig(thinking_budget=0) # Disables thinking
                )
            )
            
            # Extract AI response
            ai_response = response.text.strip()
            log_request_success(request_id, self.model_id, len(ai_response), "news fetching")
            
            # Parse and validate response using common utilities
            news_data, error = safe_json_parse(ai_response, request_id, self.model_id)
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
            return None, format_error_message(e, self.model_id, request_id)