"use client";

// Place this file at: app/dashboard/companies/[id]/page.jsx
// Route: /dashboard/companies/16 (Stripe), /dashboard/companies/1 (Nomad), ...
// This is the DASHBOARD company detail page -- the "details" for each
// company the user asked to show inside the dashboard, not on the
// public site. It lives inside app/dashboard/layout.jsx, so it keeps
// the dashboard sidebar and has NO Navbar/Footer.
//
// DATA: the company itself comes from @/lib/companies (same 21
// companies as the list). "Jobs at this company" are the REAL jobs
// from @/lib/jobs whose company name matches -- for example Nomad,
// Dropbox, Revolut and Canva have jobs in lib/jobs.js, so they show
// a list; Stripe, Truebill, Coinbase, Robinhood and Kraken have NO
// jobs in lib/jobs.js, so they honestly show "no jobs listed yet"
// instead of invented jobs. The "X Jobs" pill on the list card is the
// dataset's count from lib/companies.js, which is a different number
// -- see the note on the detail page itself.

import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft, MapPin, Users, Briefcase, Building2 } from "lucide-react";
import { getCompanyById } from "@/lib/companies";
import { jobs } from "@/lib/jobs";

function CompanyLogo({ company, large }) {
  const Icon = company.icon;
  const size = large ? "h-16 w-16 text-3xl" : "h-12 w-12 text-2xl";
  if (!Icon) {
    return (
      <span className={`flex shrink-0 items-center justify-center rounded-lg bg-slate-50 font-black text-indigo-600 ${size}`}>
        {(company.name || "?").charAt(0)}
      </span>
    );
  }
  return (
    <div className={`flex shrink-0 items-center justify-center rounded-lg ${size} ${company.iconBg || "bg-transparent"}`}>
      {typeof Icon === "string" ? (
        <span className={`font-black text-3xl ${company.iconColor}`}>{Icon}</span>
      ) : (
        <Icon aria-label={`${company.name} logo`} className={`text-4xl ${company.iconColor}`} />
      )}
    </div>
  );
}

