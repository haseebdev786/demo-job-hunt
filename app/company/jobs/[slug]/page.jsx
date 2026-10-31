// Place this file at: app/company/jobs/[slug]/page.jsx
// Route: /company/jobs/[slug] -- Job Detail (3.10-3.13), inside
// the company layout. If the slug is not in lib/company-jobs-data.js,
// it shows the Not Found page, not a fake job.
// Resolve ?tab=details on the server so the requested tab renders immediately.

import { notFound } from "next/navigation";
import CompanyJobDetailsPage from "@/components/company/CompanyJobDetailsPage";
import { getCompanyJobBySlug } from "@/lib/company-jobs-data";
import { getCompanySessionUser } from "@/lib/company-session-data";

export default async function CompanyJobDetailsPageRoute({ params, searchParams }) {
  const { slug } = await params;
  const job = getCompanyJobBySlug(slug);
  if (!job) notFound();
  const query = await searchParams;
  const initialTab = query.tab === "details" ? "details" : "applicants";

  const sessionData = await getCompanySessionUser();

  return (
    <CompanyJobDetailsPage
      key={`${job.slug}:${initialTab}`}
      initialTab={initialTab}
      job={job}
      companyName={sessionData.loggedIn ? sessionData.user.name : "Nomad"}
    />
  );
}
