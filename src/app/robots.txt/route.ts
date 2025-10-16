import { NextResponse } from "next/server";

export const dynamic = "force-static";

export async function GET() {
  const robotsTxt = `User-agent: *
Allow: /

Sitemap: https://openvoiceos.github.io/ovos-blogs/sitemap.xml`;

  return new NextResponse(robotsTxt, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
    },
  });
}
