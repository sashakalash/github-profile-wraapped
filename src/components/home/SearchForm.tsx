'use client';

import { useState, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { Search, AlertCircle } from 'lucide-react';
import { isValidUsername } from '@/lib/utils';

export function SearchForm() {
  const router = useRouter();
  const [value, setValue] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const username = value.trim();

    if (!username) {
      setError('Enter a GitHub username');
      return;
    }

    if (!isValidUsername(username)) {
      setError('Username can only contain letters, numbers, and hyphens');
      return;
    }

    window.__nprogress_start?.();
    router.push(`/u/${username}`);
  };

  const handleChange = (val: string) => {
    setValue(val);
    if (error) setError('');
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-md">
      <div className="relative">
        <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400 dark:text-gray-500" />
        <input
          type="text"
          value={value}
          onChange={(e) => handleChange(e.target.value)}
          placeholder="GitHub username"
          autoComplete="off"
          spellCheck={false}
          className="w-full rounded-xl border border-gray-200 bg-white py-3 pl-10 pr-16 text-gray-900 placeholder-gray-400 outline-none transition focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:border-white/10 dark:bg-white/5 dark:text-white dark:placeholder-gray-500 dark:focus:border-blue-500"
          aria-label="GitHub username"
          aria-describedby={error ? 'search-error' : undefined}
          aria-invalid={!!error}
        />
        <button
          type="submit"
          className="absolute right-2 top-1/2 -translate-y-1/2 rounded-lg bg-blue-600 px-4 py-1.5 text-sm font-medium text-white transition-colors hover:bg-blue-500"
        >
          Go
        </button>
      </div>
      {error && (
        <p id="search-error" className="mt-2 flex items-center gap-1.5 text-sm text-red-500">
          <AlertCircle className="h-3.5 w-3.5 flex-shrink-0" />
          {error}
        </p>
      )}
    </form>
  );
}
