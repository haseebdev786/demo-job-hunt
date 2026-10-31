"use client";

// Place this file at: components/dashboard/ApplicationsHistoryFull.jsx
// Client component: it needs useState() for the tabs, search, job-type
// filter, pagination, the dismissible banner and the expanded row.
// It does NOT fetch anything itself and contains NO applications:
// every row comes from props, read from MongoDB by the server page
// through lib/dashboard-data.js (the SAME `applications` collection
// the main dashboard uses). Save a new application in MongoDB and it
// appears here automatically, in All and in its status tab.
//
// STATUS MAPPING -- read this before comparing with the screenshot:
//   The screenshot tabs are: All, In Review, Interviewing, Assessment,
//   Offered, Hired. Your current data (from scripts/seed-dashboard.js)
//   only uses: In Review, Shortlisted, Declined, Interviewed.
//   So this page maps:
//     Interviewed -> "Interviewing" tab and pill
//     Declined    -> "Unsuitable" pill (the dashboard donut's wording)
//   Shortlisted and Declined still show in "All" -- there is no
//   Shortlisted / Unsuitable tab in the screenshot.
//   Assessment, Offered and Hired tabs show their real count, which
//   is 0 until you save applications with those statuses. No fake
//   count is invented to match the screenshot's numbers.

import { useMemo, useState } from "react";
import Link from "next/link";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import {
  Search,
  SlidersHorizontal,
  Calendar,
  ChevronLeft,
  ChevronRight,
  MoreHorizontal,
  X,
} from "lucide-react";

const PAGE_SIZE = 10;

// Display label + pill colours, following the screenshot's pills.
const statusDisplay = {
  "In Review": { label: "In Review", pill: "border-amber-300 text-amber-600" },
  Shortlisted: { label: "Shortlisted", pill: "border-teal-300 text-teal-600" },
  Interviewed: { label: "Interviewing", pill: "border-amber-300 text-amber-600" },
  Interviewing: { label: "Interviewing", pill: "border-amber-300 text-amber-600" },
  Declined: { label: "Unsuitable", pill: "border-red-300 text-red-600" },
  Unsuitable: { label: "Unsuitable", pill: "border-red-300 text-red-600" },
  Assessment: { label: "Assessment", pill: "border-sky-300 text-sky-600" },
  Offered: { label: "Offered", pill: "border-indigo-300 text-indigo-600" },
  Hired: { label: "Hired", pill: "border-emerald-300 text-emerald-600" },
};

function displayStatus(status) {
  return statusDisplay[status] || { label: status, pill: "border-slate-300 text-slate-500" };
}

// Which tab does a stored status belong to? Interviewed counts as
// Interviewing; everything else counts under its own tab name, and
// Shortlisted / Declined count only under All.
function tabKeyFor(status) {
  if (status === "Interviewed") return "Interviewing";
  if (status === "Declined") return "Unsuitable";
  return status;
}

function companyInitials(company) {
  return String(company || "?")
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("");
}

function followUpNote(app) {
  // Banner rule from the screenshot: a follow-up can be requested
  // 7 days after applying, only while the status is in review.
  if (app.status !== "In Review") {
    return "Follow-up is only available for applications that are in review.";
  }
  if (!app.dateAppliedRaw) {
    return "Follow-up becomes available 7 days after applying.";
  }
  const days = Math.floor((Date.now() - new Date(app.dateAppliedRaw).getTime()) / 86400000);
  if (days >= 7) {
    return "Follow-up available: you can request a follow-up for this job now (one follow-up per job).";
  }
  return `Follow-up becomes available in ${7 - days} day${7 - days === 1 ? "" : "s"} (7 days after applying).`;
}

function pageNumbers(current, total) {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  const pages = new Set([1, 2, total - 1, total, current - 1, current, current + 1]);
  const sorted = [...pages].filter((p) => p >= 1 && p <= total).sort((a, b) => a - b);
  const out = [];
  for (let i = 0; i < sorted.length; i++) {
    if (i > 0 && sorted[i] - sorted[i - 1] > 1) out.push("...");
    out.push(sorted[i]);
  }
  return out;
}

