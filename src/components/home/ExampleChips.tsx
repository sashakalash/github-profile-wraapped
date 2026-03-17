'use client';

import Link from 'next/link';
import { EXAMPLE_USERNAMES } from '@/lib/constants';

export function ExampleChips() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-2">
      <span className="text-sm text-gray-400 dark:text-gray-500">Try:</span>
      {EXAMPLE_USERNAMES.map((username) => (
        <Link
          key={username}
          href={`/u/${username}`}
          onClick={() => window.__nprogress_start?.()}
          className="rounded-full border border-gray-200 bg-gray-100 px-3 py-1 text-sm text-gray-600 transition-colors hover:border-gray-300 hover:text-gray-900 dark:border-white/10 dark:bg-white/5 dark:text-gray-300 dark:hover:border-white/20 dark:hover:text-white"
        >
          {username}
        </Link>
      ))}
    </div>
  );
}
