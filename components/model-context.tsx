"use client"

import React, { createContext, useContext, useState, ReactNode } from "react"
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

  return (
    <ModelContext.Provider value={{ selectedModel, setSelectedModel }}>
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