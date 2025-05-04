import { CMS_NAME } from "@/lib/constants";

export function Intro() {
  return (
    <section className="mb-8 pt-4 pb-6">
      <div className="border-b border-mono-200 dark:border-mono-800 pb-6">
        <h1 className="text-2xl md:text-3xl font-bold mb-2 text-mono-900 dark:text-mono-100">
          OpenVoiceOS Blog
        </h1>
        <p className="text-sm text-mono-600 dark:text-mono-400">
          Updates, guides, and insights from the open-source voice assistant
          operating system.
        </p>
      </div>
    </section>
  );
}
