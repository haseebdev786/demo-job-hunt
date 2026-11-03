import { cache } from "react";
import { getDb } from "./mongodb";

import { getCurrentUserId, getDashboardUser } from "./dashboard-user";
export { getCurrentUserId } from "./dashboard-user";

export const getSettingsData = cache(async () => {
  const userId = await getCurrentUserId();
  const db = await getDb().catch(() => null);

  if (!db || !userId) {
    return {
      connected: Boolean(db),
      user: null,
      personal: null,
      login: null,
      notifications: null,
    };
  }

  const userDoc = await getDashboardUser(db, userId);
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

