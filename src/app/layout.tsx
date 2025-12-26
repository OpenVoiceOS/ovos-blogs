import Header from "@/app/_components/header";
import Footer from "@/app/_components/footer";
import Script from "next/script";
import { 
  CMS_NAME, 
  HOME_OG_IMAGE_URL, 
  SITE_NAME, 
  SITE_DESCRIPTION, 
  SITE_URL,
  SITE_KEYWORDS,
  TWITTER_HANDLE 
} from "@/lib/constants";
import type { Metadata } from "next";
import { Inter, Poppins } from "next/font/google";
import cn from "classnames";
import { ThemeSwitcher } from "./_components/theme-switcher";

import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const poppins = Poppins({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-poppins",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: SITE_NAME,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  keywords: SITE_KEYWORDS,
  authors: [{ name: "OpenVoiceOS Team" }],
  creator: "OpenVoiceOS",
  publisher: "OpenVoiceOS",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: SITE_URL,
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
    siteName: SITE_NAME,
    images: [
      {
        url: HOME_OG_IMAGE_URL,
        width: 1200,
        height: 630,
        alt: SITE_NAME,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
    site: TWITTER_HANDLE,
    creator: TWITTER_HANDLE,
    images: [HOME_OG_IMAGE_URL],
  },
  category: "technology",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${poppins.variable}`}>
      <head>
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/favicon/apple-touch-icon.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon/favicon-16x16.png"
        />
        <link rel="manifest" href="/favicon/site.webmanifest" />
        <link
          rel="mask-icon"
          href="/favicon/safari-pinned-tab.svg"
          color="#000000"
        />
        <link rel="shortcut icon" href="/favicon/favicon.ico" />
        <meta name="msapplication-TileColor" content="#000000" />
        <meta
          name="msapplication-config"
          content="/favicon/browserconfig.xml"
        />
        <meta name="theme-color" content="#000" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, viewport-fit=cover"
        />
        <link rel="canonical" href={SITE_URL} />
        <link rel="alternate" type="application/rss+xml" href="/feed.xml" title={`${SITE_NAME} RSS Feed`} />
        <link rel="stylesheet" href="/assets/css/highlight.css" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              "name": SITE_NAME,
              "description": SITE_DESCRIPTION,
              "url": SITE_URL,
              "potentialAction": {
                "@type": "SearchAction",
                "target": `${SITE_URL}/search?q={search_term_string}`,
                "query-input": "required name=search_term_string"
              },
              "publisher": {
                "@type": "Organization",
                "name": "OpenVoiceOS",
                "url": "https://openvoiceos.org",
                "logo": {
                  "@type": "ImageObject",
                  "url": HOME_OG_IMAGE_URL
                }
              }
            })
          }} />

        <Script
            src="https://cdn.tigregotico.pt/api/script.js"
            data-site-id="0715afc5ad9d"
            defer
        ></Script>

      </head>
      <body
        className={cn(
          "min-h-screen font-sans antialiased bg-white dark:bg-mono-900 text-mono-800 dark:text-mono-100",
        )}
      >
        <div className="fixed bottom-4 right-4 z-50 md:bottom-6 md:right-6">
          <ThemeSwitcher />
        </div>
        <Header />
        <div className="container mx-auto px-4 md:px-6 lg:px-8 py-8 min-h-screen bg-white dark:bg-mono-900">
          <div className="dark:text-mono-100">
            {children}
          </div>
        </div>
        <Footer />
      </body>
    </html>
  );
}
