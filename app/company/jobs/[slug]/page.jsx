import { Suspense } from "react";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/session";
import { getJobPost } from "@/lib/job-posts";
import { getCompanyJobBySlug } from "@/lib/company-jobs-data";
import CompanyJobDetailsPage from "@/components/company/CompanyJobDetailsPage";
import Loading from "../../loading";
export default function Page({ params, searchParams }) { return <Suspense fallback={<Loading />}><Content params={params} searchParams={searchParams} /></Suspense>; }
async function Content({ params, searchParams }) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  if (user.accountType !== "company") redirect("/dashboard");
  const { slug } = await params;
  const demo = getCompanyJobBySlug(slug);
  if (demo) {
    const query = await searchParams;
    const initialTab = query.tab === "details" ? "details" : "applicants";
    return <CompanyJobDetailsPage key={`${slug}-${initialTab}`} job={demo} companyName={user.name} initialTab={initialTab} />;
  }
  const job = await getJobPost(slug, user.id);
  if (!job) notFound();
  return <div className="space-y-6 px-6 py-8 lg:px-10">
    <Link href="/company/jobs" className="text-indigo-600">&larr; Job Listing</Link>
    <div className="flex flex-wrap items-center justify-between gap-4"><h1 className="text-2xl font-bold">{job.title}</h1><Link href={`/jobs/${job.id}`} className="bg-indigo-600 px-5 py-3 text-white">View public job</Link></div>
    <p className="text-slate-500">{job.location} &middot; {job.type} &middot; {job.status}</p>
    <section className="space-y-5 border border-slate-200 bg-white p-6"><h2 className="text-xl font-bold">Job Details</h2>
      <p>{job.salary}</p><p>Posted {job.datePosted}</p>
      {[['Description', job.description], ['Responsibilities', job.responsibilities], ['Who You Are', job.whoYouAre], ['Nice-To-Haves', job.niceToHaves]].map(([label, text]) => text && <div key={label}><h3 className="font-semibold">{label}</h3><p className="mt-2 whitespace-pre-line text-slate-600">{text}</p></div>)}
      <p>Skills: {job.skills.join(', ')}</p>
    </section>
    <section className="border border-slate-200 bg-white p-6"><h2 className="font-bold">Applicants ({job.applicants})</h2><p className="mt-3 text-slate-500">No applications received for this job yet.</p></section>
  </div>;
}
