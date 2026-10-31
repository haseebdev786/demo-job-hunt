"use client";

// Place this file at: components/company/CompanyJobDetailsPage.jsx
// Job Detail for one job (3.10 Applicants Table View, 3.11 Pipeline
// View, 3.12 Job Details, 3.13 Analytics), inside the company layout.
// Header: back arrow + job title + "Design - Full-Time - 4 / 11 Hired"
// (for Social Media Assistant; for other jobs it is built from the
// job row: type + applicants/needs) + More Action button.
// Tabs: Applicants | Job Details | Analytics.
//   Applicants tab: Total Applicants: 19, Search, Filter (stage),
//     Pipeline View / Table View toggle.
//     Table View uses companyApplicants (19, same as All Applicants
//     and as screenshot 3.10). Pipeline View uses pipelineApplicants
//     (its own demo list, see lib/company-jobs-data.js -- the
//     pipeline screenshot's counts/names do not match the table).
//   Job Details tab: Edit Job Details button (opens an edit form
//     modal; saving is LOCAL only for now, not saved to MongoDB),
//     Description, Responsibilities, Who You Are, Nice-To-Haves,
//     Perks & Benefits, About this role, Categories, Required Skills.
//     For Social Media Assistant all of this is screenshot 3.12;
//     for other jobs it is generated from the job row (title/type).
//   Analytics tab: Total Views 23,564 (+5.4%), Total Applied 132,
//     Job Listing View stats line chart (Last 7 days, tooltip on
//     23 Jul = 243 views, like the screenshot), Traffic channel
//     donut (Direct 48%, Social 33%, Organic 24%, Other 6% --
//     normalised to 100% for drawing, see the data file note),
//     Visitors by country (USA, France, Italy, Germany, Japan).
//     Analytics values are Social Media Assistant's screenshot
//     values for every job for now -- they are NOT per-job live
//     analytics yet. That is stated on the Analytics tab.

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowLeft, ChevronDown, ListFilter, Search, Star, X } from "lucide-react";
import { companyApplicants } from "@/lib/company-applicants-data";
import { pipelineApplicants, socialMediaAssistantDetail } from "@/lib/company-jobs-data";

const stageStyles = {
  Interview: "border-violet-200 bg-violet-50 text-violet-600",
  Shortlisted: "border-amber-200 bg-amber-50 text-amber-600",
  Declined: "border-red-200 bg-red-50 text-red-500",
  Hired: "border-emerald-200 bg-emerald-50 text-emerald-600",
  Interviewed: "border-cyan-200 bg-cyan-50 text-cyan-600",
  "In Review": "border-amber-200 bg-amber-50 text-amber-600",
};

function StagePill({ stage }) {
  return (
    <span className={`whitespace-nowrap border px-3 py-1 text-xs font-semibold ${stageStyles[stage] || "border-slate-200 bg-slate-50 text-slate-600"}`}>
      {stage}
    </span>
  );
}

// Simple SVG line chart: points joined with a smooth-ish polyline,
// dots on each point, tooltip on the 23 Jul point (243 views).
function LineChart({ data }) {
  const width = 600;
  const height = 200;
  const max = Math.max(...data.map((d) => d.views), 1);
  const points = data.map((d, i) => ({
    x: 20 + (i / (data.length - 1)) * (width - 40),
    y: height - 20 - (d.views / max) * (height - 40),
    ...d,
  }));
  const path = points.map((p, i) => `${i === 0 ? "M" : "L"}${p.x},${p.y}`).join(" ");
  return (
    <div className="overflow-x-auto">
      <svg viewBox={`0 0 ${width} ${height}`} className="min-w-[500px] w-full">
        {[0, 100, 250, 500, 750, 1000, 1250, 1500].filter((v) => v <= max + 200).map((v) => (
          <g key={v}>
            <line x1="20" x2={width - 20} y1={height - 20 - (v / max) * (height - 40)} y2={height - 20 - (v / max) * (height - 40)} stroke="#e2e8f0" strokeWidth="1" />
            <text x="0" y={height - 20 - (v / max) * (height - 40) + 4} fontSize="10" fill="#94a3b8">{v}</text>
          </g>
        ))}
        <path d={path} fill="none" stroke="#10b981" strokeWidth="2" />
        {points.map((p) => (
          <g key={p.date}>
            <circle cx={p.x} cy={p.y} r="4" fill="#10b981" />
            {p.date === "23 Jul" && (
              <g>
                <rect x={p.x - 28} y={p.y - 52} width="56" height="28" rx="4" fill="#1e293b" />
                <text x={p.x} y={p.y - 34} textAnchor="middle" fontSize="11" fill="#fff">Views</text>
                <text x={p.x} y={p.y - 20} textAnchor="middle" fontSize="11" fontWeight="bold" fill="#fff">{p.views}</text>
              </g>
            )}
            <text x={p.x} y={height - 4} textAnchor="middle" fontSize="10" fill="#94a3b8">{p.date}</text>
          </g>
        ))}
      </svg>
    </div>
  );
}

