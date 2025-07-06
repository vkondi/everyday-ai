import React from "react"
import { cn } from "@/lib/utils"

interface GradientTextProps extends React.HTMLAttributes<HTMLHeadingElement> {
  as?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6"
  children: React.ReactNode
}

export function GradientText({ 
  as: Component = "h1", 
  className, 
  children, 
  ...props 
}: GradientTextProps) {
  return (
    <Component
      className={cn(
        "bg-gradient-to-r from-amber-600 to-amber-800 bg-clip-text text-transparent",
        className
      )}
      {...props}
    >
      {children}
    </Component>
  )
} 