import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/context/theme-provider";
import { ModelProvider } from "@/components/context/model-context";
import { Analytics } from "@vercel/analytics/next";
import {
  WebsiteStructuredData,
  OrganizationStructuredData,
} from "@/components/seo/structured-data";
import { SEO } from "@/components/seo/seo";
import { SEO_CONFIG, SOCIAL_MEDIA } from "@/components/utils/seo-constants";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const token = process.env.CLOUDFLARE_WEB_ANALYTICS_TOKEN;
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Favicon and Web App Configuration */}
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon-16x16.png"
        />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/site.webmanifest" />
        <meta name="theme-color" content="#f59e0b" />

        {/* Preconnect to external domains for performance */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link rel="preconnect" href="https://static.cloudflareinsights.com" />
        <link rel="preconnect" href="https://analytics.vercel.com" />

        {/* Google site verification */}
        <meta
          name="google-site-verification"
          content="wjsrKQApqIPyzuQgutkwO2lvykBJkxNPjFEmTx9qXFg"
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <ModelProvider>
            {/* Global SEO Meta Tags */}
            <SEO
              title={SEO_CONFIG.siteName}
              description={SEO_CONFIG.defaultDescription}
              keywords={SEO_CONFIG.keywords}
              canonical={SEO_CONFIG.siteUrl}
              ogTitle={SEO_CONFIG.siteName}
              ogDescription={SEO_CONFIG.defaultDescription}
              ogUrl={SEO_CONFIG.siteUrl}
              ogType={SOCIAL_MEDIA.ogType}
              twitterCard={SOCIAL_MEDIA.twitterCard}
              twitterTitle={SEO_CONFIG.siteName}
              twitterDescription={SEO_CONFIG.defaultDescription}
              noIndex={false}
            />

            {/* Global Structured Data */}
            <WebsiteStructuredData
              name={SEO_CONFIG.siteName}
              url={SEO_CONFIG.siteUrl}
              description={SEO_CONFIG.description}
              logo={SEO_CONFIG.siteUrl + SEO_CONFIG.images.logo}
              sameAs={[SEO_CONFIG.social.github, SEO_CONFIG.social.twitter]}
            />
            <OrganizationStructuredData
              type={SEO_CONFIG.structuredData.organization.type}
              name={SEO_CONFIG.siteName}
              url={SEO_CONFIG.siteUrl}
              description={SEO_CONFIG.description}
              logo={SEO_CONFIG.siteUrl + SEO_CONFIG.images.logo}
              sameAs={[SEO_CONFIG.social.github, SEO_CONFIG.social.twitter]}
              foundingDate={SEO_CONFIG.structuredData.organization.foundingDate}
              contactPoint={{
                telephone: SEO_CONFIG.contact.telephone,
                contactType: SEO_CONFIG.structuredData.organization.contactType,
                areaServed: SEO_CONFIG.structuredData.organization.areaServed,
                availableLanguage:
                  SEO_CONFIG.structuredData.organization.availableLanguages,
              }}
            />
            {children}
          </ModelProvider>
        </ThemeProvider>

        {/* Cloudflare Web Analytics */}
        <script
          defer
          src="https://static.cloudflareinsights.com/beacon.min.js"
          data-cf-beacon={`{"token": "${token}"}`}
        ></script>
        {/* End Cloudflare Web Analytics */}

        {/* Vercel Analytics */}
        <Analytics />
      </body>
    </html>
  );
}
