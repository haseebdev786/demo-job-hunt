"use client";

// Place this file at: components/company/CompanyDashboardPage.jsx
// (REPLACES the previous version of this file.)
// Company dashboard overview (3.1 Dashboard Company), redesigned
// to the better reference crop the user sent:
//   - Header: COMPANY label + logo tile + COMPANY NAME from the
//     LOGGED-IN session (props companyName / companyInitial),
//     NOT hardcoded Nomad. If no one is logged in, the page
//     falls back to Nomad / Maria (demo preview only).
//   - Job statistics: header with Week / Month / Year tabs,
//     then sub-tabs Overview / Jobs View / Jobs Applied.
//     Overview = STACKED bars (bottom purple = Job Applied,
//     top orange = Job View) + both summary cards on the right.
//     Jobs View = orange bars only + Job Views card.
//     Jobs Applied = purple bars only + Job Applied card.
//     Hover any bar to see its tooltip (dark box, like the crop:
//     Tue shows 122 Job Applied and 34 Job View).
//   - Right column (outside Job statistics): Job Open + Applicants
//     Summary, as before. Stat cards row and Job Updates row below
//     are unchanged from the previous delivery.
// Data comes from lib/company-dashboard-data.js (screenshot demo
// numbers for stats/chart/summary -- see that file's note).

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, Calendar, ChevronRight, Eye, FileText } from "lucide-react";
import { companyDashboardData } from "@/lib/company-dashboard-data";

function StackedChart({ data, mode }) {
  const totals = data.map((d) =>
    mode === "view" ? d.view : mode === "applied" ? d.applied : d.view + d.applied
  );
  const max = Math.max(...totals, 1);
  const chartHeight = 180;

  return (
    <div>
      <div className="flex h-48 items-end gap-3 sm:gap-4">
        {data.map((d) => {
          const total = mode === "view" ? d.view : mode === "applied" ? d.applied : d.view + d.applied;
          const totalHeight = Math.round((total / max) * chartHeight);
          const appliedHeight =
            mode === "overview" ? Math.round((d.applied / max) * chartHeight) : 0;
          const viewHeight =
            mode === "overview" ? totalHeight - appliedHeight : totalHeight;
          return (
            <div key={d.label} className="group relative flex flex-1 flex-col items-center gap-2">
              {/* Tooltip, like the crop's dark box on Tue */}
              <div className="pointer-events-none absolute -top-2 left-1/2 z-10 hidden -translate-x-1/2 -translate-y-full whitespace-nowrap bg-slate-800 px-3 py-2 text-xs text-white shadow-lg group-hover:block">
                {mode !== "view" && (
                  <p className="flex items-center gap-1.5">
                    <span className="h-2.5 w-2.5 bg-violet-500" /> {d.applied}
                  </p>
                )}
                {mode !== "applied" && (
                  <p className="mt-1 flex items-center gap-1.5">
                    <span className="h-2.5 w-2.5 bg-amber-400" /> {d.view}
                  </p>
                )}
              </div>
              <div className="flex h-48 w-full flex-col-reverse items-center">
                {mode !== "view" && (
                  <div
                    className="w-5 rounded-b-sm bg-violet-500 sm:w-6"
                    style={{ height: `${mode === "overview" ? appliedHeight : totalHeight}px` }}
                    title={`Job Applied: ${d.applied}`}
                  />
                )}
                {mode !== "applied" && (
                  <div
                    className="w-5 rounded-t-sm bg-amber-400 sm:w-6"
                    style={{ height: `${viewHeight}px` }}
                    title={`Job View: ${d.view}`}
                  />
                )}
              </div>
              <span className="text-[11px] text-slate-500">{d.label}</span>
            </div>
          );
        })}
      </div>
      <div className="mt-4 flex items-center gap-5 text-xs text-slate-500">
        {mode !== "applied" && (
          <span className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 bg-amber-400" /> Job View
          </span>
        )}
        {mode !== "view" && (
          <span className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 bg-violet-500" /> Job Applied
          </span>
        )}
      </div>
    </div>
  );
}

