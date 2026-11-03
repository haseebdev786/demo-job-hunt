import "server-only";
import { getCurrentUser } from "./session";

export async function getCurrentUserId() {
  const user = await getCurrentUser();
  return user?.id ? String(user.id) : null;
}

export async function getDashboardUser(db, userId) {
  const profile = await db.collection("users").findOne({ userId });
  const user = await getCurrentUser();
  if (!user) return null;
  return { ...profile, name: profile?.name || user.name, email: user.email, avatarUrl: profile?.avatarUrl || user.image || "" };
}
