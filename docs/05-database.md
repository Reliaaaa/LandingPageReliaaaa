# Database

Apply [`server/schema.sql`](../server/schema.sql) to PostgreSQL before using the API. There is no automatic request-time migration. Queries use the `pg` package with bound parameters and a small connection pool; serverless deployments should use their database provider's pooled connection endpoint.

`contact_messages` stores an identity primary key, name, email, message, salted client hash, and creation timestamp. The `(client_hash, created_at)` index supports the cross-instance five-message/ten-minute quota. An advisory transaction lock serializes writes for the same hash while checking the quota. Client hashes are for abuse control and must still be handled as personal information.

`analytics_events` stores an identity primary key, allowlisted event name, sanitized pathname, and timestamp. A creation-time index supports the 30-day aggregation query. This schema stores no cookies, raw IP addresses, user agents, or visitor identifiers.

Only trusted operators should access contact records. There is deliberately no public message-list endpoint. Configure verified TLS, encrypted provider backups, least-privilege runtime credentials, and a documented retention/deletion policy for your deployment. Apply future migrations explicitly and back up before destructive schema changes.

`analytics_rate_limits` stores a salted client hash, window start and count for the shared one-minute quota. Before release, configure a scheduled retention job to delete rows with `window_start < now() - interval '1 day'`; the table otherwise grows over time. Reapply the idempotent schema before enabling this version.
