import { cache } from "react";
import { getDb } from "./mongodb";

import { getCurrentUserId } from "./dashboard-user";
export { getCurrentUserId } from "./dashboard-user";

function relativeTime(date) {
  if (!date) return "";
  const diffMs = Date.now() - new Date(date).getTime();
  const minutes = Math.floor(diffMs / 60000);
  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes} mins ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hours ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days} days ago`;
  return new Date(date).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function formattedDateTime(date) {
  if (!date) return "";
  const d = new Date(date);
  const day = String(d.getDate()).padStart(2, "0");
  const month = d.toLocaleDateString("en-GB", { month: "long" });
  const year = d.getFullYear();
  let hours = d.getHours();
  const minutes = String(d.getMinutes()).padStart(2, "0");
  const ampm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12 || 12;
  return `${day} ${month} ${year} - ${hours}:${minutes} ${ampm}`;
}

export const getNotificationsData = cache(async () => {
  const userId = await getCurrentUserId();
  const db = await getDb().catch(() => null);

  if (!db || !userId) {
    return { connected: Boolean(db), notifications: [], unreadCount: 0 };
  }

  const docs = await db
    .collection("notifications")
    .find({ userId })
    .sort({ createdAt: -1 })
    .toArray();

  const notifications = docs.map((doc) => ({
    id: String(doc._id),
    actorName: doc.actorName || "",
    actorCompany: doc.actorCompany || "",
    actorAvatarUrl: doc.actorAvatarUrl || "",
    kind: doc.kind || "status-update",
    text: doc.text || "",
    badge: doc.badge || "",
    badgeTone: doc.badgeTone || "",
    read: Boolean(doc.read),
    relativeTime: relativeTime(doc.createdAt),
    sentAtLabel: formattedDateTime(doc.createdAt),
    detail: doc.detail || null,
  }));

  return {
    connected: true,
    notifications,
    unreadCount: notifications.filter((n) => !n.read).length,
  };
});
