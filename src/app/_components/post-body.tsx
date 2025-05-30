import markdownStyles from "./markdown-styles.module.css";

type Props = {
  content: string;
};

export function PostBody({ content }: Props) {
  return (
    <div className="max-w-3xl mx-auto mt-10 px-4 md:px-0">
      <div
        className={`${markdownStyles["markdown"]} prose prose-lg dark:prose-invert prose-headings:font-display prose-headings:font-bold prose-a:text-accent hover:prose-a:text-accent-light dark:prose-a:text-accent dark:hover:prose-a:text-accent-light prose-img:rounded-lg prose-img:shadow-md mx-auto prose-pre:bg-mono-100 dark:prose-pre:bg-mono-800 prose-code:text-accent-dark dark:prose-code:text-accent-light prose-table:table-auto prose-table:w-full prose-thead:bg-mono-100 dark:prose-thead:bg-mono-800 prose-th:p-2 prose-td:p-2 prose-tr:border-b prose-tr:border-mono-200 dark:prose-tr:border-mono-700`}
        dangerouslySetInnerHTML={{ __html: content }}
      />
    </div>
  );
}
