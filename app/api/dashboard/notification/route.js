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

  const userId = await getCurrentUserId();
  if (!userId) return NextResponse.json({ error: "Please log in." }, { status: 401 });
  await db
    .collection("notifications")
    .updateMany({ userId, read: false }, { $set: { read: true } });

  return NextResponse.json({ message: "All notifications marked as read.", unreadCount: 0 });
}
