import { remark } from "remark";
import remarkGfm from "remark-gfm";
import remarkRehype from "remark-rehype";
import rehypeHighlight from "rehype-highlight";
import rehypeStringify from "rehype-stringify";

export default async function markdownToHtml(markdown: string) {
  const result = await remark()
    .use(remarkGfm)
    .use(remarkRehype, {
      allowDangerousHtml: true,
      allowedElements: false, // Allow html syntax in markdown
    })
    .use(rehypeHighlight)
    .use(rehypeStringify, {
      allowDangerousHtml: true
    })
    .process(markdown);
  
  return result.toString();
}
