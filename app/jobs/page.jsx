"use client";

import { useMemo, useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import {
  ArrowLeft, ArrowRight, ChevronDown, ChevronUp, Grid2X2,
  List, MapPin, Search, SlidersHorizontal, X,
} from "lucide-react";
import { FaDropbox } from "react-icons/fa";
import { SiCanvas } from "react-icons/si";

const jobs = [
  { id: 1, title: "Social Media Assistant", company: "Nomad", location: "Paris, France", category: "Marketing", type: "Full-Time", level: "Entry Level", salary: "€30k - €60k", logo: "N", logoColor: "text-emerald-500", applicants: 5 },
  { id: 2, title: "Brand Designer", company: "Dropbox", location: "San Francisco, USA", category: "Design", type: "Full-Time", level: "Mid Level", salary: "€60k - €100k", logo: FaDropbox, logoColor: "text-blue-600", applicants: 2 },
  { id: 3, title: "Interactive Developer", company: "Terraform", location: "Hamburg, Germany", category: "Technology", type: "Remote", level: "Senior Level", salary: "€60k - €100k", logo: "T", logoColor: "text-cyan-500", applicants: 2 },
  { id: 4, title: "Email Marketing", company: "Revolut", location: "Madrid, Spain", category: "Marketing", type: "Full-Time", level: "Entry Level", salary: "€30k - €60k", logo: "R", logoColor: "text-slate-900", applicants: 0 },
  { id: 5, title: "Lead Engineer", company: "Canva", location: "Ontario, Canada", category: "Engineering", type: "Full-Time", level: "Director", salary: "€100k+", logo: SiCanvas, logoColor: "text-teal-500", applicants: 6 },
  { id: 6, title: "Product Designer", company: "ClassPass", location: "Barcelona, Spain", category: "Design", type: "Part-Time", level: "Mid Level", salary: "€30k - €60k", logo: "C", logoColor: "text-blue-600", applicants: 6 },
  { id: 7, title: "Customer Manager", company: "Pitch", location: "Berlin, Germany", category: "Business", type: "Full-Time", level: "Senior Level", salary: "€60k - €100k", logo: "P", logoColor: "text-slate-900", applicants: 5 },
  { id: 8, title: "Visual Designer", company: "Blinkist", location: "Granada, Spain", category: "Design", type: "Remote", level: "Entry Level", salary: "€30k - €60k", logo: "B", logoColor: "text-emerald-500", applicants: 3 },
  { id: 9, title: "HR Manager", company: "Webflow", location: "Lucerne, Switzerland", category: "Human Resource", type: "Full-Time", level: "Director", salary: "€100k+", logo: "W", logoColor: "text-indigo-600", applicants: 4 },
  { id: 10, title: "Financial Analyst", company: "GoDaddy", location: "Marseille, France", category: "Finance", type: "Internship", level: "Entry Level", salary: "€0 - €30k", logo: "G", logoColor: "text-green-600", applicants: 1 },
  { id: 11, title: "Sales Specialist", company: "Notion", location: "London, UK", category: "Sales", type: "Contract", level: "Mid Level", salary: "€60k - €100k", logo: "N", logoColor: "text-slate-900", applicants: 3 },
  { id: 12, title: "Backend Developer", company: "Dropbox", location: "Remote", category: "Technology", type: "Remote", level: "Senior Level", salary: "€100k+", logo: FaDropbox, logoColor: "text-blue-600", applicants: 4 },
];

const filters = [
  { title: "Type of Employment", field: "type", options: ["Full-Time", "Part-Time", "Remote", "Internship", "Contract"] },
  { title: "Categories", field: "category", options: ["Design", "Sales", "Marketing", "Business", "Human Resource", "Finance", "Engineering", "Technology"] },
  { title: "Job Level", field: "level", options: ["Entry Level", "Mid Level", "Senior Level", "Director"] },
  { title: "Salary Range", field: "salary", options: ["€0 - €30k", "€30k - €60k", "€60k - €100k", "€100k+"] },
];

function JobLogo({ job }) {
  const Logo = job.logo;
  return (
    <div className="flex h-10 w-10 shrink-0 items-center justify-center sm:h-12 sm:w-12">
      {typeof Logo === "string" ? (
        <span className={`flex h-9 w-9 items-center justify-center rounded-lg bg-slate-50 text-2xl font-extrabold ${job.logoColor}`}>{Logo}</span>
      ) : (
        <Logo className={`text-3xl ${job.logoColor}`} aria-label={job.company} />
      )}
    </div>
  );
}

function FilterGroup({ group, selected, onToggle }) {
  const [expanded, setExpanded] = useState(true);
  return (
    <div className="border-b border-slate-100 pb-5 last:border-0">
      <button type="button" className="mb-3 flex w-full items-center justify-between gap-2 text-left text-sm font-bold text-slate-800" onClick={() => setExpanded(!expanded)} aria-expanded={expanded}>
        {group.title}
        {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
      </button>
      {expanded && (
        <div className="space-y-3">
          {group.options.map((option) => {
            const count = jobs.filter((job) => job[group.field] === option).length;
            return (
              <label key={option} className="flex cursor-pointer items-center gap-2.5 text-xs text-slate-500">
                <input type="checkbox" className="h-4 w-4 cursor-pointer accent-indigo-600" checked={(selected[group.field] || []).includes(option)} onChange={() => onToggle(group.field, option)} />
                <span>{option} ({count})</span>
              </label>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default function FindJobsPage() {
  const [keyword, setKeyword] = useState("");
  const [search, setSearch] = useState("");
  const [location, setLocation] = useState("");
  const [selected, setSelected] = useState({});
  const [filterOpen, setFilterOpen] = useState(false);
  const [sort, setSort] = useState("relevant");
  const [view, setView] = useState("list");
  const [page, setPage] = useState(1);
  const [applied, setApplied] = useState([]);
  const pageSize = 7;

  const toggleFilter = (field, value) => {
    setSelected((prev) => {
      const oldValues = prev[field] || [];
      return { ...prev, [field]: oldValues.includes(value) ? oldValues.filter((x) => x !== value) : [...oldValues, value] };
    });
    setPage(1);
  };

  const results = useMemo(() => {
    const term = search.trim().toLowerCase();
    const loc = location.trim().toLowerCase();
    const list = jobs.filter((job) => {
      const matchesTerm = !term || `${job.title} ${job.company} ${job.category}`.toLowerCase().includes(term);
      const matchesLocation = !loc || job.location.toLowerCase().includes(loc);
      return matchesTerm && matchesLocation && filters.every(({ field }) => !(selected[field] || []).length || selected[field].includes(job[field]));
    });
    if (sort === "az") list.sort((a, b) => a.title.localeCompare(b.title));
    if (sort === "company") list.sort((a, b) => a.company.localeCompare(b.company));
    return list;
  }, [search, location, selected, sort]);

  const totalPages = Math.max(1, Math.ceil(results.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const pagedJobs = results.slice((currentPage - 1) * pageSize, currentPage * pageSize);
  const clearFilters = () => { setSelected({}); setPage(1); };

  return (
    <div className="min-h-screen bg-white text-slate-800">
      <Navbar />
      <header className="bg-[#F8F8FD] px-4 py-10 sm:px-6 sm:py-14 lg:py-16">
        <div className="mx-auto max-w-7xl text-center">
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">Find your <span className="text-sky-400">dream job</span></h1>
          <p className="mt-3 text-sm text-slate-500">Find your next career at companies like HubSpot, Nike, and Dropbox</p>
          <form onSubmit={(e) => { e.preventDefault(); setSearch(keyword); setPage(1); }} className="mx-auto mt-7 flex w-full max-w-5xl flex-col gap-3 bg-white p-3 shadow-lg sm:p-4 md:flex-row md:items-center md:gap-5">
            <label className="flex min-w-0 flex-1 items-center gap-3 border-b border-slate-200 px-2 py-2 md:border-0">
              <Search size={20} className="shrink-0 text-slate-700" />
              <input aria-label="Job title or keyword" value={keyword} onChange={(e) => setKeyword(e.target.value)} placeholder="Job title or keyword" className="w-full min-w-0 bg-transparent text-sm outline-none placeholder:text-slate-400" />
            </label>
            <label className="flex min-w-0 flex-1 items-center gap-3 border-b border-slate-200 px-2 py-2 md:border-0">
              <MapPin size={20} className="shrink-0 text-slate-700" />
              <input aria-label="Location" value={location} onChange={(e) => { setLocation(e.target.value); setPage(1); }} placeholder="City or Remote" className="w-full min-w-0 bg-transparent text-sm outline-none placeholder:text-slate-400" />
            </label>
            <button type="submit" className="bg-indigo-600 px-7 py-3.5 text-sm font-semibold text-white transition hover:bg-indigo-700">Search</button>
          </form>
          <p className="mx-auto mt-3 max-w-5xl text-left text-xs text-slate-400">Popular: UI Designer, UX Researcher, Android, Admin</p>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:py-12">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[230px_minmax(0,1fr)] lg:gap-12">
          <aside className="hidden space-y-6 lg:block" aria-label="Job filters">
            {filters.map((group) => <FilterGroup key={group.field} group={group} selected={selected} onToggle={toggleFilter} />)}
            <button onClick={clearFilters} className="text-sm font-semibold text-indigo-600">Clear all filters</button>
          </aside>

          <div className="min-w-0">
            <div className="mb-5 flex flex-wrap items-start justify-between gap-3">
              <div>
                <h2 className="text-xl font-bold sm:text-2xl">All Jobs</h2>
                <p className="mt-1 text-xs text-slate-500">Showing {results.length} results</p>
              </div>
              <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                <button className="flex items-center gap-2 border border-slate-200 px-3 py-2 text-sm lg:hidden" onClick={() => setFilterOpen(true)}><SlidersHorizontal size={16} /> Filters</button>
                <select aria-label="Sort jobs" value={sort} onChange={(e) => { setSort(e.target.value); setPage(1); }} className="min-w-0 bg-white text-xs text-slate-600 outline-none sm:text-sm">
                  <option value="relevant">Most Relevant</option>
                  <option value="az">Job title A–Z</option>
                  <option value="company">Company A–Z</option>
                </select>
                <div className="hidden items-center gap-1 border-l border-slate-200 pl-2 sm:flex">
                  <button aria-label="Grid view" title="Grid view" onClick={() => setView("grid")} className={`p-2 ${view === "grid" ? "bg-indigo-50 text-indigo-600" : "text-slate-400"}`}><Grid2X2 size={17} /></button>
                  <button aria-label="List view" title="List view" onClick={() => setView("list")} className={`p-2 ${view === "list" ? "bg-indigo-50 text-indigo-600" : "text-slate-400"}`}><List size={17} /></button>
                </div>
              </div>
            </div>

            <div className={view === "grid" ? "grid gap-3 sm:grid-cols-2" : "space-y-3"}>
              {pagedJobs.map((job) => (
                <article key={job.id} className={`min-w-0 border border-slate-200 bg-white p-3 transition hover:border-indigo-300 hover:shadow-md sm:p-4 ${view === "list" ? "flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between" : "flex flex-col gap-4"}`}>
                  <div className="flex min-w-0 items-start gap-3 sm:gap-4">
                    <JobLogo job={job} />
                    <div className="min-w-0">
                      <h3 className="text-sm font-bold sm:text-base">{job.title}</h3>
                      <p className="mt-1 text-xs text-slate-500">{job.company} · {job.location}</p>
                      <div className="mt-2 flex flex-wrap gap-1.5">
                        <span className="rounded-full bg-teal-50 px-2 py-1 text-[10px] text-teal-600">{job.type}</span>
                        <span className="rounded-full border border-orange-300 px-2 py-1 text-[10px] text-orange-500">{job.category}</span>
                        <span className="rounded-full border border-indigo-300 px-2 py-1 text-[10px] text-indigo-600">{job.level}</span>
                      </div>
                    </div>
                  </div>
                  <div className={`flex shrink-0 flex-col gap-1 ${view === "list" ? "self-stretch sm:w-36 sm:items-stretch" : ""}`}>
                    <button onClick={() => setApplied((prev) => prev.includes(job.id) ? prev : [...prev, job.id])} disabled={applied.includes(job.id)} className="w-full bg-indigo-600 px-4 py-2 text-xs font-semibold text-white hover:bg-indigo-700 disabled:cursor-default disabled:bg-indigo-300">{applied.includes(job.id) ? "Applied" : "Apply"}</button>
                    <div className="h-1.5 overflow-hidden bg-indigo-100"><div className="h-full bg-indigo-600" style={{ width: `${Math.min(100, (job.applicants / 10) * 100)}%` }} /></div>
                    <span className="text-[10px] text-slate-500">{job.applicants} applied of 10 capacity</span>
                  </div>
                </article>
              ))}
              {!results.length && <p className="border border-slate-200 p-8 text-center text-sm text-slate-500">No matching jobs. Try a different keyword or clear the filters.</p>}
            </div>

            {results.length > pageSize && (
              <nav aria-label="Jobs pagination" className="mt-7 flex items-center justify-center gap-2">
                <button aria-label="Previous page" disabled={currentPage === 1} onClick={() => setPage((p) => Math.max(1, p - 1))} className="rounded px-2 py-2 disabled:opacity-30"><ArrowLeft size={17} /></button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((num) => <button key={num} onClick={() => setPage(num)} className={`h-9 w-9 text-sm ${currentPage === num ? "bg-indigo-600 text-white" : "text-slate-600 hover:bg-slate-100"}`}>{num}</button>)}
                <button aria-label="Next page" disabled={currentPage === totalPages} onClick={() => setPage((p) => Math.min(totalPages, p + 1))} className="rounded px-2 py-2 disabled:opacity-30"><ArrowRight size={17} /></button>
              </nav>
            )}
          </div>
        </div>
      </main>

      {filterOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button aria-label="Close filters" className="absolute inset-0 bg-slate-950/50" onClick={() => setFilterOpen(false)} />
          <aside className="absolute inset-y-0 left-0 flex w-[min(88vw,360px)] flex-col bg-white shadow-xl">
            <div className="flex items-center justify-between border-b p-4"><h2 className="text-lg font-bold">Filter jobs</h2><button onClick={() => setFilterOpen(false)} aria-label="Close filters"><X size={22} /></button></div>
            <div className="flex-1 space-y-6 overflow-y-auto p-4">{filters.map((group) => <FilterGroup key={group.field} group={group} selected={selected} onToggle={toggleFilter} />)}</div>
            <div className="flex gap-2 border-t p-4"><button onClick={clearFilters} className="flex-1 border border-slate-300 px-3 py-3 text-sm">Clear</button><button onClick={() => setFilterOpen(false)} className="flex-1 bg-indigo-600 px-3 py-3 text-sm font-semibold text-white">Show {results.length} jobs</button></div>
          </aside>
        </div>
      )}
      <Footer />
    </div>
  );
}

