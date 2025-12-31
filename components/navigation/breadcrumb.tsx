"use client"

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { BreadcrumbStructuredData } from '../seo/structured-data'

interface BreadcrumbItem {
  label: string
  href?: string
}

interface BreadcrumbProps {
  customItems?: BreadcrumbItem[]
  className?: string
}

export function Breadcrumb({ customItems, className = "" }: BreadcrumbProps) {
  const pathname = usePathname()
  
  // Generate breadcrumb items based on pathname
  const generateBreadcrumbItems = (): BreadcrumbItem[] => {
    if (customItems && customItems.length > 0) {
      return customItems
    }

    const pathSegments = pathname.split('/').filter(segment => segment !== '')
    const items: BreadcrumbItem[] = []

    // Always start with Home
    items.push({ label: 'Home', href: '/' })

    // Add path segments
    let currentPath = ''
    pathSegments.forEach((segment) => {
      currentPath += `/${segment}`
      
      // Convert URL segment to readable label
      const label = segment
        .replace(/-/g, ' ')
        .replace(/_/g, ' ')
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ')

      // Special cases for tool pages
      if (segment === 'tools') {
        items.push({ label: 'Tools', href: '/tools' })
      } else if (segment === 'smart-email') {
        items.push({ label: 'Smart Email', href: '/tools/smart-email' })
      } else if (segment === 'travel-itinerary') {
        items.push({ label: 'Travel Itinerary', href: '/tools/travel-itinerary' })
      } else if (segment === 'news-digest') {
        items.push({ label: 'News Digest', href: '/tools/news-digest' })
      } else if (segment === 'dashboard') {
        items.push({ label: 'Dashboard', href: '/dashboard' })
      } else {
        items.push({ label, href: currentPath })
      }
    })

    return items
  }

  const items = generateBreadcrumbItems()
  const structuredDataItems = items.map((item, index) => ({
    position: index + 1,
    name: item.label,
    ...(item.href && { item: `https://everyday-ai-tools.vercel.app${item.href}` })
  }))

  return (
    <>
      {/* Structured Data */}
      <BreadcrumbStructuredData itemListElement={structuredDataItems} />
      
      {/* Visual Breadcrumb */}
      {items.length > 1 && (
        <nav aria-label="Breadcrumb" className={`text-sm ${className}`}>
          <ol className="flex items-center space-x-2 text-muted-foreground">
            {items.map((item, index) => (
              <li key={index} className="flex items-center">
                {index > 0 && (
                  <span className="mx-2 text-gray-400 dark:text-gray-500" aria-hidden="true">
                    /
                  </span>
                )}
                {item.href ? (
                  <Link 
                    href={item.href}
                    className="hover:text-foreground transition-colors"
                    aria-current={index === items.length - 1 ? "page" : undefined}
                  >
                    {item.label}
                  </Link>
                ) : (
                  <span className="text-foreground font-medium">{item.label}</span>
                )}
              </li>
            ))}
          </ol>
        </nav>
      )}
    </>
  )
}
