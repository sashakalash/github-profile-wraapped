import { format } from 'date-fns';
import type {
  GitHubRepo,
  GitHubLanguages,
  GitHubEvent,
  ContributionsCollection,
} from '@/types/github';
import type {
  LanguageEntry,
  HeatmapEntry,
  WeekdayBucket,
  HourBucket,
  TopRepo,
  StreakStats,
  SummaryStats,
} from '@/types/profile';
import {
  LANGUAGE_COLORS,
  DEFAULT_LANGUAGE_COLOR,
  MAX_LANGUAGE_ENTRIES,
  MAX_TOP_REPOS,
  WEEKDAYS,
} from '@/lib/constants';
import { formatHour } from '@/lib/utils';

export function buildLanguageMap(
  repos: GitHubRepo[],
  languagesPerRepo: GitHubLanguages[]
): LanguageEntry[] {
  const totals: Record<string, number> = {};

  for (const languages of languagesPerRepo) {
    for (const [lang, bytes] of Object.entries(languages)) {
      totals[lang] = (totals[lang] ?? 0) + bytes;
    }
  }

  const sorted = Object.entries(totals).sort((a, b) => b[1] - a[1]);
  const totalBytes = sorted.reduce((sum, [, b]) => sum + b, 0);
  if (totalBytes === 0) return [];

  const top = sorted.slice(0, MAX_LANGUAGE_ENTRIES);
  const otherBytes = sorted.slice(MAX_LANGUAGE_ENTRIES).reduce((sum, [, b]) => sum + b, 0);

  const entries: LanguageEntry[] = top.map(([language, bytes]) => ({
    language,
    bytes,
    percentage: Math.round((bytes / totalBytes) * 1000) / 10,
    color: LANGUAGE_COLORS[language] ?? DEFAULT_LANGUAGE_COLOR,
  }));

  if (otherBytes > 0) {
    entries.push({
      language: 'Other',
      bytes: otherBytes,
      percentage: Math.round((otherBytes / totalBytes) * 1000) / 10,
      color: DEFAULT_LANGUAGE_COLOR,
    });
  }

  // Normalize to 100%
  const pctSum = entries.reduce((s, e) => s + e.percentage, 0);
  if (pctSum > 0 && pctSum !== 100) {
    entries[entries.length - 1].percentage =
      Math.round((100 - pctSum + entries[entries.length - 1].percentage) * 10) / 10;
  }

  return entries;
}

export function buildHeatmapData(contributions: ContributionsCollection | null): HeatmapEntry[] {
  if (!contributions) return [];

  return contributions.contributionCalendar.weeks.flatMap((week) =>
    week.contributionDays.map((day) => ({
      day: day.date,
      value: day.contributionCount,
    }))
  );
}

export function buildWeekdayBuckets(events: GitHubEvent[]): WeekdayBucket[] {
  const counts = Array(7).fill(0) as number[];

  for (const event of events) {
    if (event.type !== 'PushEvent') continue;
    const date = new Date(event.created_at);
    counts[date.getDay()]++;
  }

  return WEEKDAYS.map((day, i) => ({ day, commits: counts[i] }));
}

export function buildHourBuckets(events: GitHubEvent[]): HourBucket[] {
  const counts = Array(24).fill(0) as number[];

  for (const event of events) {
    if (event.type !== 'PushEvent') continue;
    const date = new Date(event.created_at);
    counts[date.getUTCHours()]++;
  }

  return counts.map((commits, hour) => ({
    hour,
    label: formatHour(hour),
    commits,
  }));
}

export function buildTopRepos(repos: GitHubRepo[]): TopRepo[] {
  return repos
    .filter((r) => !r.fork)
    .sort((a, b) => b.stargazers_count - a.stargazers_count)
    .slice(0, MAX_TOP_REPOS)
    .map((r) => ({
      name: r.name,
      description: r.description,
      htmlUrl: r.html_url,
      stars: r.stargazers_count,
      forks: r.forks_count,
      language: r.language,
    }));
}

export function computeStreaks(contributions: ContributionsCollection | null): StreakStats {
  if (!contributions) {
    return { currentStreak: 0, longestStreak: 0, totalActiveDays: 0, totalContributions: 0 };
  }

  const days = contributions.contributionCalendar.weeks
    .flatMap((w) => w.contributionDays)
    .sort((a, b) => a.date.localeCompare(b.date));

  const totalContributions = contributions.contributionCalendar.totalContributions;
  const totalActiveDays = days.filter((d) => d.contributionCount > 0).length;

  let longestStreak = 0;
  let currentRun = 0;

  for (const day of days) {
    if (day.contributionCount > 0) {
      currentRun++;
      longestStreak = Math.max(longestStreak, currentRun);
    } else {
      currentRun = 0;
    }
  }

  // Current streak: walk backwards from today
  const today = format(new Date(), 'yyyy-MM-dd');
  let currentStreak = 0;
  const reversedDays = [...days].reverse();

  for (const day of reversedDays) {
    if (day.date > today) continue;
    if (day.contributionCount > 0) {
      currentStreak++;
    } else {
      break;
    }
  }

  return { currentStreak, longestStreak, totalActiveDays, totalContributions };
}

export function buildSummaryStats(repos: GitHubRepo[], yearsOnGitHub: number): SummaryStats {
  const ownRepos = repos.filter((r) => !r.fork);
  return {
    totalRepos: ownRepos.length,
    totalStars: ownRepos.reduce((sum, r) => sum + r.stargazers_count, 0),
    totalForks: ownRepos.reduce((sum, r) => sum + r.forks_count, 0),
    yearsOnGitHub,
  };
}
