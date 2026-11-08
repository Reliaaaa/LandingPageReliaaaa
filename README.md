# Reliaaaa Landing Page

A portfolio landing page built with React and Vite.

## Local development

Use Node.js 22 and npm. From the repository root:

```bash
npm ci
npm run dev
```

Vite prints the local URL after the development server starts.

The contact form and analytics API also need PostgreSQL. Copy `.env.example` to `.env`, replace its placeholders, apply `server/schema.sql` to that database, and run `node --env-file=.env server/dev.mjs` in a second terminal. See [development and release operations](docs/08-devops.md) for the environment variables and deployment steps.

## Checks

```bash
npm run lint
npm run test
npm run build
```

The production build is written to `dist/`. GitHub Actions runs these checks for pull requests into `dev` or `main`, and for pushes to either branch. The workflow uses `npm ci`, so changes to dependencies must include an updated `package-lock.json`.

## Branches and deployment

Create work on a `feature/*` branch. Open a pull request from the feature branch into `dev`, then open a pull request from `dev` into `main` when it is ready for release. Review and merge each pull request manually. CI checks the changes but does not merge or deploy them.

To deploy with Vercel, import this GitHub repository into a Vercel project and select `main` as the production branch. Use the Vite framework preset, `npm run build` as the build command, and `dist` as the output directory. Vercel can create preview deployments for pull requests after the Git integration is configured. Add any needed environment variables in the Vercel project settings; keep their values out of Git.

Vercel and GitHub branch protection are configured outside this repository. This README describes the intended setup and does not imply those services have already been connected.

## Optional service integrations

`vercel.json` specifies the Vite build and output directory. Connect this repository to a Vercel project and select `main` as its production branch in Vercel. Vercel's Git integration then deploys pushes to `main`; no deployment occurs until the integration and project settings are configured. Configure `DATABASE_URL`, `APP_ORIGIN`, `IP_HASH_SALT`, and `ANALYTICS_ADMIN_TOKEN` in Vercel and apply `server/schema.sql` before relying on contact or analytics. See [deployment details](docs/08-devops.md).

The following commands are optional server-side utilities, not browser code. Run them only with tokens you are authorized to use; do not commit tokens, paste them into issues, or put them in client-side `VITE_` variables. Results can contain private information; protect any redirected output.

### Figma

With a Figma personal access token that can read the file and has the required file-content read scope, set `FIGMA_ACCESS_TOKEN` in your shell. Copy the file key from the Figma file URL, then run:

```bash
node scripts/figma.mjs FILE_KEY
node scripts/figma.mjs FILE_KEY 1:2,3:4
```

The first command prints the file JSON, including document and component metadata. The second requests PNG export URLs for the specified node IDs; download the returned assets separately. This utility reads an existing file; it does not create a Figma mockup.

### LinkedIn

Enable **Sign In with LinkedIn using OpenID Connect** for your LinkedIn developer app and obtain an OAuth access token for the consenting account with the approved `openid` and `profile` scopes. Set `LINKEDIN_ACCESS_TOKEN` in your shell and run:

```bash
node scripts/linkedin.mjs
```

The `userinfo` endpoint returns the authenticated account's permitted basic profile claims. It does not accept a LinkedIn profile URL or provide another person's work history. Access depends on LinkedIn product approval, consent, scopes and token validity; this example does not implement the OAuth authorization flow.
