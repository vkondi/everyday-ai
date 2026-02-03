'use client';

import { createContext, useContext, useState, useCallback } from 'react';
import type { ReactNode } from 'react';
import type { AIModel } from '@/components/features/model-selector';

interface ModelContextType {
  selectedModel: AIModel;
  setSelectedModel: (model: AIModel) => void;
}

const ModelContext = createContext<ModelContextType | undefined>(undefined);

export function ModelProvider({ children }: { children: ReactNode }) {
  // Set default model based on environment
  const isDevelopment = process.env.NODE_ENV === 'development';
  const defaultModel: AIModel = isDevelopment ? 'deepseek-api' : 'deepseek-api';

  const [selectedModel, setSelectedModel] = useState<AIModel>(() => {
    // Initialize from localStorage during render (safe for SSR as localStorage is guarded)
    if (typeof window !== 'undefined') {
      const storedModel = localStorage?.getItem('everyday-ai-model') as AIModel;
      if (
        storedModel &&
        ['deepseek-api', 'local-deepseek-r1', 'local-llama3'].includes(storedModel)
      ) {
        return storedModel;
      }
    }
    return defaultModel;
  });

  const handleSetSelectedModel = useCallback((model: AIModel) => {
    localStorage?.setItem('everyday-ai-model', model);
    setSelectedModel(model);
  }, []);

  const value = {
    selectedModel,
    setSelectedModel: handleSetSelectedModel,
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
