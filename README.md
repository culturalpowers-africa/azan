# Ancestral Path / azan

This repository is the production site for Ancestral Path, maintained in the `culturalpowers-africa/azan` repository.

Ancestral Path is a polished, multi-page spiritual guidance website focused on dream interpretation, relationship clarity, grounded protection practices, prosperity and purpose, and ancestral connection.

## Run locally

```bash
npm ci
npm run dev
```

The development server runs on port 3000. The site is a Vite-powered SPA with direct route support through the managed preview server.

## Production verification

```bash
npm test
```

The test command builds the production bundle, starts a preview server, verifies all declared routes, checks the route manifest, and confirms the WhatsApp conversion path.

## Production routes

- `/` — Home
- `/guidance` — Service directory with quick-view popouts
- `/dreams` — Dream interpretation editorial page
- `/approach` — Grounded, respectful service approach
- `/contact` — WhatsApp inquiry form
- `/services/dreams`
- `/services/love`
- `/services/protection`
- `/services/prosperity`
- `/services/ancestors`

## CI and releases

`.github/workflows/ci.yml` runs `npm ci` and `npm test` on every push to `main` and every pull request. `.github/workflows/release.yml` builds and uploads the `dist` production artifact for tagged releases (`v*.*.*`) or a manual workflow dispatch.

All service detail pages use distinct managed image assets and route visitors to the WhatsApp number `+27 73 255 2543`. Spiritual content is intentionally framed as reflective guidance and does not promise fixed outcomes or replace professional care.
