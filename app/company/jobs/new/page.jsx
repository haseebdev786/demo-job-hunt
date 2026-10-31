// Place this file at: app/company/jobs/new/page.jsx
// Route: /company/jobs/new -- Post A Job (3.15-3.17), inside the
// company layout. Company name from the logged-in session.
// IMPORTANT: Next.js gives this static route priority over the
// dynamic route /company/jobs/[slug], so "new" is NOT treated
// as a job slug here. If you rename this folder, check that
// rule again, or /company/jobs/new will fall through to the
// [slug] page and show Not Found.

import { Suspense } from "react";
import PostJobPage from "@/components/company/PostJobPage";
import { getCompanySessionUser } from "@/lib/company-session-data";
import CompanyLoading from "../../loading";

export default function PostJobPageRoute() {
  return (
    <Suspense fallback={<CompanyLoading />}>
      <PostJobContent />
    </Suspense>
  );
}

async function PostJobContent() {
  const sessionData = await getCompanySessionUser();
  return (
    <PostJobPage
      companyName={sessionData.loggedIn ? sessionData.user.name : "Nomad"}
      companyInitial={sessionData.loggedIn ? sessionData.user.initial : "N"}
    />
  );
}
