// Place this file at: scripts/seed-dashboard.js
// Run AFTER setting MONGODB_URI in .env.local (or as an env var):
//   npm install mongodb
//   node scripts/seed-dashboard.js
//
// What it does: deletes the old demo-jake data, then inserts ONE user,
// 45 applications and 3 interviews into MongoDB. After this, /dashboard
// reads from MongoDB -- it does NOT read these numbers from code.
// Delete or edit this file's data to test with your own real data.
// To clear the demo data later, just delete the documents with
// userId "demo-jake" from MongoDB.

const fs = require("fs");
const path = require("path");
const { MongoClient } = require("mongodb");

// Read .env.local without needing the dotenv package.
function loadEnvLocal() {
  const envPath = path.join(process.cwd(), ".env.local");
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
      if (!process.env[key]) process.env[key] = value;
    });
}

async function main() {
  loadEnvLocal();
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error("ERROR: MONGODB_URI is not set. Add it to .env.local first.");
    process.exit(1);
  }
  const dbName = process.env.MONGODB_DB || "jobhunt";
  const userId = process.env.DASHBOARD_USER_ID || "demo-jake";

  const client = new MongoClient(uri);
  await client.connect();
  const db = client.db(dbName);

  // Clean old demo data only (never touch other users' data).
  await db.collection("users").deleteMany({ userId });
  await db.collection("applications").deleteMany({ userId });
  await db.collection("interviews").deleteMany({ userId });

  await db.collection("users").insertOne({
    userId,
    name: "Jake Gyll",
    email: "jakegyll@email.com",
    avatarUrl: "",
    createdAt: new Date(),
  });

  // The 3 most recent applications, matching the reference history.
  const recent = [
    { jobTitle: "Social Media Assistant", company: "Nomad", location: "Paris, France", jobType: "Full-Time", dateApplied: new Date("2021-07-24"), status: "In Review" },
    { jobTitle: "Social Media Assistant", company: "Udacity", location: "New York, USA", jobType: "Full-Time", dateApplied: new Date("2021-07-23"), status: "Shortlisted" },
    { jobTitle: "Social Media Assistant", company: "Packer", location: "Madrid, Spain", jobType: "Full-Time", dateApplied: new Date("2021-07-22"), status: "Declined" },
  ];

  // Fill up to 45 total: 18 Interviewed, 27 non-Interviewed (60% Unsuitable).
  const pool = [
    ["Brand Designer", "Dropbox", "San Francisco, USA", "Full-Time"],
    ["Interactive Developer", "Terraform", "Hamburg, Germany", "Remote"],
    ["Email Marketing", "Revolut", "Madrid, Spain", "Full-Time"],
    ["Lead Engineer", "Canva", "Ontario, Canada", "Full-Time"],
    ["Product Designer", "ClassPass", "Barcelona, Spain", "Part-Time"],
    ["Customer Manager", "Pitch", "Berlin, Germany", "Full-Time"],
    ["Visual Designer", "Blinkist", "Granada, Spain", "Remote"],
    ["HR Manager", "Webflow", "Lucerne, Switzerland", "Full-Time"],
    ["Financial Analyst", "GoDaddy", "Marseille, France", "Internship"],
    ["Sales Specialist", "Notion", "London, UK", "Contract"],
    ["Backend Developer", "Dropbox", "Remote", "Remote"],
  ];
  const generated = [];
  for (let i = 0; i < 42; i++) {
    const [jobTitle, company, location, jobType] = pool[i % pool.length];
    generated.push({
      jobTitle,
      company,
      location,
      jobType,
      // June 2021, so the 3 recent July applications stay on top.
      dateApplied: new Date(2021, 5, 1 + (i % 28)),
      status: i < 18 ? "Interviewed" : "Declined",
    });
  }

  const applications = [...recent, ...generated].map((app) => ({ ...app, userId, createdAt: new Date() }));
  await db.collection("applications").insertMany(applications);

  await db.collection("interviews").insertMany([
    { userId, date: new Date("2021-11-26"), time: "10:00 AM", interviewerName: "Alex Morgan", role: "Product Designer", company: "Canva", avatarUrl: "", highlighted: false },
    { userId, date: new Date("2021-11-26"), time: "10:30 AM", interviewerName: "Joe Bartmann", role: "HR Manager", company: "Divvy", avatarUrl: "", highlighted: true },
    { userId, date: new Date("2021-11-26"), time: "11:00 AM", interviewerName: "Emma Wilson", role: "Recruiter", company: "Nomad", avatarUrl: "", highlighted: false },
  ]);

  console.log(`Seeded ${applications.length} applications and 3 interviews for userId "${userId}" in database "${dbName}".`);
  console.log("Now open /dashboard -- it should show Total Jobs Applied 45, Interviewed 18, 40% / 60%.");
  await client.close();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
