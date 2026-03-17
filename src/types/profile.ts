// Derived/aggregated types that the UI consumes

export interface ProfileUser {
  login: string;
  name: string | null;
  avatarUrl: string;
  bio: string | null;
  location: string | null;
  blog: string | null;
  followers: number;
  following: number;
  publicRepos: number;
  createdAt: string;
  htmlUrl: string;
  yearsOnGitHub: number;
}

export interface LanguageEntry {
  language: string;
  bytes: number;
  percentage: number;
  color: string;
}

export interface HeatmapEntry {
  day: string; // YYYY-MM-DD
  value: number;
}

export interface WeekdayBucket {
  day: string; // 'Mon', 'Tue', etc.
  commits: number;
}

export interface HourBucket {
  hour: number; // 0–23
  label: string; // '12am', '1am', etc.
  commits: number;
}

export interface TopRepo {
  name: string;
  description: string | null;
  htmlUrl: string;
  stars: number;
  forks: number;
  language: string | null;
}

export interface StreakStats {
  currentStreak: number;
  longestStreak: number;
  totalActiveDays: number;
  totalContributions: number;
}

export interface SummaryStats {
  totalRepos: number;
  totalStars: number;
  totalForks: number;
  yearsOnGitHub: number;
}

export interface ProfileData {
  user: ProfileUser;
  languages: LanguageEntry[];
  heatmap: HeatmapEntry[];
  weekdayActivity: WeekdayBucket[];
  hourActivity: HourBucket[];
  topRepos: TopRepo[];
  streak: StreakStats;
  summary: SummaryStats;
}

export type ProfileError = 'not_found' | 'rate_limited' | 'network_error' | 'server_error';

export interface ProfileResult {
  data?: ProfileData;
  error?: ProfileError;
}
