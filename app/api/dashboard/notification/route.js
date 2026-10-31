// Place this file at: app/api/dashboard/notifications/route.js
// GET: returns getNotificationsData() (for debugging).
// POST: { action: "mark-all-read" } sets read=true on every unread
// notification for the current user in MongoDB, and returns the new
// unread count (0). Any other action returns 400.
// USER ID: same placeholder as the rest of the dashboard
// (DASHBOARD_USER_ID / "demo-jake") until login is connected.

import { NextResponse } from "next/server";
import { connection } from "next/server";
import { getDb } from "@/lib/mongodb";
import { getNotificationsData, getCurrentUserId } from "@/lib/notifications-data";

export async function GET() {
  await connection();
  const data = await getNotificationsData();
  return NextResponse.json(data);
}

export async function POST(request) {
  await connection();
  const db = await getDb().catch(() => null);
  if (!db) {
    return NextResponse.json(
      { error: "MongoDB is not connected." },
      { status: 503 }
    );
  }

  const body = await request.json().catch(() => ({}));
  if (body.action !== "mark-all-read") {
    return NextResponse.json({ error: "Unknown action." }, { status: 400 });
  }

  const userId = getCurrentUserId();
  await db
    .collection("notifications")
    .updateMany({ userId, read: false }, { $set: { read: true } });

  return NextResponse.json({ message: "All notifications marked as read.", unreadCount: 0 });
}
