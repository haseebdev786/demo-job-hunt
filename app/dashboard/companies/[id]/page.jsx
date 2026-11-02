import { Suspense } from "react";
import { notFound } from "next/navigation";
import PublicCompanyProfile from "@/components/PublicCompanyProfile";
import { getHiringCompanies, getPublishedJobs } from "@/lib/job-posts";
import Loading from "@/app/loading";
export default function Page({ params }) { return <Suspense fallback={<Loading />}><Content params={params} /></Suspense>; }
async function Content({ params }) { const { id } = await params; const companies = await getHiringCompanies(); const company = companies.find((item) => item.slug === id) || companies.find((item) => String(item.id) === id); if (!company) notFound(); const jobs = await getPublishedJobs(); return <PublicCompanyProfile company={company} openJobs={jobs.filter((job) => job.companySlug === company.slug)} dashboard={true} />; }
