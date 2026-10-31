// Place this file at: scripts/seed-profile.js
// Run AFTER setting MONGODB_URI in .env.local or .env (or as an env var):
//   npm install mongodb
//   node scripts/seed-profile.js
//
// What it does: upserts the demo-jake user (it does NOT duplicate it
// if seed-dashboard.js already ran) and replaces that user's document
// in the `profiles` collection with demo data matching the 2.8 Profile
// screenshot as closely as the screenshot allows. It does NOT touch
// applications, interviews, conversations or messages.
// After this, /dashboard/profile reads from MongoDB, not from code.
//
// NOTE: the screenshot text for About Me / experience descriptions is
// too small to read exactly, so those paragraphs below are short demo
// text in the same spirit -- replace them in MongoDB with your real
// profile text. Portfolio image URLs are left blank on purpose: the
// page shows a placeholder tile with the portfolio title until you
// add a real imageUrl in MongoDB. Skills and portfolio titles below
// ARE the ones visible in the screenshot.

const fs = require("fs");
const path = require("path");
const { MongoClient } = require("mongodb");

// Read .env and .env.local without needing the dotenv package.
// Next.js loads BOTH files (with .env.local winning over .env), but
// the old seed scripts only read .env.local -- so if MONGODB_URI was
// in .env (this project has my-app/.env and no my-app/.env.local),
// the seed failed with "MONGODB_URI is not set" even though the
// website itself was connected. This loader matches Next.js:
// .env first, then .env.local overrides it. Real environment
// variables (already in process.env) always win.
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

  await db.collection("users").updateOne(
    { userId },
    {
      $setOnInsert: { userId, createdAt: new Date() },
      $set: { name: "Jake Gyll", email: "jakegyll@email.com", avatarUrl: "" },
    },
    { upsert: true }
  );

  await db.collection("profiles").deleteMany({ userId });
  // Values below are from the 2.8 reference screenshot (enlarged and
  // read as closely as the small image allows -- the smallest text is
  // approximate, replace it in MongoDB with the real profile text).
  // Re-run this seed after updating the files, otherwise the page
  // keeps showing the OLD seed data (location, phone, languages,
  // social links and portfolio titles live in MongoDB, not in code).
  await db.collection("profiles").insertOne({
    userId,
    title: "Product Designer at Twitter",
    location: "Manchester, UK",
    about:
      "I'm a product designer currently working remotely at Twitter from beautiful Manchester, United Kingdom. I'm passionate about designing digital products that have a positive impact on the world.\n\nFor 10 years, I've specialised in interface, experience & interaction design as well as working in user research and product strategy for product agencies, big tech companies & start-ups.",
    openForOpportunities: true,
    experiences: [
      {
        role: "Product Designer",
        company: "Twitter",
        employmentType: "Full-Time",
        period: "Jun 2018 - Present",
        location: "Manchester, UK",
        description:
          "Created and executed social media plan for 10 brands utilizing multiple features and content types to increase brand outreach, engagement, and leads.",
      },
      {
        role: "Growth Marketing Designer",
        company: "GoDaddy",
        employmentType: "Full-Time",
        period: "Jun 2017 - May 2018",
        location: "Manchester, UK",
        description:
          "Developed digital marketing strategies, activation plans, proposals, content and promotions for client initiatives.",
      },
    ],
    educations: [
      {
        school: "Harvard University",
        degree: "Postgraduate Degree, Applied Psychology",
        period: "2011 - 2012",
        description:
          "As an Applied Psychologist in the field of Consumer and Society I am specialised in creating business opportunities by observing, analysing, researching and changing behaviour.",
      },
      {
        school: "University of Toronto",
        degree: "Bachelor of Arts, Visual Communication",
        period: "2006 - 2009",
        description: "",
      },
    ],
    skills: ["Communication", "Analytics", "Facebook Ads", "Content Planning", "Community Manager"],
    portfolios: [
      // Titles from the reference. Image files are NOT in this repo:
      // the reference shows real design screenshots. Until you add
      // those images to public/ and set imageUrl to e.g.
      // "/portfolio-clinically.png", the page shows a gradient
      // placeholder tile with the title below it.
      { title: "Clinically - clinic & health care website", imageUrl: "" },
      { title: "Growthly - SaaS Analytics & Sales Website", imageUrl: "" },
      { title: "Planna - Project Management App", imageUrl: "" },
      { title: "Food App", imageUrl: "" },
    ],
    additionalDetails: {
      email: "jakegyll@email.com",
      phone: "+44 (345) 512 105",
      languages: "English, French",
    },
    socialLinks: [
      { platform: "Instagram", url: "https://instagram.com/jakegyll" },
      { platform: "Twitter", url: "https://twitter.com/jakegyll" },
      { platform: "Website", url: "https://www.jakegyll.com" },
    ],
    createdAt: new Date(),
  });

  console.log(`Seeded profile for userId "${userId}" in database "${dbName}".`);
  console.log("Now open /dashboard/profile -- it should show Jake Gyll's profile from MongoDB.");
  await client.close();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
