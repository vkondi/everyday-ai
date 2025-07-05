import json
import logging
from typing import Dict, Any, Optional
from config import client, logger

class NewsService:
    """
    Example service for news digest functionality
    Demonstrates how to add new AI tools to the modular structure
    """
    
    def __init__(self):
        self.client = client
    
    def is_available(self) -> bool:
        """
        Check if the service is available (API key configured)
        """
        return self.client is not None
    
    def create_news_digest(self, news_articles: list, request_id: str) -> tuple[Optional[Dict[str, Any]], Optional[str]]:
        """
        Create a news digest from a list of articles
        
        Args:
            news_articles: List of news articles to summarize
            request_id: Unique identifier for logging
            
        Returns:
            (digest_data, error_message) - if error_message is not None, the request failed
        """
        if not self.is_available():
            logger.error(f"[{request_id}] API key not configured. Cannot create news digest.")
            return None, "API key not configured. Please set DEEPSEEK_API_KEY environment variable."
        
        # Create structured prompt for news digest
        articles_text = "\n\n".join([f"Article {i+1}: {article}" for i, article in enumerate(news_articles)])
        
        prompt = f"""
Please create a comprehensive news digest from the following articles. Provide your response in the exact JSON structure specified below.

Articles:
{articles_text}

Please provide your news digest in the following JSON format:

{{
    "summary": "Overall summary of the main stories",
    "key_headlines": [
        "Headline 1",
        "Headline 2",
        "Headline 3"
    ],
    "main_topics": [
        "Topic 1",
        "Topic 2",
        "Topic 3"
    ],
    "insights": "Analysis and insights about the news",
    "recommended_actions": [
        "Action item 1",
        "Action item 2"
    ]
}}

Focus on:
1. Identifying the most important stories
2. Providing clear, concise summaries
3. Highlighting key trends and patterns
4. Suggesting relevant actions or follow-ups

Respond only with the JSON structure, no additional text.
"""
        
        try:
            logger.info(f"[{request_id}] Creating news digest for {len(news_articles)} articles...")
            
            # Call DeepSeek AI
            response = self.client.chat.completions.create(
                model="deepseek-chat",
                messages=[
                    {
                        "role": "system",
                        "content": "You are an expert news analyst. You create comprehensive news digests with clear summaries and insights. Always respond in the exact JSON format requested."
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
            logger.info(f"[{request_id}] News digest response received: {len(ai_response)} characters")
            
            # Clean and parse the response
            ai_response = ai_response.strip()
            if ai_response.startswith('```json'):
                ai_response = ai_response[7:]
            if ai_response.endswith('```'):
                ai_response = ai_response[:-3]
            
            digest_data = json.loads(ai_response)
            logger.info(f"[{request_id}] Successfully parsed news digest as JSON")
            
            # Validate the response structure
            required_fields = ['summary', 'key_headlines', 'main_topics', 'insights', 'recommended_actions']
            for field in required_fields:
                if field not in digest_data:
                    logger.error(f"[{request_id}] Invalid AI response: missing field '{field}'")
                    return None, f'Invalid AI response: missing field "{field}"'
            
            logger.info(f"[{request_id}] News digest created successfully")
            return digest_data, None
            
        except json.JSONDecodeError as e:
            logger.error(f"[{request_id}] Failed to parse AI response as JSON: {str(e)}")
            logger.error(f"[{request_id}] Raw AI response: {ai_response[:500]}...")
            return None, f"Failed to parse AI response as JSON: {str(e)}"
            
        except Exception as e:
            logger.error(f"[{request_id}] News digest creation failed: {str(e)}")
            return None, f"News digest creation failed: {str(e)}" 