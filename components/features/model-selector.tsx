'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { ChevronDown, Cpu, Globe, AlertCircle, Loader2 } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { useModel } from '@/components/context/model-context';

export type AIModel = string;

interface ModelSelectorProps {
  selectedModel: AIModel;
  onModelChange: (model: AIModel) => void;
}

export function ModelSelector({ selectedModel, onModelChange }: ModelSelectorProps) {
  const { availableModels: models, isLoadingModels: isLoading, modelsError: error } = useModel();
  const ollamaAvailable = models.some((m) => m.type === 'local' && m.available);

  // Get icon based on model type
  const getIcon = (modelType: 'cloud' | 'local') => {
    return modelType === 'local' ? Cpu : Globe;
  };

  // Find selected model data
  const selectedModelData = models.find((model) => model.id === selectedModel);
  const displayName = selectedModelData?.name || 'Select Model';
  const IconComponent = selectedModelData ? getIcon(selectedModelData.type) : Globe;

  // Separate cloud and local models
  const cloudModels = models.filter((m) => m.type === 'cloud');
  const localModels = models.filter((m) => m.type === 'local' && m.available);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : error ? (
            <AlertCircle className="h-4 w-4" />
          ) : (
            <IconComponent className="h-4 w-4" />
          )}
          {displayName}
          <ChevronDown className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64">
        {isLoading ? (
          <div className="px-2 py-6 text-center">
            <Loader2 className="h-4 w-4 animate-spin mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">Loading models...</p>
          </div>
        ) : error ? (
          <div className="px-2 py-4 text-center">
            <AlertCircle className="h-4 w-4 mx-auto mb-2 text-red-500" />
            <p className="text-sm text-red-500 font-semibold">Failed to load models</p>
            <p className="text-xs text-muted-foreground mt-2">{error}</p>
            <p className="text-xs text-muted-foreground mt-2 border-t pt-2">
              Using fallback cloud models. Check browser console for details.
            </p>
          </div>
        ) : models.length === 0 ? (
          <div className="px-2 py-4 text-center">
            <p className="text-sm text-muted-foreground">No models available</p>
          </div>
        ) : (
          <>
            {/* Cloud Models Section */}
            {cloudModels.length > 0 && (
              <>
                <div className="px-2 py-1.5">
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Cloud Models
                  </p>
                </div>
                {cloudModels.map((model) => (
                  <DropdownMenuItem
                    key={model.id}
                    onClick={() => onModelChange(model.id)}
                    className="flex items-center gap-3 cursor-pointer"
                  >
                    <Globe className="h-4 w-4 text-blue-500" />
                    <div className="flex flex-col flex-1">
                      <span className="font-medium">{model.name}</span>
                      <span className="text-xs text-muted-foreground">{model.description}</span>
                    </div>
                    {!model.available && <AlertCircle className="h-3 w-3 text-yellow-500" />}
                  </DropdownMenuItem>
                ))}
              </>
            )}

            {/* Local Models Section */}
            {localModels.length > 0 && (
              <>
                {cloudModels.length > 0 && <DropdownMenuSeparator />}
                <div className="px-2 py-1.5">
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Local Models {localModels.length > 0 && `(${localModels.length})`}
                  </p>
                </div>
                {localModels.map((model) => (
                  <DropdownMenuItem
                    key={model.id}
                    onClick={() => onModelChange(model.id)}
                    className="flex items-center gap-3 cursor-pointer"
                  >
                    <Cpu className="h-4 w-4 text-green-600" />
                    <div className="flex flex-col flex-1">
                      <span className="font-medium">{model.name}</span>
                      <span className="text-xs text-muted-foreground">{model.description}</span>
                    </div>
                  </DropdownMenuItem>
                ))}
              </>
            )}

            {/* Ollama Status */}
            {!ollamaAvailable && localModels.length === 0 && (
              <>
                {cloudModels.length > 0 && <DropdownMenuSeparator />}
                <div className="px-2 py-2 text-center">
                  <p className="text-xs text-muted-foreground">
                    No local models available. Start Ollama to use local models.
                  </p>
                </div>
              </>
            )}
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
