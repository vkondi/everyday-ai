"use client"

import { useModel } from "@/components/context/model-context"
import { ModelSelector } from "@/components/features/model-selector"
import { ThemeToggle } from "@/components/features/theme-toggle"



export function Header() {
  const { selectedModel, setSelectedModel } = useModel()

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="max-w-7xl mx-auto flex h-16 items-center justify-between px-4 md:px-6 lg:px-8">
        <div className="flex items-center space-x-2">
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight bg-gradient-to-r from-amber-600 to-amber-800 bg-clip-text text-transparent">
            Everyday AI
          </h1>
        </div>
        <div className="flex items-center space-x-4">
          <ModelSelector selectedModel={selectedModel} onModelChange={setSelectedModel} />
          <ThemeToggle />
        </div>
      </div>
    </header>
  )
} 