// Donut chart: segments normalised to 100% (screenshot percents sum to 111%).
function DonutChart({ data }) {
  const total = data.reduce((sum, d) => sum + d.percent, 0);
  const radius = 60;
  const circumference = 2 * Math.PI * radius;
  return (
    <svg viewBox="0 0 160 160" className="h-36 w-36">
      {data.map((d, index) => {
        const fraction = d.percent / total;
        const dash = fraction * circumference;
        const offset = data.slice(0, index).reduce((sum, item) => sum + item.percent, 0) / total * circumference;
        const el = (
          <circle
            key={d.label}
            cx="80"
            cy="80"
            r={radius}
            fill="none"
            stroke={d.color}
            strokeWidth="22"
            strokeDasharray={`${dash} ${circumference - dash}`}
            strokeDashoffset={-offset}
            transform="rotate(-90 80 80)"
          />
        );
        return el;
      })}
    </svg>
  );
}

export default function CompanyJobDetailsPage({ job, companyName = "Nomad", initialTab = "applicants" }) {
  const isSMA = job.slug === "social-media-assistant";
  const detail = isSMA
    ? socialMediaAssistantDetail
    : {
        description: `${job.role} is an open role at ${companyName}. Full description for this demo job is not in the screenshots -- replace it in lib/company-jobs-data.js with real job details.`,
        responsibilities: ["Own the day-to-day work for this role", "Collaborate with the team on delivery", "Report progress to the hiring manager"],
        whoYouAre: ["You have relevant experience for this role", "You are detail-oriented and a team player"],
        niceToHaves: ["Relevant portfolio", "Strong communication skills"],
        perks: socialMediaAssistantDetail.perks,
        aboutRole: {
          applied: `${job.needs} needs`,
          applyBefore: job.dueDate,
          jobPostedOn: job.datePosted,
          jobType: job.jobType,
          salary: "Not specified",
        },
        categories: ["Design"],
        requiredSkills: [job.role],
        analytics: socialMediaAssistantDetail.analytics,
      };

  const [tab, setTab] = useState(initialTab);
  const [applicantView, setApplicantView] = useState("table");
  const [search, setSearch] = useState("");
  const [stageFilter, setStageFilter] = useState("All");
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [editOpen, setEditOpen] = useState(false);
  const [editedTitle, setEditedTitle] = useState(job.role);
  const [editedDescription, setEditedDescription] = useState(detail.description);

  const tableFiltered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return companyApplicants.filter((a) => {
      const matchesStage = stageFilter === "All" || a.stage === stageFilter;
      const matchesSearch = !q || a.name.toLowerCase().includes(q) || a.jobRole.toLowerCase().includes(q);
      return matchesStage && matchesSearch;
    });
  }, [search, stageFilter]);
  const totalPages = Math.max(1, Math.ceil(tableFiltered.length / perPage));
  const safePage = Math.min(page, totalPages);
  const pageItems = tableFiltered.slice((safePage - 1) * perPage, safePage * perPage);

  const pipelineStages = ["In Review", "Shortlisted", "Interview", "Hired", "Declined"];
  const analytics = detail.analytics;
  const maxVisitors = Math.max(...analytics.visitorsByCountry.map((c) => c.visitors), 1);

  return (
    <div className="px-4 py-8 sm:px-6 lg:px-10">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <Link href="/company/jobs" className="flex items-center gap-2 text-lg font-bold text-slate-800">
          <ArrowLeft size={20} /> {editedTitle}
        </Link>
        <button type="button" className="flex items-center gap-1 border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-600">
          <ChevronDown size={16} /> More Action
        </button>
      </div>
      <p className="mt-1 pl-7 text-sm text-slate-500">
        Design - {job.jobType} - 4 / 11 Hired
      </p>

      <div className="mt-6 flex gap-6 border-b border-slate-200 text-sm">
        {[
          { id: "applicants", label: "Applicants" },
          { id: "details", label: "Job Details" },
          { id: "analytics", label: "Analytics" },
        ].map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTab(t.id)}
            className={`-mb-px pb-2 ${tab === t.id ? "border-b-2 border-indigo-600 font-bold text-slate-800" : "text-slate-500 hover:text-slate-800"}`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === "applicants" && (
        <div className="mt-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <h2 className="text-lg font-bold text-slate-800">Total Applicants: {companyApplicants.length}</h2>
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-2 border border-slate-200 bg-white px-3">
                <Search size={16} className="text-slate-400" />
                <input type="search" value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} placeholder="Search Applicants" className="w-full py-2 text-sm outline-none placeholder:text-slate-400 sm:w-56" />
              </div>
              <label className="flex items-center gap-2 border border-slate-200 bg-white px-3 py-2 text-sm text-slate-600">
                <ListFilter size={16} />
                <select value={stageFilter} onChange={(e) => { setStageFilter(e.target.value); setPage(1); }} className="bg-transparent text-sm outline-none" aria-label="Filter by hiring stage">
                  <option value="All">Filter</option>
                  {["In Review", "Interview", "Shortlisted", "Interviewed", "Hired", "Declined"].map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </label>
              <div className="flex gap-1">
                <button type="button" onClick={() => setApplicantView("pipeline")} className={`px-4 py-2 text-sm font-semibold ${applicantView === "pipeline" ? "bg-indigo-600 text-white" : "bg-white text-indigo-600 ring-1 ring-indigo-200"}`}>
                  Pipeline View
                </button>
                <button type="button" onClick={() => setApplicantView("table")} className={`px-4 py-2 text-sm font-semibold ${applicantView === "table" ? "bg-indigo-600 text-white" : "bg-white text-indigo-600 ring-1 ring-indigo-200"}`}>
                  Table View
                </button>
              </div>
            </div>
          </div>

          {applicantView === "pipeline" ? (
            <div>
              <p className="mt-2 text-xs text-slate-400">
                Pipeline list is its own demo list (see lib/company-jobs-data.js) -- it does not match the Table View total of 19, just like the screenshots do not agree.
              </p>
              <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-5">
                {pipelineStages.map((stage) => {
                  const cards = pipelineApplicants.filter((a) => a.stage === stage);
                  return (
                    <div key={stage} className="border border-slate-200 bg-white">
                      <div className="flex items-center justify-between border-t-4 border-indigo-600 px-4 py-3">
                        <p className="text-sm font-bold text-slate-800">{stage}</p>
                        <span className="text-xs text-slate-500">{cards.length}</span>
                      </div>
                      <div className="space-y-3 px-4 pb-4">
                        {cards.map((a) => (
                          <div key={a.id} className="border border-slate-200 p-3">
                            <div className="flex items-center gap-2">
                              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-100 text-xs font-bold text-indigo-600">{a.name.charAt(0)}</span>
                              <div>
                                <p className="text-sm font-bold text-slate-800">{a.name}</p>
                                <p className="text-xs text-indigo-600">View Profile</p>
                              </div>
                            </div>
                            <p className="mt-2 flex items-center justify-between text-xs text-slate-500">
                              <span>Applied on {a.appliedDate}</span>
                              <span className="flex items-center gap-1 text-amber-500"><Star size={12} fill="currentColor" /> {a.score.toFixed(1)}</span>
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <div>
              <div className="mt-6 overflow-x-auto border border-slate-200 bg-white">
                <table className="w-full min-w-[800px] text-left text-sm">
                  <thead>
                    <tr className="border-b border-slate-200 text-xs text-slate-500">
                      <th className="px-4 py-3"><input type="checkbox" aria-label="Select all" /></th>
                      <th className="px-4 py-3">Full Name</th>
                      <th className="px-4 py-3">Score</th>
                      <th className="px-4 py-3">Hiring Stage</th>
                      <th className="px-4 py-3">Applied Date</th>
                      <th className="px-4 py-3">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pageItems.map((a) => (
                      <tr key={a.id} className="border-b border-slate-100">
                        <td className="px-4 py-3"><input type="checkbox" aria-label={`Select ${a.name}`} /></td>
                        <td className="px-4 py-3">
                          <span className="flex items-center gap-3">
                            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-indigo-100 text-xs font-bold text-indigo-600">{a.name.charAt(0)}</span>
                            <span className="font-bold text-slate-800">{a.name}</span>
                          </span>
                        </td>
                        <td className="px-4 py-3"><span className="flex items-center gap-1 text-amber-500"><Star size={14} fill="currentColor" /> <span className="text-slate-800">{a.score.toFixed(2)}</span></span></td>
                        <td className="px-4 py-3"><StagePill stage={a.stage} /></td>
                        <td className="px-4 py-3 text-slate-600">{a.appliedDate}</td>
                        <td className="px-4 py-3">
                          <span className="flex items-center gap-2">
                            <Link href={`/company/applicants/${a.id}`} className="whitespace-nowrap border border-indigo-200 px-3 py-1.5 text-xs font-semibold text-indigo-600 hover:bg-indigo-50">See Application</Link>
                            <span className="text-slate-400">...</span>
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
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
                    <button key={p} type="button" onClick={() => setPage(p)} className={`px-3 py-1.5 ${p === safePage ? "bg-indigo-600 text-white" : "border border-slate-200 bg-white"}`}>{p}</button>
                  ))}
                  <button type="button" disabled={safePage >= totalPages} onClick={() => setPage(safePage + 1)} className="border border-slate-200 bg-white px-3 py-1.5 disabled:opacity-40">&gt;</button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {tab === "details" && (
        <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
          <div className="space-y-6">
            <section className="border border-slate-200 bg-white p-6">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-md bg-violet-100 text-lg font-black text-violet-600">{editedTitle.charAt(0)}</span>
                  <h2 className="text-lg font-bold text-slate-800">{editedTitle}</h2>
                </div>
                <button type="button" onClick={() => setEditOpen(true)} className="border border-indigo-200 px-4 py-2 text-sm font-semibold text-indigo-600 hover:bg-indigo-50">
                  Edit Job Details
                </button>
              </div>
              <h3 className="mt-6 text-base font-bold text-slate-800">Description</h3>
              <p className="mt-2 text-sm leading-6 text-slate-500">{editedDescription}</p>
              <h3 className="mt-6 text-base font-bold text-slate-800">Responsibilities</h3>
              <ul className="mt-2 space-y-2 text-sm text-slate-500">
                {detail.responsibilities.map((r) => (
                  <li key={r} className="flex gap-2"><span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-emerald-400" /> {r}</li>
                ))}
              </ul>
              <h3 className="mt-6 text-base font-bold text-slate-800">Who You Are</h3>
              <ul className="mt-2 space-y-2 text-sm text-slate-500">
                {detail.whoYouAre.map((r) => (
                  <li key={r} className="flex gap-2"><span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-emerald-400" /> {r}</li>
                ))}
              </ul>
              <h3 className="mt-6 text-base font-bold text-slate-800">Nice-To-Haves</h3>
              <ul className="mt-2 space-y-2 text-sm text-slate-500">
                {detail.niceToHaves.map((r) => (
                  <li key={r} className="flex gap-2"><span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-emerald-400" /> {r}</li>
                ))}
              </ul>
            </section>

            <section className="border border-slate-200 bg-white p-6">
              <h3 className="text-base font-bold text-slate-800">Perks & Benefits</h3>
              <p className="mt-1 text-sm text-slate-500">This job comes with several perks and benefits</p>
              <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {detail.perks.map((perk) => (
                  <div key={perk.title}>
                    <p className="text-sm font-bold text-slate-800">{perk.title}</p>
                    <p className="mt-1 text-xs leading-5 text-slate-500">{perk.text}</p>
                  </div>
                ))}
              </div>
            </section>
          </div>

          <div className="space-y-6">
            <section className="border border-slate-200 bg-white p-6">
              <h3 className="text-base font-bold text-slate-800">About this role</h3>
              <dl className="mt-4 space-y-3 text-sm">
                <div className="flex justify-between gap-4"><dt className="text-slate-500">Applied</dt><dd className="font-semibold text-slate-800">{detail.aboutRole.applied}</dd></div>
                <div className="flex justify-between gap-4"><dt className="text-slate-500">Apply Before</dt><dd className="font-semibold text-slate-800">{detail.aboutRole.applyBefore}</dd></div>
                <div className="flex justify-between gap-4"><dt className="text-slate-500">Job Posted On</dt><dd className="font-semibold text-slate-800">{detail.aboutRole.jobPostedOn}</dd></div>
                <div className="flex justify-between gap-4"><dt className="text-slate-500">Job Type</dt><dd className="font-semibold text-slate-800">{detail.aboutRole.jobType}</dd></div>
                <div className="flex justify-between gap-4"><dt className="text-slate-500">Salary</dt><dd className="font-semibold text-slate-800">{detail.aboutRole.salary}</dd></div>
              </dl>
            </section>
            <section className="border border-slate-200 bg-white p-6">
              <h3 className="text-base font-bold text-slate-800">Categories</h3>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {detail.categories.map((c, i) => (
                  <span key={c} className={`px-2.5 py-1 text-xs ${i === 0 ? "bg-orange-50 text-orange-500" : "bg-indigo-50 text-indigo-600"}`}>{c}</span>
                ))}
              </div>
              <h3 className="mt-6 text-base font-bold text-slate-800">Required Skills</h3>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {detail.requiredSkills.map((s) => (
                  <span key={s} className="bg-indigo-50 px-2.5 py-1 text-xs text-indigo-600">{s}</span>
                ))}
              </div>
            </section>
          </div>
        </div>
      )}

      {tab === "analytics" && (
        <div className="mt-6 space-y-6">
          <p className="text-xs text-slate-400">Analytics values below are Social Media Assistant&apos;s screenshot values for every job for now -- they are NOT per-job live analytics yet.</p>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            <section className="border border-slate-200 bg-white p-6">
              <p className="text-sm text-slate-500">Total Views</p>
              <p className="mt-1 text-3xl font-black text-slate-800">{analytics.totalViews.toLocaleString()}</p>
              <p className="mt-1 text-xs text-slate-500">vs last day <span className="font-semibold text-emerald-500">▲ {analytics.totalViewsChange}</span></p>
            </section>
            <section className="border border-slate-200 bg-white p-6">
              <p className="text-sm text-slate-500">Total Applied</p>
              <p className="mt-1 text-3xl font-black text-slate-800">{analytics.totalApplied}</p>
              <p className="mt-1 text-xs text-slate-500">vs last day</p>
            </section>
            <section className="border border-slate-200 bg-white p-6">
              <h3 className="text-base font-bold text-slate-800">Traffic channel</h3>
              <div className="mt-4 flex items-center gap-6">
                <DonutChart data={analytics.trafficChannel} />
                <ul className="space-y-2 text-sm text-slate-600">
                  {analytics.trafficChannel.map((t) => (
                    <li key={t.label} className="flex items-center gap-2">
                      <span className="h-2.5 w-2.5" style={{ backgroundColor: t.color }} /> {t.label}: {t.percent}%
                    </li>
                  ))}
                </ul>
              </div>
            </section>
          </div>

          <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_320px]">
            <section className="border border-slate-200 bg-white p-6">
              <div className="flex items-center justify-between gap-4">
                <h3 className="text-base font-bold text-slate-800">Job Listing View stats</h3>
                <select className="border border-slate-200 bg-white px-2 py-1.5 text-sm outline-none" aria-label="View period">
                  <option>Last 7 days</option>
                  <option>Last 30 days</option>
                </select>
              </div>
              <div className="mt-4">
                <LineChart data={analytics.viewStats} />
              </div>
            </section>
            <section className="border border-slate-200 bg-white p-6">
              <h3 className="text-base font-bold text-slate-800">Visitors by country</h3>
              <ul className="mt-4 space-y-3">
                {analytics.visitorsByCountry.map((c) => (
                  <li key={c.country}>
                    <div className="flex items-center justify-between text-sm">
                      <span className="flex items-center gap-2"><span className="flex h-6 w-8 items-center justify-center bg-slate-100 text-[10px] font-bold text-slate-600">{c.code}</span> {c.country}</span>
                      <span className="font-semibold text-slate-800">{c.visitors.toLocaleString()}</span>
                    </div>
                    <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-slate-100">
                      <div className="h-full bg-indigo-600" style={{ width: `${(c.visitors / maxVisitors) * 100}%` }} />
                    </div>
                  </li>
                ))}
              </ul>
            </section>
          </div>
        </div>
      )}

      {editOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" onClick={() => setEditOpen(false)}>
          <div className="w-full max-w-md bg-white p-6 shadow-xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-start justify-between gap-4">
              <h2 className="text-lg font-bold text-slate-800">Edit Job Details</h2>
              <button type="button" onClick={() => setEditOpen(false)} aria-label="Close" className="text-slate-400 hover:text-slate-800"><X size={20} /></button>
            </div>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                setEditOpen(false);
              }}
              className="mt-4 space-y-4"
            >
              <div>
                <label className="mb-1 block text-xs font-semibold text-slate-700">Job Title</label>
                <input value={editedTitle} onChange={(e) => setEditedTitle(e.target.value)} className="w-full border border-slate-300 px-3 py-2 text-sm outline-none focus:border-indigo-500" />
              </div>
              <div>
                <label className="mb-1 block text-xs font-semibold text-slate-700">Description</label>
                <textarea rows={5} value={editedDescription} onChange={(e) => setEditedDescription(e.target.value)} className="w-full border border-slate-300 px-3 py-2 text-sm outline-none focus:border-indigo-500" />
              </div>
              <button type="submit" className="w-full bg-indigo-600 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700">Save Changes</button>
              <p className="text-xs text-slate-400">Saving here updates this page only for now -- it is not saved to MongoDB yet.</p>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
