# PRD: GitHub Profile Wrapped

**Status**: Draft
**Author**: Kalash
**Date**: 2026-03-17
**Stack**: Next.js 14 (App Router) · TypeScript (strict) · Tailwind CSS · Nivo / D3.js · GitHub REST API v3 · Vercel

---

## Overview

GitHub Profile Wrapped is a public web app where anyone enters a GitHub username and gets a visually rich, shareable analytics page — think Spotify Wrapped, but for your coding activity. It surfaces data GitHub already exposes (repos, commits, languages, stars, contribution patterns) but presents it in a way GitHub's own UI never does: beautiful charts, shareable URLs, and a "story" format that's worth screenshotting. No login required. Built as a portfolio piece to demonstrate Next.js, TypeScript, data visualization, and production-grade frontend architecture.

---

## Goals

- Deliver a visually impressive, instantly demoable app with zero friction (no sign-up, no OAuth)
- Showcase complex data visualization skills (D3/Nivo) to potential employers
- Generate shareable profile pages at `/u/[username]` with SSR/ISR for performance and SEO
- Handle GitHub API rate limits gracefully so the demo never breaks during an interview
- Ship a production-quality README that explains architecture decisions

---

## Non-Goals

- No user accounts or saved preferences
- No comparison between two users (v1 scope only)
- No private repo data (public API only, no OAuth)
- No GitHub Actions / CI stats
- No mobile app
- No email/social sharing buttons (plain URL sharing is enough)

---

## User Stories

| #   | User Story                                                                                                               | Priority     |
| --- | ------------------------------------------------------------------------------------------------------------------------ | ------------ |
| 1   | As a developer, I want to enter a GitHub username and see a rich stats page, so I can explore my coding profile visually | Must         |
| 2   | As a visitor, I want to share my profile URL with others, so they can see my stats without any setup                     | Must         |
| 3   | As a visitor, I want the page to load fast, so I don't wait more than 3 seconds on a cold load                           | Must         |
| 4   | As a developer, I want to see my top programming languages with accurate percentages, so I understand my actual stack    | Must         |
| 5   | As a developer, I want to see my contribution heatmap for the past year, so I can see my activity patterns               | Must         |
| 6   | As a developer, I want to see which days/hours I commit most, so I understand my working habits                          | Should       |
| 7   | As a visitor, I want a graceful error page if the username doesn't exist, so I understand what went wrong                | Must         |
| 8   | As a developer, I want to see my commit streak stats, so I can track consistency                                         | Should       |
| 9   | As a developer, I want to see my most starred repos ranked, so I know what resonates with others                         | Should       |
| 10  | As a visitor on mobile, I want charts to be readable on a small screen, so I can share from my phone                     | Should       |
| 11  | As a developer, I want to see total stats (total stars, total forks, total PRs), so I get a career-level summary         | Nice to have |
| 12  | As a developer, I want a "most productive year" highlight card, so I get a fun shareable stat                            | Nice to have |

---

## Functional Requirements

### Search & Navigation

1. Home page (`/`) must show a single centered search input that accepts a GitHub username
2. On submit, the app must navigate to `/u/[username]`
3. The URL `/u/[username]` must be directly linkable and shareable — full page renders on that route
4. If username contains invalid characters (anything other than alphanumeric + hyphen), show inline validation error before submitting

### Profile Page — Data Sections

5. **Header card**: avatar, display name, username, bio, location, follower/following counts, account creation year
6. **Language breakdown**: horizontal bar chart or donut chart showing top 6 languages by bytes across all public repos; "Other" bucket for the rest
7. **Contribution heatmap**: GitHub-style calendar grid for the past 52 weeks, color-coded by contribution count (4 intensity levels + zero state)
8. **Commit activity by day of week**: bar chart showing which weekdays have the most commits (aggregated across all repos, past year)
9. **Commit activity by hour**: 24-bar chart showing commit distribution across hours of the day (UTC, labeled)
10. **Top repos by stars**: ranked list of up to 8 repos with name, description, star count, fork count, primary language tag
11. **Streak stats**: longest contribution streak (days), current streak, total active days in past year
12. **Summary stat cards**: total public repos, total stars received, total forks received, years on GitHub

### Rate Limiting & Caching

13. All GitHub API calls must go through Next.js Route Handlers (not client-side) to hide any future token usage and enable server-side caching
14. Responses must be cached with ISR — revalidate every 6 hours per username to avoid hammering the API
15. If the GitHub API returns 404, the app must render a "User not found" error state (not a 500)
16. If the GitHub API returns 403 (rate limit hit), the app must render a friendly "Too many requests, try again in a few minutes" state

### SEO & Sharing

17. Each `/u/[username]` page must have unique `<title>` and `<meta description>` tags
18. Each profile page must have a dynamic `og:image` generated by `@vercel/og` at `/api/og?username=[username]`, showing avatar, username, total stars, top language
19. Profile page must include a "Copy link" button that copies the current URL to clipboard

---

## Technical Requirements

