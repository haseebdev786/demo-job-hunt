// Place this file at: scripts/seed-messages-demo-3.js
// Run AFTER setting MONGODB_URI in .env or .env.local:
//   npm install mongodb
//   node scripts/seed-messages-demo-3.js
//
// What it does: inserts DEMO chats only -- 3 conversations, each
// with 5-6 messages, into MongoDB (conversations + messages
// collections), so /dashboard/messages stops showing
// "No messages yet." and shows these 3 chats instead.
//   1. Jan Mayer (Recruiter, Nomad)      -- 6 messages, 12 mins ago
//   2. Joe Bartmann (HR Manager, Divvy)  -- 5 messages, 2 hours ago
//   3. Ally Wales (Digital Ocean)        -- 6 messages, 5 hours ago
// Total: 3 conversations, 17 messages.
//
// These are DEMO chats, not real recruiter messages -- they are
// here because you asked for demo chats in the Messages section.
// Real messages will appear in the same list when they are saved
// in MongoDB (the reply box already saves through
// POST /api/dashboard/messages).
//
// SAFETY: this script does NOT delete all conversations. It only
// removes the old demo rows for these same 3 participant names
// for this userId (so running it twice does not duplicate them),
// and leaves every other conversation untouched.
// WARNING: the old scripts/seed-messages.js deletes ALL demo-jake
// conversations first, so do NOT run that old seed AFTER this one,
// or these 3 demo chats will be replaced by its 9 conversations.
//
// USER ID: same as lib/messages-data.js -- DASHBOARD_USER_ID from
// .env / .env.local, or "demo-jake" by default. That is the userId
// /dashboard/messages currently reads, not the Better Auth session
// user yet. To seed for a different userId, run:
//   DASHBOARD_USER_ID=<your-user-id> node scripts/seed-messages-demo-3.js
// (on Windows PowerShell: $env:DASHBOARD_USER_ID="<id>"; node scripts/seed-messages-demo-3.js)
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

function minutesAgo(mins) {
  return new Date(Date.now() - mins * 60000);
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

  const demos = [
    {
      name: "Jan Mayer",
      role: "Recruiter",
      company: "Nomad",
      unreadCount: 1,
      messages: [
        { sender: "them", text: "Hey Jake, I wanted to reach out because we saw your work contributions and were impressed by your work. We want to invite you for a quick interview", minsAgo: 45 },
        { sender: "you", text: "Hi Jan, sure would love to. Thanks for taking the time to see my work", minsAgo: 40 },
        { sender: "them", text: "Great! Are you available this week for a 30 minute call with our design team?", minsAgo: 35 },
        { sender: "you", text: "Yes, I am available on Thursday afternoon, or Friday morning if that works better.", minsAgo: 30 },
        { sender: "them", text: "Thursday afternoon works perfectly. I will send you the meeting link shortly.", minsAgo: 15 },
        { sender: "them", text: "Just sent the invite for Thursday at 3 PM. Looking forward to speaking with you!", minsAgo: 12 },
      ],
    },
    {
      name: "Joe Bartmann",
      role: "HR Manager",
      company: "Divvy",
      unreadCount: 0,
      messages: [
        { sender: "them", text: "Hey thanks for your interview, we really liked your approach to the task.", minsAgo: 180 },
        { sender: "you", text: "Thank you, Joe! I enjoyed speaking with the team as well.", minsAgo: 170 },
        { sender: "them", text: "We would like to move you to the next stage. Can you share a few recent projects?", minsAgo: 150 },
        { sender: "you", text: "Sure, I will send over my portfolio link and two case studies by tonight.", minsAgo: 130 },
        { sender: "them", text: "Perfect, thanks. We will review them and get back to you by early next week.", minsAgo: 120 },
      ],
    },
    {
      name: "Ally Wales",
      role: "Recruiter",
      company: "Digital Ocean",
      unreadCount: 0,
      messages: [
        { sender: "them", text: "Hi Jake, this is Ally from Digital Ocean. We have an opening that matches your profile.", minsAgo: 360 },
        { sender: "you", text: "Hi Ally, thanks for reaching out. I would love to hear more about the role.", minsAgo: 350 },
        { sender: "them", text: "It is a Product Designer role, full time and remote. The team works on our dashboard product.", minsAgo: 330 },
        { sender: "you", text: "That sounds like a great fit. My experience is mostly in dashboard and SaaS products.", minsAgo: 310 },
        { sender: "them", text: "Excellent. Would you be open to a short intro call next week?", minsAgo: 305 },
        { sender: "you", text: "Yes, please share a few times that work for you and I will confirm.", minsAgo: 300 },
      ],
    },
  ];

  // Remove only the old demo rows for these 3 names, so re-running
  // does not duplicate them. All other conversations are untouched.
  const demoNames = demos.map((d) => d.name);
  const oldConversations = await db
    .collection("conversations")
    .find({ userId, participantName: { $in: demoNames } })
    .toArray();
  const oldIds = oldConversations.map((c) => String(c._id));
  if (oldIds.length > 0) {
    await db.collection("messages").deleteMany({ userId, conversationId: { $in: oldIds } });
    await db.collection("conversations").deleteMany({ userId, participantName: { $in: demoNames } });
  }

  let totalMessages = 0;
  for (const demo of demos) {
    const lastMessage = demo.messages[demo.messages.length - 1];
    const result = await db.collection("conversations").insertOne({
      userId,
      participantName: demo.name,
      participantRole: demo.role,
      participantCompany: demo.company,
      avatarUrl: "",
      lastMessage: lastMessage.text,
      lastMessageAt: minutesAgo(lastMessage.minsAgo),
      unreadCount: demo.unreadCount,
      createdAt: new Date(),
    });
    const conversationId = String(result.insertedId);
    await db.collection("messages").insertMany(
      demo.messages.map((m) => ({
        userId,
        conversationId,
        sender: m.sender,
        senderName: m.sender === "you" ? "You" : demo.name,
        text: m.text,
        sentAt: minutesAgo(m.minsAgo),
        createdAt: new Date(),
      }))
    );
    totalMessages += demo.messages.length;
  }

  console.log(`Seeded ${demos.length} demo conversations and ${totalMessages} messages for userId "${userId}" in database "${dbName}".`);
  console.log("Now open /dashboard/messages -- Jan Mayer should open first, with 6 messages.");
  await client.close();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
