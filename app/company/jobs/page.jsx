import { Suspense } from "react";
import { redirect } from "next/navigation";
import CompanyJobListingPage from "@/components/company/CompanyJobListingPage";
import { getCurrentUser } from "@/lib/session";
import { getCompanyJobs } from "@/lib/job-posts";
import { companyJobs as demoJobs } from "@/lib/company-jobs-data";
import Loading from "../loading";
export default function Page() { return <Suspense fallback={<Loading />}><Content /></Suspense>; }
async function Content() { const user = await getCurrentUser(); if (!user) redirect("/login"); if (user.accountType !== "company") redirect("/dashboard"); return <CompanyJobListingPage companyName={user.name} companyInitial={user.name.charAt(0)} companyJobs={[...await getCompanyJobs(user.id), ...demoJobs]} />; }
