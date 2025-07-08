"use client"

import React from "react"
import { Button } from "@/components/ui/button"
import { ChevronDown, Cpu, Globe } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export type AIModel = "deepseek-api" | "local-deepseek-r1" | "local-llama3"

interface ModelSelectorProps {
  selectedModel: AIModel
  onModelChange: (model: AIModel) => void
}

export function ModelSelector({ selectedModel, onModelChange }: ModelSelectorProps) {
  const isDevelopment = process.env.NODE_ENV === 'development'
  
  const models = [
    {
      id: "deepseek-api" as AIModel,
      name: "DeepSeek API",
      description: "Cloud-based AI model",
      icon: Globe,
      alwaysVisible: true,
    },
    {
      id: "local-deepseek-r1" as AIModel,
      name: "Local DeepSeek R1",
      description: "Local Ollama model",
      icon: Cpu,
      alwaysVisible: false,
    },
    {
      id: "local-llama3" as AIModel,
      name: "Local Llama 3",
      description: "Local Ollama model",
      icon: Cpu,
      alwaysVisible: false,
    },
  ]

  // Filter models based on environment
  const visibleModels = models.filter(model => model.alwaysVisible || isDevelopment)
  
  const selectedModelData = visibleModels.find(model => model.id === selectedModel) || models[0]
  const IconComponent = selectedModelData?.icon || Globe

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <IconComponent className="h-4 w-4" />
          {selectedModelData?.name}
          <ChevronDown className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        {visibleModels.map((model) => {
          const ModelIcon = model.icon
          return (
            <DropdownMenuItem
              key={model.id}
              onClick={() => onModelChange(model.id)}
              className="flex items-center gap-3 cursor-pointer"
            >
              <ModelIcon className="h-4 w-4" />
              <div className="flex flex-col">
                <span className="font-medium">{model.name}</span>
                <span className="text-xs text-muted-foreground">{model.description}</span>
              </div>
            </DropdownMenuItem>
          )
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  )
} 