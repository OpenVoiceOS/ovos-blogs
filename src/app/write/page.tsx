"use client";

import { useState, useEffect, useMemo } from "react";
import Container from "../_components/container";
import { remark } from "remark";
import remarkGfm from "remark-gfm";
import remarkRehype from "remark-rehype";
import rehypeStringify from "rehype-stringify";
import markdownStyles from "../_components/markdown-styles.module.css";

interface CoAuthor {
  name: string;
  github: string;
}

interface FormData {
  title: string;
  excerpt: string;
  authorName: string;
  authorGithub: string;
  coverImage: string;
  content: string;
  coauthors: CoAuthor[];
}

const GITHUB_REPO = "OpenVoiceOS/ovos-blogs";

export default function WritePage() {
  const [formData, setFormData] = useState<FormData>({
    title: "",
    excerpt: "",
    authorName: "",
    authorGithub: "",
    coverImage: "/assets/blog/common/cover.png",
    content: "",
    coauthors: [],
  });

  const [showPreview, setShowPreview] = useState(false);
  const [renderedContent, setRenderedContent] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Render markdown preview
  useEffect(() => {
    const renderMarkdown = async () => {
      if (!formData.content) {
        setRenderedContent("");
        return;
      }
      try {
        const result = await remark()
          .use(remarkGfm)
          .use(remarkRehype, { allowDangerousHtml: true })
          .use(rehypeStringify, { allowDangerousHtml: true })
          .process(formData.content);
        setRenderedContent(result.toString());
      } catch {
        setRenderedContent("<p>Error rendering preview</p>");
      }
    };
    renderMarkdown();
  }, [formData.content]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const addCoAuthor = () => {
    setFormData((prev) => ({
      ...prev,
      coauthors: [...prev.coauthors, { name: "", github: "" }],
    }));
  };

  const removeCoAuthor = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      coauthors: prev.coauthors.filter((_, i) => i !== index),
    }));
  };

  const updateCoAuthor = (
    index: number,
    field: "name" | "github",
    value: string
  ) => {
    setFormData((prev) => ({
      ...prev,
      coauthors: prev.coauthors.map((ca, i) =>
        i === index ? { ...ca, [field]: value } : ca
      ),
    }));
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = "Title is required";
    }
    if (!formData.excerpt.trim()) {
      newErrors.excerpt = "Excerpt is required";
    }
    if (!formData.authorName.trim()) {
      newErrors.authorName = "Author name is required";
    }
    if (!formData.authorGithub.trim()) {
      newErrors.authorGithub = "GitHub username is required";
    }
    if (!formData.content.trim()) {
      newErrors.content = "Content is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const generateSubmissionPayload = () => {
    return {
      title: formData.title.trim(),
      excerpt: formData.excerpt.trim(),
      author: {
        name: formData.authorName.trim(),
        github: formData.authorGithub.trim().replace(/^@/, ""),
      },
      coauthors: formData.coauthors
        .filter((ca) => ca.name.trim() && ca.github.trim())
        .map((ca) => ({
          name: ca.name.trim(),
          github: ca.github.trim().replace(/^@/, ""),
        })),
      coverImage: formData.coverImage.trim() || "/assets/blog/common/cover.png",
      content: formData.content,
    };
  };

  const handleSubmit = () => {
    if (!validateForm()) {
      return;
    }

    const payload = generateSubmissionPayload();
    const issueTitle = `[blog-submission] ${payload.title}`;
    const issueBody = `## Blog Post Submission

This blog post was submitted via the blog submission form.

### Submission Data

\`\`\`json
${JSON.stringify(payload, null, 2)}
\`\`\`

---

**Instructions for maintainers:** A GitHub Actions bot will automatically process this submission and create a PR. Review the PR when ready.
`;

    const url = new URL(`https://github.com/${GITHUB_REPO}/issues/new`);
    url.searchParams.set("title", issueTitle);
    url.searchParams.set("body", issueBody);
    url.searchParams.set("labels", "blog-submission");

    window.open(url.toString(), "_blank");
  };

  // Generate preview of frontmatter
  const frontmatterPreview = useMemo(() => {
    const date = new Date().toISOString().split("T")[0];
    return `---
title: "${formData.title}"
excerpt: "${formData.excerpt}"
coverImage: "${formData.coverImage}"
date: "${date}T00:00:00.000Z"
author:
  name: "${formData.authorName}"
  picture: "https://github.com/${formData.authorGithub.replace(/^@/, "")}.png"${
      formData.coauthors.length > 0
        ? `
coauthors:${formData.coauthors
            .map(
              (ca) => `
  - name: "${ca.name}"
    picture: "https://github.com/${ca.github.replace(/^@/, "")}.png"`
            )
            .join("")}`
        : ""
    }
ogImage:
  url: "${formData.coverImage}"
---`;
  }, [formData]);

  return (
    <Container>
      <div className="max-w-6xl mx-auto mt-16 pt-8 pb-16">
        <h1 className="text-4xl font-bold tracking-tighter leading-tight mb-4 text-center">
          Write a Blog Post
        </h1>
        <p className="text-center text-mono-600 dark:text-mono-400 mb-8 max-w-2xl mx-auto">
          Write your blog post below. When you submit, it will create a GitHub
          Issue that our bot will process into a Pull Request for review.
        </p>

        {/* Toggle between Edit and Preview */}
        <div className="flex justify-center mb-6">
          <div className="inline-flex rounded-lg border border-mono-200 dark:border-mono-700 p-1">
            <button
              onClick={() => setShowPreview(false)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                !showPreview
                  ? "bg-accent text-white"
                  : "text-mono-600 dark:text-mono-400 hover:text-mono-900 dark:hover:text-white"
              }`}
            >
              Edit
            </button>
            <button
              onClick={() => setShowPreview(true)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                showPreview
                  ? "bg-accent text-white"
                  : "text-mono-600 dark:text-mono-400 hover:text-mono-900 dark:hover:text-white"
              }`}
            >
              Preview
            </button>
          </div>
        </div>

        {!showPreview ? (
          /* Edit Mode */
          <div className="space-y-6">
            {/* Title */}
            <div>
              <label
                htmlFor="title"
                className="block text-sm font-medium mb-2"
              >
                Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="Your Blog Post Title"
                className={`w-full px-4 py-3 rounded-lg border ${
                  errors.title
                    ? "border-red-500"
                    : "border-mono-200 dark:border-mono-700"
                } bg-white dark:bg-mono-800 focus:ring-2 focus:ring-accent focus:border-transparent outline-none transition`}
              />
              {errors.title && (
                <p className="text-red-500 text-sm mt-1">{errors.title}</p>
              )}
            </div>

            {/* Excerpt */}
            <div>
              <label
                htmlFor="excerpt"
                className="block text-sm font-medium mb-2"
              >
                Excerpt <span className="text-red-500">*</span>
              </label>
              <textarea
                id="excerpt"
                name="excerpt"
                value={formData.excerpt}
                onChange={handleInputChange}
                placeholder="A brief summary of your blog post (1-2 sentences)"
                rows={2}
                className={`w-full px-4 py-3 rounded-lg border ${
                  errors.excerpt
                    ? "border-red-500"
                    : "border-mono-200 dark:border-mono-700"
                } bg-white dark:bg-mono-800 focus:ring-2 focus:ring-accent focus:border-transparent outline-none transition resize-none`}
              />
              {errors.excerpt && (
                <p className="text-red-500 text-sm mt-1">{errors.excerpt}</p>
              )}
            </div>

            {/* Author Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="authorName"
                  className="block text-sm font-medium mb-2"
                >
                  Your Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="authorName"
                  name="authorName"
                  value={formData.authorName}
                  onChange={handleInputChange}
                  placeholder="John Doe"
                  className={`w-full px-4 py-3 rounded-lg border ${
                    errors.authorName
                      ? "border-red-500"
                      : "border-mono-200 dark:border-mono-700"
                  } bg-white dark:bg-mono-800 focus:ring-2 focus:ring-accent focus:border-transparent outline-none transition`}
                />
                {errors.authorName && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.authorName}
                  </p>
                )}
              </div>
              <div>
                <label
                  htmlFor="authorGithub"
                  className="block text-sm font-medium mb-2"
                >
                  GitHub Username <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="authorGithub"
                  name="authorGithub"
                  value={formData.authorGithub}
                  onChange={handleInputChange}
                  placeholder="johndoe"
                  className={`w-full px-4 py-3 rounded-lg border ${
                    errors.authorGithub
                      ? "border-red-500"
                      : "border-mono-200 dark:border-mono-700"
                  } bg-white dark:bg-mono-800 focus:ring-2 focus:ring-accent focus:border-transparent outline-none transition`}
                />
                {errors.authorGithub && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.authorGithub}
                  </p>
                )}
                <p className="text-mono-500 text-xs mt-1">
                  Used for your profile picture
                </p>
              </div>
            </div>

            {/* Cover Image */}
            <div>
              <label
                htmlFor="coverImage"
                className="block text-sm font-medium mb-2"
              >
                Cover Image URL{" "}
                <span className="text-mono-500">(optional)</span>
              </label>
              <input
                type="text"
                id="coverImage"
                name="coverImage"
                value={formData.coverImage}
                onChange={handleInputChange}
                placeholder="/assets/blog/common/cover.png"
                className="w-full px-4 py-3 rounded-lg border border-mono-200 dark:border-mono-700 bg-white dark:bg-mono-800 focus:ring-2 focus:ring-accent focus:border-transparent outline-none transition"
              />
              <p className="text-mono-500 text-xs mt-1">
                Leave default or provide a URL. You can add images to the PR
                later.
              </p>
            </div>

            {/* Co-authors */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium">
                  Co-authors <span className="text-mono-500">(optional)</span>
                </label>
                <button
                  type="button"
                  onClick={addCoAuthor}
                  className="text-sm text-accent hover:text-accent-light transition"
                >
                  + Add Co-author
                </button>
              </div>
              {formData.coauthors.map((coauthor, index) => (
                <div
                  key={index}
                  className="flex gap-4 mb-3 items-start"
                >
                  <input
                    type="text"
                    value={coauthor.name}
                    onChange={(e) =>
                      updateCoAuthor(index, "name", e.target.value)
                    }
                    placeholder="Co-author name"
                    className="flex-1 px-4 py-2 rounded-lg border border-mono-200 dark:border-mono-700 bg-white dark:bg-mono-800 focus:ring-2 focus:ring-accent focus:border-transparent outline-none transition"
                  />
                  <input
                    type="text"
                    value={coauthor.github}
                    onChange={(e) =>
                      updateCoAuthor(index, "github", e.target.value)
                    }
                    placeholder="GitHub username"
                    className="flex-1 px-4 py-2 rounded-lg border border-mono-200 dark:border-mono-700 bg-white dark:bg-mono-800 focus:ring-2 focus:ring-accent focus:border-transparent outline-none transition"
                  />
                  <button
                    type="button"
                    onClick={() => removeCoAuthor(index)}
                    className="px-3 py-2 text-red-500 hover:text-red-700 transition"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>

            {/* Content */}
            <div>
              <label
                htmlFor="content"
                className="block text-sm font-medium mb-2"
              >
                Content (Markdown) <span className="text-red-500">*</span>
              </label>
              <textarea
                id="content"
                name="content"
                value={formData.content}
                onChange={handleInputChange}
                placeholder={`# Your Blog Post Title

Introduction paragraph explaining what this post is about.

## Main Section

Your content here. You can use **bold**, *italic*, and other markdown formatting.

### Code Examples

\`\`\`python
def hello():
    print("Hello, OVOS!")
\`\`\`

## Conclusion

Wrap up your post here.`}
                rows={20}
                className={`w-full px-4 py-3 rounded-lg border ${
                  errors.content
                    ? "border-red-500"
                    : "border-mono-200 dark:border-mono-700"
                } bg-white dark:bg-mono-800 focus:ring-2 focus:ring-accent focus:border-transparent outline-none transition font-mono text-sm resize-y`}
              />
              {errors.content && (
                <p className="text-red-500 text-sm mt-1">{errors.content}</p>
              )}
            </div>

            {/* Submit Button */}
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-between pt-4 border-t border-mono-200 dark:border-mono-700">
              <p className="text-mono-500 text-sm">
                Submitting will open a GitHub Issue. You&apos;ll need a GitHub
                account.
              </p>
              <button
                type="button"
                onClick={handleSubmit}
                className="px-6 py-3 bg-accent hover:bg-accent-dark text-white font-medium rounded-lg transition shadow-lg hover:shadow-xl"
              >
                Submit Blog Post
              </button>
            </div>
          </div>
        ) : (
          /* Preview Mode */
          <div className="space-y-8">
            {/* Frontmatter Preview */}
            <div className="bg-mono-100 dark:bg-mono-800 rounded-lg p-4">
              <h3 className="text-sm font-medium text-mono-500 mb-2">
                Generated Frontmatter
              </h3>
              <pre className="text-sm overflow-x-auto whitespace-pre-wrap font-mono text-mono-700 dark:text-mono-300">
                {frontmatterPreview}
              </pre>
            </div>

            {/* Content Preview */}
            <div>
              <h3 className="text-sm font-medium text-mono-500 mb-4">
                Content Preview
              </h3>
              {formData.title && (
                <h1 className="text-4xl font-bold mb-4">{formData.title}</h1>
              )}
              {formData.excerpt && (
                <p className="text-xl text-mono-600 dark:text-mono-400 mb-6 italic">
                  {formData.excerpt}
                </p>
              )}
              {formData.authorName && (
                <div className="flex items-center gap-3 mb-8">
                  {formData.authorGithub && (
                    <img
                      src={`https://github.com/${formData.authorGithub.replace(/^@/, "")}.png`}
                      alt={formData.authorName}
                      className="w-12 h-12 rounded-full"
                    />
                  )}
                  <div>
                    <p className="font-medium">{formData.authorName}</p>
                    <p className="text-sm text-mono-500">
                      {new Date().toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                </div>
              )}
              <div
                className={`${markdownStyles["markdown"]} prose prose-lg dark:prose-invert max-w-none`}
                dangerouslySetInnerHTML={{ __html: renderedContent }}
              />
            </div>

            {/* Submit Button in Preview */}
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-between pt-4 border-t border-mono-200 dark:border-mono-700">
              <button
                type="button"
                onClick={() => setShowPreview(false)}
                className="text-mono-600 hover:text-mono-900 dark:text-mono-400 dark:hover:text-white transition"
              >
                ← Back to Edit
              </button>
              <button
                type="button"
                onClick={handleSubmit}
                className="px-6 py-3 bg-accent hover:bg-accent-dark text-white font-medium rounded-lg transition shadow-lg hover:shadow-xl"
              >
                Submit Blog Post
              </button>
            </div>
          </div>
        )}

        {/* Help Section */}
        <div className="mt-12 p-6 bg-mono-50 dark:bg-mono-800/50 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Submission Process</h2>
          <ol className="list-decimal list-inside space-y-2 text-mono-700 dark:text-mono-300">
            <li>Fill out the form above with your blog post content</li>
            <li>Use the Preview tab to see how your post will look</li>
            <li>Click &quot;Submit Blog Post&quot; to open a GitHub Issue</li>
            <li>Review the issue and submit it (requires GitHub account)</li>
            <li>Our bot will automatically create a Pull Request</li>
            <li>Maintainers will review and merge your post</li>
          </ol>
          <p className="mt-4 text-sm text-mono-500">
            Need to add images? You can add them to the Pull Request after
            submission, or link to external images in your markdown.
          </p>
        </div>
      </div>
    </Container>
  );
}
