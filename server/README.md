# API setup

Requires Node.js 22+, PostgreSQL, and the `pg` package. The project must use `"type": "module"`.

1. Copy `.env.example` to `.env` and supply a PostgreSQL connection string.
2. Run `psql "$DATABASE_URL" -f server/schema.sql` with the intended database credentials. Schema creation is explicit; requests never run migrations.
3. Run `node --env-file=.env server/dev.mjs` and start Vite in another terminal. Vite should proxy `/api` to `http://127.0.0.1:3001`.
4. On Vercel, set the environment variables in project settings and deploy. Files under `api/` become Node functions. Use a provider's pooled PostgreSQL URL for serverless deployments.

## Environment

- `DATABASE_URL`: required PostgreSQL connection URL. For managed production services use verified TLS (for example the provider's supported `sslmode=verify-full` configuration and CA); no insecure certificate override is installed.
- `APP_ORIGIN`: canonical site origin, e.g. `https://portfolio.example.com`. For local Vite set `http://localhost:5173`. When omitted, a browser Origin must match the request Host. Origin is a browser abuse check, not authentication.
- `IP_HASH_SALT`: long random secret, required in production (public writes return 503 if absent) to protect contact quota identifiers. Rotate with awareness this resets client quotas. Raw IP addresses are not stored.
- `ANALYTICS_ADMIN_TOKEN`: random secret of at least 32 characters. Required for analytics summaries. Never expose through `VITE_` variables or client code.
- `API_PORT`: optional local API port, defaults to 3001.

## Endpoints

`POST /api/contact`, JSON `{ "name": "Jane Doe", "email": "jane@example.com", "message": "A message of at least ten characters.", "company": "" }` returns 201 `{ "ok": true }` after storing the message. The optional `company` honeypot must stay empty. A filled honeypot gets a synthetic 200 success. Name is 2–100 characters, email up to 254, and message 10–4,000. Contact limit: five requests per ten minutes per instance, plus five stored messages per client hash per ten minutes across instances. Stored messages can be read by the owner through the database; no public inbox endpoint or email delivery is included.

`POST /api/analytics`, JSON `{ "event": "page_view", "path": "/" }` stores a privacy-minimal event; allowed event names are `page_view` and `contact_submit`. Paths must begin `/`, contain only letters, digits, `/`, `_`, `-`, and be at most 200 characters. Strip queries/fragments before sending. No IP, user agent, cookie, or visitor identifier is stored. Requests are limited to 30 per minute per warm instance/client.

`GET /api/analytics` requires `Authorization: Bearer <ANALYTICS_ADMIN_TOKEN>` and returns aggregate event counts over the preceding 30 days, `{ "periodDays": 30, "events": [{ "event": "page_view", "count": 12 }] }`.

All POST requests require JSON and at most 8 KiB. Errors use `{ "error": "..." }` with 400 validation, 403 origin, 405 method, 413 size, 415 content type, 429 quota, or 503 dependency failure. Database details are never returned to clients.

## Operations and limitations

Analytics are unauthenticated estimates: bots can submit fabricated events. Per-instance rate limiting resets on cold starts; deploy an edge/WAF rate limiter for stronger distributed abuse protection. Contact's database quota is cross-instance, but shared NATs share a quota. The Vercel-provided forwarding header is trusted only on Vercel; local development uses the socket address. Honeypots do not replace CAPTCHA for determined abuse. No external messages or email notifications are sent.

Apply a retention policy appropriate to your privacy notice; for example remove analytics older than 90 days and contact records after handling them. Restrict database access to trusted operators, store credentials in deployment secrets, and avoid logging contact payloads. Render stored messages as text, never HTML. Backups and deletion procedures belong to the deployment owner.
