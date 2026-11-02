import { Suspense } from "react";
import DashboardFindJobs from "@/components/dashboard/DashboardFindJobs";
import { getPublishedJobs } from "@/lib/job-posts";
import Loading from "@/app/loading";
export default function Page() { return <Suspense fallback={<Loading />}><Content /></Suspense>; }
async function Content() { return <DashboardFindJobs jobs={await getPublishedJobs()} />; }
