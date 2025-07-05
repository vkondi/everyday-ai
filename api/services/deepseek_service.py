import json
import logging
from typing import Dict, Any, Optional
from config import client, logger

class DeepSeekService:
    """
    Service class for interacting with DeepSeek AI API
    """
    
    def __init__(self):
        self.client = client
    
    def is_available(self) -> bool:
        """
        Check if the DeepSeek service is available (API key configured)
        """
        return self.client is not None
    
    def _clean_ai_response(self, response: str) -> str:
        """
        Clean AI response by removing markdown formatting if present
        """
        response = response.strip()
        if response.startswith('```json'):
            response = response[7:]
        if response.endswith('```'):
            response = response[:-3]
        return response.strip()
    
    def _validate_response_structure(self, data: Dict[str, Any], required_fields: list) -> Optional[str]:
        """
        Validate that the AI response contains all required fields
        Returns: error message if validation fails, None if successful
        """
        for field in required_fields:
            if field not in data:
                return f'Invalid AI response: missing field "{field}"'
        return None
    
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
        
        # Create structured prompt for DeepSeek AI
        prompt = f"""
Please analyze and enhance the following email content. Provide your response in the exact JSON structure specified below.

Original Email:
{email_content}

Please provide your analysis and enhancement in the following JSON format:

{{
    "original_email_score": "percentage (0-100%)",
    "enhanced_email": "the improved email content",
    "recommended_subject": "suggested subject line",
    "key_improvements": [
        "specific improvement 1",
        "specific improvement 2",
        "specific improvement 3"
    ],
    "analysis": {{
        "tone": "professional/friendly/formal/informal",
        "clarity": "clear/unclear",
        "conciseness": "concise/verbose",
        "call_to_action": "present/missing/weak"
    }}
}}

IMPORTANT: For the "key_improvements" field, provide specific, contextual improvements that directly reference elements from the original email. Instead of generic advice, mention specific phrases, sentences, or content from the original email and explain how they were improved. For example:
- "Changed 'I wanted to follow up' to 'I'm following up on our discussion' for more directness"
- "Added specific details about the project timeline that were missing from your original message"
- "Restructured your opening to lead with the most important point about the budget approval"
- "Enhanced your closing by adding a clear next step instead of just 'let me know'"

Focus on:
1. Improving clarity and professionalism
2. Making the message more concise and impactful
3. Ensuring proper tone for the context
4. Adding or improving call-to-action if needed
5. Suggesting an appropriate subject line
6. Providing specific, contextual improvements that reference the original content

Respond only with the JSON structure, no additional text.
"""
        
        try:
            logger.info(f"[{request_id}] Calling DeepSeek AI API...")
            
            # Call DeepSeek AI
            response = self.client.chat.completions.create(
                model="deepseek-chat",
                messages=[
                    {
                        "role": "system",
                        "content": "You are an expert email writing assistant. You analyze emails and provide enhancements with specific improvements. Always respond in the exact JSON format requested."
                    },
                    {
                        "role": "user",
                        "content": prompt
                    }
                ],
                temperature=0.7,
                max_tokens=2000
            )
            
            # Extract AI response
            ai_response = response.choices[0].message.content.strip()
            logger.info(f"[{request_id}] DeepSeek AI response received: {len(ai_response)} characters")
            
            # Clean and parse the response
            ai_response = self._clean_ai_response(ai_response)
            enhanced_data = json.loads(ai_response)
            logger.info(f"[{request_id}] Successfully parsed AI response as JSON")
            
            # Validate the response structure
            required_fields = ['original_email_score', 'enhanced_email', 'recommended_subject', 'key_improvements', 'analysis']
            validation_error = self._validate_response_structure(enhanced_data, required_fields)
            
            if validation_error:
                logger.error(f"[{request_id}] {validation_error}")
                return None, validation_error
            
            logger.info(f"[{request_id}] Email enhancement completed successfully")
            return enhanced_data, None
            
        except json.JSONDecodeError as e:
            logger.error(f"[{request_id}] Failed to parse AI response as JSON: {str(e)}")
            logger.error(f"[{request_id}] Raw AI response: {ai_response[:500]}...")
            return None, f"Failed to parse AI response as JSON: {str(e)}"
            
        except Exception as e:
            logger.error(f"[{request_id}] DeepSeek API call failed: {str(e)}")
            return None, f"DeepSeek API call failed: {str(e)}" 