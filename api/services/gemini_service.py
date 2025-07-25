from config import logger
from utils.prompts import EMAIL_ENHANCEMENT_PROMPT, MODEL_CONFIGS, SYSTEM_MESSAGES
from utils.response_utils import (
    log_request_start, log_request_success, safe_json_parse, validate_response_structure, format_error_message)
from typing import Dict, Any, Optional
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
            return None, "API key not configured. Please set GEMINI_AI_API_KEY environment variable."
        
        # Use common prompt from prompts module
        prompt = EMAIL_ENHANCEMENT_PROMPT.format(email_content=email_content)
        
        try:
            log_request_start(request_id, self.model_id, "email enhancement")
            
            # Get model configuration
            config = MODEL_CONFIGS[self.model_id]
            
            # Call Gemini AI API with timeout
            response = self.client.models.generate_content(
                model=config["model"],
                contents=prompt,
                config=types.GenerateContentConfig(
                    responseMimeType="application/json",
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