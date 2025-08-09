import Container from '../_components/container'
import React from 'react'

export default function Contribute() {
  return (
    <>
        <Container>
          <div className="max-w-4xl mx-auto mt-16 pt-8 pb-16">
            <h1 className="text-4xl font-bold tracking-tighter leading-tight md:pr-8 mb-8 text-center">
              How to Contribute a Blog Post
            </h1>
            
            <div className="markdown prose prose-lg dark:prose-invert max-w-none">
              <div className="bg-red-50 dark:bg-red-900/20 p-6 rounded-lg mb-8 border-l-4 border-red-500 shadow-md">
                <p className="text-lg font-medium">
                  To submit a blog post, you need to have a GitHub account and basic knowledge of Git and Markdown. You dont need to be expert or a developer, a copule of YouTube videos will be enough to get you started!
                </p>
              </div>

              <h2 className="text-2xl font-semibold mt-6 mb-3 flex items-center">
                <span className="inline-block bg-mono-100 dark:bg-mono-800 rounded-full w-8 h-8 flex items-center justify-center mr-2">1</span>
                Fork the Repository
              </h2>
              <p className="mb-4">
                Start by forking the <a href="https://github.com/OpenVoiceOS/ovos-blogs" className="text-blue-600 hover:underline dark:text-blue-400" target="_blank" rel="noopener noreferrer">OpenVoiceOS blog repository</a> to your GitHub account.
              </p>

              <h2 className="text-2xl font-semibold mt-6 mb-3 flex items-center">
                <span className="inline-block bg-mono-100 dark:bg-mono-800 rounded-full w-8 h-8 flex items-center justify-center mr-2">2</span>
                Create a New Branch
              </h2>
              <p className="mb-4">
                Clone your forked repository locally and create a new branch for your blog post:
              </p>
              <pre className="bg-mono-100 p-4 rounded-md overflow-x-auto mb-4 dark:bg-mono-800 dark:text-mono-200 shadow-inner border border-mono-200 dark:border-mono-700">
                <code>
                  git clone https://github.com/YOUR-USERNAME/ovos-blogs.git{'\n'}
                  cd ovos-blogs{'\n'}
                  git checkout -b blog/your-blog-post-name
                </code>
              </pre>

              <h2 className="text-2xl font-semibold mt-6 mb-3 flex items-center">
                <span className="inline-block bg-mono-100 dark:bg-mono-800 rounded-full w-8 h-8 flex items-center justify-center mr-2">3</span>
                Create Your Blog Post
              </h2>
              <p className="mb-4">
                Create a new Markdown file in the <code className="bg-mono-100 px-2 py-1 rounded dark:bg-mono-800 dark:text-mono-200">_posts</code> directory. You can <a href="/assets/examples/blog-template.md" download className="text-blue-600 hover:underline dark:text-blue-400">download our template</a> to get started. The filename should follow this format:
              </p>
              <pre className="bg-mono-100 p-4 rounded-md overflow-x-auto mb-4 dark:bg-mono-800 dark:text-mono-200 shadow-inner border border-mono-200 dark:border-mono-700">
                <code>
                  YYYY-MM-DD-title-of-your-post.md
                </code>
              </pre>
              <p className="mb-4">
                For example: <code className="bg-mono-100 px-2 py-1 rounded dark:bg-mono-800 dark:text-mono-200">2025-07-01-implementing-new-voice-features.md</code>
              </p>

              <h2 className="text-2xl font-semibold mt-6 mb-3 flex items-center">
                <span className="inline-block bg-mono-100 dark:bg-mono-800 rounded-full w-8 h-8 flex items-center justify-center mr-2">4</span>
                Format Your Blog Post
              </h2>
              <p className="mb-4">
                Each blog post requires a YAML front matter section followed by your markdown content. Here's the required format:
              </p>
              <pre className="bg-mono-100 p-4 rounded-md overflow-x-auto mb-4 dark:bg-mono-800 dark:text-mono-200 shadow-inner border border-mono-200 dark:border-mono-700">
                <code>
                  ---{'\n'}
                  title: "Your Blog Post Title"{'\n'}
                  excerpt: "A brief summary of your blog post (1-2 sentences)"{'\n'}
                  coverImage: "/assets/blog/common/cover.png"{'\n'}
                  date: "YYYY-MM-DDT00:00:00.000Z"{'\n'}
                  author:{'\n'}
                  {'  '}name: "Your Name"{'\n'}
                  {'  '}picture: "https://github.com/yourusername.png"{'\n'}
                  ogImage:{'\n'}
                  {'  '}url: "/assets/blog/common/cover.png"{'\n'}
                  ---{'\n\n'}
                  Your markdown content goes here...
                </code>
              </pre>

              <p className="mb-4">
                Note: For the author picture, you can use your GitHub profile picture URL or another appropriate image URL.
              </p>

              <h2 className="text-2xl font-semibold mt-6 mb-3 flex items-center">
                <span className="inline-block bg-mono-100 dark:bg-mono-800 rounded-full w-8 h-8 flex items-center justify-center mr-2">5</span>
                Adding Images to Your Blog Post
              </h2>
              <div className="bg-yellow-50 dark:bg-yellow-900/20 p-6 rounded-lg mb-6 border-l-4 border-yellow-500 shadow-md">
                <h3 className="text-xl font-medium mb-2 text-yellow-700 dark:text-yellow-300">Image Directory Structure</h3>
                <p className="mb-3">
                  When adding images to your blog post, follow these guidelines:
                </p>
                <ol className="list-decimal pl-6 mb-4 space-y-2">
                  <li> Dimensions of images should be 16:9 (use 1920x1080 or 1280x720) for best results.</li>
                  <li>Create a directory for your blog post images at: <code className="bg-mono-100 px-2 py-1 rounded dark:bg-mono-800 dark:text-mono-200">/public/assets/blog/BLOG_NAME/</code></li>
                  <li>Where <code className="bg-mono-100 px-2 py-1 rounded dark:bg-mono-800 dark:text-mono-200">BLOG_NAME</code> should match your blog post name (e.g., <code className="bg-mono-100 px-2 py-1 rounded dark:bg-mono-800 dark:text-mono-200">custom-wake-words</code>)</li>
                  <li>Place all your images inside this directory (e.g., <code className="bg-mono-100 px-2 py-1 rounded dark:bg-mono-800 dark:text-mono-200">diagram.png</code>, <code className="bg-mono-100 px-2 py-1 rounded dark:bg-mono-800 dark:text-mono-200">screenshot.jpg</code>)</li>
                </ol>
                <h3 className="text-xl font-medium mb-2 text-yellow-700 dark:text-yellow-300">Referencing Images in Markdown</h3>
                <p className="mb-3">
                  To include images in your blog post, use the following markdown syntax:
                </p>
                <pre className="bg-mono-100 p-4 rounded-md overflow-x-auto mb-2 dark:bg-mono-800 dark:text-mono-200 shadow-inner border border-mono-200 dark:border-mono-700">
                  <code>
                    ![Alt text for the image](/assets/blog/BLOG_NAME/image-filename.png)
                  </code>
                </pre>
                <p className="mb-0">
                  For example: <code className="bg-mono-100 px-2 py-1 rounded dark:bg-mono-800 dark:text-mono-200">![Wake Word Training Process](/assets/blog/custom-wake-words/training-diagram.png)</code>
                </p>
              </div>
              <div className="bg-green-50 dark:bg-green-900/20 p-6 rounded-lg mb-6 border-l-4 border-green-500 shadow-md">
                <h3 className="text-xl font-medium mb-2 text-green-700 dark:text-green-300">Image Best Practices</h3>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Use descriptive filenames for your images (e.g., <code className="bg-mono-100 px-2 py-1 rounded dark:bg-mono-800 dark:text-mono-200">wake-word-training-flow.png</code>)</li>
                  <li>Optimize images for web (compress images to reduce file size)</li>
                  <li>Use PNG format for diagrams, screenshots, or images with transparency</li>
                  <li>Use JPG format for photos</li>
                  <li>Provide meaningful alt text for accessibility</li>
                </ul>
              </div>

              <h2 className="text-2xl font-semibold mt-6 mb-3 flex items-center">
                Adding Videos to Your Blog Post
              </h2>
              <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-lg mb-6 border-l-4 border-blue-500 shadow-md">
                <h3 className="text-xl font-medium mb-2 text-blue-700 dark:text-blue-300">Video Guidelines</h3>
                <p className="mb-3">
                  Videos can make your blog post more engaging and informative. You can embed videos in two ways:
                </p>
                <h4 className="text-lg font-medium mb-2">1. Embedding YouTube Videos</h4>
                <p className="mb-3">
                  To embed a YouTube video, use the following HTML in your markdown:
                </p>
                <pre className="bg-mono-100 p-4 rounded-md overflow-x-auto mb-4 dark:bg-mono-800 dark:text-mono-200 shadow-inner border border-mono-200 dark:border-mono-700">
                  <code>
                    {'<iframe width="560" height="315" \n    src="https://www.youtube.com/embed/VIDEO_ID" \n    frameborder="0" \n    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" \n    allowfullscreen>\n</iframe>'}
                  </code>
                </pre>
                <p className="mb-3">
                  Replace <code className="bg-mono-100 px-2 py-1 rounded dark:bg-mono-800 dark:text-mono-200">VIDEO_ID</code> with the ID of your YouTube video (found in the YouTube URL after "v=").
                </p>
                <h4 className="text-lg font-medium mb-2">2. Self-hosted Videos</h4>
                <p className="mb-3">
                  For self-hosted videos, host video file anywhere on the web (e.g., your own server, cloud storage) and use the following HTML: 
                </p>
                <pre className="bg-mono-100 p-4 rounded-md overflow-x-auto mb-4 dark:bg-mono-800 dark:text-mono-200 shadow-inner border border-mono-200 dark:border-mono-700">
                  <code>
                    {'<video width="100%" controls>\n    <source src="https://your-domain.com/path/to/your-video.mp4" type="video/mp4">\n    Your browser does not support the video tag.\n</video>'}
                  </code>
                </pre>
                <h4 className="text-lg font-medium mb-2">Video Best Practices</h4>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Keep videos concise and relevant to your content</li>
                  <li>For self-hosted videos, compress videos to reduce file size (aim for less than 10MB)</li>
                  <li>Use MP4 format with H.264 encoding for maximum compatibility</li>
                  <li>Add captions or transcripts when possible for accessibility</li>
                  <li>Ensure videos have a 16:9 aspect ratio for proper display</li>
                </ul>
                <div className='mt-4 bg-yellow-100 dark:bg-yellow-900/40 p-3 rounded-md border-l-4 border-yellow-500'>
                  <p className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
                  <strong>IMPORTANT:</strong> DO NOT add video files directly to this repository as it will drastically increase its size. Always use external hosting services like YouTube or other video platforms and embed them using the methods described above.
                  </p>
                </div>
              </div>

              <h2 className="text-2xl font-semibold mt-6 mb-3 flex items-center">
                <span className="inline-block bg-mono-100 dark:bg-mono-800 rounded-full w-8 h-8 flex items-center justify-center mr-2">6</span>
                Co-authors (Optional)
              </h2>
              <p className="mb-4">
                If your blog post has co-authors, you can include them like this:
              </p>
              <pre className="bg-mono-100 p-4 rounded-md overflow-x-auto mb-4 dark:bg-mono-800 dark:text-mono-200 shadow-inner border border-mono-200 dark:border-mono-700">
                <code>
                  coauthors:{'\n'}
                  {'  '}- name: "Co-Author Name"{'\n'}
                  {'    '}picture: "https://github.com/coauthorusername.png"{'\n'}
                  {'  '}- name: "Another Co-Author"{'\n'}
                  {'    '}picture: "https://github.com/anothercoauthor.png"
                </code>
              </pre>

              <h2 className="text-2xl font-semibold mt-6 mb-3 flex items-center">
                <span className="inline-block bg-mono-100 dark:bg-mono-800 rounded-full w-8 h-8 flex items-center justify-center mr-2">7</span>
                Markdown Formatting
              </h2>
              <p className="mb-4">
                You can use standard Markdown syntax in your blog post:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="bg-mono-50 p-4 rounded-md dark:bg-mono-800">
                  <h3 className="text-lg font-medium mb-2">Text Formatting</h3>
                  <ul className="list-disc pl-6 space-y-2">
                    <li><code className="bg-mono-100 px-2 py-1 rounded dark:bg-mono-700"># Heading 1</code></li>
                    <li><code className="bg-mono-100 px-2 py-1 rounded dark:bg-mono-700">## Heading 2</code></li>
                    <li><code className="bg-mono-100 px-2 py-1 rounded dark:bg-mono-700">**Bold Text**</code></li>
                    <li><code className="bg-mono-100 px-2 py-1 rounded dark:bg-mono-700">*Italic Text*</code></li>
                    <li><code className="bg-mono-100 px-2 py-1 rounded dark:bg-mono-700">`Code`</code></li>
                  </ul>
                </div>
                <div className="bg-mono-50 p-4 rounded-md dark:bg-mono-800">
                  <h3 className="text-lg font-medium mb-2">Elements</h3>
                  <ul className="list-disc pl-6 space-y-2">
                    <li><code className="bg-mono-100 px-2 py-1 rounded dark:bg-mono-700">[Link](URL)</code></li>
                    <li><code className="bg-mono-100 px-2 py-1 rounded dark:bg-mono-700">![Alt text](image URL)</code></li>
                    <li><code className="bg-mono-100 px-2 py-1 rounded dark:bg-mono-700">- Bullet point</code></li>
                    <li><code className="bg-mono-100 px-2 py-1 rounded dark:bg-mono-700">1. Numbered item</code></li>
                    <li><code className="bg-mono-100 px-2 py-1 rounded dark:bg-mono-700">```language\ncode\n```</code></li>
                  </ul>
                </div>
              </div>

              <h2 className="text-2xl font-semibold mt-6 mb-3 flex items-center">
                <span className="inline-block bg-mono-100 dark:bg-mono-800 rounded-full w-8 h-8 flex items-center justify-center mr-2">8</span>
                Example Blog Post
              </h2>
              <p className="mb-4">
                Here's a complete example of a blog post with image references:
              </p>
              <pre className="bg-mono-100 p-4 rounded-md overflow-x-auto mb-4 dark:bg-mono-800 dark:text-mono-200 shadow-inner border border-mono-200 dark:border-mono-700">
                <code>
                  ---{'\n'}
                  title: "Implementing Custom Wake Words in OpenVoiceOS"{'\n'}
                  excerpt: "Learn how to create and implement your own custom wake words in OpenVoiceOS for a personalized voice assistant experience."{'\n'}
                  coverImage: "/assets/blog/custom-wake-words/header-image.jpg"{'\n'}
                  date: "2025-07-01T00:00:00.000Z"{'\n'}
                  author:{'\n'}
                  {'  '}name: "Jane Developer"{'\n'}
                  {'  '}picture: "https://github.com/janedeveloper.png"{'\n'}
                  ogImage:{'\n'}
                  {'  '}url: "/assets/blog/custom-wake-words/social-card.jpg"{'\n'}
                  ---{'\n\n'}
                  # Implementing Custom Wake Words in OpenVoiceOS{'\n\n'}
                  Wake words are the phrases that activate your voice assistant, like "Hey Google" or "Alexa." With OpenVoiceOS, you can create your own custom wake words, allowing for a more personalized experience.{'\n\n'}
                  ![Wake Word Visualization](/assets/blog/custom-wake-words/wake-word-viz.png){'\n\n'}
                  ## Why Custom Wake Words Matter{'\n\n'}
                  Custom wake words provide several benefits:{'\n\n'}
                  - **Personalization**: Choose a name that feels natural to you{'\n'}
                  - **Privacy**: Use a unique phrase that won't be triggered accidentally{'\n'}
                  - **Branding**: For businesses, use your brand name as the wake word{'\n\n'}
                  ## Getting Started{'\n\n'}
                  To implement a custom wake word in OpenVoiceOS, you'll need to follow these steps:{'\n\n'}
                  1. Collect audio samples{'\n'}
                  2. Train your wake word model{'\n'}
                  3. Integrate the model with OpenVoiceOS{'\n\n'}
                  ![Process Diagram](/assets/blog/custom-wake-words/process-diagram.png){'\n\n'}
                  Let's dive deeper into each of these steps.{'\n\n'}
                  ### Collecting Audio Samples{'\n\n'}
                  The first step is to collect audio samples of your wake word. You'll need at least 100 recordings of different people saying your wake word in various environments.{'\n\n'}
                  ```bash{'\n'}
                  # Example command to record wake word samples{'\n'}
                  ovos-record-wake-word --name "my-wake-word" --samples 100{'\n'}
                  ```{'\n\n'}
                  ![Recording Interface](/assets/blog/custom-wake-words/recording-interface.jpg){'\n\n'}
                  ### Training Your Wake Word Model{'\n\n'}
                  Once you have your audio samples, you can train your wake word model using the OpenVoiceOS training tools.{'\n\n'}
                  And so on...
                </code>
              </pre>

              <h2 className="text-2xl font-semibold mt-6 mb-3 flex items-center">
                <span className="inline-block bg-mono-100 dark:bg-mono-800 rounded-full w-8 h-8 flex items-center justify-center mr-2">9</span>
                Submit Your Pull Request
              </h2>
              <p className="mb-4">
                After creating your blog post and adding any images, commit your changes and push to your forked repository:
              </p>
              <pre className="bg-mono-100 p-4 rounded-md overflow-x-auto mb-4 dark:bg-mono-800 dark:text-mono-200 shadow-inner border border-mono-200 dark:border-mono-700">
                <code>
                  # Add your blog post{'\n'}
                  git add _posts/YYYY-MM-DD-your-post-title.md{'\n\n'}
                  # Add any images you created{'\n'}
                  git add public/assets/blog/your-blog-name/*{'\n\n'}
                  git commit -m "Add blog post: Your Post Title"{'\n'}
                  git push origin blog/your-blog-post-name
                </code>
              </pre>
              <p className="mb-4">
                Then, go to the original OpenVoiceOS blog repository and create a Pull Request from your branch.
              </p>

              <h2 className="text-2xl font-semibold mt-6 mb-3 flex items-center">
                <span className="inline-block bg-mono-100 dark:bg-mono-800 rounded-full w-8 h-8 flex items-center justify-center mr-2">10</span>
                Review Process
              </h2>
              <p className="mb-4">
                After submitting your PR, the OpenVoiceOS team will review your blog post. They might suggest changes or improvements before merging your contribution.
              </p>
              <p className="mb-4">
                Once approved and merged, your blog post will be published on the OpenVoiceOS blog!
              </p>

              <h2 className="text-2xl font-semibold mt-6 mb-3">Additional Tips</h2>
              <div className="bg-purple-50 dark:bg-purple-900/20 p-6 rounded-lg mb-4 border-l-4 border-purple-500 shadow-md">
                <ul className="list-disc pl-6 mb-0 space-y-2">
                  <li className="mb-1">Keep your blog post focused on topics relevant to OpenVoiceOS, voice assistants, or open-source technology.</li>
                  <li className="mb-1">Include images where appropriate to make your post more engaging.</li>
                  <li className="mb-1">Proofread your post carefully before submitting.</li>
                  <li className="mb-1">If you're unsure about the topic or content, feel free to open an issue first to discuss your blog post idea.</li>
                  <li className="mb-1">Preview your markdown in a markdown editor before submitting to ensure proper formatting.</li>
                </ul>
              </div>
            </div>
          </div>
        </Container>
    </>
  )
}
