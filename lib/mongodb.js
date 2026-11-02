import "server-only";

// Dashboard and authentication share one connection pool and database.
// lib/db resets failed connections so a temporary outage can recover.
export async function getDb() {
  if (!process.env.MONGODB_URI) return null;
  const { getDb: getSharedDb } = await import("./db");
  return getSharedDb();
}

export async function isDbConnected() {
  try {
    const db = await getDb();
    if (!db) return false;
    await db.command({ ping: 1 });
    return true;
  } catch {
    return false;
  }
}
