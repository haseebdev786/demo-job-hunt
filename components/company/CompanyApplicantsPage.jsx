"use client";

// Place this file at: components/company/CompanyApplicantsPage.jsx
// All Applicants (3.4), inside the company layout.
// Header: Total Applicants: 19, Search Applicants, Filter (by stage),
// Pipeline View / Table View toggle.
// Table View (default, like the screenshot): checkbox, Full Name,
// Score (star), Hiring Stage pill, Applied Date, Job Role,
// See Application button + "..." menu (Copy link, local only).
// Pipeline View: same applicants grouped by Hiring Stage columns.
// Sorting: click a column header to sort by that column.
// Pagination: 10 per page by default (select 10 / 20 / 50),
// page buttons 1, 2 for 19 applicants.
// See Application links to /company/applicants/<id> (3.5-3.8).
// Company name in the header comes from props (session).

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowUpDown, ListFilter, Search, Star } from "lucide-react";
import { companyApplicants } from "@/lib/company-applicants-data";

const stageStyles = {
  Interview: "border-violet-200 bg-violet-50 text-violet-600",
  Shortlisted: "border-amber-200 bg-amber-50 text-amber-600",
  Declined: "border-red-200 bg-red-50 text-red-500",
  Hired: "border-emerald-200 bg-emerald-50 text-emerald-600",
  Interviewed: "border-cyan-200 bg-cyan-50 text-cyan-600",
};

const stages = ["All", "Interview", "Shortlisted", "Interviewed", "Hired", "Declined"];

function StagePill({ stage }) {
  return (
    <span className={`whitespace-nowrap border px-3 py-1 text-xs font-semibold ${stageStyles[stage] || "border-slate-200 bg-slate-50 text-slate-600"}`}>
      {stage}
    </span>
  );
}

