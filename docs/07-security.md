# Backend security review

Reviewed `api/contact.js`, `api/analytics.js`, `server/http.js`, `server/db.js`, `server/schema.sql`, and `server/dev.mjs` on 2026-11-08 while implementation was in progress. This is a scoped implementation review, not a completed production penetration test.

## Outcome

No confirmed SQL injection, unauthorized analytics read, or reflected script execution was found in the reviewed paths. Database statements use bound parameters; analytics reads require a server-only bearer token of at least 32 characters and compare it with `timingSafeEqual`. JSON bodies are limited to 8 KiB, contact fields are bounded, responses use generic operational errors, and API responses disable caching. Contact submissions use a transaction and database advisory lock to enforce a shared five-message quota per hashed client in ten minutes.

## Actionable deployment limitations

- Analytics POST rate limiting currently resides in process memory. Separate serverless instances do not share its counters, so concurrency or instance replacement can exceed the apparent 30-event quota. Configure a shared ingestion quota or a verified edge rate limit before relying on this control against sustained storage abuse. Public analytics remains untrusted and can be fabricated by non-browser clients; never use it for billing or authorization.
- Resolved during review: production/Vercel public writes now fail closed with a generic 503 when `IP_HASH_SALT` is absent. Set a strong, private salt; weak salts still permit enumeration of IPv4 hashes if stored hashes leak. Hashed client identifiers and contact details need a retention/deletion policy.
- Set `APP_ORIGIN` to the deployed HTTPS origin and keep `ANALYTICS_ADMIN_TOKEN` and `DATABASE_URL` outside browser-exposed `VITE_` variables. The Origin check deliberately allows clients without Origin and is not bot authentication. Configure database TLS and least-privilege access according to the chosen provider.

## Verification and coverage

All eight backend tests in `server/api.test.js` passed. Direct helper assertions passed for valid/invalid bearer authorization, allowed/rejected origins, invalid JSON objects, oversized bodies, and local rate-limit behavior. Reviewed SQL statically for parameter binding and contact transaction/lock ordering. No real database or production deployment was available for testing; cross-instance contact concurrency, provider-trusted forwarding headers, deployed TLS/security headers, database permissions, and external rate limits remain unverified. Dependencies and frontend rendering were outside this backend review.

The Codex Security skill's required reference resources and scan host tools were unavailable in this worker. This document records a direct scoped review and does not claim a canonical Codex Security scan.
