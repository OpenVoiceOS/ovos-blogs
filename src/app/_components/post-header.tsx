import Avatar from "./avatar";
import CoverImage from "./cover-image";
import DateFormatter from "./date-formatter";
import { PostTitle } from "@/app/_components/post-title";
import { type Author } from "@/interfaces/author";
import Container from "./container";

type Props = {
  title: string;
  coverImage: string;
  date: string;
  author: Author;
};

export function PostHeader({ title, coverImage, date, author }: Props) {
  return (
    <>
      <div className="relative bg-gradient-to-b from-mono-200 to-transparent dark:from-mono-800/30 pt-16 pb-20">
        <Container>
          <div className="max-w-3xl mx-auto">
            <div className="flex items-center gap-2 mb-6">
              <span className="px-2 py-1 text-xs font-medium rounded-full bg-accent/10 text-accent">
                Article
              </span>
              <span className="text-sm text-mono-600 dark:text-mono-400">
                <DateFormatter dateString={date} />
              </span>
            </div>

            <PostTitle>{title}</PostTitle>

            <div className="mt-6 flex items-center">
              <div className="w-10 h-10 rounded-full overflow-hidden mr-3 border-2 border-mono-100 dark:border-mono-800">
                <img
                  src={author.picture}
                  alt={author.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <p className="font-medium text-mono-900 dark:text-mono-100">
                  {author.name}
                </p>
                <p className="text-sm text-mono-600 dark:text-mono-400">
                  Published on <DateFormatter dateString={date} />
                </p>
              </div>
            </div>
          </div>
        </Container>
      </div>

      <div className="relative -mt-6">
        <Container>
          <div className="max-w-4xl mx-auto">
            <div className="rounded-lg overflow-hidden shadow-md dark:shadow-mono-900/30 aspect-[21/9] relative">
              <img
                src={coverImage}
                alt={title}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </Container>
      </div>
    </>
  );
}
