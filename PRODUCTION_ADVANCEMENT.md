# Ancestral Path / azan — production advancement blueprint

**Audited revision:** `ad42f7cb2d8cb9571cb517201b2f7ba4a1e8d441` (18 October 2026)

## Executive decision

The repository is a polished **static Vite marketing prototype**, not a production service platform yet. It should not be treated as publicly launch-ready until the P0 items below are completed.

The correct direction is **not** to add cosmetic pages to the existing single-file client-side router. It is to replace the SPA/GitHub Pages delivery model with a typed, pre-rendered/SSR web application backed by real content governance, booking, consent, payments (only once a verified merchant account is chosen), and production operations.

No fake features should be shipped:

- No fake login. The current header does not offer an account system and must not imply one.
- No faux booking. Until availability, policies, confirmations, and a calendar are live, label the journey as an enquiry—not a booking.
- No fictional events, prices, testimonials, practitioner credentials, or community endorsements.
- No watermarked/context-free cultural imagery, and no use of people, traditions, stories, or ceremonial material without documented rights and review.
- No payment UI until a live merchant/provider account, prices, tax position, refund policy, and webhook processing are ready.
- No public claim of accessibility, privacy, community partnership, or cultural authority that is not substantiated in the delivered product and governance process.

## What is already real and worth retaining

- A small attack surface: the committed app is static and has no exposed API, database, cookies, secrets, or account system.
- Respectful safety framing: the service copy avoids fixed predictions, fear-based selling, and replacing medical, legal, or mental-health support.
- A usable content seed: 40 declared routes and 30 structured JSON documents.
- Basic quality controls: locked Vite dependency, `npm ci`, GitHub Actions, CodeQL, dependency review, and route/build smoke checks.
- Basic semantic foundations: document language, landmark structure, labels, a skip link, visible focus treatment, native disclosure elements, native dialog, and a direct WhatsApp handoff.

The clone currently passes `npm test`; the production JavaScript is about 38 KB and CSS about 23 KB. `npm audit --omit=dev` reported no known production dependency vulnerabilities at audit time.

## Launch blockers that must be fixed first

### P0 — delivery and discoverability

1. **Replace the SPA fallback.** The current GitHub Pages strategy copies `index.html` to `404.html`; published deep routes return an HTTP 404 and then depend on JavaScript to render. The sitemap nevertheless advertises those deep routes. This is unacceptable for organic search, social sharing, direct links, monitoring, no-JS resilience, and trust.
2. **Generate page HTML and metadata per route.** Every canonical URL needs a unique title, description, canonical URL, Open Graph/Twitter tags, social image, and appropriate JSON-LD. Unknown paths require a real 404 page—not the home page.
3. **Remove hard-coded Pages assumptions.** The public domain, canonical origin, sitemap origin, robots configuration, and environment name must be configuration, not `culturalpowers-africa.github.io/azan` strings in source.

### P0 — people, culture, and legal trust

4. **Replace all current hero/service imagery before commercial launch.** The current visual assets are watermarked editorial images; the repository itself warns that owned/licensed imagery is required. Create an asset register for every image/audio/video: creator, licence, model/property/community consent, permitted purpose, restrictions, credit line, expiry/review date, and storage location.
5. **Create cultural-content governance.** Every public article/story needs an editorial owner, author/contributor, source/provenance, language, community/region only where appropriate, rights statement, sensitivity/access notes, publish date, review date, and withdrawal/correction contact. Establish a named cultural/community review process before using ceremony, dress, family, oral-history, or sacred/restricted knowledge.
6. **Commission jurisdiction-specific policy review.** The current privacy and terms copy is not enough for sensitive spiritual/relationship narratives. Publish the legal operator, privacy contact, data purposes/retention/rights/complaints, WhatsApp/Meta disclosure, children/minors policy, safeguarding/escalation, accessibility accommodations, currency/taxes, cancellation/refund, payment, and booking terms.
7. **Disclose WhatsApp processing at the point of collection.** The native contact/booking path must exist for visitors who do not want to use WhatsApp. If a visitor chooses WhatsApp, state clearly that a new WhatsApp conversation will open and that they should not send highly sensitive records.

### P0 — accessibility and truthful interaction

