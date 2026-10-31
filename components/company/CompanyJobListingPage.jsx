"use client";

// Place this file at: components/company/CompanyJobListingPage.jsx
// Job Listing (3.9), inside the company layout.
// Header: Job Listing + subtitle + Jul 19 - Jul 25 date button.
// Job List card: Filters button (Status + Job Type dropdown),
// table: Roles, Status (Live green / Closed red), Date Posted,
// Due Date, Job Type (Fulltime purple / Freelance orange),
// Applicants, Needs, "..." menu (View Applicants / View Details).
// Pagination: 10 per page (select 10 / 20 / 50), pages 1, 2 for
// 11 jobs. Click a role title to open that job's detail page
// (/company/jobs/<slug>, with Applicants / Job Details / Analytics).
// "+ Post a job" opens the three-step form at /company/jobs/new.
// Company name in the header comes from props (session).

import { useMemo, useState } from "react";
import Link from "next/link";
import { Calendar, ListFilter } from "lucide-react";
import { companyJobs } from "@/lib/company-jobs-data";

export default function CompanyJobListingPage({ companyName = "Nomad", companyInitial = "N" }) {
  const [statusFilter, setStatusFilter] = useState("All");
  const [typeFilter, setTypeFilter] = useState("All");
  const [showFilters, setShowFilters] = useState(false);
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [openMenuSlug, setOpenMenuSlug] = useState(null);

  const filtered = useMemo(
    () =>
      companyJobs.filter(
        (j) =>
          (statusFilter === "All" || j.status === statusFilter) &&
          (typeFilter === "All" || j.jobType === typeFilter)
      ),
    [statusFilter, typeFilter]
  );
  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
  const safePage = Math.min(page, totalPages);
  const pageItems = filtered.slice((safePage - 1) * perPage, safePage * perPage);

  return (
    <div className="px-4 py-8 sm:px-6 lg:px-10">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-slate-400">Company</p>
          <div className="mt-2 flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-50 text-xl font-black text-emerald-500">
              {companyInitial}
            </span>
            <h1 className="text-2xl font-black text-slate-800">{companyName}</h1>
          </div>
        </div>
        <Link href="/company/jobs/new" className="bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700">
          + Post a job
        </Link>
      </div>

      <div className="mt-8 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-800">Job Listing</h2>
          <p className="mt-1 text-sm text-slate-500">Here is your jobs listing status from July 19 - July 25.</p>
        </div>
        <button type="button" className="flex items-center gap-2 border border-slate-200 bg-white px-4 py-2 text-sm text-slate-600">
          Jul 19 - Jul 25 <Calendar size={16} />
        </button>
      </div>

      <section className="mt-6 border border-slate-200 bg-white p-6">
        <div className="flex items-center justify-between gap-4">
          <h3 className="text-base font-bold text-slate-800">Job List</h3>
          <button type="button" onClick={() => setShowFilters(!showFilters)} className="flex items-center gap-2 border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600">
            <ListFilter size={16} /> Filters
          </button>
        </div>

        {showFilters && (
          <div className="mt-4 flex flex-wrap gap-4 border border-slate-200 bg-slate-50 p-4 text-sm">
            <label className="flex items-center gap-2">
              Status:
              <select value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }} className="border border-slate-200 bg-white px-2 py-1.5 outline-none">
                <option value="All">All</option>
                <option value="Live">Live</option>
                <option value="Closed">Closed</option>
              </select>
            </label>
            <label className="flex items-center gap-2">
              Job Type:
              <select value={typeFilter} onChange={(e) => { setTypeFilter(e.target.value); setPage(1); }} className="border border-slate-200 bg-white px-2 py-1.5 outline-none">
                <option value="All">All</option>
                <option value="Fulltime">Fulltime</option>
                <option value="Freelance">Freelance</option>
              </select>
            </label>
          </div>
        )}

        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[800px] text-left text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-xs text-slate-500">
                <th className="px-4 py-3">Roles</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Date Posted</th>
                <th className="px-4 py-3">Due Date</th>
                <th className="px-4 py-3">Job Type</th>
                <th className="px-4 py-3">Applicants</th>
                <th className="px-4 py-3">Needs</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {pageItems.map((job) => (
                <tr key={job.slug} className="border-b border-slate-100">
                  <td className="px-4 py-4">
                    <Link href={`/company/jobs/${job.slug}`} className="font-bold text-slate-800 hover:text-indigo-600">
                      {job.role}
                    </Link>
                  </td>
                  <td className="px-4 py-4">
                    <span className={`border px-3 py-1 text-xs font-semibold ${job.status === "Live" ? "border-emerald-200 bg-emerald-50 text-emerald-600" : "border-red-200 bg-red-50 text-red-500"}`}>
                      {job.status}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-slate-600">{job.datePosted}</td>
                  <td className="px-4 py-4 text-slate-600">{job.dueDate}</td>
                  <td className="px-4 py-4">
                    <span className={`whitespace-nowrap border px-3 py-1 text-xs font-semibold ${job.jobType === "Fulltime" ? "border-indigo-200 bg-indigo-50 text-indigo-600" : "border-amber-200 bg-amber-50 text-amber-600"}`}>
                      {job.jobType}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-slate-600">{job.applicants.toLocaleString()}</td>
                  <td className="px-4 py-4 text-slate-600">{job.needs}</td>
                  <td className="px-4 py-4">
                    <div className="relative">
                      <button type="button" onClick={() => setOpenMenuSlug(openMenuSlug === job.slug ? null : job.slug)} aria-label="Job options" className="px-2 text-slate-400 hover:text-slate-800">
                        ...
                      </button>
                      {openMenuSlug === job.slug && (
                        <div className="absolute right-0 top-6 z-10 w-44 border border-slate-200 bg-white shadow-lg">
                          <Link href={`/company/jobs/${job.slug}`} onClick={() => setOpenMenuSlug(null)} className="block px-4 py-2 text-sm text-slate-600 hover:bg-indigo-50">
                            View Applicants
                          </Link>
                          <Link href={`/company/jobs/${job.slug}?tab=details`} onClick={() => setOpenMenuSlug(null)} className="block px-4 py-2 text-sm text-slate-600 hover:bg-indigo-50">
                            View Job Details
                          </Link>
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {pageItems.length === 0 && (
                <tr><td colSpan={8} className="px-4 py-8 text-center text-slate-500">No jobs found for these filters.</td></tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="mt-4 flex flex-wrap items-center justify-between gap-4 text-sm text-slate-500">
          <p>
            View{" "}
            <select value={perPage} onChange={(e) => { setPerPage(Number(e.target.value)); setPage(1); }} className="border border-slate-200 bg-white px-2 py-1 outline-none" aria-label="Jobs per page">
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
            </select>{" "}
            Applicants per page
          </p>
          <div className="flex items-center gap-1">
            <button type="button" disabled={safePage <= 1} onClick={() => setPage(safePage - 1)} className="border border-slate-200 bg-white px-3 py-1.5 disabled:opacity-40">&lt;</button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <button key={p} type="button" onClick={() => setPage(p)} className={`px-3 py-1.5 ${p === safePage ? "bg-indigo-600 text-white" : "border border-slate-200 bg-white"}`}>
                {p}
              </button>
            ))}
            <button type="button" disabled={safePage >= totalPages} onClick={() => setPage(safePage + 1)} className="border border-slate-200 bg-white px-3 py-1.5 disabled:opacity-40">&gt;</button>
          </div>
        </div>
      </section>

    </div>
  );
}
