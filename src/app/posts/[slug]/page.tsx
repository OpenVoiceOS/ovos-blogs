import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getAllPosts, getPostBySlug } from "@/lib/api";
import markdownToHtml from "@/lib/markdownToHtml";
import Alert from "@/app/_components/alert";
import Container from "@/app/_components/container";
import { PostBody } from "@/app/_components/post-body";
import { PostHeader } from "@/app/_components/post-header";
import Link from "next/link";

export default async function Post(props: Params) {
  const params = await props.params;
  const post = getPostBySlug(params.slug);

  if (!post) {
    return notFound();
  }

  const content = await markdownToHtml(post.content || "");
  const allPosts = getAllPosts();

  // Find the current post index
  const currentPostIndex = allPosts.findIndex((p) => p.slug === post.slug);

  // Get previous and next posts for navigation
  const prevPost =
    currentPostIndex < allPosts.length - 1
      ? allPosts[currentPostIndex + 1]
      : null;
  const nextPost = currentPostIndex > 0 ? allPosts[currentPostIndex - 1] : null;

  return (
    <>
      {post.preview && <Alert preview={post.preview} />}

      <article className="mb-16">
        <PostHeader
          title={post.title}
          coverImage={post.coverImage}
          date={post.date}
          author={post.author}
        />

        <Container>
          <div className="max-w-3xl mx-auto">
            <PostBody content={content} />

            <div className="border-t border-mono-200 dark:border-mono-800 mt-12 pt-8">
              <div className="flex flex-col sm:flex-row gap-6 justify-between items-start sm:items-center">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 rounded-full overflow-hidden">
                    <img
                      src={post.author.picture}
                      alt={post.author.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <p className="font-medium text-mono-900 dark:text-mono-100">
                      {post.author.name}
                    </p>
                    <p className="text-sm text-mono-600 dark:text-mono-400">
                      Author
                    </p>
                  </div>
                </div>

                <div className="flex space-x-4">
                  <a
                    href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(post.title)}&url=${encodeURIComponent(`https://blog.openvoiceos.org/posts/${post.slug}`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-mono-500 hover:text-accent dark:hover:text-accent transition-colors duration-200"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                    </svg>
                  </a>
                  <a
                    href={`https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(`https://blog.openvoiceos.org/posts/${post.slug}`)}&title=${encodeURIComponent(post.title)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-mono-500 hover:text-accent dark:hover:text-accent transition-colors duration-200"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                    </svg>
                  </a>
                </div>
              </div>
            </div>

            {/* Post navigation */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12">
              {prevPost && (
                <Link
                  href={`/posts/${prevPost.slug}`}
                  className="p-6 flex flex-col border border-mono-200 dark:border-mono-800 rounded-lg hover:border-accent hover:shadow-md transition-all duration-200"
                >
                  <span className="text-sm text-mono-500 dark:text-mono-400 mb-2">
                    Previous Article
                  </span>
                  <span className="font-semibold text-mono-900 dark:text-mono-100">
                    {prevPost.title}
                  </span>
                </Link>
              )}

              {nextPost && (
                <Link
                  href={`/posts/${nextPost.slug}`}
                  className="p-6 flex flex-col border border-mono-200 dark:border-mono-800 rounded-lg hover:border-accent hover:shadow-md transition-all duration-200 md:ml-auto"
                >
                  <span className="text-sm text-mono-500 dark:text-mono-400 mb-2">
                    Next Article
                  </span>
                  <span className="font-semibold text-mono-900 dark:text-mono-100">
                    {nextPost.title}
                  </span>
                </Link>
              )}
            </div>
          </div>
        </Container>
      </article>

      {/* Related content section */}
      <div className="bg-gradient-to-b from-mono-200/50 to-mono-100 dark:from-mono-800/50 dark:to-mono-900 py-16">
        <Container>
          <div className="max-w-5xl mx-auto">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-accent-dark to-accent bg-clip-text text-transparent">
                More Articles You Might Enjoy
              </h2>
              <Link
                href="/"
                className="text-sm font-medium text-accent hover:text-accent-light dark:text-accent dark:hover:text-accent-light flex items-center gap-1 transition-colors duration-200"
              >
                View all
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                  className="w-4 h-4"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
                  />
                </svg>
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {allPosts
                .filter((p) => p.slug !== post.slug)
                .slice(0, 3)
                .map((relatedPost) => (
                  <div key={relatedPost.slug} className="group">
                    <Link
                      href={`/posts/${relatedPost.slug}`}
                      className="block rounded-lg overflow-hidden shadow-sm group-hover:shadow-md transition-all duration-200 bg-mono-100 dark:bg-mono-800/60"
                    >
                      <div className="relative h-52 overflow-hidden">
                        <img
                          src={relatedPost.coverImage}
                          alt={relatedPost.title}
                          className="object-cover w-full h-full transform group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-mono-900/50 to-transparent opacity-60"></div>
                        <div className="absolute bottom-3 left-4">
                          <span className="inline-block px-3 py-1 text-xs font-medium bg-accent/90 text-white rounded-full">
                            Article
                          </span>
                        </div>
                      </div>
                      <div className="p-5">
                        <h3 className="font-bold text-lg mb-2 text-mono-900 dark:text-mono-100 group-hover:text-accent dark:group-hover:text-accent transition-colors duration-200">
                          {relatedPost.title}
                        </h3>
                        <p className="text-mono-700 dark:text-mono-300 text-sm line-clamp-2 mb-4">
                          {relatedPost.excerpt}
                        </p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 rounded-full overflow-hidden ring-2 ring-mono-200 dark:ring-mono-700">
                              <img
                                src={relatedPost.author.picture}
                                alt={relatedPost.author.name}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div className="text-xs">
                              <p className="font-medium text-mono-900 dark:text-mono-200">
                                {relatedPost.author.name}
                              </p>
                              <p className="text-mono-600 dark:text-mono-400">
                                {new Date(relatedPost.date).toLocaleDateString(
                                  "en-US",
                                  {
                                    month: "short",
                                    day: "numeric",
                                    year: "numeric",
                                  },
                                )}
                              </p>
                            </div>
                          </div>
                          <span className="text-accent dark:text-accent">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              strokeWidth={2}
                              stroke="currentColor"
                              className="w-4 h-4"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M8.25 4.5l7.5 7.5-7.5 7.5"
                              />
                            </svg>
                          </span>
                        </div>
                      </div>
                    </Link>
                  </div>
                ))}
            </div>

            <div className="mt-12 text-center">
              <div className="inline-block rounded-full bg-mono-200 dark:bg-mono-800 p-1">
                <div className="flex items-center gap-2 px-4 py-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-5 h-5 text-accent dark:text-accent"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z"
                    />
                  </svg>
                  <span className="text-sm font-medium text-mono-700 dark:text-mono-300">
                    Explore other topics on our{" "}
                    <Link
                      href="/"
                      className="text-accent hover:text-accent-light dark:text-accent dark:hover:text-accent-light transition-colors duration-200"
                    >
                      homepage
                    </Link>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </div>
    </>
  );
}

type Params = {
  params: Promise<{
    slug: string;
  }>;
};

export async function generateMetadata(props: Params): Promise<Metadata> {
  const params = await props.params;
  const post = getPostBySlug(params.slug);

  if (!post) {
    return notFound();
  }

  const title = `${post.title} | OpenVoiceOS Blog`;
  const description = post.excerpt || "";

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [post.ogImage.url],
      type: "article",
      publishedTime: post.date,
      authors: [post.author.name],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [post.ogImage.url],
    },
  };
}

export async function generateStaticParams() {
  const posts = getAllPosts();

  return posts.map((post) => ({
    slug: post.slug,
  }));
}
