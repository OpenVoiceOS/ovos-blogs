import { getAllPosts } from "@/lib/api";
import markdownToHtml from "@/lib/markdownToHtml";
import RSS from "rss";
import { NextResponse } from "next/server";

export const dynamic = "force-static";

export async function GET() {
  const posts = getAllPosts();
  
  const feed = new RSS({
    title: "OpenVoiceOS Blog",
    description: "Latest news and updates from the OpenVoiceOS community",
    site_url: "https://openvoiceos.github.io/ovos-blogs",
    feed_url: "https://openvoiceos.github.io/ovos-blogs/feed.xml",
    copyright: `Copyright ${new Date().getFullYear()}, OpenVoiceOS`,
    language: "en-US",
    pubDate: new Date(),
    ttl: 60,
  });

  // Process posts with full content
  for (const post of posts) {
    const htmlContent = await markdownToHtml(post.content || "");
    
    feed.item({
      title: post.title,
      description: htmlContent,
      url: `https://openvoiceos.github.io/ovos-blogs/posts/${post.slug}`,
      guid: `https://openvoiceos.github.io/ovos-blogs/posts/${post.slug}`,
      date: new Date(post.date),
      author: post.author?.name || "OpenVoiceOS Team",
    });
  }

  return new NextResponse(feed.xml(), {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
    },
  });
}
