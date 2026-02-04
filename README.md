# Everyday AI - Your Personal AI Assistant

Transform your daily tasks with intelligent AI-powered tools designed to enhance productivity, streamline workflows, and make complex tasks simple.

## ✨ What is Everyday AI?

Everyday AI is a comprehensive suite of intelligent tools that bring the power of artificial intelligence to your everyday activities. Whether you're crafting professional emails, planning your next adventure, or staying informed with curated news, our AI assistants are here to help you work smarter, not harder.

## 🚀 Featured Tools

### 📧 Smart Email Assistant

**Transform your communication with AI-powered email enhancement**

- **Tone Analysis & Enhancement**: AI analyzes email tone and provides professional suggestions for better communication
- **Smart Subject Lines**: Generate compelling, click-worthy subject lines that improve open rates

_Perfect for: Business communication, client emails, job applications, and personal correspondence_

### 🗺️ Travel Itinerary Builder

**Plan your dream vacation with AI-powered recommendations**

- **Personalized Planning**: AI-curated itineraries with destination recommendations and activity scheduling
- **Budget Optimization**: Smart cost management with daily breakdowns and travel details

_Perfect for: Vacation planning, business trips, weekend getaways, and bucket list adventures_

### 📰 News Digest

**Stay informed with AI-curated news summaries**

- **Personalized News Feed**: AI-curated summaries tailored to your interests with regional content
- **Smart Filtering**: Category-based news selection with noise filtering for relevant stories

_Perfect for: Staying informed, industry research, market analysis, and general knowledge_

## 🎯 Why Choose Everyday AI?

### 🤖 Intelligent Assistance

Our AI tools understand context and provide personalized recommendations that adapt to your specific needs and preferences.

### ⚡ Instant Results

No waiting, no complex setup. Get professional-quality results in seconds, not hours.

### 🔒 Privacy First

Your data is processed securely and never stored on our servers. We prioritize your privacy in everything we do.

### 📱 Works Everywhere

Access your AI assistants from any device - desktop, tablet, or mobile. Responsive design ensures a great experience on all screen sizes.

### 🎨 Beautiful Interface

Clean, modern design that makes using AI tools feel natural and intuitive. No steep learning curves here.

## 🛠️ How It Works

1. **Choose Your AI Model**: Select between cloud models or locally installed Ollama models
2. **Choose Your Tool**: Select from our suite of AI-powered assistants
3. **Input Your Content**: Provide the information you want to enhance or analyze
4. **Get AI Insights**: Receive intelligent suggestions and improvements
5. **Apply & Improve**: Use the recommendations to create better results

## 🚀 Getting Started

### Prerequisites

- **Node.js 18+**: For running the Next.js frontend
- **Python 3.8+**: For the Flask backend
- **Git**: For cloning the repository

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/vkondi/everyday-ai.git
   cd everyday-ai
   ```

2. **Install frontend dependencies**

   ```bash
   npm install
   ```

3. **Install Python dependencies**

   ```bash
   pip install -r requirements.txt
   ```

4. **Set up environment variables**

   Create a `.env.local` file in the root directory:

   ```bash
   # Cloud AI Model API Keys
   DEEPSEEK_API_KEY=your_deepseek_api_key_here
   GEMINI_API_KEY=your_gemini_api_key_here

   # Optional: Analytics
   CLOUDFLARE_WEB_ANALYTICS_TOKEN=your_cloudflare_analytics_token
   ```

5. **Start the development servers**

   ```bash
   # Run both frontend and backend simultaneously
   npm run dev

   # Or run them separately:
   # Terminal 1: Frontend
   npm run next-dev

   # Terminal 2: Backend
   npm run flask-dev
   ```

6. **Open your browser**

   Navigate to `http://localhost:3000` to access the application. The Flask API will be running on port 5328.

### Optional: Local AI Models Setup

For privacy-focused, offline AI processing (development only):

1. **Install Ollama** - See [OLLAMA_SETUP.md](docs/OLLAMA_SETUP.md) for detailed instructions
2. **Pull any Ollama model** - Visit [ollama.ai/models](https://ollama.ai/models) to choose models
3. **Models will be automatically available in development mode**

## 🤖 AI Model Options

- **Cloud Models**: API-based models like DeepSeek, Google Gemini, etc. - instant responses, requires API keys
- **Local Models**: Any Ollama model installed locally - offline processing, privacy-focused, development only

**Learn more**: See [OLLAMA_SETUP.md](docs/OLLAMA_SETUP.md) for local model setup and configuration

## 🛠️ Tech Stack

- **Frontend**: Next.js 16+ with React 19.0.0, TypeScript, Tailwind CSS v4
- **Backend**: Python Flask 3.1.1, support for multiple AI providers via APIs, Ollama integration
- **UI/UX**: Radix UI components, Lucide React icons, responsive design
- **Deployment**: Vercel hosting with SEO optimization

**Note**: Tech stack versions may differ. Check `package.json` and `requirements.txt` for exact versions.

## 🎨 User Experience Highlights

### Responsive Design

- **Desktop**: Full-featured experience with all tools visible
- **Tablet**: Optimized layout for medium screens
- **Mobile**: Touch-friendly interface with intuitive navigation

### Dark Mode Support

- Seamless switching between light and dark themes
- Optimized for all lighting conditions
- Reduces eye strain during extended use

### Accessibility Features

- Keyboard navigation support
- Screen reader compatibility
- High contrast mode support
- Focus indicators for better usability

### Model Selection

- Dynamic model discovery - available models automatically detected
- Persistent model selection across sessions
- Seamless switching between cloud and local models

## 📧 Contact

Have questions, suggestions, or want to contribute? We'd love to hear from you!

- **Email**: [vkondi@gmail.com](mailto:vkondi@gmail.com)
- **GitHub Issues**: [Report a bug or request a feature](https://github.com/vkondi/everyday-ai/issues)

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

_Everyday AI - Making intelligence accessible, one task at a time._ 🚀
