"use client"

import { usePathname } from 'next/navigation'
import { useEffect } from 'react'

interface SEOProps {
  title?: string
  description?: string
  keywords?: string[]
  canonical?: string
  ogTitle?: string
  ogDescription?: string
  ogImage?: string
  ogUrl?: string
  ogType?: 'website' | 'article'
  twitterCard?: 'summary' | 'summary_large_image'
  twitterTitle?: string
  twitterDescription?: string
  twitterImage?: string
  structuredData?: Record<string, unknown>
  noIndex?: boolean
}

export function SEO({
  title,
  description,
  keywords,
  canonical,
  ogTitle,
  ogDescription,
  ogImage,
  ogUrl,
  ogType = 'website',
  twitterCard = 'summary_large_image',
  twitterTitle,
  twitterDescription,
  twitterImage,
  structuredData,
  noIndex = false
}: SEOProps) {
  const pathname = usePathname()

  useEffect(() => {
    // Update document title
    if (title) {
      document.title = title
    }

    // Update meta description
    const metaDescription = document.querySelector('meta[name="description"]')
    if (description) {
      if (metaDescription) {
        metaDescription.setAttribute('content', description)
      } else {
        const meta = document.createElement('meta')
        meta.name = 'description'
        meta.content = description
        document.head.appendChild(meta)
      }
    }

    // Update keywords
    if (keywords) {
      const metaKeywords = document.querySelector('meta[name="keywords"]')
      const keywordsString = keywords.join(', ')
      if (metaKeywords) {
        metaKeywords.setAttribute('content', keywordsString)
      } else {
        const meta = document.createElement('meta')
        meta.name = 'keywords'
        meta.content = keywordsString
        document.head.appendChild(meta)
      }
    }

    // Update canonical URL
    if (canonical) {
      let canonicalLink = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null
      if (canonicalLink) {
        canonicalLink.href = canonical
      } else {
        canonicalLink = document.createElement('link') as HTMLLinkElement
        canonicalLink.rel = 'canonical'
        canonicalLink.href = canonical
        document.head.appendChild(canonicalLink)
      }
    }

    // Update robots meta tag
    const robotsContent = noIndex ? 'noindex, nofollow' : 'index, follow'
    let robotsMeta = document.querySelector('meta[name="robots"]') as HTMLMetaElement | null
    if (robotsMeta) {
      robotsMeta.content = robotsContent
    } else {
      robotsMeta = document.createElement('meta') as HTMLMetaElement
      robotsMeta.name = 'robots'
      robotsMeta.content = robotsContent
      document.head.appendChild(robotsMeta)
    }

    // Open Graph tags
    const updateOGTag = (property: string, content: string) => {
      let ogTag = document.querySelector(`meta[property="${property}"]`)
      if (ogTag) {
        ogTag.setAttribute('content', content)
      } else {
        ogTag = document.createElement('meta')
        ogTag.setAttribute('property', property)
        ogTag.setAttribute('content', content)
        document.head.appendChild(ogTag)
      }
    }

    if (ogTitle) updateOGTag('og:title', ogTitle)
    if (ogDescription) updateOGTag('og:description', ogDescription)
    if (ogImage) updateOGTag('og:image', ogImage)
    if (ogUrl) updateOGTag('og:url', ogUrl)
    if (ogType) updateOGTag('og:type', ogType)

    // Twitter Card tags
    const updateTwitterTag = (name: string, content: string) => {
      let twitterTag = document.querySelector(`meta[name="${name}"]`) as HTMLMetaElement | null
      if (twitterTag) {
        twitterTag.content = content
      } else {
        twitterTag = document.createElement('meta') as HTMLMetaElement
        twitterTag.name = name
        twitterTag.content = content
        document.head.appendChild(twitterTag)
      }
    }

    if (twitterCard) updateTwitterTag('twitter:card', twitterCard)
    if (twitterTitle) updateTwitterTag('twitter:title', twitterTitle)
    if (twitterDescription) updateTwitterTag('twitter:description', twitterDescription)
    if (twitterImage) updateTwitterTag('twitter:image', twitterImage)

    // Structured Data
    if (structuredData) {
      let script = document.querySelector('script[type="application/ld+json"]') as HTMLScriptElement | null
      if (script) {
        script.textContent = JSON.stringify(structuredData)
      } else {
        script = document.createElement('script') as HTMLScriptElement
        script.type = 'application/ld+json'
        script.textContent = JSON.stringify(structuredData)
        document.head.appendChild(script)
      }
    }

    // Viewport meta tag for mobile responsiveness
    let viewport = document.querySelector('meta[name="viewport"]') as HTMLMetaElement | null
    if (!viewport) {
      viewport = document.createElement('meta') as HTMLMetaElement
      viewport.name = 'viewport'
      viewport.content = 'width=device-width, initial-scale=1'
      document.head.appendChild(viewport)
    }

    // Language attribute
    const html = document.documentElement
    if (!html.lang) {
      html.lang = 'en'
    }

  }, [
    title, description, keywords, canonical, ogTitle, ogDescription, ogImage, 
    ogUrl, ogType, twitterCard, twitterTitle, twitterDescription, twitterImage, 
    structuredData, noIndex, pathname
  ])

  return null
}
