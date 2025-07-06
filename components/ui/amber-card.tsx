import React from "react"
import { Card } from "./card"
import { cn } from "@/lib/utils"

interface AmberCardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "input"
}

export function AmberCard({ className, variant = "default", ...props }: AmberCardProps) {
  const baseClasses = "border-amber-200 dark:border-amber-800"
  
  const variantClasses = {
    default: baseClasses,
    input: `${baseClasses} focus:border-amber-500 dark:focus:border-amber-400`
  }

  return (
    <Card 
      className={cn(variantClasses[variant], className)} 
      {...props} 
    />
  )
} 