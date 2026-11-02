import { Suspense } from "react";
import DashboardBrowseCompanies from "@/components/dashboard/DashboardBrowseCompanies";
import { getHiringCompanies } from "@/lib/job-posts";
import Loading from "@/app/loading";
export default function Page() { return <Suspense fallback={<Loading />}><Content /></Suspense>; }
async function Content() { return <DashboardBrowseCompanies companies={await getHiringCompanies()} />; }
