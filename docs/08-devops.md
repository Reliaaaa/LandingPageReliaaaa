# Development and release operations

## Branch flow

1. Create a `feature/*` branch for each change.
2. Open a pull request into `dev`. Review it and merge it manually after CI passes.
3. When `dev` is ready to release, open a pull request from `dev` into `main`. Review it and merge it manually after CI passes.

The repository's GitHub Actions workflow runs lint, tests, and a production build on pull requests into `dev` and `main`, and on pushes to those branches. Branch protection and required checks can be enabled in GitHub repository settings. The workflow does not publish a deployment.

## Vercel release setup

Import the repository into Vercel, set `main` as the production branch, and use the Vite preset with `npm run build` and output directory `dist`. The repository's `api/` directory contains the serverless functions. Create a PostgreSQL database and apply `server/schema.sql` before enabling contact and analytics traffic. Once the Git integration is configured, merging into `main` can trigger a production deployment and pull requests can receive preview deployments according to the Vercel project settings. Confirm the preview and production URLs in Vercel before sharing them.

These are setup instructions; the repository does not contain Vercel credentials or evidence of a connected Vercel project.

## Secrets and environment variables

Store server values in Vercel's environment variable settings, scoped to the appropriate production or preview environment. Use separate database credentials for preview and production where available. The API reads:

| Variable | Purpose |
| --- | --- |
| `DATABASE_URL` | PostgreSQL connection string for contact messages and analytics events. Required for API writes and the admin read endpoint. |
| `APP_ORIGIN` | Expected public site origin for browser API requests. Set to the canonical production origin; when absent, the API compares the request Origin with its Host, which accommodates changing preview URLs. |
| `IP_HASH_SALT` | Private random salt used when hashing visitor IPs for rate limiting. |
| `ANALYTICS_ADMIN_TOKEN` | Private token of at least 32 characters for the admin analytics endpoint. |

For local API development, copy `.env.example` to `.env`, replace its placeholders, apply `server/schema.sql` to that database, and run `node --env-file=.env server/dev.mjs` alongside `npm run dev`. Alternatively, export the same variables in the shell and run `npm run dev:api`. The local API defaults to port 3001; `API_PORT` can override it. Never commit secret values or place them in `VITE_` variables: Vite embeds `VITE_` values in the browser bundle.

## Rollback

If a release is faulty, use Vercel's project deployment controls to restore the last known good production deployment, if that project is connected. Then revert the offending commit or merge on `main` through the normal review process so source control matches the restored behavior. Re-run CI and verify the production URL after the replacement deployment. If Vercel is not configured, roll back through the hosting provider actually in use.
