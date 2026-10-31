// Place this file at: app/company/schedule/page.jsx
// Route: /company/schedule -- My Schedule (3.14), inside the
// company layout. Company name from the logged-in session.

import { Suspense } from "react";
import CompanySchedulePage from "@/components/company/CompanySchedulePage";
import { getCompanySessionUser } from "@/lib/company-session-data";
import CompanyLoading from "../loading";

export default function CompanySchedulePageRoute() {
  return (
    <Suspense fallback={<CompanyLoading />}>
      <ScheduleContent />
    </Suspense>
  );
}

async function ScheduleContent() {
  const sessionData = await getCompanySessionUser();
  return (
    <CompanySchedulePage
      companyName={sessionData.loggedIn ? sessionData.user.name : "Nomad"}
      companyInitial={sessionData.loggedIn ? sessionData.user.initial : "N"}
    />
  );
}
