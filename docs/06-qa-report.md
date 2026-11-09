# QA report

Checked locally on 8 November 2026.

- `npm run lint`, `npm test`, and `npm run build` passed. The test suite contains eight API tests covering validation, methods, authentication, origin and request limits; it does not exercise a live database.
- Headless Chromium at 1440 × 900 and 375 × 900 rendered without uncaught JavaScript errors or horizontal document overflow. Dark mode persisted on reload. The project dialog opened and closed with Escape. Mobile navigation opened and its work link worked.
- With the API unavailable, a valid contact form submission showed retry/LinkedIn guidance at both widths. This checks the failure path only.
- A configured PostgreSQL service was not available. Contact persistence, successful submission and the analytics aggregation endpoint have not been verified end to end. Production hosting, real-device rendering, and assistive-technology behavior have not been tested.

## PostgreSQL and preview verification — 2026-11-09

Neon schema applied successfully. A real database test verified contact persistence and 30 accepted out of 40 concurrent quota requests; test contact and quota rows were deleted. The Vercel preview returned HTTP 201 for contact and analytics; the test message and event were deleted. Browser rendering, real-device checks, data retention automation, and production release remain unverified.

