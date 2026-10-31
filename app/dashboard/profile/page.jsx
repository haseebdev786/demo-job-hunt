// Place this file at: app/dashboard/profile/page.jsx
// Route: /dashboard/profile
// This page lives inside app/dashboard/layout.jsx, so it already has
// the dashboard sidebar and NO Navbar/Footer -- do not add them here.
// The sidebar's "My Public Profile" link already points here, so no
// sidebar change is needed for this page.
// Server component: it reads the profile from MongoDB
// (lib/profile-data.js) and passes it to the client component.
//
// NEXT 16: do NOT use `export const dynamic = "force-dynamic"` -- with
// cacheComponents: true that export is rejected. `await connection()`
// plus `export const instant = false` below are the Next 16 replacements
// (same as the other dashboard pages), so this page renders at request
// time and is intentionally a blocking route.

import { connection } from "next/server";
import { getProfileData } from "@/lib/profile-data";
import ProfilePage from "@/components/dashboard/ProfilePage";

export const instant = false;

export default async function DashboardProfilePage() {
  await connection();
  const data = await getProfileData();
  return <ProfilePage initialData={data} />;
}
