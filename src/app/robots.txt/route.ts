import { NextResponse } from "next/server";

export const dynamic = "force-static";

export async function GET() {
  const robotsTxt = `User-agent: *
Allow: /

# Disallow crawling of any admin or private directories
Disallow: /api/
Disallow: /_next/
Disallow: /admin/

# Allow crawling of RSS feed
Allow: /feed.xml

# Crawl delay (be respectful)
Crawl-delay: 1

# Sitemap location
Sitemap: https://openvoiceos.github.io/ovos-blogs/sitemap.xml`;

  return new NextResponse(robotsTxt, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
    },
  });
}
