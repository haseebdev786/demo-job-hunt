import { Suspense } from "react";
import { notFound } from "next/navigation";
import JobDescriptionPage from "@/components/JobDescriptionPage";
import { getJobPost, getPublishedJobs } from "@/lib/job-posts";
import Loading from "./loading";
export default function Page({ params }) { return <Suspense fallback={<Loading />}><Content params={params} /></Suspense>; }
async function Content({ params }) { const { slug } = await params; const job = await getJobPost(slug); if (!job) notFound(); return <JobDescriptionPage job={job} jobs={await getPublishedJobs()} />; }
