// Place this file at: scripts/seed-messages.js
// Run AFTER setting MONGODB_URI in .env.local (or as an env var):
//   npm install mongodb
//   node scripts/seed-messages.js
//
// What it does: deletes only the demo-jake conversations/messages, then
// inserts the 9 conversations from the 2.2 Messages reference screenshot
// (Jan Mayer first, so it opens by default) plus their messages. It does
// NOT touch users, applications or interviews -- run it after
// scripts/seed-dashboard.js, in any order.
// After this, /dashboard/messages reads from MongoDB, not from code.
//
// Times: Jan Mayer's messages are set to ~12 minutes ago, so the list
// shows "12 mins ago" like the screenshot. The other conversations are
// set to the most recent 3:40 PM, like the screenshot.

const fs = require("fs");
const path = require("path");
const { MongoClient } = require("mongodb");

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

function minutesAgo(mins) {
  return new Date(Date.now() - mins * 60000);
}

// The most recent 3:40 PM (today if it already passed, else yesterday).
function mostRecentTime(hour, minute) {
  const now = new Date();
  const d = new Date(now.getFullYear(), now.getMonth(), now.getDate(), hour, minute);
  if (d > now) d.setDate(d.getDate() - 1);
  return d;
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
  await db.collection("conversations").deleteMany({ userId });
  await db.collection("messages").deleteMany({ userId });

  // Roles/companies for the list-only names are NOT in the screenshot,
  // so they are left blank on purpose -- the detail header then shows
  // just the name, instead of an invented job title. Jan Mayer's
  // Recruiter at Nomad IS in the screenshot, so that one is filled in.
  // Joe Bartmann is HR Manager at Divvy in the dashboard seed data.
  const list = [
    { name: "Jan Mayer", role: "Recruiter", company: "Nomad", lastMessage: "We want to invite you for a quick interview", lastMessageAt: minutesAgo(12), unreadCount: 1 },
    { name: "Joe Bartmann", role: "HR Manager", company: "Divvy", lastMessage: "Hey thanks for your interview...", lastMessageAt: mostRecentTime(15, 40), unreadCount: 0 },
    { name: "Ally Hales", role: "", company: "", lastMessage: "Hey thanks for your interview...", lastMessageAt: mostRecentTime(15, 40), unreadCount: 0 },
    { name: "James Gardner", role: "", company: "", lastMessage: "Hey thanks for your interview...", lastMessageAt: mostRecentTime(15, 40), unreadCount: 0 },
    { name: "Allison Geidt", role: "", company: "", lastMessage: "Hey thanks for your interview...", lastMessageAt: mostRecentTime(15, 40), unreadCount: 0 },
    { name: "Ruben Culhane", role: "", company: "", lastMessage: "Hey thanks for your interview...", lastMessageAt: mostRecentTime(15, 40), unreadCount: 0 },
    { name: "Lydia Diaz", role: "", company: "", lastMessage: "Hey thanks for your interview...", lastMessageAt: mostRecentTime(15, 40), unreadCount: 0 },
    { name: "James Dokidis", role: "", company: "", lastMessage: "Hey thanks for your interview...", lastMessageAt: mostRecentTime(15, 40), unreadCount: 0 },
    { name: "Angelina Swann", role: "", company: "", lastMessage: "Hey thanks for your interview...", lastMessageAt: mostRecentTime(15, 40), unreadCount: 0 },
  ];

  const insertedIds = [];
  for (const c of list) {
    const result = await db.collection("conversations").insertOne({
      userId,
      participantName: c.name,
      participantRole: c.role,
      participantCompany: c.company,
      avatarUrl: "",
      lastMessage: c.lastMessage,
      lastMessageAt: c.lastMessageAt,
      unreadCount: c.unreadCount,
      createdAt: new Date(),
    });
    insertedIds.push(result.insertedId);
  }

  const janId = String(insertedIds[0]);
  const joeId = String(insertedIds[1]);

  await db.collection("messages").insertMany([
    {
      userId,
      conversationId: janId,
      sender: "them",
      senderName: "Jan Mayer",
      text: "Hey Jake, I wanted to reach out because we saw your work contributions and were impressed by your work. We want to invite you for a quick interview",
      sentAt: minutesAgo(12),
      createdAt: new Date(),
    },
    {
      userId,
      conversationId: janId,
      sender: "you",
      senderName: "You",
      text: "Hi Jan, sure would love to. Thanks for taking the time to see my work",
      sentAt: minutesAgo(11),
      createdAt: new Date(),
    },
    {
      userId,
      conversationId: joeId,
      sender: "them",
      senderName: "Joe Bartmann",
      text: "Hey thanks for your interview, we will get back to you soon.",
      sentAt: mostRecentTime(15, 40),
      createdAt: new Date(),
    },
  ]);

  console.log(`Seeded ${list.length} conversations and 3 messages for userId "${userId}" in database "${dbName}".`);
  console.log("Now open /dashboard/messages -- Jan Mayer should open first, with the interview invitation chat.");
  await client.close();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
