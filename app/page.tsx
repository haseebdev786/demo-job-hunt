import { Suspense } from "react";
import HomePage from "@/components/HomePage";
import { getPublishedJobs } from "@/lib/job-posts";
import Loading from "./loading";
export default function Page() { return <Suspense fallback={<Loading />}><Content /></Suspense>; }
async function Content() {
  const jobs = await getPublishedJobs();
  return <HomePage jobs={jobs} featuredJobs={jobs.slice(0, 8)} latestJobs={jobs.slice(0, 8)} />;
}
