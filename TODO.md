# Ancestral Path — production expansion checklist

## Atmospheric landing page
- [x] The site introduces Ancestral Path, dream interpretation, and ancestral/spiritual guidance in a polished single-page experience.
- [x] The visual direction uses a deep midnight backdrop, luminous WhatsApp green accents, warm ivory typography, and restrained gold details.
- [x] The original flyer is used as creative direction rather than displayed as the entire page.

## Services and trust
- [x] The responsive service list covers relationship healing, protection from negative energy, luck, business growth, curse removal, finding love, peace in the home, dream interpretation, and connecting with ancestors.
- [x] The trust/ritual section explains a respectful, reflective approach to spiritual guidance without promising guaranteed outcomes.

## Contact and interaction
- [x] The WhatsApp contact number +27732552543 is prominent and links directly to WhatsApp click-to-chat.
- [x] The contact CTA offers a simple inquiry flow that prepares a WhatsApp message for the visitor.
- [x] Interactions have readable contrast, visible focus states, semantic structure, and descriptive action labels.

## Forty-page content platform
- [x] The site keeps the existing home, guidance, dreams, approach, contact, and five service detail routes.
- [x] The site adds thirty structured content pages across resources, journal, FAQ, pricing, about, community, contact, legal, and service-support sections.
- [x] All forty routes are represented in `/manus-routes.json` and rendered through the route system.
- [x] Pages include editorial copy, related links, category labels, responsive layouts, and service-specific calls to action.

## Features and deployment
- [x] Service cards support full detail pages and quick-view popouts.
- [x] Resource pages support client-side filtering.
- [x] FAQ pages use accessible native disclosure controls.
- [x] Internal links normalize against the GitHub Pages base path as well as Manus Preview.
- [x] A static 404 fallback preserves direct nested route loading on GitHub Pages.
- [x] The build generates the route manifest before compiling and creates a GitHub Pages-compatible `404.html`.
- [x] Nine GitHub Actions workflows cover CI, release artifacts, GitHub Pages deployment, HTML/source validation, route matrices, dependency review, CodeQL, link checks, and bundle budgets.
- [x] README documentation explains local development, testing, routes, and Pages deployment.

## Responsive delivery
- [x] The layout is mobile-first and remains clear on phone, tablet, and desktop sizes.
