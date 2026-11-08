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
