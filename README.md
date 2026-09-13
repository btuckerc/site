# Tucker Craig Website

Personal portfolio for [btuckerc.dev](https://btuckerc.dev). The site is a React/Vite app with a compact TUI-inspired interface, keyboard navigation, theme/font controls, and project data I can update without rewriting pages by hand.

## Current Focus

The homepage leads with omalo, a pocket companion running ichr, and Pokémon
Emerald on the device with an AI handoff for gameplay goals. The `/projects/omalo`
page is the product introduction; `/projects/s3-amoled` keeps the technical
notes and Grain detail. The projects page is a reviewed allow-list of authored
public work.

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
- `data/about.json` drives the public about card.
- `data/PROJECT_TEMPLATE.md` documents project fields.

Project entries use a short public description and links that a visitor can
follow:

```json
{
  "source": "GitHub public",
  "activity": "active",
  "visibility": "public",
  "blurb": "A short description of the project.",
  "links": { "github": "https://github.com/btuckerc/example" }
}
```

Keep descriptions grounded in a public repo README or metadata. Do not place
credentials, local paths, device identifiers, or unpublished material in build
inputs.

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

- `npm run stats:about` validates the reviewed public content structure and
  does not collect or write runtime statistics.
- `npm run build` also creates initial HTML metadata for each route through
  `scripts/prerender-routes.js`. Each non-root route is emitted as both a
  directory index and an extensionless `.html` artifact so static hosting and
  the Vite preview resolve `/route` and `/route/` consistently.
- Generated output under `dist/` is suitable for a static preview; deployment
  remains a separate action.

## Production deployment

Cloudflare Pages project `site` serves `btuckerc.dev` from Git branch `main`.
Commit the complete website source, public assets, and build scripts before
pushing a release. Run `npm run lint`, `npm test -- --run`, and `npm run build`.
Verify the deployed home, omalo and s3-amoled routes, metadata, and media.

The September 12, 2026 site was initially uploaded directly while its source
remained uncommitted. A subsequent Git push rebuilt older content. That source
has now been reconciled onto `main`. Direct uploads must use a committed build
and must not leave production ahead of its source branch. Private planning and
publication materials in `btuckercdev-profile` are not website build inputs.
