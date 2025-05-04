import { CMS_NAME } from "@/lib/constants";

export function Intro() {
  return (
    <section className="mb-8 pt-4 pb-6">
      <div className="border-b border-mono-200 dark:border-mono-800 pb-6">
        <h1 className="text-3xl md:text-4xl font-bold mb-3 text-mono-900 dark:text-mono-100">
          Welcome to the <span className="text-accent">OpenVoiceOS</span> Blog
        </h1>
        <p className="text-base md:text-lg text-mono-600 dark:text-mono-400 max-w-3xl">
          Discover the latest updates, guides, and insights from the open-source
          voice assistant ecosystem. Join our journey of innovation and
          collaboration.
        </p>
      </div>
    </section>
  );
}
