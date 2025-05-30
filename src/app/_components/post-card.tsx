import { type Author } from "@/interfaces/author";
import Link from "next/link";
import DateFormatter from "./date-formatter";

type Props = {
  title: string;
  date: string;
  excerpt: string;
  author: Author;
  slug: string;
};

export default function PostCard({
  title,
  date,
  excerpt,
  author,
  slug,
}: Props) {
  // Define a consistent accent color for UI elements
  const accentColor = "bg-accent hover:bg-accent-dark dark:bg-accent-light dark:hover:bg-accent";

  return (
    <div className="flex flex-col h-full">
      {/* Simple plain card */}
      <div className="flex flex-col bg-white dark:bg-mono-800 rounded-lg h-full 
        shadow-sm hover:shadow-md transition-all duration-300">
        
        {/* Card content */}
        <div className="flex flex-col p-5 h-full">
          {/* Date and Author */}
          <div className="flex justify-between items-center mb-3">
            <div className="text-sm text-mono-500 dark:text-mono-400">
              <DateFormatter dateString={date} />
            </div>
            <div className="text-sm text-mono-600 dark:text-mono-400">
              By {author.name}
            </div>
          </div>

          {/* Title */}
          <h3 className="text-xl font-bold mb-3 text-mono-800 dark:text-mono-200">
            <Link href={`/posts/${slug}`} className="text-black dark:text-white">
              {title}
            </Link>
          </h3>

          {/* Content */}
          <p className="text-sm text-mono-600 dark:text-mono-400 mb-4 line-clamp-3 flex-grow">
            {excerpt}
          </p>

          {/* Footer */}
          <div className="flex items-center justify-end mt-auto pt-3 dark:border-mono-700">
            <Link
              href={`/posts/${slug}`}
              className={`px-4 py-2 ${accentColor.replace("hover:bg-accent-dark", "hover:opacity-90")} text-white hover:text-white rounded-md text-sm 
              font-medium transition-all duration-300 hover:scale-105 
              flex items-center gap-2 shadow-sm hover:shadow`}
              aria-label={`Read more about ${title}`}
            >
              Read More
              <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1"
              aria-hidden="true"
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
  );
}
