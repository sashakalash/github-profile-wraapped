# GitHub Profile Wrapped

Spotify Wrapped-style analytics dashboard for any GitHub profile. Enter a username — get a shareable page with contribution heatmaps, language breakdowns, streak stats, and activity charts. No login required.

https://github-profile-wraapped.vercel.app/

## Tech Stack

- **Next.js 16** (App Router, ISR with 6h revalidation)
- **TypeScript** (strict mode)
- **Tailwind CSS**
- **Nivo** — bar, calendar, pie charts
- **TanStack Query** — client-side data fetching
- **NextAuth** — GitHub OAuth
- **@vercel/og** — dynamic OG images for social sharing

## Features

- Contribution heatmap (52-week calendar grid)
- Language breakdown (top 6 by bytes)
- Top starred repositories
- Commit activity by day of week and hour
- Streak statistics (current, longest, total active days)
- Dark/light theme toggle
- Skeleton loading states
- Copy-to-share URL button
- Dynamic OG images per profile

## Getting Started

```bash
cp .env.example .env.local
# fill in the values (see below)
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Environment Variables

| Variable               | Required    | Description                                                                 |
| ---------------------- | ----------- | --------------------------------------------------------------------------- |
| `GITHUB_TOKEN`         | Recommended | Fine-grained PAT (`read:user`) — enables contribution heatmap without OAuth |
| `GITHUB_CLIENT_ID`     | For OAuth   | GitHub OAuth App client ID                                                  |
| `GITHUB_CLIENT_SECRET` | For OAuth   | GitHub OAuth App secret                                                     |
| `NEXTAUTH_URL`         | Yes         | App URL (`http://localhost:3000` for dev)                                   |
| `NEXTAUTH_SECRET`      | Yes         | Generate: `openssl rand -base64 32`                                         |

## Scripts

```bash
npm run dev        # Start dev server
npm run build      # Production build
npm run lint       # Check linting
npm run lint:fix   # Auto-fix lint issues
npm run format     # Format with Prettier
```

## Project Structure

```
src/
├── app/
│   ├── api/          # Auth, contributions, OG image endpoints
│   ├── u/[username]/ # Profile page
│   └── page.tsx      # Home (search)
├── components/
│   ├── home/         # SearchForm, ExampleChips
│   ├── profile/      # ProfileHeader, StatCards, Charts, etc.
│   └── ui/           # Card, Badge, CopyButton, ThemeToggle
├── lib/
│   └── github/       # REST + GraphQL clients, data aggregation
└── types/            # TypeScript interfaces
```
