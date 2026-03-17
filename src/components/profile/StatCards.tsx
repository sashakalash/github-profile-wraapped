import { BookOpen, Star, GitFork, Calendar } from 'lucide-react';
import type { SummaryStats } from '@/types/profile';
import { formatNumber } from '@/lib/utils';
import { Card } from '@/components/ui/Card';

const stats = [
  { key: 'totalRepos', label: 'Public Repos', icon: BookOpen },
  { key: 'totalStars', label: 'Total Stars', icon: Star },
  { key: 'totalForks', label: 'Total Forks', icon: GitFork },
  { key: 'yearsOnGitHub', label: 'Years on GitHub', icon: Calendar },
] as const;

interface StatCardsProps {
  summary: SummaryStats;
}

export function StatCards({ summary }: StatCardsProps) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      {stats.map(({ key, label, icon: Icon }) => (
        <Card key={key} className="flex flex-col items-center gap-1 py-4">
          <Icon className="mb-1 h-5 w-5 text-gray-400 dark:text-gray-500" />
          <span className="text-2xl font-bold text-gray-900 dark:text-white">
            {formatNumber(summary[key])}
          </span>
          <span className="text-xs text-gray-500 dark:text-gray-400">{label}</span>
        </Card>
      ))}
    </div>
  );
}
