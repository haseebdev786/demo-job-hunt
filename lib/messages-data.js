import { cache } from "react";
import { getDb } from "./mongodb";

import { getCurrentUserId, getDashboardUser } from "./dashboard-user";
export { getCurrentUserId } from "./dashboard-user";

function formatTimeLabel(value) {
  if (!value) return "";
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  const diffMins = Math.round((Date.now() - date.getTime()) / 60000);
  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins} mins ago`;
  const today = new Date();
  const sameDay = date.toDateString() === today.toDateString();
  if (sameDay) {
    return date.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
  }
  return date.toLocaleDateString("en-GB", { day: "numeric", month: "short" });
}

function serializeConversation(doc) {
  return {
    id: String(doc._id),
    name: doc.participantName,
    role: doc.participantRole || "",
    company: doc.participantCompany || "",
    avatarUrl: doc.avatarUrl || "",
    lastMessage: doc.lastMessage || "",
    lastMessageAt: doc.lastMessageAt ? new Date(doc.lastMessageAt).toISOString() : null,
    timeLabel: formatTimeLabel(doc.lastMessageAt),
    unreadCount: doc.unreadCount || 0,
  };
}

function serializeMessage(doc) {
  return {
    id: String(doc._id),
    conversationId: String(doc.conversationId),
    sender: doc.sender, // "them" | "you"
    senderName: doc.senderName || (doc.sender === "you" ? "You" : ""),
    text: doc.text,
    sentAt: doc.sentAt ? new Date(doc.sentAt).toISOString() : null,
    timeLabel: formatTimeLabel(doc.sentAt),
  };
}

// cache() dedupes this per request, so the page + API route calling it
// in the same request only hit MongoDB once.
export const getMessagesData = cache(async () => {
  const userId = await getCurrentUserId();
  const db = await getDb().catch(() => null);

  // No database yet: return an empty, honest state, NOT fake messages.
  if (!db || !userId) {
    return { connected: Boolean(db), user: null, conversations: [] };
  }

  const userDoc = await getDashboardUser(db, userId);
  const conversationDocs = await db
    .collection("conversations")
    .find({ userId })
    .sort({ lastMessageAt: -1 })
    .toArray();

  const conversations = [];
  for (const doc of conversationDocs) {
    const messageDocs = await db
      .collection("messages")
      .find({ userId, conversationId: String(doc._id) })
      .sort({ sentAt: 1 })
      .toArray();
    conversations.push({
      ...serializeConversation(doc),
      messages: messageDocs.map(serializeMessage),
    });
  }

  return {
    connected: true,
    user: userDoc
      ? {
          name: userDoc.name,
          firstName: String(userDoc.name || "").split(" ")[0] || "there",
          email: userDoc.email,
          avatarUrl: userDoc.avatarUrl || "",
        }
      : null,
    conversations,
  };
});
