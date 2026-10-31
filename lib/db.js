import "server-only";
import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB || "jobhuntly";
if (!uri) throw new Error("Set MONGODB_URI in the server environment.");

// Keep one client and one pending connection across development reloads.
const cached = globalThis.__jobhuntlyAuthMongoV2 ??= {
  client: new MongoClient(uri, {
    maxPoolSize: 10,
    connectTimeoutMS: 8000,
    serverSelectionTimeoutMS: 10000,
    timeoutMS: 15000,
  }),
  connection: null,
  initialization: null,
};

export const mongoClient = cached.client;
export const db = mongoClient.db(dbName);

export async function getDb() {
  if (!cached.connection) {
    cached.connection = mongoClient.connect().catch((error) => {
      cached.connection = null;
      throw error;
    });
  }
  await cached.connection;

  if (!cached.initialization) {
    cached.initialization = (async () => {
      await Promise.all([
        db.collection("user").createIndex({ email: 1 }, { unique: true }),
        db.collection("session").createIndex({ token: 1 }, { unique: true }),
        db.collection("session").createIndex({ expiresAt: 1 }, { expireAfterSeconds: 0 }),
        db.collection("session").createIndex({ userId: 1 }),
        db.collection("account").createIndex({ providerId: 1, accountId: 1 }, { unique: true }),
        db.collection("account").createIndex({ userId: 1 }),
        db.collection("rateLimit").createIndex({ key: 1 }, { unique: true }),
      ]);
      // Replace the old index only after the correct unique index exists.
      // Better Auth stores accountId; providerAccountId is not its field.
      const indexes = await db.collection("account").indexes();
      for (const index of indexes) {
        if (Object.keys(index.key).length === 2 && index.key.providerId === 1 && index.key.providerAccountId === 1) {
          await db.collection("account").dropIndex(index.name);
        }
      }
    })().catch((error) => {
      cached.initialization = null;
      cached.connection = null;
      throw error;
    });
  }
  await cached.initialization;
  return db;
}
