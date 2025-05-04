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
  // Generate a random stripe color from a set of vibrant colors
  const stripeColors = [
    'bg-red-500',
    'bg-blue-500',
    'bg-green-500',
    'bg-yellow-500',
    'bg-purple-500',
    'bg-pink-500',
    'bg-cyan-500',
    'bg-amber-500'
  ];
  
  // Create hash from slug to ensure consistent color for each post
  const hashCode = slug.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const colorIndex = hashCode % stripeColors.length;
  const stripeColor = stripeColors[colorIndex];

  // Randomly rotate the card slightly in either direction
  const rotateClasses = [
    'rotate-[0.5deg]',
    'rotate-[-0.5deg]',
    'rotate-[1deg]',
    'rotate-[-1deg]'
  ];
  const rotateIndex = (hashCode + 3) % rotateClasses.length;
  const rotateClass = rotateClasses[rotateIndex];

  return (
    <div className="relative flex flex-col h-full group p-1">
      {/* Main postcard with slight rotation for handcrafted feel */}
      <div className={`flex flex-col bg-white dark:bg-mono-800 rounded-lg h-full 
        shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden ${rotateClass}`}>
        
        {/* Cover Image with overlay decorations */}
        <div className="relative aspect-[4/3] overflow-hidden">
          {/* Colorful corner triangles */}
          <div className="absolute top-0 left-0 w-12 h-12 z-10 overflow-hidden">
            <div className={`${stripeColors[(colorIndex) % stripeColors.length]} w-16 h-16 rotate-45 -translate-x-8 -translate-y-8`}></div>
          </div>
          <div className="absolute top-0 right-0 w-12 h-12 z-10 overflow-hidden">
            <div className={`${stripeColors[(colorIndex + 2) % stripeColors.length]} w-16 h-16 rotate-45 translate-x-8 -translate-y-8`}></div>
          </div>
          
          {/* Image */}
          <div className="group-hover:scale-105 transition-transform duration-500 ease-in-out">
            <CoverImage slug={slug} title={title} src={coverImage} />
          </div>
          
          {/* Cancellation marks overlay - random pattern */}
          <div className="absolute top-0 left-0 right-0 bottom-0 pointer-events-none opacity-30 z-10">
            <div className={`absolute ${hashCode % 2 === 0 ? 'top-3 left-[40%]' : 'top-5 left-[30%]'} w-24 h-24 border-4 border-dashed rounded-full ${stripeColor} opacity-40`}></div>
            <div className={`absolute ${hashCode % 2 === 0 ? 'bottom-4 right-[20%]' : 'bottom-6 right-[35%]'} w-16 h-16 border-4 border-dashed rounded-full ${stripeColor} opacity-30`}></div>
          </div>
          
          {/* Vintage postcard text overlay */}
          <div className="absolute top-2 left-1/2 transform -translate-x-1/2 bg-white/70 dark:bg-mono-800/70 px-2 py-0.5 rounded text-xs font-mono text-mono-600 dark:text-mono-300 tracking-wider z-10">
            POSTCARD
          </div>
          
          {/* Stamp area */}
          <div className="absolute top-3 right-3 w-14 h-14 z-10">
            <div className="w-full h-full bg-white/80 dark:bg-mono-900/80 border border-dashed border-mono-400 p-1">
              <div className={`w-full h-full ${stripeColor} flex items-center justify-center`}>
                <span className="text-xs text-white font-bold">OVOS</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Content area */}
        <div className="p-4 border-x-2 border-b-2 border-mono-200 dark:border-mono-700">
          {/* Postmark and date */}
          <div className="flex justify-between items-center mb-3">
            <div className="text-xs font-mono text-mono-500 dark:text-mono-400 bg-mono-100 dark:bg-mono-700 px-2 py-0.5 rounded">
              <DateFormatter dateString={date} />
            </div>
            
            {/* Post ID with handwritten style */}
            <div className="text-xs italic text-mono-500 dark:text-mono-400 -rotate-2" style={{ fontFamily: 'cursive, sans-serif' }}>
              #{slug.substring(0, 4)}
            </div>
          </div>
          
          {/* Title */}
          <h3 className="text-base font-medium mb-2 text-mono-800 dark:text-mono-200" style={{ fontFamily: 'cursive, sans-serif' }}>
            <Link href={`/posts/${slug}`} className="hover:text-accent transition-colors duration-200">
              {title}
            </Link>
          </h3>
          
          {/* Content */}
          <p className="text-xs text-mono-700 dark:text-mono-300 mb-3 line-clamp-2 font-mono">
            {excerpt}
          </p>
          
          {/* Footer */}
          <div className="flex items-center justify-between pt-2 border-t border-dotted border-mono-300 dark:border-mono-600">
            <Avatar name={author.name} picture={author.picture} />
            <Link
              href={`/posts/${slug}`}
              className={`px-2 py-1 ${stripeColor} text-white rounded-full text-xs font-medium 
                flex items-center gap-1 hover:scale-105 transition-all duration-300`}
            >
              Read Card
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
          
          {/* Decorative elements */}
          <div className="absolute top-[40%] left-0 w-3 h-8 bg-yellow-100 dark:bg-yellow-900/30 opacity-50"></div>
          <div className="absolute bottom-[20%] right-0 w-3 h-8 bg-blue-100 dark:bg-blue-900/30 opacity-50"></div>
        </div>
      </div>
    </div>
  );
}