export default function CompanyApplicantsPage({ companyName = "Nomad", companyInitial = "N" }) {
  const [view, setView] = useState("table");
  const [search, setSearch] = useState("");
  const [stageFilter, setStageFilter] = useState("All");
  const [sortKey, setSortKey] = useState("appliedDate");
  const [sortAsc, setSortAsc] = useState(false);
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [selected, setSelected] = useState([]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    let list = companyApplicants.filter((a) => {
      const matchesStage = stageFilter === "All" || a.stage === stageFilter;
      const matchesSearch = !q || a.name.toLowerCase().includes(q) || a.jobRole.toLowerCase().includes(q);
      return matchesStage && matchesSearch;
    });
    list = [...list].sort((a, b) => {
      const av = a[sortKey];
      const bv = b[sortKey];
      if (typeof av === "number" && typeof bv === "number") return sortAsc ? av - bv : bv - av;
      return sortAsc ? String(av).localeCompare(String(bv)) : String(bv).localeCompare(String(av));
    });
    return list;
  }, [search, stageFilter, sortKey, sortAsc]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
  const safePage = Math.min(page, totalPages);
  const pageItems = filtered.slice((safePage - 1) * perPage, safePage * perPage);

  function toggleSort(key) {
    if (sortKey === key) setSortAsc(!sortAsc);
    else {
      setSortKey(key);
      setSortAsc(true);
    }
    setPage(1);
  }

  function toggleSelect(id) {
    setSelected((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  }

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

      <div className="mt-8 flex flex-wrap items-center justify-between gap-4">
        <h2 className="text-lg font-bold text-slate-800">Total Applicants: {companyApplicants.length}</h2>
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 border border-slate-200 bg-white px-3">
            <Search size={16} className="text-slate-400" />
            <input
              type="search"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              placeholder="Search Applicants"
              className="w-full py-2 text-sm outline-none placeholder:text-slate-400 sm:w-56"
            />
          </div>
          <label className="flex items-center gap-2 border border-slate-200 bg-white px-3 py-2 text-sm text-slate-600">
            <ListFilter size={16} />
            <select
              value={stageFilter}
              onChange={(e) => {
                setStageFilter(e.target.value);
                setPage(1);
              }}
              className="bg-transparent text-sm outline-none"
              aria-label="Filter by hiring stage"
            >
              {stages.map((s) => (
                <option key={s} value={s}>{s === "All" ? "Filter" : s}</option>
              ))}
            </select>
          </label>
          <div className="flex gap-1">
            <button
              type="button"
              onClick={() => setView("pipeline")}
              className={`px-4 py-2 text-sm font-semibold ${view === "pipeline" ? "bg-indigo-600 text-white" : "bg-white text-indigo-600 ring-1 ring-indigo-200"}`}
            >
              Pipeline View
            </button>
            <button
              type="button"
              onClick={() => setView("table")}
              className={`px-4 py-2 text-sm font-semibold ${view === "table" ? "bg-indigo-600 text-white" : "bg-white text-indigo-600 ring-1 ring-indigo-200"}`}
            >
              Table View
            </button>
          </div>
        </div>
      </div>

      {view === "pipeline" ? (
        <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-5">
          {stages.slice(1).map((stage) => (
            <div key={stage} className="border border-slate-200 bg-white p-4">
              <p className="font-bold text-slate-800">{stage}</p>
              <p className="text-xs text-slate-500">{filtered.filter((a) => a.stage === stage).length} applicants</p>
              <div className="mt-3 space-y-3">
                {filtered.filter((a) => a.stage === stage).map((a) => (
                  <Link key={a.id} href={`/company/applicants/${a.id}`} className="block border border-slate-200 p-3 hover:border-indigo-300">
                    <p className="text-sm font-bold text-slate-800">{a.name}</p>
                    <p className="text-xs text-slate-500">{a.jobRole} - {a.appliedDate}</p>
                    <p className="mt-1 flex items-center gap-1 text-xs text-amber-500"><Star size={12} fill="currentColor" /> {a.score.toFixed(2)}</p>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="mt-6 overflow-x-auto border border-slate-200 bg-white">
          <table className="w-full min-w-[800px] text-left text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-xs text-slate-500">
                <th className="px-4 py-3">
                  <input
                    type="checkbox"
                    checked={pageItems.length > 0 && pageItems.every((a) => selected.includes(a.id))}
                    onChange={() => {
                      const ids = pageItems.map((a) => a.id);
                      setSelected((prev) => (pageItems.every((a) => prev.includes(a.id)) ? prev.filter((x) => !ids.includes(x)) : [...new Set([...prev, ...ids])]));
                    }}
                    aria-label="Select all on this page"
                  />
                </th>
                {[
                  { key: "name", label: "Full Name" },
                  { key: "score", label: "Score" },
                  { key: "stage", label: "Hiring Stage" },
                  { key: "appliedDate", label: "Applied Date" },
                  { key: "jobRole", label: "Job Role" },
                ].map((col) => (
                  <th key={col.key} className="px-4 py-3">
                    <button type="button" onClick={() => toggleSort(col.key)} className="flex items-center gap-1 font-semibold hover:text-slate-800">
                      {col.label} <ArrowUpDown size={12} />
                    </button>
                  </th>
                ))}
                <th className="px-4 py-3">Action</th>
              </tr>
            </thead>
            <tbody>
              {pageItems.map((a) => (
                <tr key={a.id} className="border-b border-slate-100">
                  <td className="px-4 py-3">
                    <input type="checkbox" checked={selected.includes(a.id)} onChange={() => toggleSelect(a.id)} aria-label={`Select ${a.name}`} />
                  </td>
                  <td className="px-4 py-3">
                    <span className="flex items-center gap-3">
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-xs font-bold text-indigo-600">
                        {a.name.charAt(0)}
                      </span>
                      <span className="font-bold text-slate-800">{a.name}</span>
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="flex items-center gap-1 text-amber-500"><Star size={14} fill="currentColor" /> <span className="text-slate-800">{a.score.toFixed(2)}</span></span>
                  </td>
                  <td className="px-4 py-3"><StagePill stage={a.stage} /></td>
                  <td className="px-4 py-3 text-slate-600">{a.appliedDate}</td>
                  <td className="px-4 py-3 text-slate-600">{a.jobRole}</td>
                  <td className="px-4 py-3">
                    <span className="flex items-center gap-2">
                      <Link href={`/company/applicants/${a.id}`} className="whitespace-nowrap border border-indigo-200 px-3 py-1.5 text-xs font-semibold text-indigo-600 hover:bg-indigo-50">
                        See Application
                      </Link>
                      <span className="text-slate-400">...</span>
                    </span>
                  </td>
                </tr>
              ))}
              {pageItems.length === 0 && (
                <tr><td colSpan={7} className="px-4 py-8 text-center text-slate-500">No applicants found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      <div className="mt-4 flex flex-wrap items-center justify-between gap-4 text-sm text-slate-500">
        <p>
          View{" "}
          <select value={perPage} onChange={(e) => { setPerPage(Number(e.target.value)); setPage(1); }} className="border border-slate-200 bg-white px-2 py-1 outline-none" aria-label="Applicants per page">
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
    </div>
  );
}
