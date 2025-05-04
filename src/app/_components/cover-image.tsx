"use client";

import cn from "classnames";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";

type Props = {
  title: string;
  src: string;
  slug?: string;
};

const CoverImage = ({ title, src, slug }: Props) => {
  const [isImageError, setIsImageError] = useState(false);

  const handleImageError = () => {
    setIsImageError(true);
  };

  const image = (
    <>
      {isImageError ? (
        <div className="w-full h-full flex items-center justify-center bg-mono-200 dark:bg-mono-800">
          <div className="text-center p-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-12 w-12 mx-auto text-mono-500 mb-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            <p className="text-sm text-mono-600 dark:text-mono-400">
              Image not available
            </p>
          </div>
        </div>
      ) : (
        <Image
          src={src}
          alt={`Cover Image for ${title}`}
          className="object-cover w-full h-full"
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          priority={slug ? false : true}
          onError={handleImageError}
        />
      )}
    </>
  );

  return (
    <div
      className={cn("relative overflow-hidden rounded-md shadow-sm", {
        "hover:shadow-md transition-shadow duration-200 hover:ring-2 hover:ring-accent/30":
          slug,
      })}
    >
      {slug ? (
        <Link href={`/posts/${slug}`} aria-label={title}>
          {image}
        </Link>
      ) : (
        image
      )}
    </div>
  );
};

export default CoverImage;
