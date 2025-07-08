"use client"

import React, { useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { PageLayout } from "@/components/page-layout"
import { PageHeader } from "@/components/page-header"
import { FeatureCards } from "@/components/feature-cards"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuCheckboxItem,
} from "@/components/ui/dropdown-menu"
import { 
  Newspaper, 
  ChevronDown, 
  Loader2, 
  RefreshCw,
  Globe,
  Briefcase,
  Building2,
  Microscope,
  Trophy,
  Music,
  Heart,
  Shield,
  Cloud,
  BookOpen,
  GraduationCap,
  Users,
  Car,
  Zap
} from "lucide-react"
import { useModel } from "@/components/model-context"
import { getUserFriendlyError, handleApiError, validateJsonResponse } from "../../../lib/error-utils"

interface NewsArticle {
  title: string;
  description: string;
  category: string;
  source: string;
}

interface NewsResponse {
  articles: NewsArticle[];
}

const NEWS_CATEGORIES = [
  { id: "world", name: "World & International", icon: Globe },
  { id: "national", name: "National News", icon: Building2 },
  { id: "business", name: "Business & Money", icon: Briefcase },
  { id: "politics", name: "Politics & Government", icon: Shield },
  { id: "technology", name: "Technology & Science", icon: Microscope },
  { id: "sports", name: "Sports", icon: Trophy },
  { id: "entertainment", name: "Entertainment & Celebrities", icon: Music },
  { id: "health", name: "Health & Wellness", icon: Heart },
  { id: "crime", name: "Crime & Justice", icon: Shield },
  { id: "environment", name: "Environment & Weather", icon: Cloud },
  { id: "religion", name: "Religion & Beliefs", icon: BookOpen },
  { id: "education", name: "Education & Careers", icon: GraduationCap },
  { id: "lifestyle", name: "Lifestyle & Society", icon: Users },
  { id: "automotive", name: "Automotive & Transport", icon: Car },
  { id: "odd", name: "Odd & Viral News", icon: Zap }
]

// Top 5 categories to preselect
const DEFAULT_CATEGORIES = ["World & International", "National News", "Business & Money", "Politics & Government", "Technology & Science"]

