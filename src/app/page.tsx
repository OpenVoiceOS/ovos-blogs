import Container from "@/app/_components/container";
import { Intro } from "@/app/_components/intro";
import { getAllPosts } from "@/lib/api";
import PostCard from "@/app/_components/post-card";

export default function Index() {
  const allPosts = getAllPosts();

  return (
    <Container>
      <div className="max-w-4xl mx-auto">
        <Intro />

        <div className="space-y-10 pb-10">
          <section>
            <h2 className="text-lg font-medium mb-4 text-mono-600 dark:text-mono-400">
              Latest Articles
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {allPosts.map((post) => (
                <PostCard
                  key={post.slug}
                  title={post.title}
                  date={post.date}
                  author={post.author}
                  slug={post.slug}
                  excerpt={post.excerpt}
                />
              ))}
            </div>
          </section>

          <div className="border-t border-mono-200 dark:border-mono-800 pt-8 mt-10">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-left">
                <h2 className="text-lg font-medium mb-1 text-mono-800 dark:text-mono-200">
                  Subscribe to Updates
                </h2>
                <p className="text-sm text-mono-600 dark:text-mono-400">
                  Get the latest OpenVoiceOS news in your inbox.
                </p>
              </div>
              <div className="flex w-full sm:w-auto">
                <input
                  type="email"
                  placeholder="Email address"
                  className="flex-grow px-3 py-1.5 text-xs rounded-l-md border border-mono-300 dark:border-mono-700 bg-mono-100 dark:bg-mono-800 focus:outline-none focus:ring-1 focus:ring-accent text-mono-800 dark:text-mono-200"
                />
                <button className="bg-accent hover:bg-accent-light text-white px-3 py-1.5 text-xs rounded-r-md transition-colors">
                  Subscribe
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Container>
  );
}
