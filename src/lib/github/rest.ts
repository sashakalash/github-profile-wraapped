import type { GitHubUser, GitHubRepo, GitHubLanguages, GitHubEvent } from '@/types/github';
import type { GitHubAPIError as GitHubAPIErrorType } from '@/types/github';

const GITHUB_API = 'https://api.github.com';

function getHeaders(): HeadersInit {
  const headers: HeadersInit = {
    Accept: 'application/vnd.github.v3+json',
    'X-GitHub-Api-Version': '2022-11-28',
  };
  if (process.env.GITHUB_TOKEN) {
    (headers as Record<string, string>).Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
  }
  return headers;
}

export class GitHubAPIError extends Error {
  constructor(
    public type: GitHubAPIErrorType,
    message: string
  ) {
    super(message);
    this.name = 'GitHubAPIError';
  }
}

async function githubFetch<T>(path: string): Promise<T> {
  let res: Response;
  try {
    res = await fetch(`${GITHUB_API}${path}`, {
      headers: getHeaders(),
      next: { revalidate: 21600 },
    });
  } catch {
    throw new GitHubAPIError('network_error', 'Failed to reach GitHub API');
  }

  if (res.status === 404) throw new GitHubAPIError('not_found', 'User not found');
  if (res.status === 403 || res.status === 429) {
    throw new GitHubAPIError('rate_limited', 'GitHub API rate limit exceeded');
  }
  if (res.status === 401) throw new GitHubAPIError('auth_error', 'GitHub API auth error');
  if (!res.ok) throw new GitHubAPIError('network_error', `GitHub API error: ${res.status}`);

  return res.json() as Promise<T>;
}

export async function fetchUser(username: string): Promise<GitHubUser> {
  return githubFetch<GitHubUser>(`/users/${username}`);
}

export async function fetchRepos(username: string): Promise<GitHubRepo[]> {
  const repos: GitHubRepo[] = [];
  let page = 1;

  while (repos.length < 1000) {
    const batch = await githubFetch<GitHubRepo[]>(
      `/users/${username}/repos?per_page=100&page=${page}&sort=stars&direction=desc`
    );
    if (batch.length === 0) break;
    repos.push(...batch);
    if (batch.length < 100) break;
    page++;
    if (page > 10) break;
  }

  return repos;
}

export async function fetchRepoLanguages(owner: string, repo: string): Promise<GitHubLanguages> {
  try {
    return await githubFetch<GitHubLanguages>(`/repos/${owner}/${repo}/languages`);
  } catch {
    return {};
  }
}

export async function fetchPublicEvents(username: string): Promise<GitHubEvent[]> {
  const events: GitHubEvent[] = [];
  for (let page = 1; page <= 3; page++) {
    try {
      const batch = await githubFetch<GitHubEvent[]>(
        `/users/${username}/events/public?per_page=100&page=${page}`
      );
      if (batch.length === 0) break;
      events.push(...batch);
      if (batch.length < 100) break;
    } catch {
      break;
    }
  }
  return events;
}
