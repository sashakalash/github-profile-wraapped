import { notFound } from 'next/navigation';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import type { Metadata } from 'next';
import { ArrowLeft } from 'lucide-react';
import { fetchProfileData } from '@/lib/github/fetch-profile';
import { ProfileHeader } from '@/components/profile/ProfileHeader';
import { StatCards } from '@/components/profile/StatCards';
import { LanguageChart } from '@/components/profile/LanguageChart';
import { TopRepos } from '@/components/profile/TopRepos';
import { ContributionSection } from '@/components/profile/ContributionSection';
import { Card } from '@/components/ui/Card';
import { CopyButton } from '@/components/ui/CopyButton';
import { Skeleton } from '@/components/ui/Skeleton';

export const revalidate = 21600;

const CommitsByWeekday = dynamic(
  () => import('@/components/profile/CommitsByWeekday').then((m) => m.CommitsByWeekday),
  { ssr: false, loading: () => <Skeleton className="h-28 w-full" /> }
);

const CommitsByHour = dynamic(
  () => import('@/components/profile/CommitsByHour').then((m) => m.CommitsByHour),
  { ssr: false, loading: () => <Skeleton className="h-28 w-full" /> }
);

interface Props {
  params: { username: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { username } = params;
  const result = await fetchProfileData(username);

  if (result.error || !result.data) {
    return {
      title: `${username} · GitHub Wrapped`,
      description: `GitHub profile stats for ${username}`,
    };
  }

  const { user, summary, languages } = result.data;
  const displayName = user.name ?? user.login;
  const topLanguage = languages[0]?.language ?? 'code';

  return {
    title: `${displayName} (@${user.login}) · GitHub Wrapped`,
    description: `${displayName} has ${summary.totalRepos} repos, ${summary.totalStars} stars, and primarily codes in ${topLanguage}. View their full GitHub stats.`,
    openGraph: {
      title: `${displayName}'s GitHub Wrapped`,
      description: `${summary.totalStars} stars · ${summary.totalRepos} repos · ${topLanguage}`,
      images: [`/api/og?username=${username}`],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${displayName}'s GitHub Wrapped`,
      images: [`/api/og?username=${username}`],
    },
  };
}

export default async function ProfilePage({ params }: Props) {
  const { username } = params;
  const result = await fetchProfileData(username);

  if (result.error === 'not_found') notFound();

  if (result.error || !result.data) {
    return (
      <div className="flex min-h-[calc(100vh-3.5rem)] flex-col items-center justify-center gap-4 px-4 text-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          {result.error === 'rate_limited'
            ? 'GitHub API rate limit reached'
            : 'Something went wrong'}
        </h1>
        <p className="text-gray-500 dark:text-gray-400">
          {result.error === 'rate_limited'
            ? 'Too many requests. Try again in a few minutes.'
            : 'Failed to load profile data. Please try again.'}
        </p>
        <a
          href="/"
          className="mt-2 rounded-lg border border-gray-200 bg-gray-100 px-4 py-2 text-sm text-gray-700 transition-colors hover:bg-gray-200 dark:border-white/10 dark:bg-white/10 dark:text-white dark:hover:bg-white/20"
        >
          ← Back to search
        </a>
      </div>
    );
  }

  const { user, languages, heatmap, weekdayActivity, hourActivity, topRepos, streak, summary } =
    result.data;

  const profileUrl = `https://github.com/${user.login}`;

  return (
    <div className="mx-auto max-w-[900px] space-y-4 px-4 py-8">
      {/* Back button */}
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 text-sm text-gray-500 transition-colors hover:text-gray-900 dark:hover:text-gray-300"
      >
        <ArrowLeft className="h-4 w-4" />
        Back
      </Link>

      {/* Header card */}
      <Card>
        <div className="space-y-4">
          <ProfileHeader user={user} profileUrl={profileUrl} />
          <div className="flex justify-end">
            <CopyButton username={user.login} />
          </div>
        </div>
      </Card>

      {/* Summary stats */}
      <StatCards summary={summary} />

      {/* Contribution heatmap + streak (auth-gated client component) */}
      <ContributionSection username={username} serverHeatmap={heatmap} serverStreak={streak} />

      {/* Language chart + Top repos */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card title="Languages">
          <LanguageChart languages={languages} />
        </Card>
        <Card title="Top Repositories">
          <TopRepos repos={topRepos} />
        </Card>
      </div>

      {/* Commit activity charts */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card title="Commits by Day of Week">
          <CommitsByWeekday data={weekdayActivity} />
        </Card>
        <Card title="Commits by Hour (UTC)">
          <CommitsByHour data={hourActivity} />
        </Card>
      </div>
    </div>
  );
}
