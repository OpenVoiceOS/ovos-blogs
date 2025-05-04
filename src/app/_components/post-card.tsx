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
  return (
    <div className="flex flex-col border border-mono-200 dark:border-mono-800 rounded-lg p-5 h-full hover:border-accent transition-colors duration-200">
      <div className="text-xs text-mono-500 dark:text-mono-400 mb-2">
        <DateFormatter dateString={date} />
      </div>

      <h3 className="text-lg font-medium mb-2">
        <Link
          href={`/posts/${slug}`}
          className="hover:text-accent transition-colors duration-200"
        >
          {title}
        </Link>
      </h3>

      <p className="text-sm text-mono-600 dark:text-mono-400 mb-4 line-clamp-3 flex-grow">
        {excerpt}
      </p>

      <div className="flex items-center justify-between mt-auto pt-3 border-t border-mono-100 dark:border-mono-800">
        <div className="text-xs text-mono-500 dark:text-mono-400">
          {author.name}
        </div>
        <Link
          href={`/posts/${slug}`}
          className="text-xs text-accent hover:text-accent-light dark:text-accent dark:hover:text-accent-light font-medium flex items-center gap-1 transition-colors duration-200"
        >
          Read more
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
  );
}
