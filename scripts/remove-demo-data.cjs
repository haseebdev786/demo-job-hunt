// Removes only the legacy seeded dashboard identity. Never deletes auth accounts.
const { loadEnvConfig } = require("@next/env");
const { MongoClient } = require("mongodb");

async function main() {
  loadEnvConfig(process.cwd());
  if (!process.env.MONGODB_URI) throw new Error("MONGODB_URI is required.");
  const client = new MongoClient(process.env.MONGODB_URI, { serverSelectionTimeoutMS: 10000 });
  try {
    await client.connect();
    const db = client.db(process.env.MONGODB_DB || "jobhuntly");
    for (const name of ["users", "applications", "interviews", "profiles", "settings", "conversations", "messages", "notifications"]) {
      const result = await db.collection(name).deleteMany({ userId: "demo-jake" });
      console.log(`${name}: removed ${result.deletedCount} seeded records`);
    }
  } finally {
    await client.close();
  }
}

main().catch(() => {
  console.error("Demo cleanup failed. Check database connectivity and environment settings.");
  process.exitCode = 1;
});
