import { ImageResponse } from '@vercel/og';
import type { NextRequest } from 'next/server';
import { LANGUAGE_COLORS, DEFAULT_LANGUAGE_COLOR } from '@/lib/constants';

export const runtime = 'edge';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const username = searchParams.get('username') ?? 'unknown';

  // Fetch basic user data
  let avatar = '';
  let name = username;
  let stars = 0;
  let repos = 0;
  let topLanguage = 'Code';
  let topLanguageColor = DEFAULT_LANGUAGE_COLOR;

  try {
    const token = process.env.GITHUB_TOKEN;
    const headers: Record<string, string> = {
      Accept: 'application/vnd.github.v3+json',
    };
    if (token) headers.Authorization = `Bearer ${token}`;

    const [userRes, reposRes] = await Promise.all([
      fetch(`https://api.github.com/users/${username}`, { headers }),
      fetch(`https://api.github.com/users/${username}/repos?per_page=100&sort=stars`, { headers }),
    ]);

    if (userRes.ok) {
      const user = (await userRes.json()) as {
        name?: string;
        avatar_url?: string;
        public_repos?: number;
      };
      name = user.name ?? username;
      avatar = user.avatar_url ?? '';
      repos = user.public_repos ?? 0;
    }

    if (reposRes.ok) {
      const repoList = (await reposRes.json()) as {
        stargazers_count: number;
        language?: string;
        fork: boolean;
      }[];
      const ownRepos = repoList.filter((r) => !r.fork);
      stars = ownRepos.reduce((sum, r) => sum + r.stargazers_count, 0);

      // Top language by repo count
      const langCount: Record<string, number> = {};
      for (const r of ownRepos) {
        if (r.language) langCount[r.language] = (langCount[r.language] ?? 0) + 1;
      }
      const sorted = Object.entries(langCount).sort((a, b) => b[1] - a[1]);
      if (sorted[0]) {
        topLanguage = sorted[0][0];
        topLanguageColor = LANGUAGE_COLORS[topLanguage] ?? DEFAULT_LANGUAGE_COLOR;
      }
    }
  } catch {
    // Use defaults
  }

  let avatarData = '';
  if (avatar) {
    try {
      const res = await fetch(avatar);
      const buf = await res.arrayBuffer();
      const base64 = Buffer.from(buf).toString('base64');
      avatarData = `data:image/jpeg;base64,${base64}`;
    } catch {
      // skip avatar
    }
  }

  return new ImageResponse(
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        height: '100%',
        background: 'linear-gradient(135deg, #0d1117 0%, #161b22 100%)',
        padding: '48px',
        fontFamily: 'sans-serif',
      }}
    >
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '32px' }}>
        {avatarData && (
          <img
            src={avatarData}
            alt=""
            width={80}
            height={80}
            style={{ borderRadius: '50%', border: '2px solid rgba(255,255,255,0.1)' }}
          />
        )}
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <span style={{ color: '#ffffff', fontSize: 28, fontWeight: 700 }}>{name}</span>
          <span style={{ color: '#8b949e', fontSize: 18 }}>@{username}</span>
        </div>
      </div>

      {/* Title */}
      <div
        style={{
          color: '#39d353',
          fontSize: 40,
          fontWeight: 800,
          letterSpacing: '-1px',
          marginBottom: '32px',
        }}
      >
        GitHub Wrapped
      </div>

      {/* Stats */}
      <div style={{ display: 'flex', gap: '32px' }}>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <span style={{ color: '#e6edf3', fontSize: 36, fontWeight: 700 }}>
            {stars >= 1000 ? `${(stars / 1000).toFixed(1)}k` : stars}
          </span>
          <span style={{ color: '#8b949e', fontSize: 16 }}>Stars earned</span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <span style={{ color: '#e6edf3', fontSize: 36, fontWeight: 700 }}>{repos}</span>
          <span style={{ color: '#8b949e', fontSize: 16 }}>Public repos</span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div
              style={{
                width: 16,
                height: 16,
                borderRadius: '50%',
                background: topLanguageColor,
              }}
            />
            <span style={{ color: '#e6edf3', fontSize: 36, fontWeight: 700 }}>{topLanguage}</span>
          </div>
          <span style={{ color: '#8b949e', fontSize: 16 }}>Top language</span>
        </div>
      </div>

      {/* Footer */}
      <div
        style={{
          position: 'absolute',
          bottom: 32,
          right: 48,
          color: '#484f58',
          fontSize: 14,
        }}
      >
        github-profile-wrapped.vercel.app
      </div>
    </div>,
    {
      width: 1200,
      height: 630,
    }
  );
}
