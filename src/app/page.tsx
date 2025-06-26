import Container from "@/app/_components/container";
import { Intro } from "@/app/_components/intro";
import { getAllPosts } from "@/lib/api";
import PostCard from "@/app/_components/post-card";
import Link from "next/link";

export default function Index() {
  const allPosts = getAllPosts();

  // Feature the most recent post
  const featuredPost = allPosts[0];
  const regularPosts = allPosts.slice(1);

  return (
    <Container>
      <div className="max-w-5xl mx-auto pt-12">
        <Intro />

        {/* Featured post */}

        <section className="mb-16">
          <div className="bg-white dark:bg-mono-800 rounded-lg shadow-md">
            <div className="flex flex-col md:flex-row gap-8 p-6 md:p-8">
              <div className="md:w-1/2">
                <div className="relative aspect-video rounded-lg overflow-hidden shadow-sm border border-mono-200 dark:border-mono-700">
                  <img
                    src={
                      featuredPost.coverImage ||
                      "/assets/blog/default-cover.jpg"
                    }
                    alt={featuredPost.title}
                    className="object-cover w-full h-full"
                  />
                </div>
              </div>
              <div className="md:w-1/2 flex flex-col justify-center">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-sm font-medium text-accent">
                    Featured Article
                  </span>
                </div>
                <h2 className="text-2xl md:text-3xl font-bold mb-3 text-mono-900 dark:text-mono-100">
                  {featuredPost.title}
                </h2>
                <p className="text-mono-600 dark:text-mono-400 mb-4 line-clamp-3">
                  {featuredPost.excerpt}
                </p>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 rounded-full overflow-hidden bg-mono-200 dark:bg-mono-700 border border-mono-300 dark:border-mono-600">
                    <img
                      src={featuredPost.author.picture}
                      alt={featuredPost.author.name}
                      className="w-full h-full object-fill"
                    />
                  </div>
                  <span className="text-sm text-mono-700 dark:text-mono-300">
                    {featuredPost.author.name}
                    {featuredPost.coauthors && featuredPost.coauthors.length > 0 && ` +${featuredPost.coauthors.length}`}
                  </span>
                  <span className="text-mono-400 dark:text-mono-500">•</span>
                  <span className="text-sm text-mono-500 dark:text-mono-400">
                    {new Date(featuredPost.date).toLocaleDateString("en-US", {
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </span>
                </div>
                <Link
                  href={`/posts/${featuredPost.slug}`}
                  className="inline-flex items-center px-4 py-2 rounded-lg bg-accent hover:bg-accent-light dark:bg-accent-light dark:hover:bg-accent text-white transition-colors w-fit"
                >
                  Read Article
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    className="w-4 h-4 ml-1"
                  >
                    <path
                      fillRule="evenodd"
                      d="M3 10a.75.75 0 01.75-.75h10.638L10.23 5.29a.75.75 0 111.04-1.08l5.5 5.25a.75.75 0 010 1.08l-5.5 5.25a.75.75 0 11-1.04-1.08l4.158-3.96H3.75A.75.75 0 013 10z"
                      clipRule="evenodd"
                    />
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        </section>

        <div className="space-y-10 pb-10">
          <section>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-mono-900 dark:text-mono-100">
                  Latest Articles
                </h2>
              </div>
              <div className="flex items-center gap-2 text-accent hover:text-accent-light dark:text-accent-light dark:hover:text-accent transition-colors cursor-pointer">
                <Link href="/archive" className="text-sm font-medium">Browse Archive</Link>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-4 h-4 ml-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {regularPosts.slice(0, 6).map((post) => (
                <div key={post.slug} className="relative">
                  <PostCard
                  title={post.title}
                  date={post.date}
                  author={post.author}
                  coauthors={post.coauthors}
                  slug={post.slug}
                  excerpt={post.excerpt}
                  />
                </div>
                ))}
            </div>

            {/* Want to submit a blog section */}
            <div className="mt-16 bg-mono-100 dark:bg-mono-800 rounded-lg p-8 text-center">
              <h3 className="text-2xl font-bold mb-4 text-mono-900 dark:text-mono-100">Want to submit a blog?</h3>
              <p className="text-mono-700 dark:text-mono-300 mb-6 max-w-2xl mx-auto">
                Share your knowledge with the OpenVoiceOS community! We welcome contributions on topics related to OpenVoiceOS, 
                voice assistants, open-source technology, and more.
              </p>
              <Link 
                href="/newblog" 
                className="inline-block bg-accent text-white font-semibold py-3 px-6 rounded-lg hover:text-white"
              >
                Learn How to Contribute
              </Link>
            </div>
          </section>
        </div>
      </div>
    </Container>
  );
}
