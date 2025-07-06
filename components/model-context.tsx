"use client"

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react"
import { AIModel } from "./model-selector"

interface ModelContextType {
  selectedModel: AIModel
  setSelectedModel: (model: AIModel) => void
}

const ModelContext = createContext<ModelContextType | undefined>(undefined)

export function ModelProvider({ children }: { children: ReactNode }) {
  // Set default model based on environment
  const isDevelopment = process.env.NODE_ENV === 'development'
  const defaultModel: AIModel = isDevelopment ? "deepseek-api" : "deepseek-api"
  
  const [selectedModel, setSelectedModel] = useState<AIModel>(defaultModel)
  const [mounted, setMounted] = useState(false)

  // Load model from localStorage on mount
  useEffect(() => {
    setMounted(true)
    const storedModel = localStorage?.getItem('everyday-ai-model') as AIModel
    if (storedModel && ['deepseek-api', 'local-deepseek-r1', 'local-llama3'].includes(storedModel)) {
      setSelectedModel(storedModel)
    }
  }, [])

  const value = {
    selectedModel,
    setSelectedModel: (model: AIModel) => {
      if (mounted) {
        localStorage?.setItem('everyday-ai-model', model)
      }
      setSelectedModel(model)
    },
  }

  return (
    <ModelContext.Provider value={value}>
      {children}
    </ModelContext.Provider>
  )
}

export function useModel() {
  const context = useContext(ModelContext)
  if (context === undefined) {
    throw new Error("useModel must be used within a ModelProvider")
  }
  return context
} 