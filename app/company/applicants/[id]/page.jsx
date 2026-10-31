// Place this file at: app/company/applicants/[id]/page.jsx
// Route: /company/applicants/[id] -- Applicant Details (3.5-3.8),
// inside the company layout. If the id is not in
// lib/company-applicants-data.js, it shows the Not Found page
// (Next.js notFound()), not a fake applicant.
// Company name for the interview form location comes from the
// logged-in session, fallback Nomad preview when logged out.

import { notFound } from "next/navigation";
import ApplicantDetailsPage from "@/components/company/ApplicantDetailsPage";
import { getCompanyApplicantById } from "@/lib/company-applicants-data";
import { getCompanySessionUser } from "@/lib/company-session-data";

export default async function ApplicantDetailsPageRoute({ params }) {
  const { id } = await params;
  const applicant = getCompanyApplicantById(id);
  if (!applicant) notFound();

  const sessionData = await getCompanySessionUser();

  return (
    <ApplicantDetailsPage
      applicant={applicant}
      companyName={sessionData.loggedIn ? sessionData.user.name : "Nomad"}
    />
  );
}
