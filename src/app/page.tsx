import { Github } from 'lucide-react';
import { SearchForm } from '@/components/home/SearchForm';
import { ExampleChips } from '@/components/home/ExampleChips';

export default function HomePage() {
  return (
    <main className="flex min-h-[calc(100vh-3.5rem)] flex-col items-center justify-center px-4 py-16">
      <div className="flex flex-col items-center gap-6 text-center">
        <div className="flex items-center gap-3">
          <Github className="h-10 w-10 text-gray-900 dark:text-white" />
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white">
            GitHub <span className="text-green-500 dark:text-green-400">Wrapped</span>
          </h1>
        </div>

        <p className="max-w-sm text-gray-500 dark:text-gray-400">
          Spotify Wrapped for your GitHub activity. Enter any username to see beautiful stats and
          charts.
        </p>

        <SearchForm />
        <ExampleChips />
      </div>

      <footer className="absolute bottom-6 text-center text-xs text-gray-400 dark:text-gray-600">
        Built with Next.js + GitHub API ·{' '}
        <a
          href="https://github.com"
          className="transition-colors hover:text-gray-600 dark:hover:text-gray-400"
          target="_blank"
          rel="noopener noreferrer"
        >
          Source on GitHub
        </a>
      </footer>
    </main>
  );
}
