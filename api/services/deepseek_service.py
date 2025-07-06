import json
import logging
from typing import Dict, Any, Optional
from config import logger
import time
from utils.prompts import EMAIL_ENHANCEMENT_PROMPT, TRAVEL_ITINERARY_PROMPT, SYSTEM_MESSAGES, MODEL_CONFIGS
from utils.response_utils import (
    safe_json_parse, 
    validate_response_structure, 
    format_error_message,
    log_request_start,
    log_request_success
)

class DeepSeekService:
    """
    Service class for interacting with DeepSeek AI API
    """
    
    def __init__(self):
        from config import client
        self.client = client
        self.model_id = "deepseek-api"
    
    def is_available(self) -> bool:
        """
        Check if the DeepSeek service is available (API key configured)
        """
        return self.client is not None
    
    def enhance_email(self, email_content: str, request_id: str) -> tuple[Optional[Dict[str, Any]], Optional[str]]:
        """
        Enhance email content using DeepSeek AI
        
        Args:
            email_content: The original email content to enhance
            request_id: Unique identifier for logging
            
        Returns:
            (enhanced_data, error_message) - if error_message is not None, the request failed
        """
        if not self.is_available():
            logger.error(f"[{request_id}] API key not configured. Cannot proceed with enhancement.")
            return None, "API key not configured. Please set DEEPSEEK_API_KEY environment variable."
        
        # Use common prompt from prompts module
        prompt = EMAIL_ENHANCEMENT_PROMPT.format(email_content=email_content)
        
        try:
            log_request_start(request_id, self.model_id, "email enhancement")
            
            # Get model configuration
            config = MODEL_CONFIGS[self.model_id]
            
            # Call DeepSeek AI with timeout
            response = self.client.chat.completions.create(
                model=config["model"],
                messages=[
                    {
                        "role": "system",
                        "content": SYSTEM_MESSAGES[self.model_id]
                    },
                    {
                        "role": "user",
                        "content": prompt
                    }
                ],
                temperature=config["temperature"],
                max_tokens=config["max_tokens"],
                timeout=config["timeout"]
            )
            
            # Extract AI response
            ai_response = response.choices[0].message.content.strip()
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
        Generate travel itinerary using DeepSeek AI with enhanced reliability
        
        Args:
            travel_data: Dictionary containing destination, budget, start_date, end_date, travelers, preferences
            request_id: Unique identifier for logging
            
        Returns:
            (itinerary_data, error_message) - if error_message is not None, the request failed
        """
        if not self.is_available():
            return None, "API key not configured. Please set DEEPSEEK_API_KEY environment variable."
        
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
            
            # Call DeepSeek AI
            response = self.client.chat.completions.create(
                model=config["model"],
                messages=[
                    {
                        "role": "system",
                        "content": "You are an expert travel planner. Create detailed, realistic travel itineraries in the exact JSON format requested."
                    },
                    {
                        "role": "user",
                        "content": prompt
                    }
                ],
                temperature=config["temperature"],
                max_tokens=config["max_tokens"],
                timeout=config["timeout"]
            )
            
            # Extract AI response
            ai_response = response.choices[0].message.content.strip()
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
    
    def _generate_fallback_response(self, travel_data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Generate a fallback response when the AI service fails
        """
        destination = travel_data['destination']
        budget = travel_data['budget']
        start_date = travel_data['start_date']
        end_date = travel_data['end_date']
        travelers = travel_data['travelers']
        
        return {
            "destination": destination,
            "total_cost": f"${budget}",
            "budget_status": "within_budget",
            "daily_itinerary": [
                {
                    "day": 1,
                    "date": start_date,
                    "weather": "sunny, 25°C",
                    "activities": [
                        {
                            "time": "09:00",
                            "description": f"Arrive in {destination}",
                            "type": "sightseeing",
                            "cost": "$0",
                            "location": f"{destination} Airport"
                        },
                        {
                            "time": "14:00",
                            "description": f"Explore {destination} city center",
                            "type": "sightseeing",
                            "cost": "$50",
                            "location": f"{destination} Downtown"
                        }
                    ]
                }
            ],
            "travel_tips": [
                f"Welcome to {destination}!",
                "Check local weather before your trip",
                "Keep important documents safe"
            ],
            "budget_breakdown": {
                "accommodation": f"${budget // 2}",
                "food": f"${budget // 4}",
                "activities": f"${budget // 8}",
                "transportation": f"${budget // 8}",
                "other": f"${budget // 8}"
            }
        } 