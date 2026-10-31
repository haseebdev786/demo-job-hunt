// Place this file at: app/company/messages/page.jsx
// Route: /company/messages -- Company Messages (3.2), inside the
// company layout (company sidebar). Company name comes from the
// logged-in session (lib/company-session-data.js), NOT hardcoded
// Nomad -- if no one is logged in, it falls back to Nomad preview.

import CompanyMessagesPage from "@/components/company/CompanyMessagesPage";
import { getCompanySessionUser } from "@/lib/company-session-data";

export default async function CompanyMessagesPageRoute() {
  const sessionData = await getCompanySessionUser();
  return (
    <CompanyMessagesPage
      companyName={sessionData.loggedIn ? sessionData.user.name : "Nomad"}
      companyInitial={sessionData.loggedIn ? sessionData.user.initial : "N"}
    />
  );
}
