# API

The Node API runs as Vercel functions in `api/` or via `node --env-file=.env server/dev.mjs` locally. PostgreSQL persists submissions and events. See [server setup and endpoint reference](../server/README.md) for environment, request examples, limits, errors, and production operations.

| Method | Path | Purpose | Access |
| --- | --- | --- | --- |
| POST | `/api/contact` | Validate and save a contact message | Public, rate limited, honeypot |
| POST | `/api/analytics` | Save a page view or contact-submit event | Public, rate limited |
| GET | `/api/analytics` | Aggregate event counts for the last 30 days | Secret bearer token |

The frontend should treat a successful contact response as a stored submission and show retry guidance on failure. Analytics requests are best effort and must never block navigation or form success. Never include contact contents, email addresses, query strings, or fragments in analytics.
