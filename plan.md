# Ancestral Path production expansion

## Implementation

The site remains a Vite-powered, content-driven SPA. Existing high-touch pages stay hand-authored in `main.js`; thirty additional pages live as JSON content files under `content/pages/`, are discovered with Vite's eager glob import, and render through a shared editorial page template. `scripts/sync-routes.mjs` derives the complete 40-route manifest before every build. `scripts/prepare-github-pages.mjs` copies the built entry to `404.html` so direct nested routes continue to work on GitHub Pages.

## Page architecture

- `content/pages/` — 30 structured resource, journal, about, community, contact, legal, and service-support pages.
- `main.js` — route normalization, page rendering, service detail popouts, inquiry flow, resource search, FAQ accordions, and GitHub Pages base-path handling.
- `public/manus-routes.json` — generated route contract for preview and deployment.
- `scripts/` — route synchronization and static deployment preparation.
- `tests/` — route, build, asset, and preview smoke checks.
- `.github/workflows/` — nine independent quality/release workflows.

## Design

The existing dark heritage editorial system remains the visual language: Cormorant display type, Montserrat UI type, charcoal surfaces, warm ivory copy, gold accents, rich photography, rounded panels, and calm motion. New pages use shared hero, related-link, FAQ, and resource-card patterns so the larger site still feels authored rather than repetitive.

## GitHub Pages

The Pages workflow builds with `VITE_BASE_PATH=/azan/`, creates a static `404.html` fallback, uploads `dist`, and deploys with the official Pages actions. The app normalizes internal links against `import.meta.env.BASE_URL` so the same build works in Manus Preview and at `culturalpowers-africa.github.io/azan/`.
