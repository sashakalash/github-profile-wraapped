import { Star, GitFork, ExternalLink } from 'lucide-react';
import type { TopRepo } from '@/types/profile';
import { LanguageBadge } from '@/components/ui/Badge';
import { formatNumber } from '@/lib/utils';

interface TopReposProps {
  repos: TopRepo[];
}

export function TopRepos({ repos }: TopReposProps) {
  if (repos.length === 0) {
    return (
      <div className="flex h-32 items-center justify-center text-sm text-gray-400 dark:text-gray-500">
        No public repositories
      </div>
    );
  }

  return (
    <ul className="space-y-3">
      {repos.map((repo, i) => (
        <li key={repo.name}>
          <a
            href={repo.htmlUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="-mx-2 group flex items-start gap-3 rounded-lg p-2 transition-colors hover:bg-gray-100 dark:hover:bg-white/5"
          >
            <span className="mt-0.5 w-5 flex-shrink-0 text-right font-mono text-sm text-gray-400 dark:text-gray-600">
              {i + 1}
            </span>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5">
                <span className="truncate font-medium text-gray-900 transition-colors group-hover:text-blue-600 dark:text-white dark:group-hover:text-blue-400">
                  {repo.name}
                </span>
                <ExternalLink className="h-3 w-3 flex-shrink-0 text-gray-400 dark:text-gray-600" />
              </div>
              {repo.description && (
                <p className="mt-0.5 line-clamp-1 text-xs text-gray-500 dark:text-gray-400">
                  {repo.description}
                </p>
              )}
              <div className="mt-1.5 flex items-center gap-3">
                {repo.language && <LanguageBadge language={repo.language} />}
                <span className="flex items-center gap-1 text-xs text-gray-400 dark:text-gray-500">
                  <Star className="h-3 w-3" />
                  {formatNumber(repo.stars)}
                </span>
                <span className="flex items-center gap-1 text-xs text-gray-400 dark:text-gray-500">
                  <GitFork className="h-3 w-3" />
                  {formatNumber(repo.forks)}
                </span>
              </div>
            </div>
          </a>
        </li>
      ))}
    </ul>
  );
}
