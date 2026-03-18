'use client';

import dynamic from 'next/dynamic';
import { Skeleton } from '@/components/ui/Skeleton';
import { Card } from '@/components/ui/Card';
import type { WeekdayBucket, HourBucket } from '@/types/profile';

const CommitsByWeekday = dynamic(
  () => import('@/components/profile/CommitsByWeekday').then((m) => m.CommitsByWeekday),
  { ssr: false, loading: () => <Skeleton className="h-28 w-full" /> }
);

const CommitsByHour = dynamic(
  () => import('@/components/profile/CommitsByHour').then((m) => m.CommitsByHour),
  { ssr: false, loading: () => <Skeleton className="h-28 w-full" /> }
);

interface ActivityChartsProps {
  weekdayActivity: WeekdayBucket[];
  hourActivity: HourBucket[];
}

export function ActivityCharts({ weekdayActivity, hourActivity }: ActivityChartsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card title="Commits by Day of Week">
        <CommitsByWeekday data={weekdayActivity} />
      </Card>
      <Card title="Commits by Hour (UTC)">
        <CommitsByHour data={hourActivity} />
      </Card>
    </div>
  );
}
