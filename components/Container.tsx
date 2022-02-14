import { useState, useEffect, ReactNode } from 'react';
import Head from 'next/head';
import NextLink from 'next/link';
import { useTheme } from 'next-themes';

import { NetworkSelect } from 'components/NetworkSelect';
import { Footer } from 'components/Footer';

type ContainerProps = {
  children: ReactNode;

  // meta
  title?: string;
  description?: string;
  type?: string;
  date?: string;
};

export const Container = (props: ContainerProps) => {
  const [mounted, setMounted] = useState(false);
  const { resolvedTheme, setTheme } = useTheme();

  // After mounting, we have access to the theme
  useEffect(() => setMounted(true), []);

  const { children, ...customMeta } = props;
  const meta = {
    title: 'Publana – Ads on Solana',
    description: 'Advertisements website build on Solana',
    type: 'website',
    ...customMeta,
  };

  return (
    <>
      <Head>
        <title>{meta.title}</title>
        <meta name="robots" content="follow, index" />
        <meta content={meta.description} name="description" />
        {meta.date && (
          <meta property="article:published_time" content={meta.date} />
        )}
      </Head>
      <nav
        className="
        flex items-center justify-between
        w-full max-w-4xl
        px-2 md:px-0
        py-4
        mx-auto my-0 md:my-4
        text-gray-900 dark:text-gray-100
        sticky top-0
        backdrop-blur
        bg-transparent dark:dark:bg-neutral-900
        z-50
        "
      >
        <div>
          <NextLink href="/">
            <a className="p-1 text-gray-900 sm:p-4 dark:text-gray-100 hover:text-amber-500 dark:hover:text-amber-400 transition">
              Pubs
            </a>
          </NextLink>
          <NextLink href="/add">
            <a className="p-1 text-gray-900 sm:p-4 dark:text-gray-100 hover:text-amber-500 dark:hover:text-amber-400 transition">
              Add
            </a>
          </NextLink>
          <NextLink href="/about">
            <a className="p-1 text-gray-900 sm:p-4 dark:text-gray-100 hover:text-amber-500 dark:hover:text-amber-400 transition">
              About
            </a>
          </NextLink>
        </div>

        <div className="ml-auto mr-4">
          <NetworkSelect />
        </div>

        <button
          aria-label="Toggle Dark Mode"
          type="button"
          className="w-10 h-10 p-3 bg-amber-100 rounded dark:bg-gray-800"
          onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
        >
          {mounted && (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              stroke="currentColor"
              className="w-4 h-4 text-gray-800 dark:text-gray-200"
            >
              {resolvedTheme === 'dark' ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
                />
              )}
            </svg>
          )}
        </button>
      </nav>
      <main className="flex flex-col flex-1 p-4 max-w-4xl w-full">
        {children}
      </main>
      <Footer />
    </>
  );
};
