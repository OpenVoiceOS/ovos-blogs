import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getAllPosts, getPostBySlug } from "@/lib/api";
import markdownToHtml from "@/lib/markdownToHtml";
import Alert from "@/app/_components/alert";
import Container from "@/app/_components/container";
import { PostBody } from "@/app/_components/post-body";
import { PostHeader } from "@/app/_components/post-header";
import Link from "next/link";
import DateFormatter from "@/app/_components/date-formatter";

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

  // Generate a random stripe color from a set of vibrant colors for the postmark effect
  const stripeColors = [
    "bg-red-500",
    "bg-blue-500",
    "bg-green-500",
    "bg-purple-500",
    "bg-pink-500",
    "bg-teal-500",
  ];

  // Create hash from slug to ensure consistent color for each post
  const hashCode = post.slug
    .split("")
    .reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const colorIndex = hashCode % stripeColors.length;
  const stripeColor = stripeColors[colorIndex];

  return (
    <>
      {post.preview && <Alert preview={post.preview} />}

      <article className="mb-8 pt-16 sm:pt-24 sm:mb-16">
        <Container>
          <div className="max-w-4xl mx-auto">
            {/* Simplified header card with reduced padding on mobile */}
            <div className="mb-6 sm:mb-10">
              <div className="relative bg-white dark:bg-mono-800 border border-mono-200 dark:border-mono-700 rounded-lg p-4 sm:p-6 md:p-8 shadow-sm sm:shadow-md overflow-hidden">
                <div className="flex justify-between items-center mb-4">
                  <div className="text-sm text-mono-500 dark:text-mono-400">
                    <DateFormatter dateString={post.date} />
                  </div>
                </div>

                <div className="md:px-2">
                  {/* Title with clean appearance */}
                  <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 sm:mb-6 text-mono-800 dark:text-mono-200">
                    {post.title}
                  </h1>

                  {/* Author info - simplified for mobile */}
                  <div className="mb-4 sm:mb-6">
                    <div className="flex items-center">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full overflow-hidden border-2 border-mono-200 dark:border-mono-700 mr-3 sm:mr-4">
                        <img
                          src={post.author.picture}
                          alt={post.author.name}
                          className="w-full h-full object-cover"
                          loading="lazy"
                        />
                      </div>
                      <div>
                        <p className="font-medium text-mono-900 dark:text-mono-100">
                          {post.author.name}{post.coauthors && post.coauthors.length > 0 ? " (Lead Author)" : ""}
                        </p>
                        <p className="text-sm text-mono-600 dark:text-mono-400">
                          OVOS Contributor
                        </p>
                      </div>
                    </div>
                    
                    {/* Co-authors section */}
                    {post.coauthors && post.coauthors.length > 0 && (
                      <div className="mt-4">
                        <p className="text-sm font-medium text-mono-700 dark:text-mono-300 mb-2">
                          Co-authors:
                        </p>
                        <div className="flex flex-wrap gap-3">
                          {post.coauthors.map((coauthor, index) => (
                            <div key={index} className="flex items-center">
                              <div className="w-8 h-8 rounded-full overflow-hidden border-2 border-mono-200 dark:border-mono-700 mr-2">
                                <img
                                  src={coauthor.picture}
                                  alt={coauthor.name}
                                  className="w-full h-full object-cover"
                                  loading="lazy"
                                />
                              </div>
                              <div>
                                <p className="text-sm font-medium text-mono-900 dark:text-mono-100">
                                  {coauthor.name}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Cover image with lazy loading */}
                  {post.coverImage && (
                    <div className="relative aspect-video rounded-lg overflow-hidden shadow-sm mb-4 sm:mb-8">
                      <img
                        src={post.coverImage}
                        alt={post.title}
                        className="w-full h-full object-fill"
                        loading="lazy"
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Post body with reduced padding on mobile */}
            <div className="bg-white dark:bg-mono-800 border border-mono-200 dark:border-mono-700 rounded-lg p-4 sm:p-6 md:p-8 shadow-sm sm:shadow-md">
              <div
                className="prose dark:prose-invert 
                prose-headings:text-mono-800 dark:prose-headings:text-mono-100
                prose-p:text-mono-700 dark:prose-p:text-mono-300
                prose-a:text-accent hover:prose-a:text-accent-light
                prose-img:rounded-md prose-img:shadow-sm
                max-w-none prose-sm sm:prose-base"
              >
                <PostBody content={content} />
              </div>

              <div className="mt-6 pt-6 sm:mt-10 sm:pt-8 border-t border-mono-200 dark:border-mono-700">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-6">
                  <div className="flex items-center">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full overflow-hidden border-2 border-mono-200 dark:border-mono-700 mr-3 sm:mr-4">
                      <img
                        src={post.author.picture}
                        alt={post.author.name}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    </div>
                    <div>
                      <p className="font-medium text-mono-900 dark:text-mono-100">
                        {post.author.name}
                      </p>
                      <p className="text-sm text-mono-600 dark:text-mono-400">
                        <DateFormatter dateString={post.date} />
                      </p>
                    </div>
                  </div>

                  {/* Simplified share buttons */}
                  <div className="flex space-x-3 mt-4 sm:mt-0">
                    <a
                      href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(post.title)}&url=${encodeURIComponent(`https://blog.openvoiceos.org/posts/${post.slug}`)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-mono-500 hover:text-accent dark:hover:text-accent transition-colors duration-200 p-2 rounded-full bg-mono-100 dark:bg-mono-700"
                      aria-label="Share on Twitter"
                    >
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                      </svg>
                    </a>
                    <a
                      href={`https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(`https://blog.openvoiceos.org/posts/${post.slug}`)}&title=${encodeURIComponent(post.title)}`}
                      target="_blank"
                      rel="noopener noreferrer" 
                      className="text-mono-500 hover:text-accent dark:hover:text-accent transition-colors duration-200 p-2 rounded-full bg-mono-100 dark:bg-mono-700"
                      aria-label="Share on LinkedIn"
                    >
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                      </svg>
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Simplified post navigation */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mt-6 sm:mt-10">
              {prevPost && (
                <Link
                  href={`/posts/${prevPost.slug}`}
                  className="flex flex-col border border-mono-200 dark:border-mono-700 rounded-lg hover:shadow-md transition-all duration-200 bg-white dark:bg-mono-800 p-3 sm:p-5 group"
                >
                  <div className="flex items-start">
                    <div className="mr-3">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={2}
                        stroke="currentColor"
                        className="w-5 h-5 text-mono-600 dark:text-mono-300"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M19.5 12h-15m0 0l6.75 6.75M4.5 12l6.75-6.75"
                        />
                      </svg>
                    </div>
                    <div>
                      <span className="text-xs sm:text-sm text-mono-500 dark:text-mono-400 block mb-1 font-medium">
                        Previous
                      </span>
                      <span className="font-semibold text-base sm:text-lg text-mono-900 dark:text-mono-100 line-clamp-1 group-hover:text-accent transition-colors">
                        {prevPost.title}
                      </span>
                    </div>
                  </div>
                </Link>
              )}

              {nextPost && (
                <Link
                  href={`/posts/${nextPost.slug}`}
                  className="flex flex-col border border-mono-200 dark:border-mono-700 rounded-lg hover:shadow-md transition-all duration-200 bg-white dark:bg-mono-800 p-3 sm:p-5 group sm:ml-auto"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-xs sm:text-sm text-mono-500 dark:text-mono-400 block mb-1 font-medium">
                        Next
                      </span>
                      <span className="font-semibold text-base sm:text-lg text-mono-900 dark:text-mono-100 line-clamp-1 group-hover:text-accent transition-colors">
                        {nextPost.title}
                      </span>
                    </div>
                    <div className="ml-3">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={2}
                        stroke="currentColor"
                        className="w-5 h-5 text-mono-600 dark:text-mono-300"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M4.5 12h15m0 0l-6.75-6.75M19.5 12l-6.75 6.75"
                        />
                      </svg>
                    </div>
                  </div>
                </Link>
              )}
            </div>
          </div>
        </Container>
      </article>
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
