import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#0D9488",
};

export const metadata: Metadata = {
  title: {
    default: "StarCatch — Catch your 5-star moments before they disappear",
    template: "%s | StarCatch",
  },
  description:
    "Turn happy customers into Google reviews in under 30 seconds. One-tap review requests with AI-powered sentiment gating. Built for home service contractors.",
  keywords: [
    "google reviews",
    "review management",
    "small business reviews",
    "contractor reviews",
    "plumber reviews",
    "home service reviews",
    "review requests",
    "reputation management",
  ],
  metadataBase: new URL("https://starcatch.io"),
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://starcatch.io",
    siteName: "StarCatch",
    title: "StarCatch — Catch your 5-star moments before they disappear",
    description:
      "Turn happy customers into Google reviews in under 30 seconds. One-tap review requests with AI-powered sentiment gating. Built for home service contractors.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "StarCatch — Catch your 5-star moments before they disappear",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "StarCatch — Catch your 5-star moments before they disappear",
    description:
      "Turn happy customers into Google reviews in under 30 seconds. One-tap review requests with AI-powered sentiment gating.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },
  manifest: "/site.webmanifest",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable}>
      <head>
        {/* Analytics placeholder — replace with your analytics script */}
        {process.env.NODE_ENV === "production" && (
          <>
            {/* 
              TODO: Add analytics (e.g., Plausible, PostHog, or GA4)
              <script defer data-domain="starcatch.io" src="https://plausible.io/js/script.js" />
            */}
          </>
        )}
      </head>
      <body
        className={`${inter.className} min-h-screen bg-white text-gray-900 antialiased`}
      >
        {children}
      </body>
    </html>
  );
}