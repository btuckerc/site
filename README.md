# Tucker Craig Website

Personal portfolio for [btuckerc.dev](https://btuckerc.dev). The site is a React/Vite app with a compact TUI-inspired interface, keyboard navigation, theme/font controls, and project data I can update without rewriting pages by hand.

## Current Focus

The projects page pulls from three places:

- Public GitHub repositories under `btuckerc`
- Local workspaces on this Mac
- Agent-system state on `admin@macmini`, including OpenClaw and Hermes

Private repos and the macmini Servarr/media stack do not get listed as portfolio projects.

## Commands

```bash
npm install
npm run dev
npm run build
npm test
```

The development server is powered by Vite. Production output is written to `dist/`.

## Data

- `data/projects.json` drives the projects page.
- `data/about.json` drives the about card and cached GitHub stats.
- `data/PROJECT_TEMPLATE.md` documents project fields.

Project entries can include a short check note:

```json
{
  "source": "GitHub public + local",
  "activity": "active",
  "visibility": "public",
  "verified": "Short note describing what was checked and when."
}
```

Keep descriptions grounded in a repo README, GitHub metadata, or local runtime state. For public copy, avoid private repo names, secrets, local absolute paths, or media-stack infrastructure.

## Structure

```text
src/
  components/    reusable UI
  hooks/         keyboard, theme, font, and navigation helpers
  pages/         route components
  utils/         GitHub and contact helpers
data/            portfolio and about-card content
public/          static assets, robots.txt, sitemap.xml
scripts/         maintenance scripts
```

## Notes

- Cached GitHub stats are intentionally stored in `data/about.json` so the deployed site does not need a client-side token.
- `scripts/update-github-stats.js` can refresh the public repo count and language-byte estimate when run with `GITHUB_TOKEN`.
- `npm run stats:about` refreshes local-only about-card aggregates, including project count, AI-aided project count, agent-system count, and display-only AI IDE token-use totals. It reads local AI IDE state and writes only cached numbers used by the site.
- Existing generated output under `dist/` is not required for local development.
