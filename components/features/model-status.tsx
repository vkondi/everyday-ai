"use client"

import React, { useState, useEffect } from "react"
import { Badge } from "@/components/ui/badge"
import { Globe, Cpu, CheckCircle, XCircle, AlertCircle } from "lucide-react"

interface ModelStatus {
  available: boolean
  type: string
  description: string
  requires?: string
}

interface ModelsResponse {
  models: {
    "deepseek-api": ModelStatus
    "local-deepseek-r1": ModelStatus
    "local-llama3": ModelStatus
  }
  ollama_service: {
    available: boolean
    status: string
    environment: string
  }
  environment: string
}

export function ModelStatus() {
  const [modelStatus, setModelStatus] = useState<ModelsResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const isDevelopment = process.env.NODE_ENV === 'development'

  useEffect(() => {
    const checkModels = async () => {
      try {
        const response = await fetch('/api/models')
        if (response.ok) {
          const data = await response.json() as ModelsResponse
          setModelStatus(data)
        } else {
          setError('Failed to check model status')
        }
      } catch (err) {
        console.error('Error checking model status:', err)
        setError('Network error checking model status')
      } finally {
        setLoading(false)
      }
    }

    checkModels()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center space-x-2">
        <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse"></div>
        <span className="text-xs text-muted-foreground">Checking models...</span>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center space-x-2">
        <AlertCircle className="w-3 h-3 text-orange-500" />
        <span className="text-xs text-muted-foreground">Model status unavailable</span>
      </div>
    )
  }

  if (!modelStatus) return null

  const { models, ollama_service } = modelStatus

  return (
    <div className="flex items-center space-x-2">
      {/* DeepSeek API Status */}
      <div className="flex items-center space-x-1">
        <Globe className="w-3 h-3" />
        <Badge 
          variant={models["deepseek-api"].available ? "default" : "secondary"}
          className="text-xs h-5"
        >
          {models["deepseek-api"].available ? (
            <CheckCircle className="w-2 h-2 mr-1" />
          ) : (
            <XCircle className="w-2 h-2 mr-1" />
          )}
          API
        </Badge>
      </div>

      {/* Local Models Status (only show in development) */}
      {isDevelopment && ollama_service.available && (
        <div className="flex items-center space-x-1">
          <Cpu className="w-3 h-3" />
          <Badge 
            variant={models["local-deepseek-r1"].available || models["local-llama3"].available ? "default" : "secondary"}
            className="text-xs h-5"
          >
            {models["local-deepseek-r1"].available || models["local-llama3"].available ? (
              <CheckCircle className="w-2 h-2 mr-1" />
            ) : (
              <XCircle className="w-2 h-2 mr-1" />
            )}
            Local
          </Badge>
        </div>
      )}
    </div>
  )
}