export default function NewsDigestPage() {
  const { selectedModel } = useModel()
  const [selectedCategories, setSelectedCategories] = useState<string[]>(DEFAULT_CATEGORIES)
  const [newsArticles, setNewsArticles] = useState<NewsArticle[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [userRegion, setUserRegion] = useState<string>("India")

  const featureCards = [
    {
      icon: Newspaper,
      badge: "Smart Curation",
      title: "AI-Powered News Curation",
      description: "Get personalized news summaries tailored to your interests and location."
    },
    {
      icon: Globe,
      badge: "Local Focus",
      title: "Region-Aware Content",
      description: "News relevant to your local area with global context and insights."
    },
    {
      icon: Zap,
      badge: "Real-time Updates",
      title: "Fresh Content",
      description: "Stay updated with the latest news across your selected categories."
    }
  ]

  // Get user's region on component mount
  useEffect(() => {
    try {
      const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone
      const region = timeZone.split('/')[1] || timeZone.split('/')[0] || "India"
      setUserRegion(region.replace('_', ' '))
    } catch (error) {
      console.warn('Could not detect user region:', error)
      setUserRegion("India")
    }
  }, [])

  // Load selected categories from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem('newsDigestCategories')
      if (saved) {
        const parsed = JSON.parse(saved)
        if (Array.isArray(parsed) && parsed.length > 0) {
          setSelectedCategories(parsed)
        }
      }
    } catch (error) {
      console.warn('Could not load saved categories:', error)
    }
  }, [])

  // Save selected categories to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem('newsDigestCategories', JSON.stringify(selectedCategories))
    } catch (error) {
      console.warn('Could not save categories:', error)
    }
  }, [selectedCategories])

  // Fetch news function
  const fetchNews = useCallback(async (categories: string[], region: string) => {
    if (categories.length === 0) return

    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/news/fetch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          categories,
          region,
          model: selectedModel
        })
      })

      if (!response.ok) {
        const errorMessage = await handleApiError(response, 'Failed to fetch news')
        throw new Error(errorMessage)
      }

      validateJsonResponse(response)
      const data: NewsResponse = await response.json()
      setNewsArticles(data.articles)
    } catch (error) {
      console.error('Error fetching news:', error)
      const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred'
      setError(getUserFriendlyError(errorMessage, 'news'))
    } finally {
      setIsLoading(false)
    }
  }, [selectedModel])

  // Fetch news on initial load when categories and region are available
  useEffect(() => {
    if (selectedCategories.length > 0 && userRegion && newsArticles.length === 0) {
      fetchNews(selectedCategories, userRegion)
    }
  }, [userRegion, newsArticles.length, fetchNews, selectedCategories])

  // Manual refetch function
  const handleManualRefetch = () => {
    if (selectedCategories.length > 0 && userRegion) {
      fetchNews(selectedCategories, userRegion)
    }
  }

  const handleCategoryToggle = (categoryName: string) => {
    setSelectedCategories(prev => 
      prev.includes(categoryName)
        ? prev.filter(cat => cat !== categoryName)
        : [...prev, categoryName]
    )
  }

  const getCategoryIcon = (categoryName: string) => {
    const category = NEWS_CATEGORIES.find(cat => cat.name === categoryName)
    return category ? category.icon : Newspaper
  }

  const getCategoryColor = (categoryName: string) => {
    const colors = {
      "World & International": "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300",
      "National News": "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300",
      "Business & Money": "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300",
      "Politics & Government": "bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-300",
      "Technology & Science": "bg-cyan-100 text-cyan-800 dark:bg-cyan-900/20 dark:text-cyan-300",
      "Sports": "bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-300",
      "Entertainment & Celebrities": "bg-pink-100 text-pink-800 dark:bg-pink-900/20 dark:text-pink-300",
      "Health & Wellness": "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/20 dark:text-emerald-300",
      "Crime & Justice": "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300",
      "Environment & Weather": "bg-teal-100 text-teal-800 dark:bg-teal-900/20 dark:text-teal-300",
      "Religion & Beliefs": "bg-indigo-100 text-indigo-800 dark:bg-indigo-900/20 dark:text-indigo-300",
      "Education & Careers": "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300",
      "Lifestyle & Society": "bg-rose-100 text-rose-800 dark:bg-rose-900/20 dark:text-rose-300",
      "Automotive & Transport": "bg-slate-100 text-slate-800 dark:bg-slate-900/20 dark:text-slate-300",
      "Odd & Viral News": "bg-amber-100 text-amber-800 dark:bg-amber-900/20 dark:text-amber-300"
    }
    return colors[categoryName as keyof typeof colors] || "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300"
  }

  return (
    <PageLayout>
      <div className="max-w-6xl mx-auto">
        <PageHeader
          title="News Digest"
          description="Stay informed with AI-curated news summaries tailored to your interests and location."
        />

        <FeatureCards cards={featureCards} />

        {/* Category Selection */}
        <div className="mb-8">
          <Card className="border-amber-200 dark:border-amber-800">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Newspaper className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                Select News Categories
              </CardTitle>
              <CardDescription>
                Choose the categories you&apos;re interested in. Click &quot;Refresh News&quot; to fetch news with your selected categories.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4 items-start">
                <div className="flex-1">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" className="w-full justify-between">
                        <span>
                          {selectedCategories.length} categories selected
                        </span>
                        <ChevronDown className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-80 max-h-96 overflow-y-auto">
                      {NEWS_CATEGORIES.map((category) => {
                        const IconComponent = category.icon
                        return (
                          <DropdownMenuCheckboxItem
                            key={category.id}
                            checked={selectedCategories.includes(category.name)}
                            onCheckedChange={() => handleCategoryToggle(category.name)}
                            className="flex items-center gap-3 cursor-pointer"
                          >
                            <IconComponent className="h-4 w-4" />
                            <span>{category.name}</span>
                          </DropdownMenuCheckboxItem>
                        )
                      })}
                    </DropdownMenuContent>
                  </DropdownMenu>
                  
                  {selectedCategories.length > 0 && (
                    <div className="mt-4 flex flex-wrap gap-2">
                      {selectedCategories.map((category) => (
                        <Badge
                          key={category}
                          variant="secondary"
                          className={`${getCategoryColor(category)} cursor-pointer`}
                          onClick={() => handleCategoryToggle(category)}
                        >
                          {category}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
                
                <Button
                  onClick={handleManualRefetch}
                  disabled={isLoading || selectedCategories.length === 0}
                  className="flex items-center gap-2"
                >
                  {isLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <RefreshCw className="h-4 w-4" />
                  )}
                  Refresh News
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* News Articles */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-semibold">Latest News</h2>
            {isLoading && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin" />
                Loading news...
              </div>
            )}
          </div>

          {error && (
            <Card className="border-red-200 dark:border-red-800 mb-6">
              <CardContent className="pt-6">
                <p className="text-red-600 dark:text-red-400">{error}</p>
              </CardContent>
            </Card>
          )}

          {isLoading && newsArticles.length === 0 ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-amber-600 dark:text-amber-400" />
                <p className="text-muted-foreground">Fetching news articles...</p>
              </div>
            </div>
          ) : newsArticles.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {newsArticles.map((article, index) => {
                const IconComponent = getCategoryIcon(article.category)
                return (
                  <Card key={index} className="border-amber-200 dark:border-amber-800 hover:shadow-lg transition-shadow">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1">
                          <CardTitle className="text-lg line-clamp-2 mb-2">
                            {article.title}
                          </CardTitle>
                          <div className="flex items-center gap-2">
                            <Badge 
                              variant="secondary" 
                              className={`${getCategoryColor(article.category)} text-xs`}
                            >
                              <IconComponent className="h-3 w-3 mr-1" />
                              {article.category}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <CardDescription className="text-sm line-clamp-3 mb-3">
                        {article.description}
                      </CardDescription>
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span className="font-medium">{article.source}</span>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          ) : (
            <Card className="border-amber-200 dark:border-amber-800">
              <CardContent className="pt-6 text-center">
                <Newspaper className="h-12 w-12 mx-auto mb-4 text-amber-600 dark:text-amber-400 opacity-50" />
                <p className="text-muted-foreground">
                  No news articles available. Please select at least one category and click &quot;Refresh News&quot;.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </PageLayout>
  )
} 