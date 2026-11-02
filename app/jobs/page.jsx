import { Suspense } from "react";
import FindJobsPage from "@/components/FindJobsPage";
import { getPublishedJobs } from "@/lib/job-posts";
import Loading from "../loading";
export default function Page({ searchParams }) { return <Suspense fallback={<Loading />}><Content searchParams={searchParams} /></Suspense>; }
async function Content({ searchParams }) { const query = await searchParams; return <FindJobsPage key={JSON.stringify(query)} jobs={await getPublishedJobs()} query={query} />; }