8. **Build a real mobile menu.** At 700px and below the primary navigation disappears without a replacement. Add a 44px accessible menu button, labelled drawer, Escape/outside-close behavior, focus management, and a preserved focus return.
9. **Repair SPA/navigation behavior.** The global link interception breaks the skip link fragment. Route changes need a document title update, focus moved to the new `h1` or `<main>`, a concise live-region announcement, browser back/forward correctness, preserved query parameters, and an actual not-found route.
10. **Replace the broken button state.** The contact CTA currently rewrites the arrow span instead of the label while WhatsApp opens. Use dedicated label/icon nodes, `aria-busy`, visible success/failure/popup-blocked feedback, and safe re-enable behavior.
11. **Use semantic imagery.** Where an image conveys meaning, replace CSS backgrounds with `picture`/`img`/`figure` and verified alt text and captions. Do not invent visual descriptions. Treat only genuinely decorative imagery as decorative.

## Target architecture: production, not a demo

### Recommended platform

Use a typed full-stack web build with server rendering or static prerendering for known content pages, plus server endpoints for booking, consent, payments, and staff workflows. The recommended implementation is:

| Concern | Production choice | Why |
|---|---|---|
| Public application | Astro 5 + TypeScript, SSR/prerendered routes | Fast static documents, route-level metadata, and server endpoints without shipping a whole SPA. React islands are used only for genuinely interactive features. |
| Hosting/runtime | A managed Node/serverless host or Manus Web Server with custom domain/CDN | Supports real 200/404 behavior, security headers, environment secrets, webhooks, monitoring, and rollbacks. GitHub Pages is retained only for archived/static previews—not production services. |
| Database | Managed PostgreSQL with Drizzle migrations | Relational integrity for services, availability, bookings, consent, payments, events, and audit trails. |
| Auth | Staff-only magic-link/OAuth with role checks | No consumer account system unless there is a real account-based feature. Roles: `owner`, `editor`, `reviewer`, `bookings`. |
| CMS/editorial | A governed CMS or the application’s staff editorial area | Required for real authorship, translations, provenance, publishing/review controls, and audit records. |
| Media | Object storage + image transformation CDN | Rights-cleared originals stay private; responsive delivery variants are generated with immutable URLs. |
| Booking | First-party availability and booking workflow with calendar adapter | Own the appointment status, timezone, consent, confirmation, cancellation, and audit record. Connect a real calendar only after the service account is authorized. |
| Payments | One provider chosen for the actual legal entity and settlement country | Use hosted checkout and verified webhooks. Do not take card data in the app or ship an inert payment button. |
| Email/notifications | A verified transactional provider plus optional WhatsApp template integration | Sends confirmed booking, cancellation, consent, and operational notifications with delivery/audit history. |
| Protection | Turnstile or equivalent, rate limiting, validation, audit logs | Protect public forms and webhooks without pretending that client-side validation is enough. |
| Analytics | Consent-aware privacy-respecting analytics | Instrument only approved goals: enquiry submitted, WhatsApp opt-in, booking requested/confirmed, checkout paid, event registration. |

This is deliberately not a generic “add a backend” statement: public editorial pages become real HTML at their canonical URLs, while sensitive and operational actions are authenticated, validated server actions backed by a database and webhook-ledger state.

### Required domain model

The initial migration must define and migrate real tables—not JSON blobs standing in for operations:

```text
users, staff_roles,
content_items, content_revisions, content_translations, content_sources,
media_assets, media_rights_records, cultural_review_records,
services, service_prices, availability_rules, availability_exceptions,
booking_holds, bookings, booking_attendees, consent_records,
payment_customers, payment_attempts, payment_events,
events, event_registrations,
contact_enquiries, notification_deliveries,
legal_documents, audit_logs
```

Every row that represents personal data needs a documented retention rule. Payment data stores provider IDs/status only; card data never enters the app database.

### Content model required before migration

Each article, service, event, story, or collection requires a typed schema containing at least:

```ts
export type ContentRecord = {
  slug: string;
  kind: 'article' | 'service' | 'event' | 'story' | 'page';
  title: string;
  description: string;
  language: string;
  publishedAt?: Date;
  reviewedAt?: Date;
  authorIds: string[];
  sourceIds: string[];
  rightsStatement: string;
  sensitivity: 'public' | 'context-required' | 'restricted';
  culturalReviewStatus: 'draft' | 'in-review' | 'approved' | 'withdrawn';
  canonicalImageAssetId?: string;
  body: RichTextDocument;
};
```

Fields are validated at build and publish time. A page cannot be published if it lacks title, description, language, rights statement, review status, and a valid source/rights record where required.

