// // Place this file at: app/dashboard/settings/page.jsx
// // Server page for Settings (2.9 / 2.10 / 2.11). The tabs are inside
// // SettingsPage.jsx -- this page only loads the data from MongoDB.
// // Next 16.4 with cacheComponents: no `export const dynamic =
// // "force-dynamic"` (that is rejected); `connection()` + `instant =
// // false` is the blocking pattern used by the other dashboard pages,
// // because settings are personal data and must not be prerendered.

// import { connection } from "next/server";
// import { getSettingsData } from "@/lib/settings-data";
// import SettingsPage from "@/components/dashboard/SettingsPage";

// export const instant = false;

// export default async function SettingsPageRoute() {
//   await connection();
//   const data = await getSettingsData();
//   return <SettingsPage initialData={data} />;
// }












// Place this file at: app/dashboard/settings/page.jsx
// Server page for Settings (2.9 / 2.10 / 2.11). The tabs are inside
// SettingsPage.jsx -- this page only loads the data from MongoDB.
// Next 16.4 with cacheComponents: no `export const dynamic =
// "force-dynamic"` (that is rejected); `connection()` + `instant =
// false` is the blocking pattern used by the other dashboard pages,
// because settings are personal data and must not be prerendered.

import { Suspense } from "react";
import { connection } from "next/server";
import { getSettingsData } from "@/lib/settings-data";
import SettingsPage from "@/components/dashboard/SettingsPage";

export const instant = false;

export default async function SettingsPageRoute() {
  await connection();
  const data = await getSettingsData();
  return (
    <Suspense fallback={<div className="px-4 py-8 sm:px-6 lg:px-10">Loading settings...</div>}>
      <SettingsPage initialData={data} />
    </Suspense>
  );
}
