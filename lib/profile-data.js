import { cache } from "react";
import { getDb } from "./mongodb";

import { getCurrentUserId, getDashboardUser } from "./dashboard-user";
export { getCurrentUserId } from "./dashboard-user";

export const getProfileData = cache(async () => {
  const userId = await getCurrentUserId();
  const db = await getDb().catch(() => null);

  if (!db || !userId) {
    return {
      connected: Boolean(db),
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

  const userDoc = await getDashboardUser(db, userId);
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
