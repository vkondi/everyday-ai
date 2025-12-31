import React from "react"
import { Header } from "./header"
import { Footer } from "./footer"
import { ScrollToTop } from "./scroll-to-top"
import { BackgroundPattern } from "./background-pattern"

interface PageLayoutProps {
  children: React.ReactNode
  className?: string
}

export function PageLayout({ children, className = "" }: PageLayoutProps) {
  return (
    <div className={`min-h-screen flex flex-col relative ${className}`}>
      <BackgroundPattern />
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-8 md:px-6 relative z-10">
        {children}
      </main>

      <Footer />
      <ScrollToTop />
    </div>
  )
} 