## Planned repository structure

```text
azan/
├── apps/web/
│   ├── src/
│   │   ├── components/       # Accessible, tested UI primitives and composites
│   │   ├── content/          # Typed local content during CMS transition
│   │   ├── layouts/          # Route metadata and document shell
│   │   ├── pages/            # Static/SSR public routes and API endpoints
│   │   ├── features/         # booking, enquiry, events, staff, payments
│   │   ├── lib/              # validation, security, SEO, i18n, integrations
│   │   ├── styles/           # tokens, base, components, motion
│   │   └── db/               # schema, migrations, repositories
│   ├── public/
│   ├── astro.config.mjs
│   └── Dockerfile
├── packages/contracts/       # Shared Zod schemas and domain types
├── infra/                    # Infrastructure-as-code and environment templates
├── scripts/                  # release, content checks, media/rights checks
├── tests/
│   ├── unit/
│   ├── integration/
│   ├── e2e/
│   └── accessibility/
├── .github/workflows/        # CI, preview, production deploy, scheduled checks
├── docs/
│   ├── runbooks/
│   ├── governance/
│   └── architecture/
└── PRODUCTION_ADVANCEMENT.md
```

The current Vite JSON pages are migration input only. They are not the end-state architecture.

## Design and motion contract

The product should feel intentional and calm, not perform “mysticism.” Motion must never animate ceremonial imagery, masks, people, heritage symbols, or supposedly sacred patterns without explicit community approval.

### Motion rules

- Use only three tokens: `120ms`, `160ms`, `200ms`; standard easing `cubic-bezier(.2,.8,.2,1)`.
- Route change: set title, render, move focus, announce title; only then apply a 120–160ms opacity transition when `prefers-reduced-motion: no-preference`.
- Cards: 1–2px lift only for fine-pointer hover; touch gets a brief pressed color state, not hover theatre.
- Dialog: 140–180ms opacity/scale transition with complete focus restoration; no animation under reduced motion.
- FAQ: native disclosure; optional 120ms opacity only, no bounce, stagger, parallax, autoplay, page slide, or delayed focus.
- Filter/search: instant data change plus a visible and live-announced result count; no dramatic reordering animation.
- Global reduced-motion media query disables every nonessential transform, transition, and animation, not only smooth scrolling.

The UI must use a responsive mobile navigation pattern, 44px touch targets, readable 14–16px minimum control/body text, zoom/forced-colors support, and contrast tests. The small 6–11px text treatment in the current stylesheet does not continue into the production system.

## Production quality gates

A production merge is blocked until all of the following are real and passing:

1. Typecheck, lint, unit tests, migration checks, and content-schema validation.
2. Playwright test suite: canonical routes, actual HTTP 200/404 behavior, title/meta/canonical values, skip link, keyboard menu, focus after navigation, dialog focus/Escape/return, enquiry error handling, booking confirmation, payment webhook ledger, and staff authorization.
3. `axe-core` accessibility scan plus targeted manual keyboard and screen-reader acceptance (NVDA/Firefox, VoiceOver/Safari, TalkBack/Chrome).
4. Visual regressions at 320/375/768/1024/1440px; 200%/400% zoom; increased text spacing; forced-colors; and reduced-motion modes.
5. Lighthouse/Core Web Vitals budgets including image and font transfer—not only CSS/JS. The current five JPEGs total about 4 MB and must be replaced by rights-cleared responsive AVIF/WebP/JPEG sources.
6. Security checks: dependency audit, CodeQL, secret scan, SAST, SBOM/attestation, webhook signature tests, and an HTTP-header test for CSP, HSTS, `frame-ancestors`, `nosniff`, Referrer Policy, and Permissions Policy.
7. Post-deploy synthetic probe of the actual canonical production domain, not Vite preview; checks routes, sitemap, robots, TLS, 404, form endpoint, and error rate.

## Real CI/CD and infrastructure deliverables

The implementation phase will commit—not merely describe—the following production files:

