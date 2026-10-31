"use client";

// Place this file at: components/dashboard/DashboardFindJobs.jsx
// Client component: search, filters, sort and pagination all run here.
//
// WHY THIS PAGE EXISTS:
//   The sidebar used to link Find Jobs to /jobs -- the PUBLIC page with
//   Navbar/Footer. This is the DASHBOARD version (screenshot 2.4):
//   it lives inside app/dashboard/layout.jsx, so it keeps the dashboard
//   sidebar and has NO Navbar/Footer. The public /jobs page is untouched
//   and still works if you open it directly.
//
// DATA: it imports the SAME 12 jobs from @/lib/jobs that your public
// Find Jobs page and the job detail page use. No jobs are copied here,
// so editing lib/jobs.js updates both pages at once. If a job in your
// lib/jobs.js is missing a field (logo, applicants, ...), this page
// falls back gracefully instead of crashing.
//
// DIFFERENCES FROM THE SCREENSHOT, ON PURPOSE:
//   - Filter counts, "Showing X results" and pagination are computed
//     from your real 12 jobs, not the screenshot's numbers (73 results,
//     33 pages, $ salary ranges). Your jobs use € salary ranges, so
//     the Salary Range filter uses those.
//   - Job titles link to /dashboard/jobs/{id} -- the dashboard detail
//     page (screenshot 2.6), so a click stays inside the dashboard
//     sidebar. The public detail page at /jobs/{id} is untouched.
//   - Apply is local state only (like the public page). It does NOT
//     save to MongoDB yet -- connect it to POST /api/applications next.

import { useMemo, useState } from "react";
import Link from "next/link";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import {
  ArrowLeft,
  ArrowRight,
  ChevronDown,
  ChevronUp,
  Grid2X2,
  List,
  MapPin,
  Search,
  SlidersHorizontal,
  X,
} from "lucide-react";
import { jobs } from "@/lib/jobs";

const filters = [
  { title: "Type of Employment", field: "type", options: ["Full-Time", "Part-Time", "Remote", "Internship", "Contract"] },
  { title: "Categories", field: "category", options: ["Design", "Sales", "Marketing", "Business", "Human Resource", "Finance", "Engineering", "Technology"] },
  { title: "Job Level", field: "level", options: ["Entry Level", "Mid Level", "Senior Level", "Director"] },
  { title: "Salary Range", field: "salary", options: ["€0 - €30k", "€30k - €60k", "€60k - €100k", "€100k+"] },
];

const popularTerms = ["UI Designer", "UX Researcher", "Android", "Admin"];

