import { ReactNode } from 'react';
import Link from 'next/link';

const ExternalLink = ({
  href,
  children,
}: {
  href: string;
  children: ReactNode;
}) => (
  <a
    className="text-gray-500 hover:text-gray-600 transition"
    target="_blank"
    rel="noopener noreferrer"
    href={href}
  >
    {children}
  </a>
);

export const Footer = () => {
  return (
    <footer className="flex flex-col justify-center items-start max-w-4xl p-4 mx-auto my-8 w-full">
      <hr className="w-full border-1 border-gray-200 dark:border-gray-800 mb-8" />
      <div className="w-full max-w-2xl grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="flex flex-col space-y-4">
          <Link href="/">
            <a className="text-gray-500 hover:text-gray-600 transition">Pubs</a>
          </Link>
          <Link href="/add">
            <a className="text-gray-500 hover:text-gray-600 transition">Add</a>
          </Link>
          <Link href="/about">
            <a className="text-gray-500 hover:text-gray-600 transition">
              About
            </a>
          </Link>
        </div>
        <div className="flex flex-col space-y-4">
          <ExternalLink href="https://twitter.com">Twitter</ExternalLink>
          <ExternalLink href="https://github.com">GitHub</ExternalLink>
        </div>
      </div>
    </footer>
  );
};
