// Place this file at: app/company/profile/page.jsx
// Route: /company/profile -- Company Profile (3.3), inside the
// company layout. Company name comes from the logged-in session,
// NOT hardcoded Nomad -- fallback Nomad preview only when logged out.

import { Suspense } from "react";
import { redirect } from "next/navigation";
import CompanyProfilePage from "@/components/company/CompanyProfilePage";
import { getCurrentUser } from "@/lib/session";
import { getCompanyJobs } from "@/lib/job-posts";
import Loading from "../loading";

export default function CompanyProfilePageRoute() {
  return <Suspense fallback={<Loading />}><Content /></Suspense>;
}

async function Content() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  if (user.accountType !== "company") redirect("/dashboard");
  const jobs = await getCompanyJobs(user.id);
  return (
    <CompanyProfilePage
      companyName={user.name}
      companyInitial={user.name.charAt(0)}
      jobs={jobs}
      publicHref={jobs.length ? `/companies/${user.id}` : "/companies"}
    />
  );
}