- **Framework**: Next.js 14+ App Router, deployed on Vercel
- **Language**: TypeScript strict mode (`"strict": true` in tsconfig)
- **Styling**: Tailwind CSS — no CSS modules, no styled-components
- **Charts**: Nivo (primary — React-native, TypeScript-first) with D3.js for any custom viz Nivo doesn't cover
- **Data fetching**: TanStack Query (React Query) on client where needed; Next.js `fetch` with `revalidate` for ISR on server
- **GitHub API**: REST API v3 + GraphQL API v4. `GITHUB_TOKEN` env var required on Vercel (5000 req/hr; used server-side only, never exposed to client)
- **OG Image**: `@vercel/og` at `/api/og?username=[username]` — server-rendered social preview card
- **No database**: all data fetched live from GitHub API + ISR cache on Vercel edge
- **Performance target**: Lighthouse Performance ≥ 90, LCP < 2.5s on a cached profile page
- **Bundle**: no unnecessary dependencies — avoid moment.js (use date-fns), avoid lodash (native JS or small utils)
- **ESLint + Prettier + Husky** configured on project init per standards

### API Endpoints Used

| Endpoint                                           | Data                                             |
| -------------------------------------------------- | ------------------------------------------------ |
| `GET /users/{username}`                            | Profile info, follower counts, public repo count |
| `GET /users/{username}/repos?per_page=100`         | Repo list, languages, stars, forks               |
| `GET /repos/{owner}/{repo}/languages`              | Language byte counts per repo                    |
| `GET /users/{username}/events/public?per_page=100` | Recent commit/PR activity, timestamps            |
| `GET /users/{username}/repos` (all pages)          | Full repo list for language aggregation          |
| `POST /graphql` → `contributionsCollection`        | Accurate contribution heatmap, streak data       |

---

## UX / UI Notes

### Layout

- Dark theme by default (matches GitHub's own dark UI, looks better for data viz)
- Single-column layout on mobile, wider content area on desktop (max-width ~900px centered)
- Each data section is a **card** with consistent padding, subtle border, and section title
- Cards load with a skeleton placeholder while data fetches — no layout shift

### Home Page (`/`)

- Minimal: logo/title, one-line description, search input, submit button
- Show 3 example usernames as clickable chips (e.g. `torvalds`, `sindresorhus`, `gaearon`) to let visitors explore without typing
- Footer: "Built with Next.js + GitHub API · Source on GitHub"

### Profile Page (`/u/[username]`)

- Top: header card (avatar + bio)
- Then stat cards row (total repos, stars, forks, years)
- Then full-width heatmap
- Then two-column grid: language chart | top repos list
- Then two charts side by side: commits by weekday | commits by hour
- Bottom: streak highlights

### Color Palette for Charts

- Use a consistent 6-color palette for languages (not random — map common languages to their known colors, e.g. TypeScript = #3178c6, Python = #3572A5)
- Heatmap: use GitHub's green scale (`#0d1117` → `#39d353`) for familiarity

---

## Edge Cases & Error States

| Scenario                                   | Behavior                                                            |
| ------------------------------------------ | ------------------------------------------------------------------- |
| Username not found (404)                   | Full-page "User not found" with search input to try again           |
| User has 0 public repos                    | Show header card, all chart sections show empty state with message  |
| User has repos but no commits in past year | Heatmap shows all-empty grid, streak = 0                            |
| Very prolific user (1000+ repos)           | Paginate API calls; cap language analysis at top 100 repos by stars |
| API rate limit hit (403)                   | Show "GitHub API rate limit reached" card, suggest trying in 60 min |
| Network error                              | Show retry button, don't leave user on broken page                  |
| Username with special chars                | Client-side validation rejects before API call                      |
| Bot/org account (no commit data)           | Show available data, gracefully hide sections with no data          |

---

## Success Metrics

Since this is a portfolio project, success is measured differently than a product:

- Lighthouse Performance ≥ 90 on a cached profile page (screenshot for README)
- Page loads in < 3s on a cold ISR miss (first visit to uncached username)
- Zero TypeScript errors, zero ESLint warnings in CI
- README includes: live demo link, architecture diagram, API design decisions, screenshot
- The app works flawlessly when demoed live in an interview (no broken states, no rate-limit crashes)

---

## Decisions

- [x] **GraphQL for heatmap**: Use GitHub GraphQL API (`contributionsCollection`) with `GITHUB_TOKEN` env var. More accurate than REST events approximation; shows API breadth.
- [x] **Dynamic OG image**: Implement with `@vercel/og` — generates a social preview card server-side at `/api/og?username=[username]`. Include avatar, username, key stats (repos, stars, top language).
- [x] **Year selector**: Out of scope for v1. Fixed to past 12 months.
- [x] **Copy URL button**: Include — trivial effort, good UX.

---

## Out of Scope (v1)

- OAuth login or access to private repositories
- User-to-user comparison ("vs" mode)
- PDF / image export of the profile card
- Embedding widget (iframe or `<script>` tag)
- Saving/bookmarking profiles (no DB)
- GitHub Actions / workflow stats
- Organization profiles (only user profiles in v1)
- Animated "reveal" sequence (Spotify Wrapped scroll animation) — nice to have for v2
