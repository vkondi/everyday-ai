'use client';

import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { AIModel } from '@/components/features/model-selector';

interface ModelInfo {
  id: string;
  name: string;
  description: string;
  available: boolean;
  type: 'cloud' | 'local';
}

interface ModelContextType {
  selectedModel: AIModel;
  setSelectedModel: (model: AIModel) => void;
  availableModels: ModelInfo[];
  isLoadingModels: boolean;
  modelsError: string | null;
}

interface HealthResponse {
  models: {
    [key: string]: {
      available: boolean;
      type: 'cloud' | 'local';
      description: string;
      requires?: string;
    };
  };
  ollama_service?: {
    available: boolean;
    discovered_models_count?: number;
  };
}

const ModelContext = createContext<ModelContextType | undefined>(undefined);

// Helper function to format model names
function formatModelName(id: string): string {
  return id
    .split('-')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}

export function ModelProvider({ children }: { children: ReactNode }) {
  const defaultModel: AIModel = 'deepseek-api';

  // Models state - fetched once and cached
  const [availableModels, setAvailableModels] = useState<ModelInfo[]>([]);
  const [isLoadingModels, setIsLoadingModels] = useState(true);
  const [modelsError, setModelsError] = useState<string | null>(null);

  // Selected model state
  const [selectedModel, setSelectedModelState] = useState<AIModel>(() => {
    if (typeof window !== 'undefined') {
      const storedModel = localStorage?.getItem('everyday-ai-model') as AIModel;
      if (storedModel) {
        return storedModel;
      }
    }
    return defaultModel;
  });

  // Fetch models once on mount
  useEffect(() => {
    const fetchModels = async () => {
      try {
        setIsLoadingModels(true);
        setModelsError(null);

        const response = await fetch('/api/health/models');

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const data: HealthResponse = await response.json();

        if (!data.models || typeof data.models !== 'object') {
          throw new Error('Invalid response format from API');
        }

        // Transform API response to ModelInfo format
        const fetchedModels: ModelInfo[] = Object.entries(data.models).map(([id, modelData]) => ({
          id,
          name: formatModelName(id),
          description: modelData.description || 'AI Model',
          available: modelData.available,
          type: modelData.type || 'cloud',
        }));

        setAvailableModels(fetchedModels);

        // If stored model is no longer available, reset to first cloud model
        const cloudModels = fetchedModels.filter((m) => m.type === 'cloud');
        const isStoredModelValid = fetchedModels.some((m) => m.id === selectedModel);
        if (!isStoredModelValid && cloudModels.length > 0) {
          const firstCloudModel = cloudModels[0]?.id || defaultModel;
          setSelectedModelState(firstCloudModel);
          localStorage?.setItem('everyday-ai-model', firstCloudModel);
        }
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : 'Failed to load models';
        console.error('[ModelProvider] Error loading models:', errorMsg);
        setModelsError(errorMsg);
      } finally {
        setIsLoadingModels(false);
      }
    };

    fetchModels();
  }, []); // Empty dependency array - fetch only once

  const handleSetSelectedModel = useCallback((model: AIModel) => {
    localStorage?.setItem('everyday-ai-model', model);
    setSelectedModelState(model);
  }, []);

  const value = {
    selectedModel,
    setSelectedModel: handleSetSelectedModel,
    availableModels,
    isLoadingModels,
    modelsError,
  };

  return <ModelContext.Provider value={value}>{children}</ModelContext.Provider>;
}

export function useModel() {
  const context = useContext(ModelContext);
  if (context === undefined) {
    throw new Error('useModel must be used within a ModelProvider');
  }
  return context;
}
