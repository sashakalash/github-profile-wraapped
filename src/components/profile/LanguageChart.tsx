'use client';

import type { LanguageEntry } from '@/types/profile';

interface LanguageChartProps {
  languages: LanguageEntry[];
}

export function LanguageChart({ languages }: LanguageChartProps) {
  if (languages.length === 0) {
    return (
      <div className="flex h-32 items-center justify-center text-sm text-gray-400 dark:text-gray-500">
        No language data available
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex h-4 w-full overflow-hidden rounded-full">
        {languages.map((entry) => (
          <div
            key={entry.language}
            style={{ width: `${entry.percentage}%`, backgroundColor: entry.color }}
            title={`${entry.language}: ${entry.percentage}%`}
          />
        ))}
      </div>
      <div className="flex flex-wrap gap-x-4 gap-y-2">
        {languages.map((entry) => (
          <div key={entry.language} className="flex items-center gap-1.5">
            <span
              className="h-3 w-3 flex-shrink-0 rounded-full"
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-sm text-gray-700 dark:text-gray-300">{entry.language}</span>
            <span className="text-xs text-gray-400 dark:text-gray-500">{entry.percentage}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}
