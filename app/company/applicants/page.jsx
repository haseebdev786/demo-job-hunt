// Place this file at: app/company/applicants/page.jsx
// Route: /company/applicants -- All Applicants (3.4), inside the
// company layout. Company name from the logged-in session.

import CompanyApplicantsPage from "@/components/company/CompanyApplicantsPage";
import { getCompanySessionUser } from "@/lib/company-session-data";

export default async function CompanyApplicantsPageRoute() {
  const sessionData = await getCompanySessionUser();
  return (
    <CompanyApplicantsPage
      companyName={sessionData.loggedIn ? sessionData.user.name : "Nomad"}
      companyInitial={sessionData.loggedIn ? sessionData.user.initial : "N"}
    />
  );
}