export default function CompanyDashboardPage({
  companyName = "Nomad",
  companyInitial = "N",
  firstName = "Maria",
}) {
  const data = companyDashboardData;
  const [period, setPeriod] = useState("Week");
  const [viewMode, setViewMode] = useState("overview"); // overview | view | applied
  const chartData = data.chart[period] || data.chart.Week;
  const summary = data.summaries[period] || data.summaries.Week;
  const summaryTotal = data.applicantsSummary.breakdown.reduce((sum, b) => sum + b.count, 0);

  return (
    <div className="px-4 py-8 sm:px-6 lg:px-10">
      {/* Header: Company + Post a job -- company name is the LOGGED-IN
          company name (prop), NOT hardcoded Nomad. */}
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
        <Link
          href="/company/jobs/new"
          className="bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700"
        >
          + Post a job
        </Link>
      </div>

      {/* Greeting + date range */}
      <div className="mt-8 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-800 sm:text-2xl">Good morning, {firstName}</h2>
          <p className="mt-1 text-sm text-slate-500">
            Here is your job listings statistic report from July 19 - July 25.
          </p>
        </div>
        <button
          type="button"
          className="flex items-center gap-2 border border-slate-200 bg-white px-4 py-2 text-sm text-slate-600"
        >
          {data.dateRange}
          <Calendar size={16} />
        </button>
      </div>

      {/* Stat cards */}
      <div className="mt-8 grid gap-5 sm:grid-cols-3">
        {data.stats.map((stat) => (
          <Link
            key={stat.id}
            href={stat.href}
            className={`flex items-center justify-between p-5 text-white hover:opacity-90 ${stat.color}`}
          >
            <div>
              <p className="text-3xl font-black">{stat.value}</p>
              <p className="mt-1 text-sm">{stat.label}</p>
            </div>
            <ChevronRight size={22} />
          </Link>
        ))}
      </div>

      {/* Middle row: Job statistics + right column */}
      <div className="mt-5 grid gap-5 lg:grid-cols-[minmax(0,1fr)_320px]">
        <section className="border border-slate-200 bg-white p-6">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <h2 className="text-base font-bold text-slate-800">Job statistics</h2>
              <p className="mt-1 text-xs text-slate-500">Showing Jobstatistic Jul 19-25</p>
            </div>
            <div className="flex gap-1">
              {["Week", "Month", "Year"].map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setPeriod(p)}
                  className={`px-3 py-1.5 text-xs font-semibold ${
                    period === p
                      ? "bg-white text-indigo-600 shadow-sm ring-1 ring-slate-200"
                      : "bg-indigo-50 text-indigo-600 hover:bg-indigo-100"
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          {/* Sub-tabs: Overview / Jobs View / Jobs Applied */}
          <div className="mt-5 flex gap-6 border-b border-slate-200 text-sm">
            {[
              { id: "overview", label: "Overview" },
              { id: "view", label: "Jobs View" },
              { id: "applied", label: "Jobs Applied" },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setViewMode(tab.id)}
                className={`-mb-px pb-2 ${
                  viewMode === tab.id
                    ? "border-b-2 border-indigo-600 font-bold text-slate-800"
                    : "text-slate-500 hover:text-slate-800"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="mt-6 grid gap-6 md:grid-cols-[minmax(0,1fr)_220px]">
            <StackedChart data={chartData} mode={viewMode} />
            <div className="space-y-4">
              {viewMode !== "applied" && (
                <div className="border border-slate-200 p-4">
                  <div className="flex items-start justify-between">
                    <p className="text-sm text-slate-500">Job Views</p>
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-100 text-amber-500">
                      <Eye size={16} />
                    </span>
                  </div>
                  <p className="mt-1 text-2xl font-black text-slate-800">
                    {summary.views.toLocaleString()}
                  </p>
                  <p className="mt-1 text-xs text-slate-500">
                    {summary.label}{" "}
                    <span className={summary.viewsUp ? "font-semibold text-indigo-600" : "font-semibold text-red-500"}>
                      {summary.viewsUp ? "▲" : "▼"} {summary.viewsChange}
                    </span>
                  </p>
                </div>
              )}
              {viewMode !== "view" && (
                <div className="border border-slate-200 p-4">
                  <div className="flex items-start justify-between">
                    <p className="text-sm text-slate-500">Job Applied</p>
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-violet-100 text-violet-500">
                      <FileText size={16} />
                    </span>
                  </div>
                  <p className="mt-1 text-2xl font-black text-slate-800">
                    {summary.applied.toLocaleString()}
                  </p>
                  <p className="mt-1 text-xs text-slate-500">
                    {summary.label}{" "}
                    <span className={summary.appliedUp ? "font-semibold text-indigo-600" : "font-semibold text-red-500"}>
                      {summary.appliedUp ? "▲" : "▼"} {summary.appliedChange}
                    </span>
                  </p>
                </div>
              )}
            </div>
          </div>
        </section>

        <div className="space-y-5">
          <section className="border border-slate-200 bg-white p-6">
            <h2 className="text-base font-bold text-slate-800">Job Open</h2>
            <p className="mt-2 text-sm text-slate-500">
              <span className="text-2xl font-black text-slate-800">{data.jobsOpen}</span> Jobs Opened
            </p>
          </section>

          <section className="border border-slate-200 bg-white p-6">
            <h2 className="text-base font-bold text-slate-800">Applicants Summary</h2>
            <p className="mt-2 text-sm text-slate-500">
              <span className="text-2xl font-black text-slate-800">{data.applicantsSummary.total}</span> Applicants
            </p>
            <div className="mt-4 flex h-2.5 overflow-hidden rounded-full bg-slate-100">
              {data.applicantsSummary.breakdown.map((b) => (
                <div
                  key={b.label}
                  className={b.color}
                  style={{ width: `${(b.count / summaryTotal) * 100}%` }}
                  title={`${b.label}: ${b.count}`}
                />
              ))}
            </div>
            <ul className="mt-4 space-y-2">
              {data.applicantsSummary.breakdown.map((b) => (
                <li key={b.label} className="flex items-center gap-2 text-xs text-slate-600">
                  <span className={`h-2.5 w-2.5 shrink-0 ${b.color}`} />
                  <span className="flex-1">{b.label}:</span>
                  <span className="font-semibold text-slate-800">{b.count}</span>
                </li>
              ))}
            </ul>
          </section>
        </div>
      </div>

      {/* Job Updates */}
      <section className="mt-5">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-slate-800">Job Updates</h2>
          <Link href="/company/jobs" className="flex items-center gap-1 text-sm font-semibold text-indigo-600 hover:text-indigo-700">
            View All <ArrowRight size={16} />
          </Link>
        </div>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {data.jobUpdates.map((job) => {
            const percent = Math.round((job.applied / job.capacity) * 100);
            return (
              <article key={job.title} className="flex flex-col border border-slate-200 bg-white p-5">
                <div className="flex items-start justify-between gap-3">
                  <span className={`flex h-10 w-10 items-center justify-center rounded-md text-lg font-black ${job.logoBg} ${job.logoColor}`}>
                    {job.logo}
                  </span>
                  <span className="whitespace-nowrap border border-teal-200 bg-teal-50 px-2 py-1 text-[11px] font-semibold text-teal-600">
                    {job.type}
                  </span>
                </div>
                <h3 className="mt-4 truncate font-bold text-slate-800">{job.title}</h3>
                <p className="mt-1 truncate text-xs text-slate-500">
                  {job.company} - {job.location}
                </p>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {job.categories.map((cat, i) => (
                    <span
                      key={cat}
                      className={`px-2.5 py-1 text-[11px] ${
                        i === 0 ? "bg-orange-50 text-orange-500" : "bg-indigo-50 text-indigo-600"
                      }`}
                    >
                      {cat}
                    </span>
                  ))}
                </div>
                <div className="mt-auto pt-4">
                  <div className="h-1.5 overflow-hidden rounded-full bg-slate-100">
                    <div className="h-full bg-emerald-500" style={{ width: `${percent}%` }} />
                  </div>
                  <p className="mt-2 text-xs text-slate-500">
                    {job.applied} applied of {job.capacity} capacity
                  </p>
                </div>
              </article>
            );
          })}
        </div>
      </section>
    </div>
  );
}
