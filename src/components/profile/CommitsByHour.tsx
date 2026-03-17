'use client';

import type { HourBucket } from '@/types/profile';

interface CommitsByHourProps {
  data: HourBucket[];
}

export function CommitsByHour({ data }: CommitsByHourProps) {
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
    <div className="flex h-28 items-end gap-0.5">
      {data.map((bucket) => {
        const pct = (bucket.commits / max) * 100;
        const showLabel = bucket.hour % 6 === 0;
        return (
          <div key={bucket.hour} className="flex flex-1 flex-col items-center gap-1">
            <div
              className="w-full rounded-t transition-all"
              style={{
                height: `${Math.max(pct, 2)}%`,
                backgroundColor: '#26a641',
                opacity: 0.4 + 0.6 * (pct / 100),
              }}
              title={`${bucket.label}: ${bucket.commits} commits`}
            />
            <span
              className="text-[10px] text-gray-400 dark:text-gray-600"
              style={{ visibility: showLabel ? 'visible' : 'hidden' }}
            >
              {bucket.label}
            </span>
          </div>
        );
      })}
    </div>
  );
}
