// Raw GitHub REST API v3 response types

export interface GitHubUser {
  login: string;
  id: number;
  avatar_url: string;
  html_url: string;
  name: string | null;
  bio: string | null;
  location: string | null;
  blog: string | null;
  public_repos: number;
  followers: number;
  following: number;
  created_at: string;
}

export interface GitHubRepo {
  id: number;
  name: string;
  full_name: string;
  description: string | null;
  html_url: string;
  stargazers_count: number;
  forks_count: number;
  language: string | null;
  fork: boolean;
  created_at: string;
  pushed_at: string;
}

export interface GitHubLanguages {
  [language: string]: number; // bytes
}

export type GitHubEventType =
  | 'PushEvent'
  | 'PullRequestEvent'
  | 'CreateEvent'
  | 'WatchEvent'
  | 'ForkEvent'
  | string;

export interface GitHubPushEventPayload {
  commits: { sha: string; message: string }[];
}

export interface GitHubEvent {
  id: string;
  type: GitHubEventType;
  created_at: string;
  payload: GitHubPushEventPayload | Record<string, unknown>;
}

// GitHub GraphQL API types

export interface ContributionDay {
  date: string; // YYYY-MM-DD
  contributionCount: number;
}

export interface ContributionWeek {
  contributionDays: ContributionDay[];
}

export interface ContributionCalendar {
  totalContributions: number;
  weeks: ContributionWeek[];
}

export interface ContributionsCollection {
  contributionCalendar: ContributionCalendar;
}

export interface GraphQLUserResponse {
  data: {
    user: {
      contributionsCollection: ContributionsCollection;
    } | null;
  };
  errors?: { message: string }[];
}

export type GitHubAPIError = 'not_found' | 'rate_limited' | 'network_error' | 'auth_error';
