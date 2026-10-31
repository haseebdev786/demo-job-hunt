// Place this file at: scripts/seed-dashboard-demo-10.js
// Run AFTER setting MONGODB_URI in .env or .env.local:
//   npm install mongodb
//   node scripts/seed-dashboard-demo-10.js
//
// What it does: replaces the demo dashboard data for one userId
// with EXACTLY the demo numbers you asked for, so you can check
// /dashboard:
//   - 10 jobs applied in total
//   - 5 Interviewed
//   - 2 Declined (rejected)
//   - 2 In Review + 1 Shortlisted = the other 3, to reach 10
//   - 5 upcoming interviews
//   - Recent Applications History = the 3 most recent applications
//     (by dateApplied, newest first, as lib/dashboard-data.js does)
//
// WHAT WILL SHOW, and where (so you can check it):
//   Dashboard overview:
//     Total Jobs Applied = 10
//     Interviewed = 5
//     Donut = 50% Interviewed / 50% Unsuitable
//       NOTE: the donut in code has only 2 slices: Interviewed
//       vs THE REST. "Unsuitable" there does NOT mean only the
//       2 Declined -- it is the other 5 (2 Declined + 2 In Review
//       + 1 Shortlisted). There is no separate "Rejected 20%"
//       slice in the current widget. If you want a rejected slice,
//       the donut component itself would need to change.
//     Recent Applications History (3, newest first):
//       24 Jul 2021 -- Social Media Assistant, Nomad -- Interviewed
//       23 Jul 2021 -- Brand Designer, Dropbox -- In Review
//       22 Jul 2021 -- Interactive Developer, Terraform -- Declined
//     Upcoming Interviews (5, all on 26 November 2021):
//       10:00 AM Jan Mayer, 10:30 AM Alex Morgan (highlighted),
//       11:00 AM Emma Wilson, 11:30 AM Joe Bartmann,
//       12:00 PM Ally Wales
//   My Applications page (/dashboard/applications):
//     All (10), In Review (2), Interviewing (5),
//     Assessment (0), Offered (0), Hired (0)
//     Shortlisted (1) and Declined (2) show only under "All" --
//     that is how ApplicationsHistoryFull.jsx maps tabs today
//     (Shortlisted / Declined have no own tab in the screenshot).
//
// DEMO ONLY: these are demo applications/interviews, not real
// submissions. Real applications will appear here automatically
// when they are saved in the `applications` collection.
// SAFETY: this script deletes ONLY users / applications /
// interviews for this one userId (DASHBOARD_USER_ID or
// "demo-jake", the userId /dashboard currently reads). It does
// NOT touch conversations, messages, profiles, settings or
// notifications. If you have REAL applications saved under that
// same demo-jake userId, they will be replaced by this demo --
// use a different DASHBOARD_USER_ID for real data.
// To seed for a different userId, run:
//   DASHBOARD_USER_ID=<your-user-id> node scripts/seed-dashboard-demo-10.js
// DB name: MONGODB_DB from .env / .env.local, or "jobhunt".

const fs = require("fs");
const path = require("path");
const { MongoClient } = require("mongodb");

// Same .env loader as the other seed scripts: .env first, then
// .env.local overrides it. Real environment variables always win.
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
function loadEnv() {
  loadEnvFile(".env");
  loadEnvFile(".env.local");
}

async function main() {
  loadEnv();
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

  // Replace demo dashboard data for this userId only.
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

  // Job titles / companies / locations are from lib/jobs.js (the
  // real 12 jobs in the project), first 10 of them. Dates are
  // newest first, so Recent Applications History shows the top 3.
  // Counts: Interviewed 5, Declined 2, In Review 2, Shortlisted 1 = 10.
  const applications = [
    { jobTitle: "Social Media Assistant", company: "Nomad", location: "Paris, France", jobType: "Full-Time", dateApplied: new Date("2021-07-24"), status: "Interviewed" },
    { jobTitle: "Brand Designer", company: "Dropbox", location: "San Francisco, USA", jobType: "Full-Time", dateApplied: new Date("2021-07-23"), status: "In Review" },
    { jobTitle: "Interactive Developer", company: "Terraform", location: "Hamburg, Germany", jobType: "Remote", dateApplied: new Date("2021-07-22"), status: "Declined" },
    { jobTitle: "Email Marketing", company: "Revolut", location: "Madrid, Spain", jobType: "Full-Time", dateApplied: new Date("2021-07-21"), status: "Interviewed" },
    { jobTitle: "Lead Engineer", company: "Canva", location: "Ontario, Canada", jobType: "Full-Time", dateApplied: new Date("2021-07-20"), status: "Interviewed" },
    { jobTitle: "Product Designer", company: "ClassPass", location: "Barcelona, Spain", jobType: "Part-Time", dateApplied: new Date("2021-07-19"), status: "Interviewed" },
    { jobTitle: "Customer Manager", company: "Pitch", location: "Berlin, Germany", jobType: "Full-Time", dateApplied: new Date("2021-07-18"), status: "Interviewed" },
    { jobTitle: "Visual Designer", company: "Blinkist", location: "Granada, Spain", jobType: "Remote", dateApplied: new Date("2021-07-17"), status: "Declined" },
    { jobTitle: "HR Manager", company: "Webflow", location: "Lucerne, Switzerland", jobType: "Full-Time", dateApplied: new Date("2021-07-16"), status: "In Review" },
    { jobTitle: "Financial Analyst", company: "GoDaddy", location: "Marseille, France", jobType: "Internship", dateApplied: new Date("2021-07-15"), status: "Shortlisted" },
  ];

  await db.collection("applications").insertMany(
    applications.map((app) => ({ ...app, userId, createdAt: new Date() }))
  );

  // 5 upcoming interviews, all on one day (like the old seed), so
  // the Upcoming Interviews card shows one date label:
  // "Today, 26 November". The interviews collection is NOT linked
  // to a specific application by ID in lib/dashboard-data.js, so
  // these 5 are demo upcoming interviews, counted separately from
  // the 5 Interviewed applications above -- both counts are 5.
  await db.collection("interviews").insertMany([
    { userId, date: new Date("2021-11-26"), time: "10:00 AM", interviewerName: "Jan Mayer", role: "Recruiter", company: "Nomad", avatarUrl: "", highlighted: false },
    { userId, date: new Date("2021-11-26"), time: "10:30 AM", interviewerName: "Alex Morgan", role: "Product Designer", company: "Canva", avatarUrl: "", highlighted: true },
    { userId, date: new Date("2021-11-26"), time: "11:00 AM", interviewerName: "Emma Wilson", role: "Recruiter", company: "Nomad", avatarUrl: "", highlighted: false },
    { userId, date: new Date("2021-11-26"), time: "11:30 AM", interviewerName: "Joe Bartmann", role: "HR Manager", company: "Divvy", avatarUrl: "", highlighted: false },
    { userId, date: new Date("2021-11-26"), time: "12:00 PM", interviewerName: "Ally Wales", role: "Recruiter", company: "Digital Ocean", avatarUrl: "", highlighted: false },
  ]);

  console.log(`Seeded 10 applications (5 Interviewed, 2 Declined, 2 In Review, 1 Shortlisted) and 5 interviews for userId "${userId}" in database "${dbName}".`);
  console.log("Now open /dashboard -- it should show Total Jobs Applied 10, Interviewed 5, 50% / 50%, Recent 3, Upcoming 5.");
  await client.close();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
