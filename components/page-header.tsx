import React from "react"
import { Button } from "./ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

interface PageHeaderProps {
  title: string
  description?: string
  showBackButton?: boolean
  backHref?: string
  className?: string
}

export function PageHeader({ 
  title, 
  description, 
  showBackButton = true, 
  backHref = "/dashboard",
  className = ""
}: PageHeaderProps) {
  return (
    <div className={`mb-8 ${className}`}>
      {showBackButton && (
        <Link href={backHref}>
          <Button variant="ghost" className="mb-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Button>
        </Link>
      )}
      <h1 className="text-3xl font-bold tracking-tight mb-4 bg-gradient-to-r from-amber-600 to-amber-800 bg-clip-text text-transparent">
        {title}
      </h1>
      {description && (
        <p className="text-slate-700 dark:text-slate-300 text-lg">
          {description}
        </p>
      )}
    </div>
  )
} 