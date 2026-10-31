// Place this file at: app/dashboard/companies/page.jsx
// Route: /dashboard/companies
// This is the DASHBOARD version of Browse Companies (screenshot 2.7).
// It lives inside app/dashboard/layout.jsx, so it keeps the dashboard
// sidebar and has NO Navbar/Footer -- do not add them here.
// The public page at /companies is a different route and is left
// untouched. Companies come from @/lib/companies; this page itself
// needs no MongoDB, and the layout already declares instant = false,
// so this page needs no connection() and no dynamic export.

import DashboardBrowseCompanies from "@/components/dashboard/DashboardBrowseCompanies";

export default function DashboardCompaniesPage() {
  return <DashboardBrowseCompanies />;
}
