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
  return (
    <section>
      <h2 className="text-lg font-medium mb-4 text-mono-600 dark:text-mono-400">
        Featured
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        <div className="md:col-span-5 relative aspect-[4/3]">
          <CoverImage title={title} src={coverImage} slug={slug} />
        </div>
        <div className="md:col-span-7">
          <div className="text-xs text-mono-500 dark:text-mono-400 mb-2">
            <DateFormatter dateString={date} />
          </div>

          <h3 className="text-xl font-semibold mb-2 hover:text-accent transition-colors duration-200">
            <Link href={`/posts/${slug}`}>{title}</Link>
          </h3>

          <p className="text-sm text-mono-700 dark:text-mono-300 mb-4 line-clamp-3">
            {excerpt}
          </p>

          <div className="flex items-center justify-between">
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
    </section>
  );
}
