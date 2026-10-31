// Place this file at: app/dashboard/jobs/page.jsx
// Route: /dashboard/jobs
// This is the DASHBOARD version of Find Jobs (screenshot 2.4). It lives
// inside app/dashboard/layout.jsx, so it keeps the dashboard sidebar
// and has NO Navbar/Footer -- do not add them here.
// The public page at /jobs is a different route and is left untouched.
//
// This page itself needs no MongoDB: the jobs come from @/lib/jobs
// (imported by components/dashboard/DashboardFindJobs.jsx). The layout
// already declares `export const instant = false` and runs at request
// time, so this page needs no connection() and no dynamic export.

import DashboardFindJobs from "@/components/dashboard/DashboardFindJobs";

export default function DashboardJobsPage() {
  return <DashboardFindJobs />;
}
