// Place this file at: scripts/seed-notifications.js
// Run AFTER setting MONGODB_URI in .env or .env.local:
//   npm install mongodb
//   node scripts/seed-notifications.js
//
// What it does: deletes only userId "demo-jake" (or DASHBOARD_USER_ID)
// documents from the `notifications` collection, then inserts the 3
// reference notifications from 2.13 Dashboard - Notifications:
//   1. Jan Mayer invited you to interview with Nomad -- "New",
//      12 mins ago (relative time, so it stays correct on reload)
//   2. Jane Alicia from Udacity updated your job applications
//      status -- "#Shortlisted", 3 days ago
//   3. Ally Wales from Digital Ocean sent you an interview
//      invitation -- detail card: Interview - Jake Gyll, Social
//      Media Manager Role, Mon, 20 July 2021, 12 PM - 12:30 PM,
//      sent 14 July 2021 - 3:26 PM
// It does NOT touch users, profiles, applications, or messages.
// After this, open /dashboard and click the bell icon (top right,
// next to "Back to homepage") to see the panel.
// Env loading matches Next.js: .env first, then .env.local overrides.

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

function minutesAgo(n) {
  return new Date(Date.now() - n * 60 * 1000);
}
function daysAgo(n) {
  return new Date(Date.now() - n * 24 * 60 * 60 * 1000);
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

  await db.collection("notifications").deleteMany({ userId });
  await db.collection("notifications").insertMany([
    {
      userId,
      actorName: "Jan Mayer",
      actorCompany: "Nomad",
      actorAvatarUrl: "",
      kind: "interview-invitation",
      text: "invited you to interview with Nomad",
      badge: "New",
      badgeTone: "indigo",
      read: false,
      createdAt: minutesAgo(12),
      detail: null,
    },
    {
      userId,
      actorName: "Jane Alicia",
      actorCompany: "Udacity",
      actorAvatarUrl: "",
      kind: "status-update",
      text: "updated your job applications status",
      badge: "#Shortlisted",
      badgeTone: "green",
      read: true,
      createdAt: daysAgo(3),
      detail: null,
    },
    {
      userId,
      actorName: "Ally Wales",
      actorCompany: "Digital Ocean",
      actorAvatarUrl: "",
      kind: "interview-detail",
      text: "sent you an interview invitation",
      badge: "",
      badgeTone: "",
      read: true,
      createdAt: new Date(2021, 6, 14, 15, 26),
      detail: {
        title: "Interview - Jake Gyll",
        role: "Social Media Manager Role",
        date: "Mon, 20 July 2021",
        time: "12 PM - 12:30 PM",
        candidateName: "Jake Gyll",
        candidateEmail: "jakegyll@email.com",
      },
    },
  ]);

  console.log(`Seeded 3 notifications for userId "${userId}" in database "${dbName}".`);
  console.log("Now open /dashboard and click the bell icon next to Back to homepage.");
  await client.close();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