```text
.github/workflows/ci.yml                 # quality gates on pull requests
.github/workflows/preview.yml            # isolated preview + E2E against preview
.github/workflows/deploy-production.yml  # signed production deployment after checks
.github/workflows/security.yml           # CodeQL, dependency, SBOM, secret checks
infra/terraform/*.tf                     # domain/CDN/runtime/storage/database bindings
apps/web/Dockerfile                      # reproducible production build/runtime
apps/web/.dockerignore
apps/web/healthcheck.ts                  # unauthenticated health/readiness endpoints
apps/web/src/lib/security/headers.ts     # actual response security policy
apps/web/src/db/migrations/*             # executable, versioned migrations
docs/runbooks/deploy.md
docs/runbooks/rollback.md
docs/runbooks/incident-response.md
.env.example                             # names only; never secrets
```

All workflow actions will be SHA pinned; builds use the committed lockfile and declared Node toolchain; deployments occur only after the same configured base-domain build and quality gate have passed. The provider-specific YAML/Terraform cannot be finalised honestly until the user selects the real host, domain registrar, database, email sender, calendar, and payment provider.

## Implementation sequence

### Stage 0 — production discovery and authorization

Collect and verify:

- Legal entity/operator, operating country, privacy contact, governing-law position, tax/currency, age/safeguarding stance.
- The true practitioner/service catalogue, duration, price, availability, timezone, cancellation/refund policy, and real customer-support channel.
- The actual domain and DNS authority.
- The selected, verified accounts for hosting, database, payment, calendar, email, analytics, and error monitoring.
- Rights-cleared brand assets and content facts; named cultural/editorial reviewers; community consent/review requirements.
- Priority language(s), terminology owners, and translation/review workflow.

This stage has no fake credentials, placeholder provider IDs, or fabricated legal copy.

### Stage 1 — foundation and public-site migration

1. Bootstrap the TypeScript server-rendered/prerendered application and move routes to file-based, canonical HTML pages.
2. Introduce shared design tokens, semantic image components, responsive media pipeline, accessible header/mobile menu/footer, and a distinct 404.
3. Migrate the existing content into a validated schema and add per-page metadata, sitemap, robots, Open Graph, JSON-LD, and favicons/manifest.
4. Replace watermarked assets with the approved media register.
5. Rebuild the design without the current mobile-navigation, skip-link, focus, contrast, and text-size defects.
6. Add E2E/accessibility/visual/CWV tests and run against a real staging deployment.

### Stage 2 — real enquiry, booking, and operations

1. Build a secure enquiry form with validation, consent record, rate limit, user-safe confirmation, and alternate non-WhatsApp contact route.
2. Implement availability, holds, timezone-safe booking, confirmations, rescheduling/cancellation, calendar synchronization, staff roles, and audit logs.
3. Add configured transactional notifications with proper sender-domain verification.
4. Add the staff operational dashboard for bookings/enquiries only after role controls and audit logs are in place.

### Stage 3 — real payments and community/event workflow

1. Configure the approved payment provider’s hosted checkout; calculate actual local pricing/tax; receive and verify signed webhooks; implement idempotent payment/booking reconciliation and refunds/cancellations per policy.
2. Publish truthful service prices and availability only after configuration is live.
3. Implement event publishing/registration from real staff-entered event data, capacity/waitlist rules, accessibility information, timezone, and confirmation flow.
4. Add governed content review, translation workflow, contributor credit, correction/takedown intake, and public provenance/rights display.

### Stage 4 — go-live and sustained operations

1. Run legal/accessibility/security/content-governance sign-off.
2. Run a controlled staged rollout on the canonical domain and test staff operations/payment/refund/webhook scenarios.
3. Enable uptime, error, 404, performance, and consent-aware conversion monitoring.
4. Publish the support, privacy, accessibility, corrections, safeguarding, and incident/rollback routes.
5. Establish a recurring content/asset/legal review cadence with accountable owners.

## Inputs required to begin actual production code

1. Confirm that the proposed target is a real service/booking platform rather than an editorial-only public site.
2. Provide/authorize the real legal business details, jurisdiction, domain, and decision-maker contacts.
3. Supply approved, rights-cleared visual identity/assets and confirm any communities/traditions that must review representation.
4. Confirm the real services, prices/currency/taxes, working hours/timezone, cancellation/refund policy, and whether users must create accounts.
5. Select/authorize the real host, database, calendar, payment provider, email sender, and monitoring provider—or authorize a managed-platform recommendation after the legal entity/country is known.
6. Confirm initial languages and the human reviewers who approve culturally specific translations/content.

Once those are supplied, the implementation should proceed as one real migration: schema and infrastructure first, then public routes, then operational workflows, then actual payment/booking integrations, with full source code, migrations, CI/CD YAML, and tests committed in the repository.
