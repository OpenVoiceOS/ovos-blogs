import Header from "@/app/_components/header";
import Footer from "@/app/_components/footer";
import { CMS_NAME, HOME_OG_IMAGE_URL } from "@/lib/constants";
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
  title: `OpenVoiceOS Blog`,
  description: `Official blog for OpenVoiceOS - The open-source voice operating system`,
  openGraph: {
    images: [HOME_OG_IMAGE_URL],
    title: "OpenVoiceOS Blog",
    description:
      "Official blog for OpenVoiceOS - The open-source voice operating system",
    url: "https://blog.openvoiceos.org",
    siteName: "OpenVoiceOS Blog",
  },
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
        <link rel="alternate" type="application/rss+xml" href="/feed.xml" />
      </head>
      <body
        className={cn(
          "min-h-screen font-sans antialiased text-mono-800 bg-mono-100 dark:text-mono-100 dark:bg-mono-900",
        )}
      >
        <div className="fixed bottom-4 right-4 z-50 md:bottom-6 md:right-6">
          <ThemeSwitcher />
        </div>
        <Header />
        <div className="container mx-auto px-4 md:px-6 lg:px-8 py-8 min-h-screen">
          {children}
        </div>
        <Footer />
      </body>
    </html>
  );
}
