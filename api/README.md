# Everyday AI API

A modular Flask API for AI-powered tools and services.

## Project Structure

```
api/
├── config.py              # Configuration, environment variables, and logging setup
├── app.py                 # Main Flask application factory
├── index.py               # Entry point (maintains backward compatibility)
├── routes/                # API route modules
│   ├── __init__.py
│   ├── health_routes.py   # Health check and status endpoints
│   └── email_routes.py    # Email enhancement endpoints
├── services/              # AI service integrations
│   ├── __init__.py
│   └── deepseek_service.py # DeepSeek AI service
├── utils/                 # Common utilities
│   ├── __init__.py
│   └── response_helpers.py # Response formatting and validation helpers
└── README.md              # This file
```

## Features

### Current Endpoints

#### Health & Status

- `GET /api/test` - Basic health check
- `GET /api/status` - Detailed API status

#### Email Enhancement

- `POST /api/email/enhance` - Enhance email content using DeepSeek AI

## Setup

1. **Install Dependencies**

   ```bash
   pip install -r requirements.txt
   ```

2. **Environment Variables**
   Create a `.env` file in the root directory:

   ```env
   DEEPSEEK_API_KEY=your_deepseek_api_key_here
   ```

3. **Run the API**

   ```bash
   # Option 1: Using the entry point
   python api/index.py

   # Option 2: Using the app directly
   python api/app.py
   ```

## API Usage

### Email Enhancement

**Endpoint:** `POST /api/email/enhance`

**Request:**

```json
{
  "email_content": "Your email content here..."
}
```

**Response:**

```json
{
  "original_email_score": "85%",
  "enhanced_email": "Improved email content...",
  "recommended_subject": "Suggested subject line",
  "key_improvements": [
    "Made the opening more engaging",
    "Added clear call-to-action",
    "Improved professional tone"
  ],
  "analysis": {
    "tone": "professional",
    "clarity": "clear",
    "conciseness": "concise",
    "call_to_action": "present"
  }
}
```

## Adding New AI Tools

To add a new AI tool, follow this pattern:

1. **Create a new service** in `services/`:

   ```python
   # services/new_ai_service.py
   class NewAIService:
       def process_request(self, data, request_id):
           # AI processing logic
           pass
   ```

2. **Create new routes** in `routes/`:

   ```python
   # routes/new_tool_routes.py
   from flask import Blueprint
   from services.new_ai_service import NewAIService

   new_tool_bp = Blueprint('new_tool', __name__)
   new_ai_service = NewAIService()

   @new_tool_bp.route('/process', methods=['POST'])
   def process():
       # Route logic
       pass
   ```

3. **Register the blueprint** in `app.py`:

   ```python
   from routes.new_tool_routes import new_tool_bp

   app.register_blueprint(new_tool_bp, url_prefix='/api/new-tool')
   ```

## Error Handling

The API uses standardized error responses:

```json
{
  "error": "Error message",
  "details": {
    "additional_info": "Optional details"
  }
}
```

Common HTTP status codes:

- `200` - Success
- `400` - Bad Request (validation errors)
- `500` - Internal Server Error

## Logging

The API logs all requests and responses to both console and `api.log` file. Logs include:

- Request IDs for tracking
- API key status (first 8 characters only)
- Request/response lengths (for privacy)
- Error details

## Development

### Running in Development Mode

```bash
python api/app.py
```

### Testing Endpoints

```bash
# Health check
curl http://localhost:5000/api/test

# Email enhancement
curl -X POST http://localhost:5000/api/email/enhance \
  -H "Content-Type: application/json" \
  -d '{"email_content": "Test email content"}'
```

## Architecture Benefits

1. **Modularity**: Each component has a single responsibility
2. **Scalability**: Easy to add new AI tools and services
3. **Maintainability**: Clear separation of concerns
4. **Testability**: Services can be tested independently
5. **Reusability**: Common utilities and helpers
6. **Error Handling**: Standardized error responses
7. **Logging**: Comprehensive request tracking