export default function ApplicationsHistoryFull({ initialData }) {
  const applications = initialData.applications || [];
  const user = initialData.user;
  const firstName = user?.firstName || "there";

  const [activeTab, setActiveTab] = useState("All");
  const [search, setSearch] = useState("");
  const [jobType, setJobType] = useState("All types");
  const [showFilter, setShowFilter] = useState(false);
  const [page, setPage] = useState(1);
  const [showBanner, setShowBanner] = useState(true);
  const [expandedId, setExpandedId] = useState(null);

  const tabs = useMemo(() => {
    const counts = { All: applications.length };
    for (const app of applications) {
      const key = tabKeyFor(app.status);
      counts[key] = (counts[key] || 0) + 1;
    }
    return [
      { key: "All", label: "All", count: counts.All || 0 },
      { key: "In Review", label: "In Review", count: counts["In Review"] || 0 },
      { key: "Interviewing", label: "Interviewing", count: counts.Interviewing || 0 },
      { key: "Assessment", label: "Assessment", count: counts.Assessment || 0 },
      { key: "Offered", label: "Offered", count: counts.Offered || 0 },
      { key: "Hired", label: "Hired", count: counts.Hired || 0 },
    ];
  }, [applications]);

  const jobTypes = useMemo(() => {
    const types = new Set(applications.map((a) => a.type).filter(Boolean));
    return ["All types", ...types];
  }, [applications]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return applications.filter((app) => {
      if (activeTab !== "All" && tabKeyFor(app.status) !== activeTab) return false;
      if (jobType !== "All types" && app.type !== jobType) return false;
      if (
        q &&
        !`${app.company} ${app.title} ${app.location}`.toLowerCase().includes(q)
      ) {
        return false;
      }
      return true;
    });
  }, [applications, activeTab, jobType, search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const pageItems = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  function changeTab(key) {
    setActiveTab(key);
    setPage(1);
  }

  return (
    <div className="px-4 py-8 sm:px-6 lg:px-10">
      {/* Header: same as Dashboard overview -- bell outside dropdown, NO Back to homepage */}
      <DashboardHeader title="My Applications" />

      {/* Greeting + date range (display only, like the dashboard page) */}
      <div className="mt-8 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-800 sm:text-2xl">Keep it up, {firstName}</h2>
          <p className="mt-1 text-sm text-slate-500">
            Here is job applications status from July 19 - July 25.
          </p>
        </div>
        <button
          type="button"
          className="flex items-center gap-2 border border-slate-200 bg-white px-4 py-2 text-sm text-slate-600"
        >
          Jul 19 - Jul 25
          <Calendar size={16} />
        </button>
      </div>

      {/* New Feature banner -- dismissible */}
      {showBanner && (
        <div className="relative mt-6 flex items-start gap-4 border border-slate-200 bg-indigo-50/60 px-5 py-4">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-sm font-bold text-indigo-600">
            {user?.name ? user.name.charAt(0) : "J"}
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-bold text-indigo-600">New Feature</p>
            <p className="mt-1 text-sm leading-6 text-slate-600">
              You can request a follow-up 7 days after applying for a job if the application
              status is in review. Only one follow-up is allowed per job.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setShowBanner(false)}
            className="p-1 text-slate-400 hover:text-slate-700"
            aria-label="Dismiss banner"
          >
            <X size={18} />
          </button>
        </div>
      )}

      {/* Tabs -- counts are computed from real MongoDB data */}
      <div className="mt-8 flex flex-wrap gap-6 border-b border-slate-200">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            type="button"
            onClick={() => changeTab(tab.key)}
            className={`border-b-2 pb-2 text-sm font-medium ${
              activeTab === tab.key
                ? "border-indigo-600 text-indigo-600"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            {tab.label} ({tab.count})
          </button>
        ))}
      </div>

      {/* Table section */}
      <div className="mt-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h3 className="text-base font-bold text-slate-800">Applications History</h3>
          <div className="flex items-center gap-2">
            <label className="flex items-center gap-2 border border-slate-200 bg-white px-3 py-2">
              <Search size={16} className="text-slate-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                placeholder="Search"
                className="w-32 text-sm outline-none placeholder:text-slate-400 sm:w-44"
              />
            </label>
            <button
              type="button"
              onClick={() => setShowFilter((v) => !v)}
              className="flex items-center gap-2 border border-slate-200 bg-white px-3 py-2 text-sm text-slate-600"
            >
              <SlidersHorizontal size={16} />
              Filter
            </button>
          </div>
        </div>

        {showFilter && (
          <div className="mt-3 flex flex-wrap items-center gap-2 border border-slate-200 bg-white px-4 py-3">
            <span className="text-sm text-slate-500">Job type:</span>
            <select
              value={jobType}
              onChange={(e) => {
                setJobType(e.target.value);
                setPage(1);
              }}
              className="border border-slate-200 px-2 py-1.5 text-sm outline-none"
            >
              {jobTypes.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
            {jobType !== "All types" && (
              <button
                type="button"
                onClick={() => setJobType("All types")}
                className="text-sm font-medium text-indigo-600"
              >
                Clear filter
              </button>
            )}
          </div>
        )}

        {applications.length === 0 ? (
          <div className="mt-4 border border-slate-200 bg-white px-5 py-8 text-center">
            <p className="font-bold text-slate-800">No applications yet.</p>
            <p className="mx-auto mt-1 max-w-md text-sm text-slate-500">
              {initialData.connected
                ? "Applications you submit will appear here automatically once they are saved in the applications collection in MongoDB."
                : "Connect MongoDB and run node scripts/seed-dashboard.js to see applications here."}
            </p>
          </div>
        ) : pageItems.length === 0 ? (
          <p className="mt-4 border border-slate-200 bg-white px-5 py-8 text-center text-sm text-slate-500">
            No applications match this tab, search or filter.
          </p>
        ) : (
          <>
            <div className="mt-4 overflow-x-auto border border-slate-200 bg-white">
              <table className="w-full min-w-[720px] text-left text-sm">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-500">
                    <th className="px-4 py-3 font-medium">#</th>
                    <th className="px-4 py-3 font-medium">Company Name</th>
                    <th className="px-4 py-3 font-medium">Roles</th>
                    <th className="px-4 py-3 font-medium">Date Applied</th>
                    <th className="px-4 py-3 font-medium">Status</th>
                    <th className="px-4 py-3" aria-label="Actions" />
                  </tr>
                </thead>
                <tbody>
                  {pageItems.map((app, index) => {
                    const shown = displayStatus(app.status);
                    const rowNumber = (safePage - 1) * PAGE_SIZE + index + 1;
                    const expanded = expandedId === app.id;
                    return (
                      <tr key={app.id} className="border-b border-slate-100 align-middle">
                        <td className="px-4 py-4 text-slate-500">{rowNumber}</td>
                        <td className="px-4 py-4">
                          <span className="flex items-center gap-3">
                            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-indigo-50 text-sm font-black text-indigo-600">
                              {companyInitials(app.company)}
                            </span>
                            <span className="font-medium text-slate-800">{app.company}</span>
                          </span>
                        </td>
                        <td className="px-4 py-4 text-slate-700">{app.title}</td>
                        <td className="px-4 py-4 text-slate-500">{app.dateApplied}</td>
                        <td className="px-4 py-4">
                          <span className={`rounded-full border bg-white px-3 py-1 text-xs font-medium ${shown.pill}`}>
                            {shown.label}
                          </span>
                        </td>
                        <td className="px-4 py-4 text-right">
                          <button
                            type="button"
                            onClick={() => setExpandedId(expanded ? null : app.id)}
                            className="p-1 text-slate-400 hover:text-slate-700"
                            aria-label={`Details for ${app.company}`}
                          >
                            <MoreHorizontal size={18} />
                          </button>
                          {expanded && (
                            <div className="mt-2 min-w-64 whitespace-normal text-left text-xs leading-5 text-slate-500">
                              <p>
                                {app.location} · {app.type}
                              </p>
                              <p>{followUpNote(app)}</p>
                            </div>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Pagination -- page count is computed from real data */}
            <div className="mt-6 flex items-center justify-center gap-1">
              <button
                type="button"
                disabled={safePage <= 1}
                onClick={() => setPage(safePage - 1)}
                className="p-2 text-slate-500 disabled:opacity-30"
                aria-label="Previous page"
              >
                <ChevronLeft size={18} />
              </button>
              {pageNumbers(safePage, totalPages).map((p, i) =>
                p === "..." ? (
                  <span key={`dots-${i}`} className="px-1 text-sm text-slate-400">
                    ...
                  </span>
                ) : (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setPage(p)}
                    className={`flex h-8 w-8 items-center justify-center rounded-md text-sm ${
                      p === safePage
                        ? "bg-indigo-600 font-bold text-white"
                        : "text-slate-500 hover:bg-slate-100"
                    }`}
                  >
                    {p}
                  </button>
                )
              )}
              <button
                type="button"
                disabled={safePage >= totalPages}
                onClick={() => setPage(safePage + 1)}
                className="p-2 text-slate-500 disabled:opacity-30"
                aria-label="Next page"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
