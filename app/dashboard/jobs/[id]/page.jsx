import { Suspense } from "react";
import { notFound } from "next/navigation";
import JobDescriptionPage from "@/components/JobDescriptionPage";
import { getJobPost, getPublishedJobs } from "@/lib/job-posts";
import Loading from "@/app/loading";
export default function Page({ params }) { return <Suspense fallback={<Loading />}><Content params={params} /></Suspense>; }
async function Content({ params }) { const { id } = await params; const job = await getJobPost(id); if (!job) notFound(); return <JobDescriptionPage job={job} jobs={await getPublishedJobs()} dashboard />; }
