// Place this file at: app/api/dashboard/messages/route.js
// GET  /api/dashboard/messages -> the same data the Messages page renders.
// POST /api/dashboard/messages -> save a reply. Body:
//   { "conversationId": "<conversation id>", "text": "Hello..." }
// It inserts one document into `messages` (sender "you") and updates
// that conversation's lastMessage / lastMessageAt, so the list and the
// chat both update from MongoDB on the next load.
//
// NEXT 16: no `export const dynamic = "force-dynamic"` here either --
// `await connection()` is the replacement (see the Messages page).

import { NextResponse, connection } from "next/server";
import { getMessagesData, getCurrentUserId } from "@/lib/messages-data";
import { getDb } from "@/lib/mongodb";

export async function GET() {
  await connection();
  const data = await getMessagesData();
  return NextResponse.json(data);
}

export async function POST(request) {
  await connection();
  const body = await request.json().catch(() => ({}));
  const conversationId = String(body.conversationId || "").trim();
  const text = String(body.text || "").trim();

  if (!conversationId || !text) {
    return NextResponse.json(
      { error: "conversationId and text are required." },
      { status: 400 }
    );
  }

  const db = await getDb().catch(() => null);
  if (!db) {
    return NextResponse.json(
      { error: "MongoDB is not connected." },
      { status: 503 }
    );
  }

  const userId = getCurrentUserId();
  // Conversation ids are stored as strings in `messages`, but the
  // conversation document itself uses an ObjectId. Match by string
  // comparison so a plain string id still works.
  const conversationDoc = await db
    .collection("conversations")
    .find({ userId })
    .toArray()
    .then((docs) => docs.find((d) => String(d._id) === conversationId));

  if (!conversationDoc) {
    return NextResponse.json(
      { error: "Conversation not found for this user." },
      { status: 404 }
    );
  }

  const userDoc = await db.collection("users").findOne({ userId });
  const sentAt = new Date();
  const messageDoc = {
    userId,
    conversationId: String(conversationDoc._id),
    sender: "you",
    senderName: "You",
    text,
    sentAt,
    createdAt: sentAt,
  };
  const result = await db.collection("messages").insertOne(messageDoc);

  await db.collection("conversations").updateOne(
    { _id: conversationDoc._id },
    { $set: { lastMessage: text, lastMessageAt: sentAt } }
  );

  return NextResponse.json(
    {
      message: {
        id: String(result.insertedId),
        conversationId: String(conversationDoc._id),
        sender: "you",
        senderName: "You",
        text,
        sentAt: sentAt.toISOString(),
        timeLabel: "Just now",
      },
      userName: userDoc?.name || null,
    },
    { status: 201 }
  );
}
