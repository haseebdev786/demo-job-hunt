# JobHuntly

## Authentication and database

Email/password authentication uses [Better Auth](https://better-auth.com/docs/integrations/next) with its [MongoDB adapter](https://better-auth.com/docs/adapters/mongo).

- Local server configuration is in `.env`; `.env.example` lists the required variable names without real credentials. The separate `../atlas-credentials.env` file is not loaded by the application.
- `MONGODB_URI` connects to Atlas, and `MONGODB_DB=jobhuntly` selects the application database. Keep these server-only.
- `BETTER_AUTH_SECRET` is a private, randomly generated secret. Keep it stable across server restarts and identical across instances.
- `BETTER_AUTH_URL` must match the application origin; use the deployed HTTPS origin in production.
- `/signup` creates a `job-seeker` or `company` account and signs the user in. `/login` checks the selected account type. Seekers go to `/jobs`; company users go to `/companies`.
- Passwords require 8–128 characters and are stored as hashes. Sessions use HttpOnly cookies; Remember me selects a persistent cookie with a 30-day session lifetime. Logout revokes the database session.
- Auth records live in `user`, `account`, `session`, and `rateLimit`. Indexes protect email uniqueness and session tokens. Expired sessions are removed automatically.
- Google sign-in is disabled until OAuth is configured. Email verification and password reset email delivery are not configured yet.

### Adding job applications next

The current job listings still use `lib/jobs.js`; application forms and submission APIs are the next feature. In new server Route Handlers, import `getCurrentUser` from `@/lib/session` and `getDb` from `@/lib/db`. Return 401 if the user is missing and check the stored `accountType` before allowing the action. For applications, derive `userId` from the authenticated user rather than trusting the request body. Always filter reads/updates by the owner. A company account is not proof of membership in an existing listed company; add company ownership before enabling employer management.

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
