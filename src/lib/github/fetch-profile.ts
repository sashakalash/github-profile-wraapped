import type { ProfileData, ProfileError } from '@/types/profile';
import {
  GitHubAPIError,
  fetchUser,
  fetchRepos,
  fetchRepoLanguages,
  fetchPublicEvents,
} from './rest';
import { fetchContributions } from './graphql';
import {
  buildLanguageMap,
  buildHeatmapData,
  buildWeekdayBuckets,
  buildHourBuckets,
  buildTopRepos,
  computeStreaks,
  buildSummaryStats,
} from './aggregate';
import { getYearsOnGitHub } from '@/lib/utils';
import { MAX_REPOS_FOR_LANGUAGES } from '@/lib/constants';

export type FetchProfileResult =
  | { data: ProfileData; error?: never }
  | { data?: never; error: ProfileError };

export async function fetchProfileData(username: string): Promise<FetchProfileResult> {
  try {
    // Fetch user profile + repos + events + contributions in parallel
    const [user, repos, events, contributions] = await Promise.all([
      fetchUser(username),
      fetchRepos(username),
      fetchPublicEvents(username),
      fetchContributions(username),
    ]);

    // Language analysis: top repos by stars, capped to avoid rate limits
    const reposForLanguages = repos.filter((r) => !r.fork).slice(0, MAX_REPOS_FOR_LANGUAGES);

    const languagesPerRepo = await Promise.all(
      reposForLanguages.map((r) => fetchRepoLanguages(user.login, r.name))
    );

    const yearsOnGitHub = getYearsOnGitHub(user.created_at);

    const data: ProfileData = {
      user: {
        login: user.login,
        name: user.name,
        avatarUrl: user.avatar_url,
        bio: user.bio,
        location: user.location,
        blog: user.blog,
        followers: user.followers,
        following: user.following,
        publicRepos: user.public_repos,
        createdAt: user.created_at,
        htmlUrl: user.html_url,
        yearsOnGitHub,
      },
      languages: buildLanguageMap(repos, languagesPerRepo),
      heatmap: buildHeatmapData(contributions),
      weekdayActivity: buildWeekdayBuckets(events),
      hourActivity: buildHourBuckets(events),
      topRepos: buildTopRepos(repos),
      streak: computeStreaks(contributions),
      summary: buildSummaryStats(repos, yearsOnGitHub),
    };

    return { data };
  } catch (err) {
    if (err instanceof GitHubAPIError) {
      if (err.type === 'not_found') return { error: 'not_found' };
      if (err.type === 'rate_limited') return { error: 'rate_limited' };
      if (err.type === 'auth_error') return { error: 'rate_limited' };
    }
    console.error('fetchProfileData error:', err);
    return { error: 'network_error' };
  }
}