export default function DashboardCompanyDetailPage() {
  const params = useParams();
  const company = getCompanyById(params?.id);

  if (!company) {
    return (
      <div className="px-4 py-20 text-center sm:px-6 lg:px-10">
        <h1 className="text-3xl font-bold text-slate-800">Company not found</h1>
        <p className="mt-3 text-sm text-slate-500">
          This company link may be old, or the id does not match any company yet.
        </p>
        <div className="mt-6 flex justify-center gap-4">
          <Link href="/dashboard/companies" className="bg-indigo-600 px-6 py-3 text-sm font-semibold text-white">
            Back to Browse Companies
          </Link>
          <Link href="/" className="border border-slate-200 px-6 py-3 text-sm font-semibold text-slate-700">
            Back to homepage
          </Link>
        </div>
      </div>
    );
  }

  const companyJobs = jobs.filter((job) => job.company === company.name);

  return (
    <div className="px-4 py-8 sm:px-6 lg:px-10">
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <Link
          href="/dashboard/companies"
          className="flex items-center gap-2 pl-10 text-2xl font-black text-slate-800 hover:text-indigo-600 lg:pl-0"
        >
          <ArrowLeft size={22} />
          Company Details
        </Link>
        <Link
          href="/"
          className="border border-indigo-200 px-4 py-2 text-sm font-medium text-indigo-600 hover:bg-indigo-50"
        >
          Back to homepage
        </Link>
      </div>

      {/* Company header card */}
      <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border border-slate-200 bg-white p-5">
        <div className="flex items-center gap-4">
          <CompanyLogo company={company} large />
          <div>
            <h1 className="text-2xl font-bold sm:text-3xl">{company.name}</h1>
            <p className="mt-1 flex flex-wrap items-center gap-2 text-sm text-slate-500">
              <span className="flex items-center gap-1">
                <MapPin size={14} /> {company.location}
              </span>
              <span>·</span>
              <span>{company.categories.join(", ")}</span>
            </p>
          </div>
        </div>
        <span className="shrink-0 border border-indigo-200 px-3 py-2 text-sm text-indigo-600">
          {company.jobs} Jobs
        </span>
      </div>

      <div className="mt-10 grid gap-10 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div>
          <h2 className="text-xl font-bold">About {company.name}</h2>
          <p className="mt-3 text-sm leading-6 text-slate-500">{company.about}</p>

          <h2 className="mt-10 text-xl font-bold">Jobs at {company.name}</h2>
          {companyJobs.length > 0 ? (
            <div className="mt-4 space-y-3">
              {companyJobs.map((job) => (
                <article
                  key={job.id}
                  className="flex flex-wrap items-center justify-between gap-3 border border-slate-200 bg-white p-4 transition hover:border-indigo-300"
                >
                  <div>
                    <Link
                      href={`/dashboard/jobs/${job.id}`}
                      className="block text-sm font-bold text-slate-800 hover:text-indigo-600 sm:text-base"
                    >
                      {job.title}
                    </Link>
                    <p className="mt-1 text-xs text-slate-500">
                      {job.location} · {job.type} · {job.level}
                    </p>
                  </div>
                  <Link
                    href={`/dashboard/jobs/${job.id}`}
                    className="bg-indigo-600 px-4 py-2 text-xs font-semibold text-white hover:bg-indigo-700"
                  >
                    View Job
                  </Link>
                </article>
              ))}
            </div>
          ) : (
            <div className="mt-4 border border-slate-200 bg-white p-5">
              <p className="text-sm text-slate-500">
                No jobs from {company.name} are in your current jobs list (@/lib/jobs.js) yet.
                The &ldquo;{company.jobs} Jobs&rdquo; count above is the number stored in the
                companies dataset, not a live count from the jobs list -- add a job with
                company &ldquo;{company.name}&rdquo; to lib/jobs.js and it will appear here automatically.
              </p>
            </div>
          )}
        </div>

        <aside>
          <h2 className="text-xl font-bold">Company Details</h2>
          <div className="mt-4 border border-slate-200 bg-gray-50 p-5">
            <dl className="space-y-4 text-sm">
              <div className="flex items-start justify-between gap-4">
                <dt className="flex items-center gap-2 text-slate-400">
                  <Building2 size={16} /> Industry
                </dt>
                <dd className="text-right font-medium">{company.categories.join(", ")}</dd>
              </div>
              <div className="flex items-start justify-between gap-4">
                <dt className="flex items-center gap-2 text-slate-400">
                  <MapPin size={16} /> Location
                </dt>
                <dd className="text-right font-medium">{company.location}</dd>
              </div>
              <div className="flex items-start justify-between gap-4">
                <dt className="flex items-center gap-2 text-slate-400">
                  <Users size={16} /> Company Size
                </dt>
                <dd className="text-right font-medium">{company.size} employees</dd>
              </div>
              <div className="flex items-start justify-between gap-4">
                <dt className="flex items-center gap-2 text-slate-400">
                  <Briefcase size={16} /> Jobs (dataset)
                </dt>
                <dd className="text-right font-medium">{company.jobs}</dd>
              </div>
            </dl>
          </div>

          <h3 className="mt-10 text-lg font-bold">Categories</h3>
          <div className="mt-3 flex flex-wrap gap-2">
            {company.categories.map((tag, index) => (
              <span
                key={tag}
                className={`rounded-full border px-3 py-1 text-xs ${
                  index === 0 ? "border-emerald-200 text-emerald-600" : "border-orange-200 text-orange-500"
                }`}
              >
                {tag}
              </span>
            ))}
          </div>
        </aside>
      </div>

      <div className="mt-10">
        <Link href="/dashboard/companies" className="text-sm font-semibold text-indigo-600">
          ← Back to Browse Companies
        </Link>
      </div>
    </div>
  );
}
