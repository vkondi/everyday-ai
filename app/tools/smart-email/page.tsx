"use client"

import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ScrollToTop } from "@/components/scroll-to-top"
import { BackgroundPattern } from "@/components/background-pattern"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "../../../components/ui/textarea"
import { ArrowLeft, Mail, Sparkles, Target, Shield, Zap, Loader2, Copy, Check, ChevronLeft, ChevronRight } from "lucide-react"
import Link from "next/link"
import { useModel } from "@/components/model-context"
import { getUserFriendlyError, handleApiError, validateJsonResponse } from "@/components/utils/error-utils"

interface EmailAnalysis {
  tone: string;
  clarity: string;
  conciseness: string;
  call_to_action: string;
}

interface EmailEnhancementResult {
  original_email_score: string;
  enhanced_email: string;
  recommended_subject: string;
  key_improvements: string[];
  analysis: EmailAnalysis;
}

export default function SmartEmailPage() {
  const { selectedModel } = useModel()
  const [emailContent, setEmailContent] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)
  const [results, setResults] = useState<EmailEnhancementResult | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [copySuccess, setCopySuccess] = useState(false)
  const [copySubjectSuccess, setCopySubjectSuccess] = useState(false)
  const [copyEmailSuccess, setCopyEmailSuccess] = useState(false)
  const [currentCardIndex, setCurrentCardIndex] = useState(0)

  const featureCards = [
    {
      icon: Target,
      badge: "Tone Analysis",
      title: "Perfect Tone Detection",
      description: "AI analyzes your email's tone and suggests improvements for better communication."
    },
    {
      icon: Sparkles,
      badge: "Clarity Check",
      title: "Enhanced Readability",
      description: "Improve sentence structure and eliminate ambiguity for crystal clear messaging."
    },
    {
      icon: Shield,
      badge: "Professional Polish",
      title: "Professional Enhancement",
      description: "Add professional polish with grammar corrections and industry-specific language."
    }
  ]

  const copyToClipboard = async (text: string, setSuccessState: (value: boolean) => void) => {
    try {
      await navigator.clipboard.writeText(text);
      setSuccessState(true);
      setTimeout(() => setSuccessState(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  }



  const handleRefineEmail = async () => {
    if (!emailContent.trim()) return
    
    setIsProcessing(true)
    setError(null)
    setResults(null)
    
    try {
      const response = await fetch('/api/email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          email_content: emailContent,
          model: selectedModel
        })
      })
      
      if (!response.ok) {
        const errorMessage = await handleApiError(response, 'Failed to enhance email')
        throw new Error(errorMessage)
      }
      
      validateJsonResponse(response)
      
      const data = await response.json()
      setResults(data)
    } catch (error) {
      console.error('Error refining email:', error)
      const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred'
      setError(getUserFriendlyError(errorMessage, 'email'))
    } finally {
      setIsProcessing(false)
    }
  }

  const nextCard = () => {
    setCurrentCardIndex((prev) => (prev + 1) % featureCards.length)
  }

  const prevCard = () => {
    setCurrentCardIndex((prev) => (prev - 1 + featureCards.length) % featureCards.length)
  }

  return (
    <div className="min-h-screen flex flex-col relative">
      <BackgroundPattern />
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-8 md:px-6 relative z-10">
        <div className="max-w-6xl mx-auto">
          {/* Header Section */}
          <div className="mb-8">
            <Link href="/dashboard">
              <Button variant="ghost" className="mb-4">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Dashboard
              </Button>
            </Link>
            <h1 className="text-3xl font-bold tracking-tight mb-4 bg-gradient-to-r from-amber-600 to-amber-800 bg-clip-text text-transparent">
              Smart Email
            </h1>
            <p className="text-slate-700 dark:text-slate-300 text-lg">
              Transform your emails with AI-powered suggestions for tone, clarity, and professionalism.
            </p>
          </div>

          {/* Feature Cards - Grid on large screens, Carousel on mobile */}
          <div className="mb-12">
            {/* Desktop/Tablet Grid View */}
            <div className="hidden md:grid md:grid-cols-3 gap-6">
              {featureCards.map((card, index) => (
                <Card key={index} className="border-amber-200 dark:border-amber-800">
                  <CardHeader className="pb-3">
                    <div className="flex items-center space-x-2">
                      <div className="w-10 h-10 bg-amber-100 dark:bg-amber-900/20 rounded-lg flex items-center justify-center">
                        {(() => {
                          const IconComponent = card.icon;
                          return <IconComponent className="h-5 w-5 text-amber-600 dark:text-amber-400" />;
                        })()}
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
                            const IconComponent = featureCards[currentCardIndex].icon;
                            return <IconComponent className="h-5 w-5 text-amber-600 dark:text-amber-400" />;
                          })()}
                        </div>
                        <Badge variant="secondary" className="bg-amber-100 dark:bg-amber-900/20 text-amber-700 dark:text-amber-300">
                          {featureCards[currentCardIndex].badge}
                        </Badge>
                      </div>
                      <CardTitle className="text-lg">{featureCards[currentCardIndex].title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <CardDescription className="text-sm">
                        {featureCards[currentCardIndex].description}
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
                    {featureCards.map((_, index) => (
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

          {/* Email Input Section */}
          <Card className="mb-8 border-amber-200 dark:border-amber-800">
            <CardHeader>
              <div className="flex items-center space-x-2">
                <Mail className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                <CardTitle>Email Content</CardTitle>
              </div>
              <CardDescription>
                Paste your email content below. Our AI will analyze and enhance it for better communication.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                placeholder="Paste your email content here...&#10;&#10;Example:&#10;Hi John,&#10;&#10;I wanted to follow up on our meeting yesterday. I think we should discuss the project timeline and budget considerations. Let me know when you&apos;re available for a call.&#10;&#10;Thanks,&#10;Sarah"
                value={emailContent}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setEmailContent(e.target.value)}
                className="min-h-[200px] resize-none border-amber-200 dark:border-amber-800 focus:border-amber-500 dark:focus:border-amber-400"
              />
              <div className="flex justify-between items-center">
                <p className="text-sm text-muted-foreground">
                  {emailContent.length} characters
                </p>
                <Button
                  onClick={handleRefineEmail}
                  disabled={!emailContent.trim() || isProcessing}
                  className="bg-amber-600 hover:bg-amber-700 text-white"
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <Zap className="mr-2 h-4 w-4" />
                      Refine with AI
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
                    Error
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
                <Button 
                  variant="outline" 
                  className="mt-3 border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/10"
                  onClick={() => setError(null)}
                >
                  Dismiss
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Results Section */}
          {results && (
            <Card className="border-green-200 dark:border-green-800">
              <CardHeader>
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center">
                    <Sparkles className="h-4 w-4 text-green-600 dark:text-green-400" />
                  </div>
                  <CardTitle className="text-green-700 dark:text-green-300">
                    Enhanced Email
                  </CardTitle>
                  <Badge variant="secondary" className="bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-300">
                    {results.original_email_score} Score
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Recommended Subject */}
                {results.recommended_subject && (
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
                        Recommended Subject Line
                      </h4>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/20"
                        onClick={() => copyToClipboard(results.recommended_subject, setCopySubjectSuccess)}
                      >
                        {copySubjectSuccess ? (
                          <Check className="h-4 w-4" />
                        ) : (
                          <Copy className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                    <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3 border-l-4 border-blue-500">
                      <p className="text-sm font-medium text-blue-700 dark:text-blue-300">
                        {results.recommended_subject}
                      </p>
                    </div>
                  </div>
                )}

                {/* Enhanced Email Content */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
                      Enhanced Version
                    </h4>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0 text-green-600 dark:text-green-400 hover:bg-green-100 dark:hover:bg-green-900/20"
                      onClick={() => copyToClipboard(results.enhanced_email, setCopyEmailSuccess)}
                    >
                      {copyEmailSuccess ? (
                        <Check className="h-4 w-4" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                  <div className="bg-muted/50 dark:bg-muted/30 rounded-lg p-4 border-l-4 border-green-500">
                    <p className="text-sm leading-relaxed whitespace-pre-wrap">
                      {results.enhanced_email}
                    </p>
                  </div>
                </div>

                {/* Analysis */}
                {results.analysis && (
                  <div>
                    <h4 className="font-semibold mb-3 text-sm text-muted-foreground uppercase tracking-wide">
                      Analysis
                    </h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      <div className="bg-muted/30 rounded-lg p-3">
                        <p className="text-xs text-muted-foreground uppercase tracking-wide">Tone</p>
                        <p className="text-sm font-medium capitalize">{results.analysis.tone}</p>
                      </div>
                      <div className="bg-muted/30 rounded-lg p-3">
                        <p className="text-xs text-muted-foreground uppercase tracking-wide">Clarity</p>
                        <p className="text-sm font-medium capitalize">{results.analysis.clarity}</p>
                      </div>
                      <div className="bg-muted/30 rounded-lg p-3">
                        <p className="text-xs text-muted-foreground uppercase tracking-wide">Conciseness</p>
                        <p className="text-sm font-medium capitalize">{results.analysis.conciseness}</p>
                      </div>
                      <div className="bg-muted/30 rounded-lg p-3">
                        <p className="text-xs text-muted-foreground uppercase tracking-wide">Call to Action</p>
                        <p className="text-sm font-medium capitalize">{results.analysis.call_to_action}</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Key Improvements */}
                <div>
                  <h4 className="font-semibold mb-3 text-sm text-muted-foreground uppercase tracking-wide">
                    Key Improvements
                  </h4>
                  <div className="space-y-2">
                    {results.key_improvements.map((improvement: string, index: number) => (
                      <div key={index} className="flex items-start space-x-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                        <p className="text-sm text-muted-foreground">{improvement}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Action Button */}
                <div className="flex justify-center pt-4">
                  <Button 
                    variant="outline" 
                    className="border-amber-200 dark:border-amber-800 text-amber-700 dark:text-amber-300 hover:bg-amber-50 dark:hover:bg-amber-900/10"
                    onClick={() => copyToClipboard(results.enhanced_email, setCopySuccess)}
                  >
                    <Mail className="mr-2 h-4 w-4" />
                    {copySuccess ? 'Copied!' : 'Copy Enhanced Email'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Privacy Note - Moved to bottom */}
          <Card className="mt-8 border-blue-200 dark:border-blue-800 bg-blue-50/50 dark:bg-blue-900/10">
            <CardContent className="pt-6">
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Shield className="h-3 w-3 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <h4 className="font-medium text-blue-800 dark:text-blue-200 mb-1">Privacy & Security</h4>
                  <p className="text-sm text-blue-700 dark:text-blue-300">
                    Your email content is processed securely and not stored on our servers.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
      <ScrollToTop />
    </div>
  )
} 