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
  slug: string;
};

export default function PostPreview({
  title,
  coverImage,
  date,
  excerpt,
  author,
  slug,
}: Props) {
  return (
    <div className="flex flex-col">
      <div className="relative aspect-[4/3]">
        <CoverImage slug={slug} title={title} src={coverImage} />
      </div>
      <div className="pt-4 flex flex-col">
        <div className="text-xs text-mono-500 dark:text-mono-400 mb-1">
          <DateFormatter dateString={date} />
        </div>
        <h3 className="text-base font-medium mb-2 hover:text-accent transition-colors duration-200">
          <Link href={`/posts/${slug}`}>{title}</Link>
        </h3>
        <p className="text-xs text-mono-700 dark:text-mono-300 mb-3 line-clamp-2">
          {excerpt}
        </p>
        <div className="flex items-center justify-between mt-auto pt-2 border-t border-mono-200 dark:border-mono-800">
          <Avatar name={author.name} picture={author.picture} />
          <Link
            href={`/posts/${slug}`}
            className="text-xs text-accent hover:text-accent-light dark:text-accent dark:hover:text-accent-light font-medium flex items-center gap-1 transition-colors duration-200"
          >
            Read
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
  );
}
