"use client"

import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import { PageLayout } from "@/components/page-layout"
import { PageHeader } from "@/components/page-header"
import { FeatureCards } from "@/components/feature-cards"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MapPin, Plane, Calendar, DollarSign, Loader2, Shield, Trash2 } from "lucide-react"
import { useModel } from "@/components/model-context"
import { getUserFriendlyError, handleApiError, validateJsonResponse } from "@/components/utils/error-utils"

interface TravelActivity {
  time: string;
  description: string;
  type: string;
  cost: string;
  location: string;
}

interface DailyItinerary {
  day: number;
  date: string;
  weather: string;
  activities: TravelActivity[];
}

interface BudgetBreakdown {
  accommodation: string;
  food: string;
  activities: string;
  transportation: string;
  other: string;
}

interface TravelItineraryResult {
  destination: string;
  total_cost: string;
  budget_status: string;
  daily_itinerary: DailyItinerary[];
  travel_tips: string[];
  budget_breakdown: BudgetBreakdown;
}

export default function TravelItineraryPage() {
  const { selectedModel } = useModel()
  const [destination, setDestination] = useState("")
  const [budget, setBudget] = useState("")
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")
  const [travelers, setTravelers] = useState("1")
  const [preferences, setPreferences] = useState<string[]>([])
  const [isProcessing, setIsProcessing] = useState(false)
  const [results, setResults] = useState<TravelItineraryResult | null>(null)
  const [error, setError] = useState<string | null>(null)

  // Get today's date in YYYY-MM-DD format for minimum date validation
  const today = new Date().toISOString().split('T')[0]

  // Calculate minimum end date based on start date
  const getMinEndDate = () => {
    if (!startDate) return today
    const start = new Date(startDate)
    const nextDay = new Date(start)
    nextDay.setDate(start.getDate() + 1)
    return nextDay.toISOString().split('T')[0]
  }

  // Calculate maximum start date based on end date
  const getMaxStartDate = () => {
    if (!endDate) return ""
    const end = new Date(endDate)
    const prevDay = new Date(end)
    prevDay.setDate(end.getDate() - 1)
    return prevDay.toISOString().split('T')[0]
  }

  // Handle start date change
  const handleStartDateChange = (date: string) => {
    setStartDate(date)
    // If end date is before or equal to new start date, clear it
    if (endDate && date && endDate <= date) {
      setEndDate("")
    }
  }

  // Handle end date change
  const handleEndDateChange = (date: string) => {
    setEndDate(date)
  }

  // Check if current date selection is valid
  const isDateSelectionValid = () => {
    if (!startDate || !endDate) return true
    return startDate < endDate
  }

  // Validate form data
  const validateForm = () => {
    if (!destination.trim()) {
      return "Please enter a destination"
    }
    if (!budget || parseInt(budget) <= 0) {
      return "Please enter a valid budget amount"
    }
    if (!startDate) {
      return "Please select a start date"
    }
    if (!endDate) {
      return "Please select an end date"
    }
    if (startDate >= endDate) {
      return "End date must be after start date"
    }
    if (!travelers || parseInt(travelers) < 1) {
      return "Please enter a valid number of travelers"
    }
    if (preferences.length === 0) {
      return "Please select at least one travel preference"
    }
    return null
  }



  const featureCards = [
    {
      icon: MapPin,
      badge: "Smart Planning",
      title: "AI-Powered Destination Planning",
      description: "Get personalized recommendations for attractions, restaurants, and activities based on your preferences and budget."
    },
    {
      icon: DollarSign,
      badge: "Budget Optimization",
      title: "Intelligent Budget Management",
      description: "AI analyzes costs and suggests optimal spending allocation across accommodation, food, activities, and transportation."
    },
    {
      icon: Calendar,
      badge: "Perfect Timing",
      title: "Optimal Activity Scheduling",
      description: "Smart scheduling considers weather, opening hours, and crowd levels to maximize your travel experience."
    }
  ]

  const preferenceOptions = [
    { id: "culture", label: "Culture", description: "Museums, historical sites, local traditions" },
    { id: "food", label: "Food", description: "Local cuisine, restaurants, food tours" },
    { id: "adventure", label: "Adventure", description: "Outdoor activities, hiking, water sports" },
    { id: "relaxation", label: "Relaxation", description: "Spa, beaches, peaceful activities" }
  ]

  const handlePreferenceChange = (preferenceId: string) => {
    setPreferences(prev => 
      prev.includes(preferenceId) 
        ? prev.filter(p => p !== preferenceId)
        : [...prev, preferenceId]
    )
  }



  const handleGenerateItinerary = async () => {
    // Validate form first
    const validationError = validateForm()
    if (validationError) {
      setError(validationError)
      return
    }
    
    setIsProcessing(true)
    setError(null)
    setResults(null)
    
    const requestData = {
      destination: destination.trim(),
      budget: parseInt(budget),
      start_date: startDate,
      end_date: endDate,
      travelers: parseInt(travelers),
      preferences: preferences,
      model: selectedModel
    }
    
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 60000);
      
      const response = await fetch('/api/travel/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestData),
        signal: controller.signal
      })
      
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        const errorMessage = await handleApiError(response, 'Failed to generate itinerary')
        throw new Error(errorMessage)
      }
      
      validateJsonResponse(response)
      
      const data = await response.json()
      setResults(data)
    } catch (error) {
      console.error('Error generating itinerary:', error)
      const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred'
      setError(getUserFriendlyError(errorMessage, 'travel'))
    } finally {
      setIsProcessing(false)
    }
  }

  const clearResults = () => {
    setResults(null)
    setError(null)
  }

  const getTypeColor = (type: string) => {
    switch (type.toLowerCase()) {
      case 'culture': return 'bg-purple-100 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300'
      case 'food': return 'bg-orange-100 dark:bg-orange-900/20 text-orange-700 dark:text-orange-300'
      case 'adventure': return 'bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-300'
      case 'relaxation': return 'bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300'
      case 'sightseeing': return 'bg-indigo-100 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-300'
      case 'shopping': return 'bg-pink-100 dark:bg-pink-900/20 text-pink-700 dark:text-pink-300'
      default: return 'bg-gray-100 dark:bg-gray-900/20 text-gray-700 dark:text-gray-300'
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'culture': return '🏛️'
      case 'food': return '🍽️'
      case 'adventure': return '🏔️'
      case 'relaxation': return '🧘'
      case 'sightseeing': return '👁️'
      case 'shopping': return '🛍️'
      default: return '📍'
    }
  }

  const getWeatherIcon = (weather: string) => {
    if (weather.includes('sunny')) return '☀️'
    if (weather.includes('cloudy')) return '☁️'
    if (weather.includes('rainy')) return '🌧️'
    if (weather.includes('partly')) return '⛅'
    return '🌤️'
  }

  return (
    <PageLayout>
      <div className="max-w-6xl mx-auto">
        <PageHeader
          title="Travel Itinerary Builder"
          description="Create personalized travel plans with AI recommendations for destinations, activities, and budget optimization."
        />

        <FeatureCards cards={featureCards} />

          {/* Travel Input Form Section */}
          <Card className="mb-8 border-amber-200 dark:border-amber-800">
            <CardHeader>
              <div className="flex items-center space-x-2">
                <Plane className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                <CardTitle>Plan Your Trip</CardTitle>
              </div>
              <CardDescription>
                Fill in your travel details and preferences to generate a personalized itinerary.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="destination" className="block text-sm font-medium mb-2">
                    Destination *
                  </label>
                  <input
                    id="destination"
                    type="text"
                    placeholder="e.g., Paris, France"
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                  />
                </div>
                
                <div>
                  <label htmlFor="budget" className="block text-sm font-medium mb-2">
                    Budget (USD) *
                  </label>
                  <input
                    id="budget"
                    type="number"
                    min="0"
                    placeholder="e.g., 1000"
                    value={budget}
                    onChange={(e) => setBudget(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                  />
                </div>
                
                <div>
                  <label htmlFor="startDate" className="block text-sm font-medium mb-2">
                    Start Date *
                  </label>
                  <input
                    id="startDate"
                    type="date"
                    min={today}
                    max={getMaxStartDate()}
                    value={startDate}
                    onChange={(e) => handleStartDateChange(e.target.value)}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 ${
                      startDate && endDate && !isDateSelectionValid()
                        ? 'border-red-300 dark:border-red-600 focus:ring-red-500'
                        : 'border-gray-300 dark:border-gray-600 focus:ring-blue-500'
                    }`}
                  />
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Select a date from today onwards
                  </p>
                </div>
                
                <div>
                  <label htmlFor="endDate" className="block text-sm font-medium mb-2">
                    End Date *
                  </label>
                  <input
                    id="endDate"
                    type="date"
                    min={getMinEndDate()}
                    value={endDate}
                    onChange={(e) => handleEndDateChange(e.target.value)}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 ${
                      startDate && endDate && !isDateSelectionValid()
                        ? 'border-red-300 dark:border-red-600 focus:ring-red-500'
                        : 'border-gray-300 dark:border-gray-600 focus:ring-blue-500'
                    }`}
                  />
                  <p className={`text-xs mt-1 ${
                    startDate && endDate && !isDateSelectionValid()
                      ? 'text-red-500 dark:text-red-400'
                      : 'text-gray-500 dark:text-gray-400'
                  }`}>
                    {startDate && endDate && !isDateSelectionValid()
                      ? 'End date must be after start date'
                      : startDate && endDate && isDateSelectionValid()
                        ? (() => {
                            const start = new Date(startDate)
                            const end = new Date(endDate)
                            const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24))
                            return `${days} day${days !== 1 ? 's' : ''} trip`
                          })()
                        : startDate 
                          ? `Select a date after ${startDate}` 
                          : 'Select a date after your start date'
                    }
                  </p>
                </div>
                
                <div>
                  <label htmlFor="travelers" className="block text-sm font-medium mb-2">
                    Number of Travelers *
                  </label>
                  <input
                    id="travelers"
                    type="number"
                    min="1"
                    value={travelers}
                    onChange={(e) => setTravelers(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-3">
                  Travel Preferences *
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {preferenceOptions.map((option) => (
                    <label key={option.id} className="flex items-start space-x-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={preferences.includes(option.id)}
                        onChange={() => handlePreferenceChange(option.id)}
                        className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <div>
                        <div className="text-sm font-medium">{option.label}</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">{option.description}</div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <Button
                  onClick={handleGenerateItinerary}
                  disabled={isProcessing}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Generating Itinerary...
                    </>
                  ) : (
                    <>
                      <Plane className="mr-2 h-4 w-4" />
                      Generate Itinerary
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Error Section */}
          {error && (
            <Card className="mb-8 border-red-200 dark:border-red-800">
              <CardHeader>
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center">
                    <svg className="h-4 w-4 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <CardTitle className="text-red-700 dark:text-red-300">
                    Unable to Generate Itinerary
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-red-600 dark:text-red-400 mb-3">{error}</p>
                <div className="flex space-x-2">
                  <Button 
                    variant="outline" 
                    className="border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/10"
                    onClick={() => setError(null)}
                  >
                    Dismiss
                  </Button>
                  <Button 
                    variant="outline" 
                    className="border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900/10"
                    onClick={handleGenerateItinerary}
                    disabled={isProcessing}
                  >
                    Try Again
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Results Section */}
          {results && (
            <Card className="border-green-200 dark:border-green-800">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center">
                      <MapPin className="h-5 w-5 text-green-600 dark:text-green-400" />
                    </div>
                    <div>
                      <CardTitle className="text-green-700 dark:text-green-300 text-xl">
                        {results.destination} Adventure
                      </CardTitle>
                      <div className="flex items-center space-x-2 mt-1">
                        <Badge 
                          variant="secondary" 
                          className={results.budget_status === 'within_budget' 
                            ? 'bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-300'
                            : 'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-300'
                          }
                        >
                          {results.budget_status === 'within_budget' ? '✅ Within Budget' : '⚠️ Over Budget'}
                        </Badge>
                        <span className="text-sm text-muted-foreground">
                          {results.daily_itinerary.length} days • {results.total_cost} total • {results.daily_itinerary[0]?.date} to {results.daily_itinerary[results.daily_itinerary.length - 1]?.date}
                        </span>
                      </div>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={clearResults}
                    className="border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-900/10"
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Clear
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-8">
                {/* Budget Overview */}
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/10 dark:to-indigo-900/10 rounded-lg p-6">
                  <h4 className="font-semibold mb-4 text-sm text-muted-foreground uppercase tracking-wide flex items-center">
                    <DollarSign className="mr-2 h-4 w-4" />
                    Budget Overview
                  </h4>
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                    {Object.entries(results.budget_breakdown).map(([category, cost]) => (
                      <div key={category} className="text-center">
                        <div className="text-lg font-bold text-gray-900 dark:text-gray-100">
                          {cost.startsWith('$') ? cost : `$${cost}`}
                        </div>
                        <div className="text-xs text-muted-foreground uppercase tracking-wide capitalize">{category}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Daily Itinerary Timeline */}
                <div>
                  <h4 className="font-semibold mb-6 text-sm text-muted-foreground uppercase tracking-wide flex items-center">
                    <Calendar className="mr-2 h-4 w-4" />
                    Your Travel Timeline
                  </h4>
                  <div className="relative">
                    {/* Timeline line */}
                    <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gradient-to-b from-blue-500 to-purple-600"></div>
                    
                    <div className="space-y-8">
                      {results.daily_itinerary.map((day) => (
                        <div key={day.day} className="relative">
                          {/* Timeline dot */}
                          <div className="absolute left-4 top-6 w-4 h-4 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full border-4 border-white dark:border-gray-800 shadow-lg"></div>
                          
                          <div className="ml-12">
                            <Card className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 border-2 border-gray-100 dark:border-gray-700 shadow-lg">
                              <CardHeader className="pb-4">
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center space-x-3">
                                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                                      {day.day}
                                    </div>
                                    <div>
                                      <h5 className="font-bold text-lg text-gray-900 dark:text-gray-100">
                                        Day {day.day}
                                      </h5>
                                      <p className="text-sm text-muted-foreground">{day.date}</p>
                                    </div>
                                  </div>
                                  <div className="flex items-center space-x-2">
                                    <span className="text-2xl">{getWeatherIcon(day.weather)}</span>
                                    <Badge variant="secondary" className="bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300">
                                      {day.weather}
                                    </Badge>
                                  </div>
                                </div>
                              </CardHeader>
                              <CardContent>
                                <div className="space-y-3">
                                  {day.activities.map((activity, index) => (
                                    <div key={index} className="relative">
                                      {/* Activity timeline connector */}
                                      {index < day.activities.length - 1 && (
                                        <div className="absolute left-8 top-8 w-0.5 h-8 bg-gray-200 dark:bg-gray-600"></div>
                                      )}
                                      
                                      <div className="flex items-start space-x-4 p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-100 dark:border-gray-700 hover:shadow-md transition-shadow">
                                        <div className="flex-shrink-0 w-16 text-center">
                                          <div className="text-sm font-bold text-gray-900 dark:text-gray-100">
                                            {activity.time}
                                          </div>
                                          <div className="text-xs text-muted-foreground">
                                            {parseInt(activity.time.split(':')[0]) < 12 ? 'AM' : 'PM'}
                                          </div>
                                        </div>
                                        <div className="flex-1">
                                          <div className="flex items-center space-x-2 mb-2">
                                            <span className="text-lg">{getTypeIcon(activity.type)}</span>
                                            <Badge className={`text-xs font-medium ${getTypeColor(activity.type)}`}>
                                              {activity.type}
                                            </Badge>
                                          </div>
                                          <h6 className="font-semibold text-gray-900 dark:text-gray-100 mb-1">
                                            {activity.description}
                                          </h6>
                                          <p className="text-sm text-muted-foreground flex items-center">
                                            <MapPin className="mr-1 h-3 w-3" />
                                            {activity.location}
                                          </p>
                                        </div>
                                        <div className="flex-shrink-0 text-right">
                                          <div className="text-lg font-bold text-green-600 dark:text-green-400">
                                            {activity.cost.startsWith('$') ? activity.cost : `$${activity.cost}`}
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </CardContent>
                            </Card>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Travel Tips */}
                <div className="bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/10 dark:to-orange-900/10 rounded-lg p-6">
                  <h4 className="font-semibold mb-4 text-sm text-muted-foreground uppercase tracking-wide flex items-center">
                    <span className="mr-2">💡</span>
                    Pro Travel Tips
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {results.travel_tips.map((tip, index) => (
                      <div key={index} className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-amber-500 rounded-full mt-2 flex-shrink-0"></div>
                        <p className="text-sm text-gray-700 dark:text-gray-300">{tip}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Privacy Note */}
          <Card className="mt-8 border-blue-200 dark:border-blue-800 bg-blue-50/50 dark:bg-blue-900/10">
            <CardContent className="pt-6">
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Shield className="h-3 w-3 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <h4 className="font-medium text-blue-800 dark:text-blue-200 mb-1">Privacy & Security</h4>
                  <p className="text-sm text-blue-700 dark:text-blue-300">
                    Your travel details are processed securely and not stored on our servers.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </PageLayout>
    )
  } 