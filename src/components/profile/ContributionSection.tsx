'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useQuery } from '@tanstack/react-query';
import dynamic from 'next/dynamic';
import { Lock } from 'lucide-react';
import type { HeatmapEntry, StreakStats } from '@/types/profile';
import type { ContributionsCollection } from '@/types/github';
import { buildHeatmapData, computeStreaks } from '@/lib/github/aggregate';
import { Card } from '@/components/ui/Card';
import { Skeleton } from '@/components/ui/Skeleton';
import { StreakStatsSection } from '@/components/profile/StreakStats';
import { SignInModal } from '@/components/ui/SignInModal';

const ContributionHeatmap = dynamic(
  () => import('@/components/profile/ContributionHeatmap').then((m) => m.ContributionHeatmap),
  { ssr: false, loading: () => <Skeleton className="h-[160px] w-full" /> }
);

interface ContributionSectionProps {
  username: string;
  serverHeatmap: HeatmapEntry[];
  serverStreak: StreakStats;
}

async function fetchContributionsClient(username: string): Promise<ContributionsCollection> {
  const res = await fetch(`/api/github/contributions?username=${username}`);
  if (!res.ok) throw new Error('Failed to fetch contributions');
  return res.json() as Promise<ContributionsCollection>;
}

function SignInCTA() {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <>
      <div className="flex flex-col items-center gap-3 py-6 text-center">
        <Lock className="h-8 w-8 text-gray-400 dark:text-gray-600" />
        <div>
          <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Contribution data requires authentication
          </p>
          <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-500">
            Sign in with GitHub to see the heatmap and streak stats
          </p>
        </div>
        <button
          onClick={() => setModalOpen(true)}
          className="mt-1 flex items-center gap-2 rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-gray-700 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-100"
        >
          Sign in with GitHub
        </button>
      </div>

      <SignInModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        description="Sign in to unlock your contribution heatmap and streak stats."
      />
    </>
  );
}

export function ContributionSection({
  username,
  serverHeatmap,
  serverStreak,
}: ContributionSectionProps) {
  const hasServerData = serverHeatmap.length > 0;
  const { status } = useSession();

  // Client-side fetch only when server has no data and user is logged in
  const { data: clientContributions, isLoading } = useQuery({
    queryKey: ['contributions', username],
    queryFn: () => fetchContributionsClient(username),
    enabled: !hasServerData && status === 'authenticated',
    staleTime: 1000 * 60 * 60 * 6,
    retry: 1,
  });

  // Derive heatmap + streak from client fetch
  const clientHeatmap = clientContributions ? buildHeatmapData(clientContributions) : [];
  const clientStreak = clientContributions ? computeStreaks(clientContributions) : null;

  const heatmap = hasServerData ? serverHeatmap : clientHeatmap;
  const streak = hasServerData ? serverStreak : (clientStreak ?? serverStreak);
  const totalContributions = streak.totalContributions;

  // What to render in the heatmap card body
  const renderHeatmapBody = () => {
    if (hasServerData || clientContributions) {
      return <ContributionHeatmap data={heatmap} totalContributions={totalContributions} />;
    }
    if (isLoading || status === 'loading') {
      return <Skeleton className="h-[160px] w-full" />;
    }
    return <SignInCTA />;
  };

  return (
    <>
      <Card
        title={
          !hasServerData && !clientContributions && status === 'unauthenticated'
            ? 'Contribution Activity'
            : 'Contribution Activity'
        }
      >
        {renderHeatmapBody()}
      </Card>

      {(hasServerData || clientContributions) && <StreakStatsSection streak={streak} />}

      {!hasServerData && !clientContributions && !isLoading && status === 'unauthenticated' && (
        <div className="grid grid-cols-3 gap-3">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="flex flex-col items-center gap-1 rounded-xl border border-gray-200 bg-[#f6f8fa] py-4 text-center dark:border-white/10 dark:bg-[#161b22]"
            >
              <div className="h-5 w-5 rounded bg-gray-200 dark:bg-white/10 mb-1" />
              <div className="h-7 w-8 rounded bg-gray-200 dark:bg-white/10" />
              <div className="h-3 w-16 rounded bg-gray-100 dark:bg-white/5 mt-1" />
            </div>
          ))}
        </div>
      )}
    </>
  );
}
