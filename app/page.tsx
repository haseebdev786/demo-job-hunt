import { Suspense } from "react";
import HomePage from "@/components/HomePage";
import { getPublishedJobs } from "@/lib/job-posts";
import { featuredDemoIds, latestDemoIds } from "@/lib/demo-catalog";
import Loading from "./loading";
export default function Page() { return <Suspense fallback={<Loading />}><Content /></Suspense>; }
async function Content() {
  const jobs = await getPublishedJobs();
  const published = jobs.filter((job) => !job.demo);
  const select = (ids: string[]) => [...published, ...ids.map((id) => jobs.find((job) => job.id === id)).filter(Boolean)];
  return <HomePage jobs={jobs} featuredJobs={select(featuredDemoIds)} latestJobs={select(latestDemoIds)} />;
}
