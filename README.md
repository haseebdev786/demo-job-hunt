# JobHuntly

## Authentication and database

Email/password authentication uses [Better Auth](https://better-auth.com/docs/integrations/next) with its [MongoDB adapter](https://better-auth.com/docs/adapters/mongo).

- Local server configuration is in `.env`; `.env.example` lists the required variable names without real credentials. The separate `../atlas-credentials.env` file is not loaded by the application.
- `MONGODB_URI` connects to Atlas, and `MONGODB_DB=jobhuntly` selects the application database. Keep these server-only.
- `BETTER_AUTH_SECRET` is a private, randomly generated secret. Keep it stable across server restarts and identical across instances.
- `BETTER_AUTH_URL` must match the application origin; use the deployed HTTPS origin in production.
- On Vercel, set `BETTER_AUTH_URL=https://demojobhuntbyhaseeb.vercel.app` (without `/login`) in Project Settings → Environment Variables, then redeploy. Set `MONGODB_URI`, `MONGODB_DB`, and `BETTER_AUTH_SECRET` there as well; local `.env` files are not deployed by Git.
- Auth also trusts this project's exact `VERCEL_PROJECT_PRODUCTION_URL`, `VERCEL_BRANCH_URL`, and `VERCEL_URL` domains. If a localhost auth URL was copied to Vercel, the server uses the Vercel URL instead. Keep access to Vercel System Environment Variables enabled.
- `/signup` creates a `job-seeker` or `company` account and signs the user in. `/login` checks the selected account type. Seekers go to `/dashboard`; company users go to `/company`.
- Passwords require 8–128 characters and are stored as hashes. Sessions use HttpOnly cookies; Remember me selects a persistent cookie with a 30-day session lifetime. Logout revokes the database session.
- Auth records live in `user`, `account`, `session`, and `rateLimit`. Indexes protect email uniqueness and session tokens. Expired sessions are removed automatically.
- Google sign-in is disabled until OAuth is configured. Email verification and password reset email delivery are not configured yet.

### Published jobs

Company accounts publish through `/company/jobs/new`. The authenticated `/api/company/jobs` endpoint validates the form and saves it in MongoDB's `jobPosts` collection. Ownership and company name come from the session. Only that owner can see the employer's job list and detail pages.

The homepage, public and dashboard job lists combine published MongoDB records with a presentation catalog of 10 demo jobs across 6 demo companies. The catalog is in `lib/demo-catalog.js`, is never inserted into MongoDB, and can be disabled with `DEMO_CATALOG_ENABLED=false`. Company dashboards continue to list only the signed-in company's real posts.

Run `node scripts/test-jobs.mjs` against a local server. `TEST_BASE_URL` defaults to `http://localhost:3000`. The test checks company login, publishing, validation, role/origin/ownership protection, saved data and rendered routes. It deletes only its own temporary accounts and jobs in `finally`.

Run `node scripts/remove-demo-data.cjs` to remove the legacy `demo-jake` dashboard records from the configured database. This does not delete authentication accounts or real job posts.

### Candidate profile

Settings saves the account name and profile photo. Images are resized to at most 400 pixels in the browser and stored as bounded binary files in MongoDB's `profilePhotos` collection; `/api/avatar/[id]` serves them publicly. No local upload directory or separate storage credentials are required. The saved photo is shared by the profile, sidebar and account menu.

My Profile supports adding, editing and removing experience, education, skills, portfolios and social links, plus editing the biography, title, location and contact details. `/api/dashboard/profile` validates each section and saves it only for the authenticated account.

### Functionality still in preview

Job application submission and resume storage are not connected yet; the application modal explicitly says that nothing was sent. Company settings, schedule changes, messages, applicant management and analytics still use local state or empty placeholders. The posting form's formatting toolbar and salary drag control are display-only; text and numeric salary inputs work. These are separate from the working job publishing flow.

### Validate authentication

With `npm run dev` running at `BETTER_AUTH_URL`, run `npm run test:auth`. The test creates temporary accounts in the configured database, checks both account types, duplicate emails, passwords, sessions, logout, cookie persistence, origin protection and rate limits, then deletes only its own temporary accounts and sessions.

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
