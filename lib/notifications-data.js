// Place this file at: lib/notifications-data.js
//
// MongoDB collection used by the Dashboard Notifications panel (2.13):
//   notifications: {
//     userId,
//     actorName, actorCompany, actorAvatarUrl,
//     kind: "interview-invitation" | "status-update" | "interview-detail",
//     text,               // e.g. "invited you to interview with Nomad"
//     badge,              // e.g. "New" or "#Shortlisted", or "" for detail cards
//     badgeTone: "indigo" | "green" | "",
//     read: boolean,
//     createdAt: Date,
//     detail: null | {    // only for kind "interview-detail"
//       title, role, date, time, candidateName, candidateEmail }
//   }
//
// HOW DATA GETS HERE:
//   Run scripts/seed-notifications.js once for the 3 reference
//   notifications (Jan Mayer / Nomad, Jane Alicia / Udacity,
//   Ally Wales / Digital Ocean). After that, insert a new document
//   into `notifications` and it appears in the panel automatically,
//   newest first. "Mark all as read" in the panel sets read=true
//   via POST /api/dashboard/notifications.
//   If there is no database, the panel shows an empty state, not
//   fake notifications. If there are no notifications yet, it shows
//   "No notifications yet" -- the reference items are seed data only.
//
// USER ID: same placeholder as the rest of the dashboard
// (DASHBOARD_USER_ID / "demo-jake") until login is connected.

import { cache } from "react";
import { getDb } from "./mongodb";

export function getCurrentUserId() {
  return process.env.DASHBOARD_USER_ID || "demo-jake";
}

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
  const userId = getCurrentUserId();
  const db = await getDb().catch(() => null);

  if (!db) {
    return { connected: false, notifications: [], unreadCount: 0 };
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
