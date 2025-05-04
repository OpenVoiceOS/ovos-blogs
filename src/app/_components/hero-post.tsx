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
  // Generate vibrant colors
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
  
  const textColors = [
    'text-red-600',
    'text-blue-600',
    'text-green-600',
    'text-yellow-600',
    'text-purple-600',
    'text-pink-600'
  ];
  
  // Create hash from slug to ensure consistent color for each post
  const hashCode = slug.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const colorIndex = hashCode % stripeColors.length;
  const stripeColor = stripeColors[colorIndex];
  const textColor = textColors[hashCode % textColors.length];
  
  return (
    <section className="pb-4">
      <h2 className="text-lg font-bold mb-4 text-mono-600 dark:text-mono-400 flex items-center gap-2">
        <div className="relative w-7 h-7 overflow-hidden">
          {/* Fun wavy pattern background for section heading */}
          <div className="absolute inset-0 flex">
            {Array(5).fill(0).map((_, i) => (
              <div 
                key={i} 
                className={`w-1.5 h-full ${stripeColors[(colorIndex + i) % stripeColors.length]}`}
              ></div>
            ))}
          </div>
          <div className="absolute inset-0 flex items-center justify-center text-white font-bold text-sm">F</div>
        </div>
        FEATURED POSTCARD
      </h2>
      
      <div className="relative grid grid-cols-1 md:grid-cols-12 gap-6 group">
        {/* Decorative elements - diagonal "tape" at corners */}
        <div className="absolute -top-2 -left-2 w-12 h-3 bg-yellow-100 dark:bg-yellow-800/40 rotate-45"></div>
        <div className="absolute -top-2 -right-2 w-12 h-3 bg-blue-100 dark:bg-blue-800/40 -rotate-45"></div>
        <div className="absolute -bottom-2 -left-2 w-12 h-3 bg-green-100 dark:bg-green-800/40 -rotate-45"></div>
        <div className="absolute -bottom-2 -right-2 w-12 h-3 bg-red-100 dark:bg-red-800/40 rotate-45"></div>
        
        {/* Fun postage stamp design for featured post */}
        <div className="absolute -top-8 -right-2 md:-top-10 md:-right-6 w-24 h-24 md:w-32 md:h-32 z-10
          flex items-center justify-center transform rotate-[8deg]">
          <div className="absolute inset-0 bg-white dark:bg-mono-800 border-4 border-dashed border-mono-300 dark:border-mono-600 
            rounded-lg overflow-hidden">
            <div className="absolute inset-0 flex flex-wrap">
              {Array(16).fill(0).map((_, i) => (
                <div 
                  key={i} 
                  className={`w-1/4 h-1/4 ${i % 2 === 0 ? stripeColors[(colorIndex + i) % stripeColors.length] : 'bg-white dark:bg-mono-800'} 
                  opacity-${i % 3 === 0 ? '60' : '40'}`}
                ></div>
              ))}
            </div>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <div className="text-sm md:text-base font-black text-white dark:text-white bg-mono-800/60 dark:bg-mono-900/60 
                px-2 rounded-full mb-1">FEATURED</div>
              <div className="text-xs md:text-sm text-white dark:text-white bg-mono-800/60 dark:bg-mono-900/60 px-2 rounded-full">POST</div>
            </div>
          </div>
        </div>
        
        {/* Cover Image Side with playful borders */}
        <div className="md:col-span-5 relative aspect-[4/3] transform md:rotate-[-1deg]">
          <div className="absolute inset-0 border-8 border-white dark:border-mono-800 rounded-lg overflow-hidden
            shadow-xl hover:shadow-2xl transition-all duration-300 z-0">
            {/* Colorful border stripes */}
            <div className="absolute top-0 left-0 right-0 h-2 flex">
              {Array(5).fill(0).map((_, i) => (
                <div 
                  key={i} 
                  className={`flex-1 ${stripeColors[(colorIndex + i) % stripeColors.length]}`}
                ></div>
              ))}
            </div>
            <div className="absolute bottom-0 left-0 right-0 h-2 flex">
              {Array(5).fill(0).map((_, i) => (
                <div 
                  key={i} 
                  className={`flex-1 ${stripeColors[(colorIndex + i + 2) % stripeColors.length]}`}
                ></div>
              ))}
            </div>
            
            <CoverImage title={title} src={coverImage} slug={slug} />
            
            {/* Circular postmark overlay */}
            <div className="absolute bottom-3 left-3 w-20 h-20 rounded-full 
              border-2 border-mono-200 dark:border-mono-600 
              bg-white/60 dark:bg-mono-900/60 
              flex items-center justify-center z-10 transform rotate-[-5deg]">
              <div className="text-xs font-mono leading-tight text-mono-800 dark:text-mono-200 text-center">
                <div className="font-bold">OVOS BLOG</div>
                <div className={`text-[10px] ${textColor} dark:text-accent`}>
                  <DateFormatter dateString={date} />
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Content Side with authentic postcard styling */}
        <div className="md:col-span-7 relative transform md:rotate-[1deg]">
          <div className="h-full border-4 border-mono-200 dark:border-mono-700 rounded-lg p-6 
            bg-white dark:bg-mono-800
            shadow-lg hover:shadow-xl transition-all duration-300">
            
            {/* Postcard header with handwritten style */}
            <div className="flex items-center justify-between mb-2">
              <div className="flex flex-col">
                <div className="text-sm md:text-base font-bold" style={{ fontFamily: 'cursive, sans-serif' }}>
                  Greetings from OVOS!
                </div>
                <div className="text-xs text-mono-500 dark:text-mono-400">
                  <DateFormatter dateString={date} />
                </div>
              </div>
              
              <div className="text-xs italic text-mono-500 dark:text-mono-400" style={{ fontFamily: 'cursive, sans-serif' }}>
                Special Delivery
              </div>
            </div>
            
            {/* Fun divider with dots and dashes */}
            <div className="flex items-center space-x-2 my-3">
              <div className="flex-grow border-t-2 border-dotted border-mono-300 dark:border-mono-600"></div>
              <div className={`w-2 h-2 rounded-full ${stripeColor}`}></div>
              <div className="flex-grow border-t-2 border-dashed border-mono-300 dark:border-mono-600"></div>
              <div className={`w-2 h-2 rounded-full ${stripeColor}`}></div>
              <div className="flex-grow border-t-2 border-dotted border-mono-300 dark:border-mono-600"></div>
            </div>

            {/* Title with decorative underline */}
            <h3 className="text-xl md:text-2xl font-bold mb-3 text-mono-800 dark:text-mono-200 relative z-0">
              <Link href={`/posts/${slug}`} className="hover:text-accent transition-colors duration-200" 
                style={{ fontFamily: 'cursive, sans-serif' }}>
                {title}
              </Link>
              <div className="absolute -bottom-1 left-0 right-0 h-1.5 bg-yellow-200 dark:bg-yellow-800/40 -z-10 transform -rotate-[0.5deg]"></div>
            </h3>

            {/* Content with "scribbled" style */}
            <p className="text-sm md:text-base text-mono-600 dark:text-mono-400 mb-4 line-clamp-3 font-mono leading-relaxed">
              {excerpt}
            </p>

            {/* Handwritten signature and postcard action */}
            <div className="flex items-center justify-between mt-3 pt-3 border-t-2 border-dotted border-mono-300 dark:border-mono-600">
              <div className="flex items-center">
                <Avatar name={author.name} picture={author.picture} />
              </div>
              <Link
                href={`/posts/${slug}`}
                className={`px-4 py-1.5 ${stripeColor} text-white rounded-full text-xs font-medium 
                flex items-center gap-1 hover:scale-105 transform transition-all duration-300`}
              >
                Read Postcard
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
            
            {/* Decorative coffee stain */}
            <div className="absolute bottom-4 right-8 w-12 h-12 rounded-full 
              bg-gradient-to-r from-amber-400/20 to-amber-800/10 dark:from-amber-400/10 dark:to-amber-800/5 
              blur-sm -z-10"></div>
          </div>
        </div>
      </div>
    </section>
  );
}
