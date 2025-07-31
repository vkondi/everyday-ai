import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { ModelProvider } from "@/components/model-context";
import { Analytics } from '@vercel/analytics/next';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Everyday AI",
  description: "AI-powered tools for everyday productivity",
  openGraph: {
    title: "Everyday AI",
    description: "AI-powered tools for everyday productivity",
    type: "website",
    url: "https://everyday-ai-tools.vercel.app",
    siteName: "Everyday AI",
    images: [
      {
        url: "https://everyday-ai-tools.vercel.app/thumbnail.png",
        width: 1912,
        height: 802,
        alt: "Everyday AI - AI-powered tools for everyday productivity",
        type: "image/png",
      },
    ],
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Everyday AI",
    description: "AI-powered tools for everyday productivity",
    images: ["https://everyday-ai-tools.vercel.app/thumbnail.png"],
    creator: "@everydayai",
  },
  robots: {
    index: true,
    follow: true,
  },
  viewport: {
    width: "device-width",
    initialScale: 1,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const token = process.env.CLOUDFLARE_WEB_ANALYTICS_TOKEN;
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <ModelProvider>{children}</ModelProvider>
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
