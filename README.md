# Ancestral Path / azan

This repository is the production site for Ancestral Path, maintained in `culturalpowers-africa/azan`. It is a dark heritage editorial platform for dream interpretation, relationship clarity, grounded protection practices, prosperity and purpose, ancestral connection, and reflective learning.

## Run locally

```bash
npm ci
npm run dev
```

The Vite development server runs on port 3000. The app is content-driven: hand-authored service pages live in `main.js`, while thirty additional editorial pages live under `content/pages/` as structured JSON files.

## Production verification

```bash
npm test
```

The test command synchronizes the route manifest, builds the production bundle, creates the GitHub Pages `404.html` fallback, starts a preview server, checks all forty routes, verifies the WhatsApp CTA, and validates the five managed service image references.

## Production routes

The site exposes exactly 40 routes across the home experience, guidance and service pages, journal, resources, about, community, contact, legal, and service-support content. The complete machine-readable route contract is served at `/manus-routes.json`.

Key entry points include `/`, `/guidance`, `/dreams`, `/approach`, `/contact`, `/resources`, `/journal`, `/about`, `/community`, `/faq`, `/pricing`, `/privacy`, `/terms`, `/accessibility`, and the five service detail routes under `/services/`. Deeper pages cover dream preparation and follow-up, relationship communication and family boundaries, home grounding, prosperity for business, and ancestral lineage reflection.

## GitHub Pages

The Pages workflow builds with `VITE_BASE_PATH=/azan/`, generates `dist/404.html` for direct nested-route loading, uploads the artifact, and deploys it with the official GitHub Pages actions. Once enabled for the repository, the site will be available at:

`https://culturalpowers-africa.github.io/azan/`

The same source works in Manus Preview because internal links normalize against `import.meta.env.BASE_URL`.

## CI and release workflows

The repository contains nine workflows under `.github/workflows/`:

- `ci.yml` — build and smoke tests on pushes and pull requests.
- `release.yml` — tagged/manual production artifact builds.
- `pages.yml` — GitHub Pages build and deployment.
- `html-validation.yml` — required source, manifest, and build-file checks.
- `route-matrix.yml` — matrix verification for all forty routes.
- `dependency-review.yml` — pull-request dependency review.
- `codeql.yml` — scheduled and change-based JavaScript analysis.
- `link-check.yml` — full preview and conversion smoke suite.
- `performance.yml` — JavaScript and CSS bundle budgets.

All service pages route visitors to WhatsApp at `+27 73 255 2543`. Spiritual content is intentionally framed as reflective guidance and does not promise fixed outcomes or replace professional care.
