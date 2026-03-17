import Link from 'next/link';
import { Search } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="flex min-h-[calc(100vh-3.5rem)] flex-col items-center justify-center gap-4 px-4 text-center">
      <div className="text-6xl">🤔</div>
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white">User not found</h1>
      <p className="max-w-sm text-gray-500 dark:text-gray-400">
        We couldn&apos;t find a GitHub user with that username. Check the spelling and try again.
      </p>
      <Link
        href="/"
        className="mt-2 flex items-center gap-2 rounded-lg border border-gray-200 bg-gray-100 px-5 py-2.5 text-sm text-gray-700 transition-colors hover:bg-gray-200 dark:border-white/10 dark:bg-white/10 dark:text-white dark:hover:bg-white/20"
      >
        <Search className="h-4 w-4" />
        Search again
      </Link>
    </div>
  );
}
