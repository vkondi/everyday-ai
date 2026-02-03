# Ollama Setup Guide

This guide will help you set up Ollama with local AI models for offline processing.

## Prerequisites

- Windows 10/11, macOS, or Linux
- At least 8GB RAM (16GB recommended)
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

### 2. Pull the Models

Open a terminal/command prompt and run the following commands:

#### DeepSeek R1 Model

```bash
ollama pull deepseek-r1
```

This will download the DeepSeek R1 model (approximately 8GB).

#### Llama 3 Model

```bash
ollama pull llama3
```

This will download the Llama 3 model (approximately 4GB).

### 3. Verify Installation

Check if the models are available:

```bash
ollama list
```

You should see both `deepseek-r1` and `llama3` in the list.

### 4. Test the Models

Test each model with a simple prompt:

```bash
# Test DeepSeek R1
ollama run deepseek-r1 "Hello, how are you?"

# Test Llama 3
ollama run llama3 "Hello, how are you?"
```

## Usage in Everyday AI

1. Start Ollama (it should run automatically after installation)
2. Open the Everyday AI application
3. In the header, click on the model selector
4. Choose from the available options:
   - **DeepSeek API**: Cloud-based model (always available)
   - **Local DeepSeek R1**: Local DeepSeek model (development only)
   - **Local Llama 3**: Local Llama 3 model (development only)
5. Use any of the AI tools - they will now use your selected model

## Environment-Based Availability

- **Development**: All models are available (DeepSeek API, Local DeepSeek R1, Local Llama 3)
- **Production**: Only DeepSeek API is available (local models are hidden)

## Troubleshooting

### Ollama not starting

- Check if Ollama is running: `ollama serve`
- On Windows, check if the service is running in Task Manager

### Models not found

- Pull the models again:
  ```bash
  ollama pull deepseek-r1
  ollama pull llama3
  ```
- Check available models: `ollama list`

### Connection errors

- Ensure Ollama is running on `http://localhost:11434`
- Check firewall settings
- Restart Ollama if needed

### Performance issues

- Close other applications to free up RAM
- Consider using only one model at a time
- Ensure you have adequate cooling for your system
- Llama 3 is generally faster than DeepSeek R1

## Model Information

### DeepSeek R1

- **Model**: DeepSeek R1
- **Size**: ~8GB
- **RAM Usage**: ~4-6GB during inference
- **Speed**: Varies by hardware, typically 10-30 tokens/second on CPU
- **Best for**: Complex reasoning, detailed analysis

### Llama 3

- **Model**: Llama 3
- **Size**: ~4GB
- **RAM Usage**: ~2-4GB during inference
- **Speed**: Generally faster than DeepSeek R1
- **Best for**: General tasks, faster responses

## Model Selection Tips

- **For Email Enhancement**: Both models work well, but DeepSeek R1 may provide more nuanced analysis
- **For Travel Planning**: Llama 3 is faster and may be sufficient for itinerary generation
- **For Privacy**: Both local models provide the same privacy benefits
- **For Speed**: Llama 3 is generally faster than DeepSeek R1

## Support

If you encounter issues:

1. Check the [Ollama documentation](https://ollama.ai/docs)
2. Visit the [Ollama GitHub repository](https://github.com/ollama/ollama)
3. Check the model cards for [DeepSeek R1](https://ollama.ai/library/deepseek-r1) and [Llama 3](https://ollama.ai/library/llama3)
