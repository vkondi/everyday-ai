import { Button } from "@/components/ui/button"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ArrowLeft, MapPin } from "lucide-react"
import Link from "next/link"

export default function TravelItineraryPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-8 md:px-6">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <Link href="/dashboard">
              <Button variant="ghost" className="mb-4">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Dashboard
              </Button>
            </Link>
            <h1 className="text-3xl font-bold tracking-tight mb-4 bg-gradient-to-r from-amber-600 to-amber-800 bg-clip-text text-transparent">Travel Itinerary Builder</h1>
            <p className="text-muted-foreground">
              Create personalized travel plans with AI recommendations for destinations, activities, and budget optimization.
            </p>
          </div>
          
          <div className="bg-card border rounded-lg p-8 text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-amber-100 dark:bg-amber-900/20 rounded-full flex items-center justify-center">
              <MapPin className="h-8 w-8 text-amber-600 dark:text-amber-400" />
            </div>
            <h2 className="text-xl font-semibold mb-4">Coming Soon</h2>
            <p className="text-muted-foreground mb-6">
              The Travel Itinerary Builder is currently under development. Check back soon for AI-powered travel planning!
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="p-4 bg-amber-50 dark:bg-amber-900/10 rounded-lg">
                <h3 className="font-semibold mb-2">Destination Planning</h3>
                <p className="text-muted-foreground">AI-recommended places to visit</p>
              </div>
              <div className="p-4 bg-amber-50 dark:bg-amber-900/10 rounded-lg">
                <h3 className="font-semibold mb-2">Budget Optimization</h3>
                <p className="text-muted-foreground">Smart cost management suggestions</p>
              </div>
              <div className="p-4 bg-amber-50 dark:bg-amber-900/10 rounded-lg">
                <h3 className="font-semibold mb-2">Activity Scheduling</h3>
                <p className="text-muted-foreground">Optimal timing for experiences</p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
} 