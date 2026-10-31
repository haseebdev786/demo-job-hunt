// Place this file at: lib/logins-data.js
//
// Data for My Logins History (/dashboard/logins), linked from the
// navbar account dropdown. This is NOT the dashboard's demo data
// (demo-jake in the jobhunt database). It reads the REAL Better Auth
// session for the currently logged-in user, from the auth database
// (lib/db.js, jobhuntly), and lists that user's sessions from the
// `session` collection, newest first.
//
// A session row has (when Better Auth recorded them):
//   userId, token, createdAt, expiresAt, ipAddress, userAgent
// ipAddress / userAgent may be empty for older sessions or for
// sessions created without those headers -- the page shows
// "Unknown IP" / "Unknown device" then, it does not invent them.
// The current session (matching the session token in the cookie)
// is marked "Current".
//
// If there is no logged-in session, the page shows a login prompt,
// not a fake history. If the auth database is not connected, it
// shows an empty state + notice.

import { headers } from "next/headers";
import { auth } from "./auth";
import { getDb } from "./db";

function deviceFromUserAgent(userAgent) {
  if (!userAgent) return "Unknown device";
  if (/mobile|android|iphone|ipad/i.test(userAgent)) return "Mobile device";
  if (/edg/i.test(userAgent)) return "Microsoft Edge";
  if (/chrome/i.test(userAgent)) return "Chrome";
  if (/firefox/i.test(userAgent)) return "Firefox";
  if (/safari/i.test(userAgent)) return "Safari";
  return "Unknown device";
}

function formatDateTime(date) {
  if (!date) return "";
  return new Date(date).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export async function getLoginsData() {
  let session = null;
  try {
    session = await auth.api.getSession({ headers: await headers() });
  } catch {
    session = null;
  }

  if (!session?.user) {
    return { loggedIn: false, user: null, sessions: [], connected: true };
  }

  const db = await getDb().catch(() => null);
  if (!db) {
    return { loggedIn: true, user: session.user, sessions: [], connected: false };
  }

  const docs = await db
    .collection("session")
    .find({ userId: session.user.id })
    .sort({ createdAt: -1 })
    .limit(50)
    .toArray();

  const currentToken = session.session?.token;
  const sessions = docs.map((doc) => ({
    id: String(doc._id),
    device: deviceFromUserAgent(doc.userAgent),
    userAgent: doc.userAgent || "",
    ipAddress: doc.ipAddress || "",
    createdAtLabel: formatDateTime(doc.createdAt),
    expiresAtLabel: formatDateTime(doc.expiresAt),
    isCurrent: Boolean(currentToken && doc.token === currentToken),
    isExpired: doc.expiresAt ? new Date(doc.expiresAt) < new Date() : false,
  }));

  return { loggedIn: true, user: session.user, sessions, connected: true };
}
