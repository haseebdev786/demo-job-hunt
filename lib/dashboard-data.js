// Place this file at: lib/dashboard-data.js
//
// MongoDB collections used by the dashboard:
//   users:        { userId, name, email, avatarUrl }
//   applications: { userId, jobTitle, company, location, jobType,
//                   dateApplied (Date), status }
//                   status is one of: "In Review" | "Shortlisted" |
//                   "Declined" | "Interviewed"
//   interviews:   { userId, date (Date), time, interviewerName,
//                   role, company, avatarUrl, highlighted (boolean) }
//
// HOW REAL DATA GETS HERE:
//   1. When a user submits the job application form, save one document
//      into `applications` with that user's userId, status "In Review"
//      and dateApplied = new Date(). (That submit is still demo --
//      connect it to POST /api/applications next.)
//   2. When an interview is scheduled, save one document into `interviews`.
//   3. This function reads those collections and computes every number
//      on the dashboard. No number is hardcoded in the UI.
//
// USER ID: after login/auth, replace getCurrentUserId() with the logged-in
// user's id from your session. Until then it reads DASHBOARD_USER_ID
// from .env.local, or "demo-jake" (the id used by scripts/seed-dashboard.js).

import { cache } from "react";
import { getDb } from "./mongodb";

function getCurrentUserId() {
  return process.env.DASHBOARD_USER_ID || "demo-jake";
}

function formatDate(value) {
  if (!value) return "";
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function serializeApplication(doc) {
  return {
    id: String(doc._id),
    title: doc.jobTitle,
    company: doc.company,
    location: doc.location,
    type: doc.jobType,
    dateApplied: formatDate(doc.dateApplied),
    // Keep the raw date for sorting on the client if needed.
    dateAppliedRaw: doc.dateApplied ? new Date(doc.dateApplied).toISOString() : null,
    status: doc.status,
  };
}

function serializeInterview(doc) {
  return {
    id: String(doc._id),
    time: doc.time,
    name: doc.interviewerName,
    role: doc.role,
    company: doc.company,
    avatarUrl: doc.avatarUrl || "",
    highlighted: Boolean(doc.highlighted),
    dateLabel: formatDate(doc.date),
  };
}

// cache() dedupes this per request, so layout + page calling it
// only hit MongoDB once.
export const getDashboardData = cache(async () => {
  const userId = getCurrentUserId();
  const db = await getDb().catch(() => null);

  // No database yet: return an empty, honest state, NOT fake numbers.
  // The page shows a "MongoDB not connected" notice in this case.
  if (!db) {
    return {
      connected: false,
      user: null,
      stats: { totalApplied: 0, interviewed: 0, interviewedPercent: 0, unsuitablePercent: 0 },
      interviews: [],
      applications: [],
      recentApplications: [],
      interviewsDateLabel: "Today",
    };
  }

  const userDoc = await db.collection("users").findOne({ userId });
  const applicationDocs = await db
    .collection("applications")
    .find({ userId })
    .sort({ dateApplied: -1 })
    .toArray();
  const interviewDocs = await db
    .collection("interviews")
    .find({ userId })
    .sort({ date: 1, time: 1 })
    .toArray();

  const applications = applicationDocs.map(serializeApplication);
  const interviews = interviewDocs.map(serializeInterview);

  const totalApplied = applications.length;
  const interviewed = applicationDocs.filter((doc) => doc.status === "Interviewed").length;
  // Screenshot donut has exactly 2 slices: Interviewed vs the rest,
  // labelled "Unsuitable". 18 / 45 = 40% interviewed, 60% unsuitable.
  const interviewedPercent = totalApplied ? Math.round((interviewed / totalApplied) * 100) : 0;
  const unsuitablePercent = totalApplied ? 100 - interviewedPercent : 0;

  // Interviews all share one day in the seed data; show that day.
  // Format: "Today, 26 November" (year is omitted, like the reference).
  let interviewsDateLabel = "Today";
  if (interviews[0]?.dateLabel) {
    const parts = interviews[0].dateLabel.split(" ");
    if (parts.length >= 2) interviewsDateLabel = `Today, ${parts[0]} ${parts[1]}`;
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
    stats: { totalApplied, interviewed, interviewedPercent, unsuitablePercent },
    interviews,
    applications,
    recentApplications: applications.slice(0, 3),
    interviewsDateLabel,
  };
});
