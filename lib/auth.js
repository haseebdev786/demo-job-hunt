import "server-only";
import { betterAuth } from "better-auth/minimal";
import { APIError, createAuthMiddleware } from "better-auth/api";
import { mongodbAdapter } from "@better-auth/mongo-adapter";
import { db, mongoClient } from "./db";

const vercelOrigins = [
  process.env.VERCEL_PROJECT_PRODUCTION_URL,
  process.env.VERCEL_BRANCH_URL,
  process.env.VERCEL_URL,
].filter(Boolean).map((host) => `https://${host}`);

const configuredURL = process.env.BETTER_AUTH_URL;
const isLocalURL = configuredURL && ["localhost", "127.0.0.1", "[::1]"].includes(new URL(configuredURL).hostname);
// A copied localhost setting must not become the auth origin on Vercel.
const baseURL = process.env.VERCEL && (!configuredURL || isLocalURL)
  ? vercelOrigins[0]
  : configuredURL;
const trustedOrigins = [...new Set([baseURL, ...vercelOrigins].filter(Boolean).map((url) => new URL(url).origin))];

export const auth = betterAuth({
  appName: "JobHuntly",
  baseURL,
  trustedOrigins,
  secret: process.env.BETTER_AUTH_SECRET,
  database: mongodbAdapter(db, { client: mongoClient }),
  emailAndPassword: {
    enabled: true,
    minPasswordLength: 8,
    maxPasswordLength: 128,
  },
  user: {
    additionalFields: {
      accountType: {
        type: ["job-seeker", "company"],
        required: true,
        defaultValue: "job-seeker",
        input: true,
      },
    },
  },
  session: {
    expiresIn: 60 * 60 * 24 * 30,
    updateAge: 60 * 60 * 24,
  },
  rateLimit: {
    enabled: true,
    storage: "database",
    window: 60,
    max: 100,
    customRules: {
      "/sign-in/email": { window: 60, max: 10 },
      "/sign-up/email": { window: 60, max: 5 },
    },
  },
  hooks: {
    before: createAuthMiddleware(async (ctx) => {
      if (ctx.path === "/sign-up/email") {
        if (!["job-seeker", "company"].includes(ctx.body?.accountType)) {
          throw new APIError("BAD_REQUEST", { message: "Choose Job Seeker or Company." });
        }
        const name = typeof ctx.body?.name === "string" ? ctx.body.name.trim() : "";
        if (name.length < 2 || name.length > 100) {
          throw new APIError("BAD_REQUEST", { message: "Name must be between 2 and 100 characters." });
        }
        ctx.body.name = name;
      }
      if (ctx.path === "/update-user" && ctx.body?.accountType !== undefined) {
        throw new APIError("FORBIDDEN", { message: "Account type cannot be changed." });
      }
      if (ctx.path === "/sign-in/email") {
        const accountType = ctx.body?.accountType;
        if (!["job-seeker", "company"].includes(accountType)) {
          throw new APIError("BAD_REQUEST", { message: "Choose Job Seeker or Company." });
        }
        if (typeof ctx.body?.email === "string") {
          const user = await db.collection("user").findOne(
            { email: ctx.body.email.trim().toLowerCase() },
            { projection: { accountType: 1 } },
          );
          if (user && user.accountType !== accountType) {
            throw new APIError("UNAUTHORIZED", { message: "Email, password, or account type is incorrect." });
          }
        }
      }
    }),
  },
});
