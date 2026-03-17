'use client';

import { ResponsiveCalendar } from '@nivo/calendar';
import { format, subDays } from 'date-fns';
import { useTheme } from 'next-themes';
import type { HeatmapEntry } from '@/types/profile';

interface ContributionHeatmapProps {
  data: HeatmapEntry[];
  totalContributions: number;
}

const NIVO_COLORS = ['#0e4429', '#006d32', '#26a641', '#39d353'];

export function ContributionHeatmap({ data, totalContributions }: ContributionHeatmapProps) {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === 'dark';

  const today = format(new Date(), 'yyyy-MM-dd');
  const yearAgo = format(subDays(new Date(), 364), 'yyyy-MM-dd');

  if (data.length === 0) {
    return (
      <div className="flex h-[160px] items-center justify-center text-sm text-gray-400 dark:text-gray-500">
        No contribution data available
      </div>
    );
  }

  return (
    <div>
      <p className="mb-3 text-sm text-gray-500 dark:text-gray-400">
        <span className="font-semibold text-gray-900 dark:text-white">
          {totalContributions.toLocaleString()}
        </span>{' '}
        contributions in the last year
      </p>
      <div style={{ height: '160px' }}>
        <ResponsiveCalendar
          data={data}
          from={yearAgo}
          to={today}
          emptyColor={isDark ? '#161b22' : '#ebedf0'}
          colors={NIVO_COLORS}
          margin={{ top: 20, right: 0, bottom: 0, left: 24 }}
          yearSpacing={40}
          monthBorderColor={isDark ? '#0d1117' : '#ffffff'}
          dayBorderWidth={2}
          dayBorderColor={isDark ? '#0d1117' : '#ffffff'}
          theme={{
            text: { fill: isDark ? '#8b949e' : '#57606a', fontSize: 11 },
            tooltip: {
              container: {
                background: isDark ? '#1c2128' : '#ffffff',
                color: isDark ? '#e6edf3' : '#24292f',
                borderRadius: '6px',
                border: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : '#d0d7de'}`,
                fontSize: 12,
              },
            },
          }}
          tooltip={({ day, value }) => (
            <div className="rounded px-2 py-1 text-xs">
              {Number(value)} contributions on {day}
            </div>
          )}
        />
      </div>
    </div>
  );
}
