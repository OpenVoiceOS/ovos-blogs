"use client";

import Link from "next/link";
import Container from "./container";
import { useState } from "react";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="py-4 border-b border-mono-200 dark:border-mono-800 sticky top-0 bg-mono-100 dark:bg-mono-900 z-10">
      <Container>
        <div className="flex justify-between items-center">
          <Link href="/" className="flex items-center">
            <span className="text-2xl font-bold bg-gradient-to-r from-accent-dark to-accent bg-clip-text text-transparent">
              OpenVoiceOS
            </span>
          </Link>

          <nav className="hidden md:flex space-x-8">
            <Link
              href="/"
              className="font-medium text-mono-800 hover:text-accent dark:text-mono-200 dark:hover:text-accent transition-colors duration-200"
            >
              Home
            </Link>
            <Link
              href="/about"
              className="font-medium text-mono-800 hover:text-accent dark:text-mono-200 dark:hover:text-accent transition-colors duration-200"
            >
              About
            </Link>
            <Link
              href="/community"
              className="font-medium text-mono-800 hover:text-accent dark:text-mono-200 dark:hover:text-accent transition-colors duration-200"
            >
              Community
            </Link>
            <Link
              href="https://github.com/OpenVoiceOS"
              className="font-medium text-mono-800 hover:text-accent dark:text-mono-200 dark:hover:text-accent transition-colors duration-200"
            >
              GitHub
            </Link>
          </nav>

          <div className="flex items-center space-x-4">
            <button
              className="md:hidden text-mono-800 dark:text-mono-200 hover:text-accent dark:hover:text-accent transition-colors duration-200"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle menu"
            >
              {isMenuOpen ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-6 h-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-6 h-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>

        {isMenuOpen && (
          <div className="md:hidden mt-4 py-3 border-t border-mono-200 dark:border-mono-800">
            <nav className="flex flex-col space-y-4">
              <Link
                href="/"
                className="font-medium text-mono-800 hover:text-accent dark:text-mono-200 dark:hover:text-accent transition-colors duration-200"
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              <Link
                href="/about"
                className="font-medium text-mono-800 hover:text-accent dark:text-mono-200 dark:hover:text-accent transition-colors duration-200"
                onClick={() => setIsMenuOpen(false)}
              >
                About
              </Link>
              <Link
                href="/community"
                className="font-medium text-mono-800 hover:text-accent dark:text-mono-200 dark:hover:text-accent transition-colors duration-200"
                onClick={() => setIsMenuOpen(false)}
              >
                Community
              </Link>
              <Link
                href="https://github.com/OpenVoiceOS"
                className="font-medium text-mono-800 hover:text-accent dark:text-mono-200 dark:hover:text-accent transition-colors duration-200"
                onClick={() => setIsMenuOpen(false)}
              >
                GitHub
              </Link>
            </nav>
          </div>
        )}
      </Container>
    </header>
  );
};

export default Header;
