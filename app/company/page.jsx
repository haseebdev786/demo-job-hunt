// Place this file at: app/company/page.jsx
// (REPLACES the previous version of this file.)
// Route: /company -- Company dashboard overview (3.1).
// Now passes the LOGGED-IN company user's name to the dashboard
// page, so the COMPANY header shows your login name, not Nomad.
// If no one is logged in, it falls back to Nomad / Maria as a
// preview only. Sidebar user comes from app/company/layout.jsx
// (same session), so header, greeting and sidebar all agree.

import CompanyDashboardPage from "@/components/company/CompanyDashboardPage";
import { getCompanySessionUser } from "@/lib/company-session-data";

export default async function CompanyDashboardPageRoute() {
  const sessionData = await getCompanySessionUser();

  if (!sessionData.loggedIn) {
    return <CompanyDashboardPage companyName="Nomad" companyInitial="N" firstName="Maria" />;
  }

  return (
    <CompanyDashboardPage
      companyName={sessionData.user.name}
      companyInitial={sessionData.user.initial}
      firstName={sessionData.user.firstName}
    />
  );
}
