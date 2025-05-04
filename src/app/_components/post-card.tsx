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
  const stripeColors = [
    "bg-red-500",
    "bg-blue-500",
    "bg-green-500",
    "bg-yellow-500",
    "bg-purple-500",
    "bg-pink-500",
    "bg-amber-500",
    "bg-lime-500",
    "bg-emerald-500",
    "bg-orange-500",
  ];

  // Create hash from slug to ensure consistent color for each post
  const hashCode = slug
    .split("")
    .reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const colorIndex = hashCode % stripeColors.length;
  const stripeColor = stripeColors[colorIndex];

  // Randomly rotate the card slightly in either direction
  const rotateClasses = [
    "rotate-[0.8deg]",
    "rotate-[-0.8deg]",
    "rotate-[1.2deg]",
    "rotate-[-1.2deg]",
    "rotate-[0.5deg]",
    "rotate-[-0.5deg]",
  ];
  const rotateIndex = (hashCode + 3) % rotateClasses.length;
  const rotateClass = rotateClasses[rotateIndex];

  return (
    <div className="relative flex flex-col h-full group p-1">
      {/* Main postcard with slight rotation for handcrafted feel */}
      <div
        className={`flex flex-col bg-white dark:bg-mono-800 rounded-lg h-full 
        shadow-md hover:shadow-lg transition-all duration-300 ${rotateClass}`}
      >
        {/* Colorful stripes at top */}
        <div className="flex w-full h-3 rounded-t-lg overflow-hidden">
          <div
            className={`w-1/3 ${stripeColors[colorIndex % stripeColors.length]}`}
          ></div>
          <div
            className={`w-1/3 ${stripeColors[(colorIndex + 2) % stripeColors.length]}`}
          ></div>
          <div
            className={`w-1/3 ${stripeColors[(colorIndex + 4) % stripeColors.length]}`}
          ></div>
        </div>

        {/* Postcard content */}
        <div className="flex flex-col p-5 h-full border-x-2 border-b-2 border-mono-200 dark:border-mono-700 rounded-b-lg">
          {/* Postmark and date */}
          <div className="flex justify-between items-center mb-3">
            <div className="text-xs font-mono text-mono-500 dark:text-mono-400 bg-mono-100 dark:bg-mono-700 px-2 py-1 rounded">
              <DateFormatter dateString={date} />
            </div>

            {/* Handwritten-like look for ID */}
            <div
              className="text-xs font-mono italic text-mono-500 dark:text-mono-400 
                -rotate-3 font-semibold"
            >
              #{slug.substring(0, 4)}
            </div>
          </div>

          {/* Address line with handwritten style */}
          <div className="border-b border-dashed border-mono-300 dark:border-mono-600 pb-2 mb-4">
            <div className="text-xs text-mono-600 dark:text-mono-400">
              From: {author.name}
            </div>
          </div>

          {/* Stamp with rough edges */}
          <div
            className="absolute top-3 right-3 w-14 h-14 bg-mono-100 dark:bg-mono-700 
              border-2 border-dashed border-mono-400 dark:border-mono-500
              rotate-6 flex items-center justify-center transform"
          >
            <div
              className={`w-10 h-10 ${stripeColor} rounded-sm flex items-center justify-center text-white text-opacity-90`}
            >
              <div className="text-[10px] font-bold text-center">
                <div>OVOS</div>
                <div>MAIL</div>
              </div>
            </div>
          </div>

          {/* Title with handwritten-like appearance */}
          <h3 className="text-lg font-bold mb-3 text-mono-800 dark:text-mono-200">
            <Link href={`/posts/${slug}`}>
              <span
                className={`
                ${stripeColor.replace("bg-", "text-").replace("-500", "-700")} 
                dark:${stripeColor.replace("bg-", "text-").replace("-500", "-300")}
                `}
              >
                {title}
              </span>
            </Link>
          </h3>

          {/* Content with typewriter-like style */}
          <p className="text-sm text-mono-600 dark:text-mono-400 mb-4 line-clamp-3 flex-grow font-mono">
            {excerpt}
          </p>

          {/* Footer with decorative elements */}
          <div className="flex items-center justify-between mt-auto pt-3 border-t border-dotted border-mono-300 dark:border-mono-600">
            {/* Hand-drawn signature style */}
            <div className="text-xs text-mono-500 dark:text-mono-400 italic">
              {author.name.split(" ")[0]}
            </div>

            <Link
              href={`/posts/${slug}`}
              className={`px-3 py-1 ${stripeColor} text-white rounded-full text-xs 
                transform hover:scale-105 transition-all duration-300 font-medium flex items-center gap-1`}
            >
              Open Card
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

          {/* Decorative elements - small tape strips */}
          <div className="absolute -left-1 top-12 w-4 h-10 bg-yellow-200 opacity-40 rotate-[12deg]"></div>
          <div className="absolute -right-1 bottom-14 w-4 h-10 bg-blue-200 opacity-40 rotate-[-8deg]"></div>
        </div>
      </div>
    </div>
  );
}
