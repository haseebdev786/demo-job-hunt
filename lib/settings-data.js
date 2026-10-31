// Place this file at: lib/settings-data.js
//
// MongoDB collections used by the Settings pages (2.9, 2.10, 2.11):
//   users:    { userId, name, email, avatarUrl }  (same as dashboard/profile)
//   profiles: { userId, title, about, location, openForOpportunities,
//               additionalDetails: { email, phone, languages },
//               socialLinks, skills, ... }  (same as profile)
//   settings: { userId, dateOfBirth (YYYY-MM-DD string), gender,
//               accountType ("jobSeeker" | "employer"),
//               emailVerified (boolean),
//               notifications: { applications, jobs, recommendations } }
//
// HOW DATA GETS HERE:
//   The page reads ONLY from MongoDB -- nothing is hardcoded in the UI.
//   Run scripts/seed-settings.js once for the reference demo values
//   (Date of Birth 1997-08-05, Gender Male, Account Type Job Seeker,
//   Email verified, Notifications: Applications ON, Jobs OFF,
//   Recommendations OFF). After that, the Save / Update buttons in
//   the UI write back to these same collections via
//   app/api/dashboard/settings/route.js, so a saved change appears
//   here on the next load.
//   If there is no settings document yet, the page shows empty
//   Date of Birth / Gender and the reference notification defaults
//   (Applications ON) as UNsaved form defaults -- it does NOT claim
//   they are saved until seed-settings.js runs or the user saves.
//   If there is no database at all, it shows an empty state + notice.
//
// USER ID: same placeholder as the rest of the dashboard. After
// login/auth, replace getCurrentUserId() with the logged-in user's
// id from your session. Until then it reads DASHBOARD_USER_ID from
// .env.local / .env, or "demo-jake".

import { cache } from "react";
import { getDb } from "./mongodb";

export function getCurrentUserId() {
  return process.env.DASHBOARD_USER_ID || "demo-jake";
}

export const getSettingsData = cache(async () => {
  const userId = getCurrentUserId();
  const db = await getDb().catch(() => null);

  if (!db) {
    return {
      connected: false,
      user: null,
      personal: null,
      login: null,
      notifications: null,
    };
  }

  const userDoc = await db.collection("users").findOne({ userId });
  const profileDoc = await db.collection("profiles").findOne({ userId });
  const settingsDoc = await db.collection("settings").findOne({ userId });

  const additional = profileDoc?.additionalDetails || {};

  return {
    connected: true,
    user: userDoc
      ? {
          name: userDoc.name,
          email: userDoc.email,
          avatarUrl: userDoc.avatarUrl || "",
        }
      : null,
    personal: {
      fullName: userDoc?.name || "",
      phone: additional.phone || "",
      email: userDoc?.email || additional.email || "",
      dateOfBirth: settingsDoc?.dateOfBirth || "",
      gender: settingsDoc?.gender || "",
      accountType: settingsDoc?.accountType || "jobSeeker",
    },
    login: {
      email: userDoc?.email || "",
      emailVerified: Boolean(settingsDoc?.emailVerified),
    },
    notifications: {
      // Reference defaults (2.11) as form defaults when no settings
      // document exists yet. They become saved values once
      // seed-settings.js runs or the user clicks Update.
      applications: settingsDoc?.notifications?.applications ?? true,
      jobs: settingsDoc?.notifications?.jobs ?? false,
      recommendations: settingsDoc?.notifications?.recommendations ?? false,
    },
  };
});

