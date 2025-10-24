import { getAllPosts } from "@/lib/api";
import { NextResponse } from "next/server";
import fs from "fs";
import { join } from "path";

export const dynamic = "force-static";

// Helper function to escape XML entities
function escapeXml(unsafe: string): string {
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

export async function GET() {
  const posts = getAllPosts();
  const baseUrl = "https://openvoiceos.github.io/ovos-blogs";
  
  // Get file modification dates for more accurate lastmod
  const getFileModDate = (slug: string) => {
    try {
      const fullPath = join(process.cwd(), "_posts", `${slug}.md`);
      const stats = fs.statSync(fullPath);
      return stats.mtime.toISOString();
    } catch (error) {
      return new Date().toISOString();
    }
  };

  // Sort posts by date (newest first) for priority calculation
  const sortedPosts = posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" 
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9" 
        xmlns:xhtml="http://www.w3.org/1999/xhtml" 
        xmlns:mobile="http://www.google.com/schemas/sitemap-mobile/1.0" 
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
  <url>
    <loc>${baseUrl}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>${baseUrl}/about</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>${baseUrl}/archive</loc>
    <lastmod>${sortedPosts[0] ? new Date(sortedPosts[0].date).toISOString() : new Date().toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>${baseUrl}/feed.xml</loc>
    <lastmod>${sortedPosts[0] ? new Date(sortedPosts[0].date).toISOString() : new Date().toISOString()}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.8</priority>
  </url>
  ${sortedPosts
    .map((post, index) => {
      // Calculate priority based on recency and position
      const daysSincePublished = Math.floor((Date.now() - new Date(post.date).getTime()) / (1000 * 60 * 60 * 24));
      let priority = 0.7;
      
      // Boost priority for recent posts
      if (daysSincePublished <= 7) priority = 0.9;
      else if (daysSincePublished <= 30) priority = 0.8;
      else if (daysSincePublished <= 90) priority = 0.7;
      else priority = 0.6;
      
      // Cap priority to reasonable bounds
      priority = Math.max(0.5, Math.min(1.0, priority));
      
      const changefreq = daysSincePublished <= 30 ? 'weekly' : 'monthly';
      
      return `
  <url>
    <loc>${baseUrl}/posts/${escapeXml(post.slug)}</loc>
    <lastmod>${getFileModDate(post.slug)}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority.toFixed(1)}</priority>${post.coverImage ? `
    <image:image>
      <image:loc>${baseUrl}${escapeXml(post.coverImage)}</image:loc>
      <image:title>${escapeXml(post.title)}</image:title>
      <image:caption>${escapeXml(post.excerpt || post.title)}</image:caption>
    </image:image>` : ''}
  </url>`;
    })
    .join("")}
</urlset>`;

  return new NextResponse(sitemap, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
    },
  });
}
