# Ollama Setup Guide

This guide will help you set up Ollama with local AI models for the Everyday AI application.

## Prerequisites

- Windows 10/11, macOS, or Linux
- At least 8GB RAM (16GB recommended for optimal performance)
- At least 20GB free disk space (for multiple models)

## Installation

### 1. Install Ollama

Visit [ollama.ai](https://ollama.ai) and download the installer for your operating system.

**Windows:**

- Download the Windows installer
- Run the installer and follow the prompts
- Ollama will be available at `http://localhost:11434`

**macOS:**

- Download the macOS installer
- Drag Ollama to Applications folder
- Start Ollama from Applications

**Linux:**

```bash
curl -fsSL https://ollama.ai/install.sh | sh
```

### 2. Pull Models

Open a terminal/command prompt and pull any Ollama models you want to use. Visit [ollama.ai/models](https://ollama.ai/models) to browse available models.

Example commands:

```bash
# Pull a model
ollama pull <model-name>

# Examples:
ollama pull llama2
ollama pull mistral
ollama pull neural-chat
```

### 3. Verify Installation

Check available models:

```bash
ollama list
```

This will show all installed models and their size.

### 4. Test the Models

Test any model with a simple prompt:

```bash
ollama run <model-name> "Hello, how are you?"
```

## How Everyday AI Uses Ollama

The Everyday AI application **automatically detects** any locally installed Ollama models:

1. **On startup**: The application connects to `http://localhost:11434` and discovers which models are available
2. **Dynamic model list**: The model selector dropdown shows only the models that are actually installed
3. **Smart selection**: The first available cloud model is selected by default, but you can switch to any installed local models

### Model Discovery Process

- Application starts → ModelProvider fetches models from `/api/health/models` → Models are cached → Model selector displays available options
- If Ollama is not running, local models are hidden and only cloud models are shown
- If a model becomes unavailable, the app automatically falls back to a cloud model
- Works with **any Ollama model** - you're not limited to specific models

## Usage in Everyday AI

1. **Start Ollama** (it runs on `http://localhost:11434` by default)
2. **Open the Everyday AI application** in your browser
3. **Click the model selector** in the header
4. **Choose your model**:
   - **Cloud Models** (always available):
     - DeepSeek API
     - Gemini (if configured)
   - **Local Models** (shown only if Ollama is running):
     - Local DeepSeek R1 (if installed)
     - Local Llama 3 (if installed)
5. **Use any AI tool** - the selected model will be used automatically
6. **Model selection persists** across page navigation and browser sessions
7. **Switch models anytime** using the model selector dropdown

## Environment-Based Behavior

- **Development**:
  - Cloud models always available
  - Local models shown if Ollama is running with discovered models
  - Model selection persists via localStorage
- **Production**:
  - Only cloud models are available
  - Local models are completely hidden
  - No Ollama connection attempted

## Troubleshooting

### Ollama not detected

**Symptoms**: Only cloud models appear in the dropdown

**Solution**:

- Ensure Ollama is running: `ollama serve`
- Verify Ollama is at `http://localhost:11434`
- Check if models are installed: `ollama list`
- Restart Ollama if needed

### "Failed to load models" error in browser

**Symptoms**: Model selector shows error message

**Solution**:

- Open browser DevTools (F12)
- Check Console tab for error details
- Verify API is running: `curl http://localhost:5328/api/health/models`
- Check that Ollama is accessible at `http://localhost:11434`

### Models not appearing after pulling new models

**Symptoms**: New model installed but doesn't show in dropdown

**Solution**:

- Refresh the browser page
- The app caches models on startup - a page refresh will reload the cache
- Verify model is available: `ollama list`

### Connection errors to Ollama

**Symptoms**: Error messages about connecting to localhost:11434

**Solution**:

- Ensure Ollama is running
- Check firewall settings allow local connections
- Verify nothing else is using port 11434
- On Windows, check if Ollama service is running in Task Manager
- Restart both Ollama and the application

### Performance issues with local models

**Symptoms**: Slow responses or high CPU/memory usage

**Solution**:

- Close other applications to free up resources
- Consider using only one model at a time
- Ensure adequate system cooling
- Llama 3 (7B) is generally faster than DeepSeek R1
- Monitor resource usage while running models

## Model Information

**What models can I use?**

Any model available on [ollama.ai/models](https://ollama.ai/models) can be used with Everyday AI. Popular options include:

- **Llama 2/3** - Versatile general-purpose models
- **Mistral** - Fast, efficient models
- **Neural Chat** - Conversational models
- **Phi** - Lightweight, fast models
- **Dolphin** - Instruction-tuned models
- And many more...

**Choosing a model:**

When selecting a model, consider:

- **Model Size**: Larger models (7B+) provide better quality but need more RAM
- **Speed**: Smaller models are faster but may have lower quality
- **RAM Requirements**: Check model specs before downloading
- **Task Suitability**: Some models excel at specific tasks (code, reasoning, chat)

Visit [ollama.ai/models](https://ollama.ai/models) to explore models and their specifications.

## Model Selection Tips

- **For First-Time Users**: Start with a smaller model (3-7B) like Llama 2 or Mistral
- **For Better Quality**: Use larger models (7B+) if your hardware supports it
- **For Privacy**: All local models keep data entirely on your machine (offline)
- **For Speed**: Smaller models respond faster
- **For Quality**: Larger models provide better reasoning and analysis
- **For Experimentation**: Try different models to find what works best for your needs

The beauty of Ollama is flexibility - install whatever models suit your needs and the app will automatically detect and use them.

## API Integration Details

The application's backend discovers models by:

1. Querying Ollama's `/api/tags` endpoint on startup
2. Generating dynamic model IDs (e.g., `deepseek-r1` → `local-deepseek-r1`)
3. Storing configuration in the OllamaService
4. Exposing via `/api/health/models` endpoint
5. Frontend caches models in React Context for instant access

## Support

If you encounter issues:

1. **Check logs**: Look in browser console (F12) and terminal where you started the app
2. **Verify Ollama**: Run `ollama list` to confirm models are installed
3. **Test connectivity**: Use `curl http://localhost:11434/api/tags` to test Ollama directly
4. **Restart services**: Stop and restart both Ollama and the Everyday AI application
5. **Check network**: Ensure local connections aren't blocked by firewall

6. Check the [Ollama documentation](https://ollama.ai/docs)
7. Visit the [Ollama GitHub repository](https://github.com/ollama/ollama)
8. Check the model cards for [DeepSeek R1](https://ollama.ai/library/deepseek-r1) and [Llama 3](https://ollama.ai/library/llama3)
