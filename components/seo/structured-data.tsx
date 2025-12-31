"use client"

import { usePathname } from 'next/navigation'
import { useEffect } from 'react'

interface WebsiteStructuredData {
  name: string
  url: string
  description: string
  logo?: string
  sameAs?: string[]
}

interface OrganizationStructuredData extends WebsiteStructuredData {
  type: 'Organization' | 'Person'
  foundingDate?: string
  contactPoint?: {
    telephone: string
    contactType: string
    areaServed: string
    availableLanguage: string | string[]
  }
}

interface ArticleStructuredData {
  headline: string
  description: string
  image?: string[]
  author?: {
    name: string
    url?: string
  }
  publisher?: OrganizationStructuredData
  datePublished?: string
  dateModified?: string
}

interface BreadcrumbStructuredData {
  itemListElement: {
    position: number
    name: string
    item?: string
  }[]
}

export function WebsiteStructuredData({ 
  name, 
  url, 
  description, 
  logo, 
  sameAs 
}: WebsiteStructuredData) {
  useEffect(() => {
    const structuredData = {
      "@context": "https://schema.org",
      "@type": "WebSite",
      "name": name,
      "url": url,
      "description": description,
      "potentialAction": {
        "@type": "SearchAction",
        "target": `${url}/search?q={search_term_string}`,
        "query-input": "required name=search_term_string"
      },
      ...(logo && { "logo": logo }),
      ...(sameAs && { "sameAs": sameAs })
    }

    let script = document.querySelector<HTMLScriptElement>('script[type="application/ld+json"][data-type="website"]')
    if (script) {
      script.textContent = JSON.stringify(structuredData)
    } else {
      script = document.createElement('script')
      script.type = 'application/ld+json'
      script.setAttribute('data-type', 'website')
      script.textContent = JSON.stringify(structuredData)
      document.head.appendChild(script)
    }
  }, [name, url, description, logo, sameAs])

  return null
}

export function OrganizationStructuredData({ 
  type = 'Organization',
  name, 
  url, 
  description, 
  logo, 
  sameAs,
  foundingDate,
  contactPoint
}: OrganizationStructuredData) {
  useEffect(() => {
    const structuredData = {
      "@context": "https://schema.org",
      "@type": type,
      "name": name,
      "url": url,
      "description": description,
      ...(logo && { "logo": logo }),
      ...(sameAs && { "sameAs": sameAs }),
      ...(foundingDate && { "foundingDate": foundingDate }),
      ...(contactPoint && { "contactPoint": contactPoint })
    }

    let script = document.querySelector<HTMLScriptElement>('script[type="application/ld+json"][data-type="organization"]')
    if (script) {
      script.textContent = JSON.stringify(structuredData)
    } else {
      script = document.createElement('script')
      script.type = 'application/ld+json'
      script.setAttribute('data-type', 'organization')
      script.textContent = JSON.stringify(structuredData)
      document.head.appendChild(script)
    }
  }, [type, name, url, description, logo, sameAs, foundingDate, contactPoint])

  return null
}

export function ArticleStructuredData({ 
  headline, 
  description, 
  image, 
  author, 
  publisher, 
  datePublished, 
  dateModified 
}: ArticleStructuredData) {
  useEffect(() => {
    const structuredData = {
      "@context": "https://schema.org",
      "@type": "Article",
      "headline": headline,
      "description": description,
      ...(image && { "image": image }),
      ...(author && { "author": author }),
      ...(publisher && { "publisher": publisher }),
      ...(datePublished && { "datePublished": datePublished }),
      ...(dateModified && { "dateModified": dateModified })
    }

    let script = document.querySelector<HTMLScriptElement>('script[type="application/ld+json"][data-type="article"]')
    if (script) {
      script.textContent = JSON.stringify(structuredData)
    } else {
      script = document.createElement('script')
      script.type = 'application/ld+json'
      script.setAttribute('data-type', 'article')
      script.textContent = JSON.stringify(structuredData)
      document.head.appendChild(script)
    }
  }, [headline, description, image, author, publisher, datePublished, dateModified])

  return null
}

export function BreadcrumbStructuredData({ itemListElement }: BreadcrumbStructuredData) {
  const pathname = usePathname()

  useEffect(() => {
    // Only show breadcrumbs for non-home pages
    if (pathname === '/') return

    const structuredData = {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": itemListElement.map((item, index) => ({
        "@type": "ListItem",
        "position": index + 1,
        "name": item.name,
        ...(item.item && { "item": item.item })
      }))
    }

    let script = document.querySelector<HTMLScriptElement>('script[type="application/ld+json"][data-type="breadcrumb"]')
    if (script) {
      script.textContent = JSON.stringify(structuredData)
    } else {
      script = document.createElement('script')
      script.type = 'application/ld+json'
      script.setAttribute('data-type', 'breadcrumb')
      script.textContent = JSON.stringify(structuredData)
      document.head.appendChild(script)
    }
  }, [pathname, itemListElement])

  return null
}

export function LocalBusinessStructuredData({
  name,
  description,
  address,
  telephone,
  openingHours,
  priceRange,
  image,
  geo
}: {
  name: string
  description: string
  address: {
    streetAddress: string
    addressLocality: string
    addressRegion: string
    postalCode: string
    addressCountry: string
  }
  telephone: string
  openingHours: string[]
  priceRange: string
  image?: string
  geo?: {
    latitude: string
    longitude: string
  }
}) {
  useEffect(() => {
    const structuredData = {
      "@context": "https://schema.org",
      "@type": "LocalBusiness",
      "name": name,
      "description": description,
      "address": {
        "@type": "PostalAddress",
        "streetAddress": address.streetAddress,
        "addressLocality": address.addressLocality,
        "addressRegion": address.addressRegion,
        "postalCode": address.postalCode,
        "addressCountry": address.addressCountry
      },
      "telephone": telephone,
      "openingHours": openingHours,
      "priceRange": priceRange,
      ...(image && { "image": image }),
      ...(geo && {
        "geo": {
          "@type": "GeoCoordinates",
          "latitude": geo.latitude,
          "longitude": geo.longitude
        }
      })
    }

    let script = document.querySelector<HTMLScriptElement>('script[type="application/ld+json"][data-type="localbusiness"]')
    if (script) {
      script.textContent = JSON.stringify(structuredData)
    } else {
      script = document.createElement('script')
      script.type = 'application/ld+json'
      script.setAttribute('data-type', 'localbusiness')
      script.textContent = JSON.stringify(structuredData)
      document.head.appendChild(script)
    }
  }, [name, description, address, telephone, openingHours, priceRange, image, geo])

  return null
}
