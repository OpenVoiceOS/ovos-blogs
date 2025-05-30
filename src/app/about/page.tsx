import Container from "@/app/_components/container";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About | OpenVoiceOS Blog",
  description:
    "Learn more about OpenVoiceOS - the open-source voice assistant operating system",
};

export default function AboutPage() {
  return (
    <>
      <Container>
        <div className="max-w-4xl mx-auto py-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-8">
            About OpenVoiceOS
          </h1>

          <div className="prose prose-lg dark:prose-invert max-w-none mb-16">
            <p className="lead text-xl text-stone-700 dark:text-stone-300">
              OpenVoiceOS is a community-driven open-source project dedicated to
              creating a secure, private, and customizable voice assistant
              operating system that respects user privacy and freedom.
            </p>

            <h2>Our Mission</h2>
            <p>
              Our mission is to provide an open-source alternative to
              proprietary voice assistants, empowering users with complete
              control over their voice technology while ensuring their privacy
              is respected by default.
            </p>

            <h2>What Makes OpenVoiceOS Special</h2>
            <ul>
              <li>
                <strong>Privacy-Focused:</strong> Voice processing happens
                locally by default, keeping your data under your control.
              </li>
              <li>
                <strong>Community-Driven:</strong> Developed by a passionate
                community of contributors from around the world.
              </li>
              <li>
                <strong>Customizable:</strong> Tailor the voice assistant to
                your specific needs and preferences.
              </li>
              <li>
                <strong>Open Source:</strong> Full transparency with code that
                anyone can inspect, modify, and contribute to.
              </li>
              <li>
                <strong>Device Agnostic:</strong> Can be installed on various
                hardware platforms from Raspberry Pi to desktop computers.
              </li>
            </ul>

            <h2>Our History</h2>
            <p>
              OpenVoiceOS began as a community fork of Mycroft Linux in early
              2019, with the goal of creating a full-featured operating system
              for voice-enabled devices. Since then, it has evolved into a
              comprehensive platform supporting various hardware configurations,
              from DIY setups to commercial products.
            </p>

            <p>
              The project has grown to include a rich ecosystem of skills (voice
              applications), TTS (text-to-speech) engines, STT (speech-to-text)
              solutions, and UI frameworks, all focused on providing a seamless
              voice experience without sacrificing privacy or user control.
            </p>

            <div className="my-12 bg-blue-50 dark:bg-blue-900/20 p-6 rounded-xl">
              <h3 className="text-xl font-bold mb-3">Join Our Community</h3>
              <p className="mb-4">
                OpenVoiceOS is built by volunteers and enthusiasts from around
                the world. We welcome contributions of all kinds – whether
                you're a developer, designer, tester, documentation writer, or
                just an enthusiastic user with ideas.
              </p>
              <div className="flex flex-wrap gap-3 mt-4">
                <a
                  href="https://github.com/OpenVoiceOS"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary"
                >
                  GitHub
                </a>
                <a
                  href="https://matrix.to/#/#OpenVoiceOS:matrix.org"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-stone-200 hover:bg-stone-300 dark:bg-stone-700 dark:hover:bg-stone-600 px-4 py-2 rounded-lg text-stone-800 dark:text-stone-200 font-medium transition-colors"
                >
                  Join Chat
                </a>
              </div>
            </div>
          </div>

          <h2 className="text-2xl font-bold mb-6">Core Team</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {teamMembers.map((member) => (
              <div key={member.name} className="card p-6">
                <div className="flex items-center mb-4">
                  <div className="w-16 h-16 rounded-full overflow-hidden mr-4 border-2 border-stone-200 dark:border-stone-700">
                    <Image
                      src={member.image}
                      alt={member.name}
                      width={64}
                      height={64}
                      className="object-cover w-full h-full"
                    />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">{member.name}</h3>
                    <p className="text-stone-600 dark:text-stone-400">
                      {member.role}
                    </p>
                  </div>
                </div>
                <p className="text-stone-700 dark:text-stone-300 text-sm">
                  {member.bio}
                </p>
                <div className="flex space-x-3 mt-4">
                  {member.github && (
                    <a
                      href={member.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-stone-500 hover:text-stone-800 dark:hover:text-stone-300"
                    >
                      <svg
                        className="w-5 h-5"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                      >
                        <path
                          fillRule="evenodd"
                          d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="text-center py-8 border-t border-stone-200 dark:border-stone-700">
            <h2 className="text-2xl font-bold mb-4">Want to get involved?</h2>
            <p className="max-w-2xl mx-auto mb-6 text-stone-700 dark:text-stone-300">
              OpenVoiceOS is a community-driven project that thrives on
              contributions from people like you. Whether you're a developer,
              designer, writer, or just enthusiastic about voice technology,
              we'd love to have you join us!
            </p>
            <Link href="/community" className="btn-primary inline-block">
              Join the Community
            </Link>
          </div>
        </div>
      </Container>
    </>
  );
}

const teamMembers = [
  {
    name: "JarbasAI",
    role: "Project Lead",
    bio: "Founder and core developer of OpenVoiceOS, with a background in AI and voice technology.",
    image: "/assets/blog/authors/jj.jpeg",
    github: "https://github.com/JarbasAl",
  },
  {
    name: "Joe Smith",
    role: "Core Developer",
    bio: "Full-stack developer specializing in embedded systems and audio processing.",
    image: "/assets/blog/authors/joe.jpeg",
    github: "https://github.com/OpenVoiceOS",
  },
  {
    name: "Tim Johnson",
    role: "UI/UX Designer",
    bio: "Designer focused on creating intuitive voice user interfaces and experiences.",
    image: "/assets/blog/authors/tim.jpeg",
    github: "https://github.com/OpenVoiceOS",
  },
];
