"use client"

import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ChevronLeft, ChevronRight } from "lucide-react"

interface FeatureCard {
  icon: React.ComponentType<{ className?: string }>
  badge: string
  title: string
  description: string
}

interface FeatureCardsProps {
  cards: FeatureCard[]
  className?: string
}

export function FeatureCards({ cards, className = "" }: FeatureCardsProps) {
  const [currentCardIndex, setCurrentCardIndex] = useState(0)

  const nextCard = () => {
    setCurrentCardIndex((prev) => (prev + 1) % cards.length)
  }

  const prevCard = () => {
    setCurrentCardIndex((prev) => (prev - 1 + cards.length) % cards.length)
  }

  return (
    <div className={`mb-12 ${className}`}>
      {/* Desktop/Tablet Grid View */}
      <div className="hidden md:grid md:grid-cols-3 gap-6">
        {cards.map((card, index) => (
          <Card key={index} className="border-amber-200 dark:border-amber-800">
            <CardHeader className="pb-3">
              <div className="flex items-center space-x-2">
                <div className="w-10 h-10 bg-amber-100 dark:bg-amber-900/20 rounded-lg flex items-center justify-center">
                  <card.icon className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                </div>
                <Badge variant="secondary" className="bg-amber-100 dark:bg-amber-900/20 text-amber-700 dark:text-amber-300">
                  {card.badge}
                </Badge>
              </div>
              <CardTitle className="text-lg">{card.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-sm">
                {card.description}
              </CardDescription>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Mobile Carousel View */}
      <div className="md:hidden">
        <div className="relative">
          <div className="flex justify-center">
            <Card className="border-amber-200 dark:border-amber-800 max-w-md w-full">
              <CardHeader className="pb-3">
                <div className="flex items-center space-x-2">
                  <div className="w-10 h-10 bg-amber-100 dark:bg-amber-900/20 rounded-lg flex items-center justify-center">
                    {(() => {
                    const IconComponent = cards[currentCardIndex].icon;
                    return <IconComponent className="h-5 w-5 text-amber-600 dark:text-amber-400" />;
                  })()}
                  </div>
                  <Badge variant="secondary" className="bg-amber-100 dark:bg-amber-900/20 text-amber-700 dark:text-amber-300">
                    {cards[currentCardIndex].badge}
                  </Badge>
                </div>
                <CardTitle className="text-lg">{cards[currentCardIndex].title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-sm">
                  {cards[currentCardIndex].description}
                </CardDescription>
              </CardContent>
            </Card>
          </div>
          
          {/* Carousel Navigation */}
          <div className="flex justify-center items-center mt-4 space-x-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={prevCard}
              className="h-8 w-8 p-0"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            
            <div className="flex space-x-2">
              {cards.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentCardIndex(index)}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    index === currentCardIndex
                      ? 'bg-amber-600 dark:bg-amber-400'
                      : 'bg-gray-300 dark:bg-gray-600'
                  }`}
                />
              ))}
            </div>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={nextCard}
              className="h-8 w-8 p-0"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
} 