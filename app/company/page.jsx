import { Suspense } from "react";
import { redirect } from "next/navigation";
import CompanyDashboardPage from "@/components/company/CompanyDashboardPage";
import { getCurrentUser } from "@/lib/session";
import { getCompanyJobs } from "@/lib/job-posts";
import Loading from "./loading";
export default function Page() { return <Suspense fallback={<Loading />}><Content /></Suspense>; }
async function Content() { const user = await getCurrentUser(); if (!user) redirect("/login"); if (user.accountType !== "company") redirect("/dashboard"); return <CompanyDashboardPage companyName={user.name} companyInitial={user.name.charAt(0)} firstName={user.name.split(" ")[0]} jobs={await getCompanyJobs(user.id)} />; }
