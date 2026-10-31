// Place this file at: app/company/settings/page.jsx
// Route: /company/settings -- Company Settings (3.18-3.20),
// inside the company layout. Company name from the logged-in
// session, NOT hardcoded Nomad -- fallback Nomad preview only
// when logged out.

import { Suspense } from "react";
import CompanySettingsPage from "@/components/company/CompanySettingsPage";
import { getCompanySessionUser } from "@/lib/company-session-data";
import CompanyLoading from "../loading";

export default function CompanySettingsPageRoute() {
  return (
    <Suspense fallback={<CompanyLoading />}>
      <SettingsContent />
    </Suspense>
  );
}

async function SettingsContent() {
  const sessionData = await getCompanySessionUser();
  return (
    <CompanySettingsPage
      companyName={sessionData.loggedIn ? sessionData.user.name : "Nomad"}
      companyInitial={sessionData.loggedIn ? sessionData.user.initial : "N"}
    />
  );
}
