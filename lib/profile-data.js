// Place this file at: lib/profile-data.js
//
// MongoDB collections used by the Profile page (2.8 Dashboard - Profile):
//   users:    { userId, name, email, avatarUrl }  (same as dashboard)
//   profiles: { userId, title, about, openForOpportunities (boolean),
//               experiences: [{ role, company, employmentType,
//                               period, description }],
//               educations:  [{ school, degree, period, description }],
//               skills: [string],
//               portfolios: [{ title, imageUrl }],
//               additionalDetails: { email, phone, location },
//               socialLinks: [{ platform, url }] }
//
// HOW REAL DATA GETS HERE:
//   Run scripts/seed-profile.js once for demo data, then edit the
//   `profiles` document for your user in MongoDB to change any section
//   -- the page reads only from MongoDB, nothing is hardcoded in the UI.
//   If there is no profiles document yet, the page still shows the
//   user from `users` and empty sections, NOT fake profile data.
//   If there is no database at all, it shows an empty state + notice.
//
// USER ID: same placeholder as the dashboard. After login/auth, replace
// getCurrentUserId() with the logged-in user's id from your session.
// Until then it reads DASHBOARD_USER_ID from .env.local, or "demo-jake"
// (the id used by scripts/seed-profile.js and seed-dashboard.js).

import { cache } from "react";
import { getDb } from "./mongodb";

export function getCurrentUserId() {
  return process.env.DASHBOARD_USER_ID || "demo-jake";
}

export const getProfileData = cache(async () => {
  const userId = getCurrentUserId();
  const db = await getDb().catch(() => null);

  if (!db) {
    return {
      connected: false,
      user: null,
      profile: null,
      experiences: [],
      educations: [],
      skills: [],
      portfolios: [],
      additionalDetails: {},
      socialLinks: [],
    };
  }

  const userDoc = await db.collection("users").findOne({ userId });
  const profileDoc = await db.collection("profiles").findOne({ userId });

  const user = userDoc
    ? {
        name: userDoc.name,
        firstName: String(userDoc.name || "").split(" ")[0] || "there",
        email: userDoc.email,
        avatarUrl: userDoc.avatarUrl || "",
      }
    : null;

  return {
    connected: true,
    user,
    profile: profileDoc
      ? {
          title: profileDoc.title || "",
          about: profileDoc.about || "",
          location: profileDoc.location || "",
          openForOpportunities: Boolean(profileDoc.openForOpportunities),
        }
      : null,
    experiences: profileDoc?.experiences || [],
    educations: profileDoc?.educations || [],
    skills: profileDoc?.skills || [],
    portfolios: profileDoc?.portfolios || [],
    additionalDetails: profileDoc?.additionalDetails || {},
    socialLinks: profileDoc?.socialLinks || [],
  };
});
