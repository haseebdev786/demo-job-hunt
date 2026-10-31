// Place this file at: lib/mongodb.js
// Run first: npm install mongodb
// Env (in .env.local, never commit it):
//   MONGODB_URI=mongodb+srv://<user>:<password>@<cluster>/...
//   MONGODB_DB=jobhunt
//
// This is the ONLY place that talks to MongoDB. The dashboard UI never
// hardcodes stats -- it only renders what this layer returns. Later, if
// you switch to Mongoose or to your Express/MERN backend API, replace
// only this file (and lib/dashboard-data.js), not the UI components.

import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB || "jobhunt";

let cachedClient = null;
let cachedDb = null;

// In Next.js dev mode the module can reload, so cache on globalThis
// to avoid opening a new MongoDB connection on every reload.
export async function getDb() {
  if (!uri) return null;
  if (cachedDb) return cachedDb;
  if (globalThis._mongoClientPromise) {
    const client = await globalThis._mongoClientPromise;
    cachedClient = client;
    cachedDb = client.db(dbName);
    return cachedDb;
  }
  const client = new MongoClient(uri);
  globalThis._mongoClientPromise = client.connect();
  cachedClient = await globalThis._mongoClientPromise;
  cachedDb = cachedClient.db(dbName);
  return cachedDb;
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
