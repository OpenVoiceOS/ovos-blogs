import { ReactNode } from "react";

type Props = {
  children?: ReactNode;
};

export function PostTitle({ children }: Props) {
  return (
    <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight md:leading-tight mb-4 text-balance text-mono-900 dark:text-mono-100">
      {children}
    </h1>
  );
}
