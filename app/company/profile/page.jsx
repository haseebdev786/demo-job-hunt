// Place this file at: app/company/profile/page.jsx
// Route: /company/profile -- Company Profile (3.3), inside the
// company layout. Company name comes from the logged-in session,
// NOT hardcoded Nomad -- fallback Nomad preview only when logged out.

import CompanyProfilePage from "@/components/company/CompanyProfilePage";
import { getCompanySessionUser } from "@/lib/company-session-data";

export default async function CompanyProfilePageRoute() {
  const sessionData = await getCompanySessionUser();
  return (
    <CompanyProfilePage
      companyName={sessionData.loggedIn ? sessionData.user.name : "Nomad"}
      companyInitial={sessionData.loggedIn ? sessionData.user.initial : "N"}
    />
  );
}
