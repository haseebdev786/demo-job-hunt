import "server-only";
import { headers } from "next/headers";
import { auth } from "./auth";
import { getDb } from "./db";

// Use this in future application/job APIs; never accept a userId from the browser.
export async function getCurrentUser() {
  await getDb();
  const session = await auth.api.getSession({ headers: await headers() });
  return session?.user ?? null;
}
