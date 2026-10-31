// Place this file at: app/dashboard/applications/page.jsx
// Route: /dashboard/applications
// This page lives inside app/dashboard/layout.jsx, so it already has
// the dashboard sidebar and NO Navbar/Footer -- do not add them here.
// Server component: it reuses lib/dashboard-data.js (the SAME
// `applications` collection the main dashboard reads), so this page
// needs NO new collection, NO new seed file and NO new API route.
// Run scripts/seed-dashboard.js once and this page already has data.
//
// NEXT 16: do NOT use `export const dynamic = "force-dynamic"` -- with
// cacheComponents: true that export is rejected. `await connection()`
// below is the Next 16 replacement, so this page renders at request
// time and never shows a prerendered / cached history.

import { connection } from "next/server";
import { getDashboardData } from "@/lib/dashboard-data";
import ApplicationsHistoryFull from "@/components/dashboard/ApplicationsHistoryFull";

export default async function ApplicationsPage() {
  await connection();
  const data = await getDashboardData();

  return (
    <>
      {!data.connected && (
        <div className="mx-4 mt-8 border border-amber-200 bg-amber-50 px-5 py-4 text-sm leading-6 text-amber-800 sm:mx-6 lg:mx-10">
          <p className="font-bold">MongoDB is not connected yet.</p>
          <p>
            Set <code className="font-mono text-xs">MONGODB_URI</code> in{" "}
            <code className="font-mono text-xs">.env.local</code> and run{" "}
            <code className="font-mono text-xs">node scripts/seed-dashboard.js</code>, then reload.
            The page shows an empty state instead of fake applications until then.
          </p>
        </div>
      )}
      <ApplicationsHistoryFull initialData={data} />
    </>
  );
}
