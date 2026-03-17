import type { ContributionsCollection } from '@/types/github';

const GITHUB_GRAPHQL = 'https://api.github.com/graphql';

const CONTRIBUTIONS_QUERY = `
  query ContributionsQuery($username: String!, $from: DateTime!, $to: DateTime!) {
    user(login: $username) {
      contributionsCollection(from: $from, to: $to) {
        contributionCalendar {
          totalContributions
          weeks {
            contributionDays {
              date
              contributionCount
            }
          }
        }
      }
    }
  }
`;

export async function fetchContributions(
  username: string,
  token?: string
): Promise<ContributionsCollection | null> {
  const resolvedToken = token ?? process.env.GITHUB_TOKEN;
  if (!resolvedToken) return null;

  const to = new Date();
  const from = new Date();
  from.setFullYear(from.getFullYear() - 1);

  const fetchOptions: RequestInit = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${resolvedToken}`,
      'X-GitHub-Api-Version': '2022-11-28',
    },
    body: JSON.stringify({
      query: CONTRIBUTIONS_QUERY,
      variables: { username, from: from.toISOString(), to: to.toISOString() },
    }),
  };

  // Only cache when using server-side env token (ISR-safe); skip cache for user OAuth tokens
  if (!token) {
    (fetchOptions as { next?: { revalidate: number } }).next = { revalidate: 21600 };
  }

  let res: Response;
  try {
    res = await fetch(GITHUB_GRAPHQL, fetchOptions);
  } catch {
    console.error('GraphQL fetch failed');
    return null;
  }

  if (!res.ok) return null;

  const json = (await res.json()) as {
    data?: { user?: { contributionsCollection: ContributionsCollection } | null };
    errors?: { message: string }[];
  };

  if (json.errors?.length || !json.data?.user) return null;

  return json.data.user.contributionsCollection;
}
