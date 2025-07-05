import { DashboardCard } from "@/components/dashboard-card"
import { Footer } from "@/components/footer"
import { Header } from "@/components/header"
import { ScrollToTop } from "@/components/scroll-to-top"
import { BackgroundPattern } from "@/components/background-pattern"
import { Mail, MapPin, Newspaper } from "lucide-react"

export default function DashboardPage() {
  const tools = [
    {
      title: "Smart Email",
      tag: "Productivity",
      description: "Transform your emails with AI-powered suggestions for tone, clarity, and professionalism. Perfect for business communication and personal correspondence.",
      icon: <Mail className="h-6 w-6" />,
      href: "/tools/smart-email"
    },
    {
      title: "Travel Itinerary Builder",
      tag: "Travel",
      description: "Create personalized travel plans with AI recommendations for destinations, activities, and budget optimization. Your perfect trip, crafted intelligently.",
      icon: <MapPin className="h-6 w-6" />,
      href: "/tools/travel-itinerary"
    },
    {
      title: "News Digest",
      tag: "Media & News",
      description: "Stay informed with AI-curated news summaries tailored to your interests. Get the most relevant stories without the noise.",
      icon: <Newspaper className="h-6 w-6" />,
      href: "/tools/news-digest"
    }
  ]

  return (
    <div className="min-h-screen flex flex-col relative">
      <BackgroundPattern />
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-8 md:px-6 relative z-10">
        <div className="max-w-4xl mx-auto">
          {/* Introduction Section */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold tracking-tight mb-6 bg-gradient-to-r from-amber-600 to-amber-800 bg-clip-text text-transparent">
              Welcome to Everyday AI
            </h2>
            <div className="prose prose-lg dark:prose-invert max-w-none">
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                Discover the power of artificial intelligence in your daily life. Our suite of intelligent tools is designed to enhance your productivity, 
                streamline your workflow, and make complex tasks simple. From crafting perfect emails to planning dream vacations, 
                let AI be your personal assistant for a smarter, more efficient tomorrow.
              </p>
            </div>
          </section>

          {/* Tools Grid */}
          <section>
            <div className="mb-8">
              <h3 className="text-2xl font-semibold tracking-tight mb-2 bg-gradient-to-r from-amber-600 to-amber-800 bg-clip-text text-transparent">
                Intelligent Solutions Hub
              </h3>
              <p className="text-slate-700 dark:text-slate-300">Explore our curated collection of AI-powered tools designed to transform your daily tasks</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {tools.map((tool) => (
                <DashboardCard
                  key={tool.title}
                  title={tool.title}
                  tag={tool.tag}
                  description={tool.description}
                  icon={tool.icon}
                  href={tool.href}
                />
              ))}
            </div>
          </section>
        </div>
      </main>

      <Footer />
      <ScrollToTop />
    </div>
  )
} 