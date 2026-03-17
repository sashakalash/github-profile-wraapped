import { Flame, TrendingUp, CalendarDays } from 'lucide-react';
import type { StreakStats } from '@/types/profile';
import { Card } from '@/components/ui/Card';

interface StreakStatsProps {
  streak: StreakStats;
}

export function StreakStatsSection({ streak }: StreakStatsProps) {
  const items = [
    {
      icon: Flame,
      label: 'Current Streak',
      value: streak.currentStreak,
      unit: streak.currentStreak === 1 ? 'day' : 'days',
      color: 'text-orange-500 dark:text-orange-400',
    },
    {
      icon: TrendingUp,
      label: 'Longest Streak',
      value: streak.longestStreak,
      unit: streak.longestStreak === 1 ? 'day' : 'days',
      color: 'text-blue-500 dark:text-blue-400',
    },
    {
      icon: CalendarDays,
      label: 'Active Days',
      value: streak.totalActiveDays,
      unit: 'in past year',
      color: 'text-green-500 dark:text-green-400',
    },
  ];

  return (
    <div className="grid grid-cols-3 gap-3">
      {items.map(({ icon: Icon, label, value, unit, color }) => (
        <Card key={label} className="flex flex-col items-center gap-1 py-4 text-center">
          <Icon className={`mb-1 h-5 w-5 ${color}`} />
          <span className="text-2xl font-bold text-gray-900 dark:text-white">{value}</span>
          <span className="text-xs text-gray-500 dark:text-gray-400">{unit}</span>
          <span className="text-xs text-gray-400 dark:text-gray-500">{label}</span>
        </Card>
      ))}
    </div>
  );
}