function JobLogo({ job }) {
  const Logo = job.logo;
  if (!Logo) {
    return (
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-slate-50 text-2xl font-extrabold text-indigo-600">
        {(job.company || "?").charAt(0)}
      </span>
    );
  }
  if (typeof Logo === "string") {
    return (
      <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-slate-50 text-2xl font-extrabold ${job.logoColor || "text-indigo-600"}`}>
        {Logo}
      </span>
    );
  }
  return <Logo className={`h-10 w-10 shrink-0 text-3xl ${job.logoColor || "text-indigo-600"}`} aria-label={job.company} />;
}

function FilterGroup({ group, selected, onToggle }) {
  const [expanded, setExpanded] = useState(true);
  return (
    <div className="border-b border-slate-100 pb-5 last:border-0">
      <button
        type="button"
        className="mb-3 flex w-full items-center justify-between gap-2 text-left text-sm font-bold text-slate-800"
        onClick={() => setExpanded(!expanded)}
        aria-expanded={expanded}
      >
        {group.title}
        {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
      </button>
      {expanded && (
        <div className="space-y-3">
          {group.options.map((option) => {
            const count = jobs.filter((job) => job[group.field] === option).length;
            return (
              <label key={option} className="flex cursor-pointer items-center gap-2.5 text-xs text-slate-500">
                <input
                  type="checkbox"
                  className="h-4 w-4 cursor-pointer accent-indigo-600"
                  checked={(selected[group.field] || []).includes(option)}
                  onChange={() => onToggle(group.field, option)}
                />
                <span>
                  {option} ({count})
                </span>
              </label>
            );
          })}
        </div>
      )}
    </div>
  );
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

export default function DashboardFindJobs() {
  const [keyword, setKeyword] = useState("");
  const [search, setSearch] = useState("");
  const [location, setLocation] = useState("");
  const [selected, setSelected] = useState({});
  const [filterOpen, setFilterOpen] = useState(false);
  const [sort, setSort] = useState("relevant");
  // View toggle -- added 2026-10-30: the dashboard Find Jobs section
  // was list-only before, the grid version (screenshot 2.4 grid) was
  // missed. Now both are available, grid is the default so the page
  // opens like the grid screenshot, and the list icon switches back.
  const [view, setView] = useState("grid");
  const [page, setPage] = useState(1);
  const [applied, setApplied] = useState([]);
  const pageSize = 7;

  const toggleFilter = (field, value) => {
    setSelected((prev) => {
      const oldValues = prev[field] || [];
      return {
        ...prev,
        [field]: oldValues.includes(value) ? oldValues.filter((x) => x !== value) : [...oldValues, value],
      };
    });
    setPage(1);
  };

  const clearFilters = () => {
    setSelected({});
    setPage(1);
  };

  const results = useMemo(() => {
    const term = search.trim().toLowerCase();
    const loc = location.trim().toLowerCase();
    const list = jobs.filter((job) => {
      const matchesTerm =
        !term || `${job.title} ${job.company} ${job.category}`.toLowerCase().includes(term);
      const matchesLocation = !loc || (job.location || "").toLowerCase().includes(loc);
      return (
        matchesTerm &&
        matchesLocation &&
        filters.every(
          ({ field }) => !(selected[field] || []).length || selected[field].includes(job[field])
        )
      );
    });
    if (sort === "az") list.sort((a, b) => a.title.localeCompare(b.title));
    if (sort === "company") list.sort((a, b) => a.company.localeCompare(b.company));
    return list;
  }, [search, location, selected, sort]);

  const totalPages = Math.max(1, Math.ceil(results.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const pagedJobs = results.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  function runSearch(term) {
    setSearch(term);
    setPage(1);
  }

  return (
    <div className="px-4 py-8 sm:px-6 lg:px-10">
      {/* Header: same as Dashboard overview -- bell outside dropdown, NO Back to homepage */}
      <DashboardHeader title="Find Jobs" />

      {/* Search bar -- screenshot 2.4 style */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          runSearch(keyword);
        }}
        className="mt-8 flex w-full flex-col gap-3 bg-white p-3 shadow-lg sm:p-4 md:flex-row md:items-center md:gap-5"
      >
        <label className="flex min-w-0 flex-1 items-center gap-3 border-b border-slate-200 px-2 py-2 md:border-0">
          <Search size={20} className="shrink-0 text-slate-700" />
          <input
            aria-label="Job title or keyword"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder="Job title or keyword"
            className="w-full min-w-0 bg-transparent text-sm outline-none placeholder:text-slate-400"
          />
        </label>
        <label className="flex min-w-0 flex-1 items-center gap-3 border-b border-slate-200 px-2 py-2 md:border-0">
          <MapPin size={20} className="shrink-0 text-slate-700" />
          <input
            aria-label="Location"
            value={location}
            onChange={(e) => {
              setLocation(e.target.value);
              setPage(1);
            }}
            placeholder="Florence, Italy"
            className="w-full min-w-0 bg-transparent text-sm outline-none placeholder:text-slate-400"
          />
        </label>
        <button
          type="submit"
          className="bg-indigo-600 px-7 py-3.5 text-sm font-semibold text-white transition hover:bg-indigo-700"
        >
          Search
        </button>
      </form>
      <p className="mt-3 text-xs text-slate-400">
        Popular:{" "}
        {popularTerms.map((term, i) => (
          <span key={term}>
            {i > 0 ? ", " : ""}
            <button
              type="button"
              className="text-slate-500 underline-offset-2 hover:text-indigo-600 hover:underline"
              onClick={() => {
                setKeyword(term);
                runSearch(term);
              }}
            >
              {term}
            </button>
          </span>
        ))}
      </p>

      {/* Filters + list */}
      <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-[230px_minmax(0,1fr)] lg:gap-12">
        <aside className="hidden space-y-6 lg:block" aria-label="Job filters">
          {filters.map((group) => (
            <FilterGroup key={group.field} group={group} selected={selected} onToggle={toggleFilter} />
          ))}
          <button onClick={clearFilters} className="text-sm font-semibold text-indigo-600">
            Clear all filters
          </button>
        </aside>

        <div className="min-w-0">
          <div className="mb-5 flex flex-wrap items-start justify-between gap-3">
            <div>
              <h2 className="text-xl font-bold sm:text-2xl">All Jobs</h2>
              <p className="mt-1 text-xs text-slate-500">Showing {results.length} results</p>
            </div>
            <div className="flex flex-wrap items-center gap-2 sm:gap-3">
              <button
                className="flex items-center gap-2 border border-slate-200 bg-white px-3 py-2 text-sm lg:hidden"
                onClick={() => setFilterOpen(true)}
              >
                <SlidersHorizontal size={16} /> Filters
              </button>
              <label className="flex items-center gap-2 text-sm text-slate-600">
                Sort by:
                <select
                  aria-label="Sort jobs"
                  value={sort}
                  onChange={(e) => {
                    setSort(e.target.value);
                    setPage(1);
                  }}
                  className="bg-white text-xs text-slate-600 outline-none sm:text-sm"
                >
                  <option value="relevant">Most relevant</option>
                  <option value="az">Job title A–Z</option>
                  <option value="company">Company A–Z</option>
                </select>
              </label>
              <div className="flex items-center gap-1 border-l border-slate-200 pl-2">
                <button
                  aria-label="Grid view"
                  title="Grid view"
                  onClick={() => setView("grid")}
                  className={`p-2 ${view === "grid" ? "bg-indigo-50 text-indigo-600" : "text-slate-400"}`}
                >
                  <Grid2X2 size={17} />
                </button>
                <button
                  aria-label="List view"
                  title="List view"
                  onClick={() => setView("list")}
                  className={`p-2 ${view === "list" ? "bg-indigo-50 text-indigo-600" : "text-slate-400"}`}
                >
                  <List size={17} />
                </button>
              </div>
            </div>
          </div>

          {/* GRID LAYOUT 2026-10-30 (same-to-same as the grid screenshot):
              3 columns on xl, 2 on sm. The grid card itself is rebuilt
              below (logo + type pill on top, title, company, 2 pills,
              green progress, no Apply button), so even at 3 columns
              the title/tags do NOT squeeze into a narrow column next
              to the logo -- that was the earlier messy look. */}
          <div className={view === "grid" ? "grid gap-4 sm:grid-cols-2 xl:grid-cols-3" : "space-y-3"}>
            {pagedJobs.map((job) => {
              const applicants = job.applicants || 0;
              const isApplied = applied.includes(job.id);

              // GRID CARD -- exactly like the grid screenshot, and
              // different from the list card on purpose:
              //   top row: logo (left) + job type pill (right)
              //   title (truncated, one line, like the screenshot)
              //   company · location (truncated, like "Berlin, Germ...")
              //   2 pills: category (orange outline) + level (indigo)
              //   green progress bar + "X applied of 10 capacity"
              //   NO Apply button in grid -- the screenshot has none;
              //   Apply lives on the list card and on /dashboard/jobs/{id}.
              // NOTE on the screenshot's 2nd pill: it says "Design" on
              // every card in the reference, which is placeholder data.
              // Here the 2nd pill is the job's real level, because your
              // jobs only have ONE category each -- a 2nd category
              // would have to be invented, and it is not.
              if (view === "grid") {
                const typePill =
                  job.type === "Internship"
                    ? "bg-red-50 text-red-500"
                    : job.type === "Part-Time"
                      ? "bg-orange-50 text-orange-600"
                      : job.type === "Contract"
                        ? "bg-indigo-50 text-indigo-600"
                        : "bg-teal-50 text-teal-600";
                return (
                  <article
                    key={job.id}
                    className="flex min-w-0 flex-col border border-slate-200 bg-white p-4 transition hover:border-indigo-300 sm:p-5"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <JobLogo job={job} />
                      {job.type && (
                        <span
                          className={`whitespace-nowrap rounded-full px-3 py-1 text-[11px] font-medium ${typePill}`}
                        >
                          {job.type}
                        </span>
                      )}
                    </div>
                    <Link
                      href={`/dashboard/jobs/${job.id}`}
                      title={job.title}
                      className="mt-3 block truncate text-base font-bold text-slate-800 hover:text-indigo-600"
                    >
                      {job.title}
                    </Link>
                    <p className="mt-1 truncate text-sm text-slate-500">
                      {job.company} · {job.location}
                    </p>
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {job.category && (
                        <span className="whitespace-nowrap rounded-full border border-orange-300 px-3 py-1 text-[11px] text-orange-500">
                          {job.category}
                        </span>
                      )}
                      {job.level && (
                        <span className="whitespace-nowrap rounded-full border border-indigo-300 px-3 py-1 text-[11px] text-indigo-600">
                          {job.level}
                        </span>
                      )}
                    </div>
                    <div className="mt-auto pt-4">
                      <div className="h-1.5 overflow-hidden bg-slate-200">
                        <div
                          className="h-full bg-emerald-500"
                          style={{ width: `${Math.min(100, (applicants / 10) * 100)}%` }}
                        />
                      </div>
                      <span className="mt-2 block text-xs text-slate-500">
                        {applicants} applied of 10 capacity
                      </span>
                    </div>
                  </article>
                );
              }

              return (
                <article
                  key={job.id}
                  className={`min-w-0 border border-slate-200 bg-white p-3 transition hover:border-indigo-300 hover:shadow-md sm:p-4 ${
                    view === "list"
                      ? "flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"
                      : "flex flex-col gap-4"
                  }`}
                >
                  <div className="flex min-w-0 items-start gap-3 sm:gap-4">
                    <JobLogo job={job} />
                    {/* flex-1 is the key fix: without it this column did
                        NOT expand to the remaining card width, so the
                        title wrapped and the tags below it were squeezed
                        into a narrow column and broke one per line. */}
                    <div className="min-w-0 flex-1">
                      <Link
                        href={`/dashboard/jobs/${job.id}`}
                        className="block text-sm font-bold leading-snug text-slate-800 hover:text-indigo-600 sm:text-base"
                      >
                        {job.title}
                      </Link>
                      <p className="mt-1 text-xs leading-snug text-slate-500">
                        {job.company} · {job.location}
                      </p>
                      {/* List view: tags stay under the title, as before. */}
                      {view === "list" && (
                        <div className="mt-2 flex flex-wrap gap-1.5">
                          {job.type && (
                            <span className="whitespace-nowrap rounded-full bg-teal-50 px-2 py-1 text-[10px] text-teal-600">
                              {job.type}
                            </span>
                          )}
                          {job.category && (
                            <span className="whitespace-nowrap rounded-full border border-orange-300 px-2 py-1 text-[10px] text-orange-500">
                              {job.category}
                            </span>
                          )}
                          {job.level && (
                            <span className="whitespace-nowrap rounded-full border border-indigo-300 px-2 py-1 text-[10px] text-indigo-600">
                              {job.level}
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                  {/* Grid view: tags get the FULL card width, below the
                      logo/title row, so 2-3 tags fit on one row instead
                      of stacking one per line. */}
                  {view === "grid" && (
                    <div className="flex flex-wrap gap-1.5">
                      {job.type && (
                        <span className="whitespace-nowrap rounded-full bg-teal-50 px-2 py-1 text-[10px] text-teal-600">
                          {job.type}
                        </span>
                      )}
                      {job.category && (
                        <span className="whitespace-nowrap rounded-full border border-orange-300 px-2 py-1 text-[10px] text-orange-500">
                          {job.category}
                        </span>
                      )}
                      {job.level && (
                        <span className="whitespace-nowrap rounded-full border border-indigo-300 px-2 py-1 text-[10px] text-indigo-600">
                          {job.level}
                        </span>
                      )}
                    </div>
                  )}
                  <div
                    className={`flex shrink-0 flex-col gap-1 ${
                      view === "list"
                        ? "self-stretch sm:w-36 sm:items-stretch"
                        : "mt-auto pt-1"
                    }`}
                  >
                    <button
                      onClick={() =>
                        setApplied((prev) => (prev.includes(job.id) ? prev : [...prev, job.id]))
                      }
                      disabled={isApplied}
                      className="w-full bg-indigo-600 px-4 py-2 text-xs font-semibold text-white hover:bg-indigo-700 disabled:cursor-default disabled:bg-indigo-300"
                    >
                      {isApplied ? "Applied" : "Apply"}
                    </button>
                    <div className="h-1.5 overflow-hidden bg-indigo-100">
                      <div
                        className="h-full bg-indigo-600"
                        style={{ width: `${Math.min(100, (applicants / 10) * 100)}%` }}
                      />
                    </div>
                    <span className="text-[10px] text-slate-500">
                      {applicants} applied of 10 capacity
                    </span>
                  </div>
                </article>
              );
            })}
            {!results.length && (
              <p className="border border-slate-200 bg-white p-8 text-center text-sm text-slate-500">
                No matching jobs. Try a different keyword or clear the filters.
              </p>
            )}
          </div>

          {results.length > pageSize && (
            <nav aria-label="Jobs pagination" className="mt-7 flex items-center justify-center gap-2">
              <button
                aria-label="Previous page"
                disabled={currentPage === 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="rounded px-2 py-2 disabled:opacity-30"
              >
                <ArrowLeft size={17} />
              </button>
              {pageNumbers(currentPage, totalPages).map((num, i) =>
                num === "..." ? (
                  <span key={`dots-${i}`} className="px-1 text-sm text-slate-400">
                    ...
                  </span>
                ) : (
                  <button
                    key={num}
                    onClick={() => setPage(num)}
                    className={`h-9 w-9 text-sm ${
                      currentPage === num ? "bg-indigo-600 text-white" : "text-slate-600 hover:bg-slate-100"
                    }`}
                  >
                    {num}
                  </button>
                )
              )}
              <button
                aria-label="Next page"
                disabled={currentPage === totalPages}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                className="rounded px-2 py-2 disabled:opacity-30"
              >
                <ArrowRight size={17} />
              </button>
            </nav>
          )}
        </div>
      </div>

      {/* Mobile filter drawer */}
      {filterOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            aria-label="Close filters"
            className="absolute inset-0 bg-slate-950/50"
            onClick={() => setFilterOpen(false)}
          />
          <aside className="absolute inset-y-0 left-0 flex w-[min(88vw,360px)] flex-col bg-white shadow-xl">
            <div className="flex items-center justify-between border-b p-4">
              <h2 className="text-lg font-bold">Filter jobs</h2>
              <button onClick={() => setFilterOpen(false)} aria-label="Close filters">
                <X size={22} />
              </button>
            </div>
            <div className="flex-1 space-y-6 overflow-y-auto p-4">
              {filters.map((group) => (
                <FilterGroup key={group.field} group={group} selected={selected} onToggle={toggleFilter} />
              ))}
            </div>
            <div className="flex gap-2 border-t p-4">
              <button onClick={clearFilters} className="flex-1 border border-slate-300 px-3 py-3 text-sm">
                Clear
              </button>
              <button
                onClick={() => setFilterOpen(false)}
                className="flex-1 bg-indigo-600 px-3 py-3 text-sm font-semibold text-white"
              >
                Show {results.length} jobs
              </button>
            </div>
          </aside>
        </div>
      )}
    </div>
  );
}
