/**
 * SEO Constants for Everyday AI
 * Centralized configuration for all SEO-related metadata
 */

export const SEO_CONFIG = {
  // Basic Site Information
  siteName: 'Everyday AI',
  siteUrl: 'https://everyday-ai-tools.vercel.app',
  description: 'AI-powered tools for everyday productivity',
  defaultDescription:
    'Discover AI-powered tools for email enhancement, travel planning, and news curation. Boost your productivity with intelligent solutions.',

  // Contact Information
  contact: {
    telephone: '+91-9876543210',
    email: 'support@everydayai.com',
    address: {
      streetAddress: '123 Tech Street',
      addressLocality: 'Bangalore',
      addressRegion: 'Karnataka',
      postalCode: '560001',
      addressCountry: 'IN',
    },
  },

  // Social Media
  social: {
    twitter: '@everydayai',
    github: 'https://github.com/vkondi/everyday-ai',
    linkedin: 'https://linkedin.com/company/everyday-ai',
  },

  // Images
  images: {
    default: '/thumbnail.png',
    ogImage: '/thumbnail.png',
    logo: '/thumbnail.png',
  },

  // Keywords
  keywords: [
    'AI tools',
    'productivity',
    'smart email',
    'travel itinerary',
    'news digest',
    'artificial intelligence',
    'email enhancement',
    'travel planning',
    'news curation',
  ],

  // Structured Data
  structuredData: {
    organization: {
      type: 'Organization' as const,
      foundingDate: '2025',
      contactType: 'Customer Support',
      areaServed: 'Worldwide',
      availableLanguages: ['English', 'Hindi'],
    },
  },
};

// Page-specific SEO configurations
export const PAGE_SEO = {
  home: {
    title: 'Everyday AI - AI-Powered Tools for Everyday Productivity',
    description:
      'Discover AI-powered tools for email enhancement, travel planning, and news curation. Boost your productivity with intelligent solutions.',
    keywords: [...SEO_CONFIG.keywords, 'home', 'dashboard'],
    ogTitle: 'Everyday AI - AI-Powered Tools for Everyday Productivity',
    ogDescription:
      'Discover AI-powered tools for email enhancement, travel planning, and news curation. Boost your productivity with intelligent solutions.',
    twitterTitle: 'Everyday AI - AI-Powered Tools for Everyday Productivity',
    twitterDescription:
      'Discover AI-powered tools for email enhancement, travel planning, and news curation. Boost your productivity with intelligent solutions.',
  },

  dashboard: {
    title: 'Everyday AI Dashboard - AI-Powered Productivity Tools',
    description:
      'Discover AI-powered tools for email enhancement, travel planning, and news curation. Boost your productivity with intelligent solutions.',
    keywords: [...SEO_CONFIG.keywords, 'dashboard', 'tools'],
    ogTitle: 'Everyday AI Dashboard - AI-Powered Productivity Tools',
    ogDescription:
      'Discover AI-powered tools for email enhancement, travel planning, and news curation. Boost your productivity with intelligent solutions.',
    twitterTitle: 'Everyday AI Dashboard - AI-Powered Productivity Tools',
    twitterDescription:
      'Discover AI-powered tools for email enhancement, travel planning, and news curation. Boost your productivity with intelligent solutions.',
  },

  smartEmail: {
    title: 'Smart Email Tool - AI-Powered Email Enhancement',
    description:
      'Transform your emails with AI-powered suggestions for tone, clarity, and professionalism. Perfect for business communication and personal correspondence.',
    keywords: [
      ...SEO_CONFIG.keywords,
      'smart email',
      'email enhancement',
      'tone analysis',
      'professional email',
    ],
    ogTitle: 'Smart Email Tool - AI-Powered Email Enhancement',
    ogDescription:
      'Transform your emails with AI-powered suggestions for tone, clarity, and professionalism. Perfect for business communication and personal correspondence.',
    twitterTitle: 'Smart Email Tool - AI-Powered Email Enhancement',
    twitterDescription:
      'Transform your emails with AI-powered suggestions for tone, clarity, and professionalism. Perfect for business communication and personal correspondence.',
  },

  travelItinerary: {
    title: 'Travel Itinerary Builder - AI-Powered Trip Planning',
    description:
      'Create personalized travel plans with AI recommendations for destinations, activities, and budget optimization. Your perfect trip, crafted intelligently.',
    keywords: [
      ...SEO_CONFIG.keywords,
      'travel itinerary',
      'trip planning',
      'travel planning',
      'budget optimization',
    ],
    ogTitle: 'Travel Itinerary Builder - AI-Powered Trip Planning',
    ogDescription:
      'Create personalized travel plans with AI recommendations for destinations, activities, and budget optimization. Your perfect trip, crafted intelligently.',
    twitterTitle: 'Travel Itinerary Builder - AI-Powered Trip Planning',
    twitterDescription:
      'Create personalized travel plans with AI recommendations for destinations, activities, and budget optimization. Your perfect trip, crafted intelligently.',
  },

  newsDigest: {
    title: 'News Digest - AI-Curated News Summaries',
    description:
      'Stay informed with AI-curated news summaries tailored to your interests. Get the most relevant stories without the noise.',
    keywords: [
      ...SEO_CONFIG.keywords,
      'news digest',
      'news curation',
      'AI news',
      'personalized news',
    ],
    ogTitle: 'News Digest - AI-Curated News Summaries',
    ogDescription:
      'Stay informed with AI-curated news summaries tailored to your interests. Get the most relevant stories without the noise.',
    twitterTitle: 'News Digest - AI-Curated News Summaries',
    twitterDescription:
      'Stay informed with AI-curated news summaries tailored to your interests. Get the most relevant stories without the noise.',
  },
};

// Open Graph and Twitter Card defaults
export const SOCIAL_MEDIA = {
  ogType: 'website' as const,
  twitterCard: 'summary_large_image' as const,
  imageAlt: 'Everyday AI - AI-powered tools for everyday productivity',
  locale: 'en_US' as const,
};

// Robots configuration
export const ROBOTS = {
  index: true,
  follow: true,
  googleBot: {
    index: true,
    follow: true,
    'max-video-preview': -1,
    'max-image-preview': 'large' as const,
    'max-snippet': -1,
  },
};

// Viewport configuration
export const VIEWPORT = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

// Sitemap configuration
export const SITEMAP = {
  changefreq: 'weekly' as const,
  priority: {
    home: 1.0,
    dashboard: 0.9,
    tools: 0.8,
  },
};
