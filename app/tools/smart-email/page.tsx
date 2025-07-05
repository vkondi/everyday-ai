import { Button } from "@/components/ui/button"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ScrollToTop } from "@/components/scroll-to-top"
import { BackgroundPattern } from "@/components/background-pattern"
import { ArrowLeft, Mail } from "lucide-react"
import Link from "next/link"

export default function SmartEmailPage() {
  return (
    <div className="min-h-screen flex flex-col relative">
      <BackgroundPattern />
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-8 md:px-6 relative z-10">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <Link href="/dashboard">
              <Button variant="ghost" className="mb-4">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Dashboard
              </Button>
            </Link>
            <h1 className="text-3xl font-bold tracking-tight mb-4 bg-gradient-to-r from-amber-600 to-amber-800 bg-clip-text text-transparent">Smart Email</h1>
            <p className="text-muted-foreground">
              Transform your emails with AI-powered suggestions for tone, clarity, and professionalism.
            </p>
          </div>
          
          <div className="bg-card border rounded-lg p-8 text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-amber-100 dark:bg-amber-900/20 rounded-full flex items-center justify-center">
              <Mail className="h-8 w-8 text-amber-600 dark:text-amber-400" />
            </div>
            <h2 className="text-xl font-semibold mb-4">Coming Soon</h2>
            <p className="text-muted-foreground mb-6">
              The Smart Email tool is currently under development. Check back soon for AI-powered email suggestions!
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="p-4 bg-amber-50 dark:bg-amber-900/10 rounded-lg">
                <h3 className="font-semibold mb-2">Tone Analysis</h3>
                <p className="text-muted-foreground">Get suggestions for the perfect tone</p>
              </div>
              <div className="p-4 bg-amber-50 dark:bg-amber-900/10 rounded-lg">
                <h3 className="font-semibold mb-2">Clarity Check</h3>
                <p className="text-muted-foreground">Improve readability and structure</p>
              </div>
              <div className="p-4 bg-amber-50 dark:bg-amber-900/10 rounded-lg">
                <h3 className="font-semibold mb-2">Professional Polish</h3>
                <p className="text-muted-foreground">Enhance your professional image</p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
      <ScrollToTop />
    </div>
  )
} 