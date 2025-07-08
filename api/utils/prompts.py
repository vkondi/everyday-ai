"""
Common prompts for AI services
This module contains all prompts used across different AI models to ensure consistency and avoid duplication.
"""

# Email Enhancement Prompts
EMAIL_ENHANCEMENT_PROMPT = """
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

# Travel Itinerary Generation Prompts
TRAVEL_ITINERARY_PROMPT = """
Create a {trip_days}-day travel itinerary from {start_date} to {end_date} for {destination} with budget ${budget} for {travelers} travelers. 

Traveler preferences: {preferences_text}

Return ONLY valid JSON with no additional text or explanations:

{{
    "destination": "{destination}",
    "total_cost": "total cost in dollars",
    "budget_status": "within_budget/over_budget",
    "daily_itinerary": [
        {{
            "day": 1,
            "date": "{start_date}",
            "day_of_week": "day name",
            "weather": "weather description",
            "activities": [
                {{
                    "time": "09:00",
                    "description": "Activity description",
                    "type": "culture/food/adventure/relaxation/sightseeing/shopping",
                    "cost": "$50",
                    "location": "Location name"
                }}
            ]
        }}
    ],
    "travel_tips": [
        "Tip 1",
        "Tip 2", 
        "Tip 3"
    ],
    "budget_breakdown": {{
        "accommodation": "$500",
        "food": "$300",
        "activities": "$200",
        "transportation": "$150",
        "other": "$50"
    }}
}}

Important: Ensure the JSON is valid and complete. Include realistic activities, costs, and tips for {destination}. The total cost should be realistic for the budget of ${budget}.
"""

# News Fetching Prompts
NEWS_FETCH_PROMPT = """
Generate 5 realistic news articles for the specified categories and country.

Categories: {categories}
Country: {region}

Return ONLY valid JSON:

{{
    "articles": [
        {{
            "title": "Concise, engaging headline (max 80 characters)",
            "description": "Clear 2-3 sentence summary with key details",
            "category": "Exact category from the list",
            "source": "Realistic news source (e.g., Reuters, BBC, CNN, local papers)"
        }}
    ]
}}

CRITICAL REQUIREMENTS:
• Generate 5 articles total
• Focus on NATIONAL/COUNTRY-LEVEL news for {region}
• DO NOT create city-specific or local news
• Include national politics, economy, sports, technology, and international news
• Use country-wide events, not local events
• Examples of good topics: national elections, federal policies, country-wide economic trends, national sports teams, international relations
• Examples of BAD topics: local city events, neighborhood news, city-specific businesses

Guidelines:
• Distribute evenly across selected categories: {categories}
• Prioritize country-level relevance for {region}
• Include both domestic and international news with {region} perspective
• Use current events and realistic scenarios
• Keep titles concise and engaging
• Ensure descriptions are informative but brief
• Use credible news sources appropriate for the country

Respond with JSON only.
"""

# System Messages for Different Models
SYSTEM_MESSAGES = {
    "deepseek-api": "You are an expert email writing assistant. You analyze emails and provide enhancements with specific improvements. Always respond in the exact JSON format requested.",
    "local-deepseek-r1": "You are an expert email writing assistant. You analyze emails and provide enhancements with specific improvements. Always respond in the exact JSON format requested.",
    "local-llama3": "You are an expert email writing assistant. You analyze emails and provide enhancements with specific improvements. Always respond in the exact JSON format requested."
}

# Model-specific configurations
MODEL_CONFIGS = {
    "deepseek-api": {
        "model": "deepseek-chat",
        "temperature": 0.7,
        "max_tokens": 2000,
        "timeout": 50
    },
    "local-deepseek-r1": {
        "model": "deepseek-r1",
        "temperature": 0.7,
        "top_p": 0.9,
        "max_tokens": 2000,
        "timeout": 60
    },
    "local-llama3": {
        "model": "llama3",
        "temperature": 0.7,
        "top_p": 0.9,
        "max_tokens": 2000,
        "timeout": 60
    }
} 