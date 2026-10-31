// Place this file at: scripts/check-profile-data.js (TEMPORARY, for diagnosis only)
// Run from your project root (my-app, where package.json is):
//   node scripts/check-profile-data.js
//
// What it prints (NO passwords, NO connection string):
//   - which database and userId the profile page will use
//     (from .env.local: MONGODB_DB, DASHBOARD_USER_ID, or the defaults)
//   - how many documents are in `users` and in `profiles`
//   - the userId of every document in those two collections
//
// How to read the result:
//   - If profiles = 0, or no profile has userId "demo-jake" (or your
//     DASHBOARD_USER_ID), the page is CORRECT to show "No profile yet"
//     -- the seed has not run for that user/database yet. Run:
//       node scripts/seed-profile.js
//     then reload /dashboard/profile.
//   - If a profile DOES exist here but the page still shows
//     "No profile yet", then the page is reading a different database
//     or userId than this script -- paste this script's full output
//     (it contains no secrets) and the exact MONGODB_DB /
//     DASHBOARD_USER_ID lines from .env.local, and the mismatch will
//     be obvious from those two lines.
//   - Delete this file after diagnosis if you do not want it in the repo.

const fs = require("fs");
const path = require("path");
const { MongoClient } = require("mongodb");

function loadEnvLocal() {
  const envPath = path.join(process.cwd(), ".env.local");
  if (!fs.existsSync(envPath)) {
    console.log(".env.local NOT FOUND in:", process.cwd());
    console.log("Run this script from the project root (my-app), not from demo/.");
    return;
  }
  fs.readFileSync(envPath, "utf8")
    .split("\n")
    .forEach((line) => {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) return;
      const eq = trimmed.indexOf("=");
      if (eq === -1) return;
      const key = trimmed.slice(0, eq).trim();
      const value = trimmed.slice(eq + 1).trim().replace(/^["']|["']$/g, "");
      if (!process.env[key]) process.env[key] = value;
    });
}

async function main() {
  loadEnvLocal();
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error("ERROR: MONGODB_URI is not set in .env.local.");
    process.exit(1);
  }
  const dbName = process.env.MONGODB_DB || "jobhunt";
  const userId = process.env.DASHBOARD_USER_ID || "demo-jake";

  console.log("Database the page will read:", dbName);
  console.log("UserId the page will read:", userId);
  console.log("Running from:", process.cwd());

  const client = new MongoClient(uri);
  await client.connect();
  const db = client.db(dbName);

  const users = await db.collection("users").find({}, { projection: { userId: 1, name: 1, _id: 0 } }).toArray();
  const profiles = await db.collection("profiles").find({}, { projection: { userId: 1, title: 1, _id: 0 } }).toArray();

  console.log("users collection:", users.length, "document(s)");
  users.forEach((u) => console.log("  user:", u.userId, "-", u.name || "(no name)"));
  console.log("profiles collection:", profiles.length, "document(s)");
  profiles.forEach((p) => console.log("  profile:", p.userId, "-", p.title || "(no title)"));

  const match = profiles.find((p) => p.userId === userId);
  if (match) {
    console.log(`OK: a profile exists for userId "${userId}". If the page still shows "No profile yet", restart the dev server and hard-refresh.`);
  } else {
    console.log(`NO profile for userId "${userId}" in database "${dbName}". Run: node scripts/seed-profile.js`);
  }

  await client.close();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
    