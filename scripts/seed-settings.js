// Place this file at: scripts/seed-settings.js
// Run AFTER seed-dashboard.js / seed-profile.js (it does NOT create
// the user or profile -- it only adds/updates the `settings`
// document for the same user):
//   npm install mongodb
//   node scripts/seed-settings.js
//
// What it does: upserts one document in the `settings` collection
// with the reference demo values (2.9 / 2.10 / 2.11):
//   Date of Birth 1997-08-05, Gender Male, Account Type Job Seeker,
//   Email verified, Notifications: Applications ON, Jobs OFF,
//   Recommendations OFF.
// After this, /dashboard/settings shows those values from MongoDB.
// It does NOT touch users, profiles, applications, or messages.
//
// Env loading matches Next.js: .env first, then .env.local overrides
// it (real process.env always wins). See seed-profile.js for why
// this matters (this project has .env, not .env.local).

const fs = require("fs");
const path = require("path");
const { MongoClient } = require("mongodb");

const _originalEnvKeys = new Set(Object.keys(process.env));
function loadEnvFile(fileName) {
  const envPath = path.join(process.cwd(), fileName);
  if (!fs.existsSync(envPath)) return;
  fs.readFileSync(envPath, "utf8")
    .split("\n")
    .forEach((line) => {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) return;
      const eq = trimmed.indexOf("=");
      if (eq === -1) return;
      const key = trimmed.slice(0, eq).trim();
      const value = trimmed.slice(eq + 1).trim().replace(/^["']|["']$/g, "");
      if (!_originalEnvKeys.has(key)) process.env[key] = value;
    });
}
function loadEnvLocal() {
  loadEnvFile(".env");
  loadEnvFile(".env.local");
}

async function main() {
  loadEnvLocal();
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error("ERROR: MONGODB_URI is not set. Add it to .env.local (or .env) first.");
    process.exit(1);
  }
  const dbName = process.env.MONGODB_DB || "jobhunt";
  const userId = process.env.DASHBOARD_USER_ID || "demo-jake";

  const client = new MongoClient(uri);
  await client.connect();
  const db = client.db(dbName);

  await db.collection("settings").updateOne(
    { userId },
    {
      $set: {
        dateOfBirth: "1997-08-05",
        gender: "Male",
        accountType: "jobSeeker",
        emailVerified: true,
        notifications: {
          applications: true,
          jobs: false,
          recommendations: false,
        },
        updatedAt: new Date(),
      },
    },
    { upsert: true }
  );

  console.log(`Seeded settings for userId "${userId}" in database "${dbName}".`);
  console.log("Now open /dashboard/settings -- it should show the reference values from MongoDB.");
  await client.close();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
