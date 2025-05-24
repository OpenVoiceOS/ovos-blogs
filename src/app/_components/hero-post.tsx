import Avatar from "@/app/_components/avatar";
import CoverImage from "@/app/_components/cover-image";
import { type Author } from "@/interfaces/author";
import Link from "next/link";
import DateFormatter from "./date-formatter";

type Props = {
  title: string;
  coverImage: string;
  date: string;
  excerpt: string;
  author: Author;
  slug: string;
};

export function HeroPost({
  title,
  coverImage,
  date,
  excerpt,
  author,
  slug,
}: Props) {
  // Define a consistent accent color for UI elements
  const accentColor = "bg-accent hover:bg-accent-dark";

  return (
    <section className="pb-4">
      <h2 className="text-lg font-bold mb-4 text-mono-600 dark:text-mono-400 flex items-center gap-2">
        FEATURED POST
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 group">
        {/* Cover Image Side */}
        <div className="md:col-span-5 relative aspect-[4/3]">
          <div className="rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-all duration-300">
            <CoverImage title={title} src={coverImage} slug={slug} />
          </div>
        </div>

        {/* Content Side */}
        <div className="md:col-span-7 relative">
          <div className="h-full border border-mono-200 dark:border-mono-700 rounded-lg p-6 
            bg-white dark:bg-mono-800 shadow-sm hover:shadow-md transition-all duration-300">
            {/* Header with date */}
            <div className="flex items-center justify-between mb-3">
              <div className="text-sm text-mono-500 dark:text-mono-400">
                <DateFormatter dateString={date} />
              </div>
              <span className="px-2 py-1 text-xs font-medium rounded bg-accent/10 text-accent">
                Featured
              </span>
            </div>

            {/* Simple divider */}
            <div className="my-3 border-t border-mono-200 dark:border-mono-700"></div>

            {/* Title */}
            <h3 className="text-2xl md:text-3xl font-bold mb-3 text-mono-800 dark:text-mono-200">
              <Link
                href={`/posts/${slug}`}
                className="hover:text-accent transition-colors duration-200"
              >
                {title}
              </Link>
            </h3>

            {/* Content */}
            <p className="text-base text-mono-600 dark:text-mono-400 mb-4 line-clamp-3">
              {excerpt}
            </p>

            {/* Footer */}
            <div className="flex items-center justify-between mt-4 pt-3 border-t border-mono-200 dark:border-mono-700">
              <Avatar name={author.name} picture={author.picture} />
              <Link
                href={`/posts/${slug}`}
                className={`px-4 py-1.5 ${accentColor} text-white rounded text-sm font-medium 
                flex items-center gap-1 transition-all duration-300`}
              >
                Read More
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                  className="w-3 h-3"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M8.25 4.5l7.5 7.5-7.5 7.5"
                  />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
