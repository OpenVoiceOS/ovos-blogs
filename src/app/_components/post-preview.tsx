import { type Author } from "@/interfaces/author";
import Link from "next/link";
import Avatar from "./avatar";
import CoverImage from "./cover-image";
import DateFormatter from "./date-formatter";

type Props = {
  title: string;
  coverImage: string;
  date: string;
  excerpt: string;
  author: Author;
  coauthors?: Author[];
  slug: string;
};

export default function PostPreview({
  title,
  coverImage,
  date,
  excerpt,
  author,
  coauthors,
  slug,
}: Props) {
  // Define a consistent accent color for UI elements
  const accentColor = "bg-accent hover:bg-accent-dark";

  return (
    <div className="flex flex-col h-full">
      {/* Simple card with clean design */}
      <div className="flex flex-col bg-white dark:bg-mono-800 rounded-lg h-full 
        shadow-sm hover:shadow-md transition-all duration-300 border border-mono-200 dark:border-mono-700 overflow-hidden">
        
        {/* Cover Image - clean version without decorations */}
        <div className="relative aspect-[4/3] overflow-hidden">
          {/* Plain image with subtle hover effect */}
          <div className="group-hover:scale-105 transition-transform duration-500 ease-in-out">
            <CoverImage slug={slug} title={title} src={coverImage} />
          </div>
        </div>

        {/* Content area */}
        <div className="p-4">
          {/* Date */}
          <div className="mb-3">
            <span className="text-sm text-mono-500 dark:text-mono-400">
              <DateFormatter dateString={date} />
            </span>
          </div>

          {/* Title */}
          <h3 className="text-xl font-bold mb-2 text-mono-800 dark:text-mono-200">
            <Link
              href={`/posts/${slug}`}
              className="hover:text-accent transition-colors duration-200"
            >
              {title}
            </Link>
          </h3>

          {/* Content */}
          <p className="text-sm text-mono-600 dark:text-mono-400 mb-4 line-clamp-2">
            {excerpt}
          </p>

          {/* Footer */}
          <div className="flex items-center justify-between pt-3 border-t border-mono-200 dark:border-mono-700">
            <Avatar name={author.name} picture={author.picture} />
            <Link
              href={`/posts/${slug}`}
              className={`px-3 py-1 ${accentColor} text-white rounded text-sm
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
  );
}
