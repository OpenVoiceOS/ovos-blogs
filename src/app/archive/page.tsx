import Container from "@/app/_components/container";
import { getAllPosts } from "@/lib/api";
import Link from "next/link";
import PostCard from "@/app/_components/post-card";

export default function Archive() {
  const allPosts = getAllPosts().sort((a, b) => {
    const dateA = new Date(a.date).getTime();
    const dateB = new Date(b.date).getTime();
    return dateB - dateA;
  });

  return (
    <Container>
      <div className="max-w-5xl mx-auto">
        <div className="mb-8 pt-4 pb-6">
          <div className="border-b border-mono-200 dark:border-mono-800 pb-6">
            <h1 className="text-3xl md:text-4xl font-bold mb-3 text-mono-900 dark:text-mono-100">
              Browse Our <span className="text-accent">Archive</span>
            </h1>
            <p className="text-base md:text-lg text-mono-600 dark:text-mono-400 max-w-3xl">
              Discover all articles from the OpenVoiceOS ecosystem. Search through our collection
              of guides, updates, and insights.
            </p>
          </div>
        </div>

        {/* Post count indicator and back to home link */}
        <div className="mb-6 flex flex-wrap justify-between items-center">
          <p className="text-sm font-medium text-mono-600 dark:text-mono-400">
            {allPosts.length === 1
              ? '1 article'
              : `${allPosts.length} articles`}
          </p>
          <div className="text-sm font-medium text-accent">
            <Link href="/" className="flex items-center gap-1 hover:underline">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                strokeWidth="2" stroke="currentColor" className="w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
              </svg>
              Back to Home
            </Link>
          </div>
        </div>

        {/* Results grid with plain theme */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {allPosts.map((post) => (
            <div key={post.slug} className="relative">
              <PostCard
                title={post.title}
                date={post.date}
                author={post.author}
                slug={post.slug}
                excerpt={post.excerpt}
              />
            </div>
          ))}
        </div>
      </div>
    </Container>
  );
}