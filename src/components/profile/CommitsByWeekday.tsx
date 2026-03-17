'use client';

import type { WeekdayBucket } from '@/types/profile';

interface CommitsByWeekdayProps {
  data: WeekdayBucket[];
}

export function CommitsByWeekday({ data }: CommitsByWeekdayProps) {
  const max = Math.max(...data.map((d) => d.commits), 1);
  const total = data.reduce((sum, d) => sum + d.commits, 0);

  if (total === 0) {
    return (
      <div className="flex h-32 items-center justify-center text-sm text-gray-400 dark:text-gray-500">
        No recent commit data
      </div>
    );
  }

  return (
    <div className="flex h-28 items-end gap-1.5">
      {data.map((bucket) => {
        const pct = (bucket.commits / max) * 100;
        return (
          <div key={bucket.day} className="flex flex-1 flex-col items-center gap-1">
            <span className="text-xs text-gray-400 dark:text-gray-500">{bucket.commits || ''}</span>
            <div
              className="w-full rounded-t transition-all"
              style={{
                height: `${Math.max(pct, 2)}%`,
                backgroundColor: '#3178c6',
                opacity: 0.4 + 0.6 * (pct / 100),
              }}
              title={`${bucket.day}: ${bucket.commits} commits`}
            />
            <span className="text-xs text-gray-400 dark:text-gray-500">
              {bucket.day.slice(0, 2)}
            </span>
          </div>
        );
      })}
    </div>
  );
}
