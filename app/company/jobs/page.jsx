// Place this file at: app/company/jobs/page.jsx
// Route: /company/jobs -- Job Listing (3.9), inside the company
// layout. Company name from the logged-in session.

import CompanyJobListingPage from "@/components/company/CompanyJobListingPage";
import { getCompanySessionUser } from "@/lib/company-session-data";

export default async function CompanyJobListingPageRoute() {
  const sessionData = await getCompanySessionUser();
  return (
    <CompanyJobListingPage
      companyName={sessionData.loggedIn ? sessionData.user.name : "Nomad"}
      companyInitial={sessionData.loggedIn ? sessionData.user.initial : "N"}
    />
  );
}
