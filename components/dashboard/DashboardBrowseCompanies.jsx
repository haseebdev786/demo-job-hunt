"use client";

// Place this file at: components/dashboard/DashboardBrowseCompanies.jsx
// Client component: search, Industry/Size filters, sort, grid/list
// view and pagination all run here.
//
// WHY THIS PAGE EXISTS:
//   The sidebar used to link Browse Companies to /companies -- the
//   PUBLIC page with Navbar/Footer. This is the DASHBOARD version
//   (screenshot 2.7): it lives inside app/dashboard/layout.jsx, so it
//   keeps the dashboard sidebar and has NO Navbar/Footer. The public
//   /companies page is untouched and still works if opened directly.
//
// DATA: companies come from @/lib/companies (the same 21 companies as
// the public page, including Stripe, Truebill, Square, Coinbase,
// Robinhood and Kraken from the screenshot). Company names link to
// /dashboard/companies/{id} -- the dashboard company detail page,
// so details also stay inside the dashboard.
//
// DIFFERENCES FROM THE SCREENSHOT, ON PURPOSE:
//   - Industry / Size counts, "Showing X results" and pagination are
//     computed from your real 21 companies, not the screenshot's
//     numbers (73 results, 33 pages, Advertising (43), ...).
//   - Cards show your real categories (e.g. Stripe: Business Service
//     only). The screenshot shows a 2nd tag like "Payment gateway"
//     or "Blockchain" on some cards -- that is reference placeholder
//     data, your companies data has no 2nd tag for those companies,
//     so none is invented.

import { useMemo, useState } from "react";
import Link from "next/link";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import {
  Search,
  MapPin,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  LayoutGrid,
  List,
  SlidersHorizontal,
  X,
} from "lucide-react";
import { companies, COMPANY_SIZES } from "@/lib/companies";

const PAGE_SIZE = 6;
const popularTerms = ["Twitter", "Microsoft", "Apple", "Facebook"];

function CompanyLogo({ company, small }) {
  // Dashboard + search formats: icon, or logo letter as fallback.
  const Icon = company.icon || company.logo;
  return (
    <div
      className={`flex shrink-0 items-center justify-center rounded-lg ${
        small ? "h-10 w-10" : "h-12 w-12"
      } ${company.iconBg || "bg-transparent"}`}
    >
      {typeof Icon === "string" ? (
        <span className={`${small ? "text-xl" : "text-2xl"} font-black ${company.iconColor}`}>
          {Icon}
        </span>
      ) : (
        <Icon
          aria-label={`${company.name} logo`}
          className={`${small ? "text-3xl" : "text-4xl"} ${company.iconColor}`}
        />
      )}
    </div>
  );
}

function toggleValue(list, value) {
  return list.includes(value) ? list.filter((item) => item !== value) : [...list, value];
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

export default function DashboardBrowseCompanies() {
  const [keyword, setKeyword] = useState("");
  const [search, setSearch] = useState("");
  const [location, setLocation] = useState("All Locations");
  const [selectedIndustries, setSelectedIndustries] = useState([]);
  const [selectedSizes, setSelectedSizes] = useState([]);
  const [sort, setSort] = useState("relevant");
  const [view, setView] = useState("grid");
  const [page, setPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);

  const locations = useMemo(
    () => ["All Locations", ...Array.from(new Set(companies.map((c) => c.location))).sort()],
    []
  );

  const industries = useMemo(() => {
    const counts = new Map();
    companies.forEach((c) =>
      (c.categories || (c.industry ? [c.industry] : [])).forEach((cat) =>
        counts.set(cat, (counts.get(cat) || 0) + 1)
      )
    );
    return Array.from(counts.entries()).sort(([a], [b]) => a.localeCompare(b));
  }, []);

  const sizeCounts = useMemo(() => {
    const counts = new Map();
    companies.forEach((c) => {
      if (c.size) counts.set(c.size, (counts.get(c.size) || 0) + 1);
    });
    return counts;
  }, []);

  const results = useMemo(() => {
    const needle = search.trim().toLowerCase();
    const list = companies.filter((company) => {
      const matchesKeyword =
        !needle ||
        `${company.name} ${company.about} ${company.categories.join(" ")} ${company.location}`
          .toLowerCase()
          .includes(needle);
      const companyCategories = company.categories || (company.industry ? [company.industry] : []);
      const matchesIndustry =
        selectedIndustries.length === 0 ||
        selectedIndustries.some((industry) => companyCategories.includes(industry));
      const matchesSize = selectedSizes.length === 0 || selectedSizes.includes(company.size);
      const matchesLocation = location === "All Locations" || company.location === location;
      return matchesKeyword && matchesIndustry && matchesSize && matchesLocation;
    });
    if (sort === "name") return [...list].sort((a, b) => a.name.localeCompare(b.name));
    if (sort === "jobs")
      return [...list].sort((a, b) => b.jobs - a.jobs || a.name.localeCompare(b.name));
    return list;
  }, [search, selectedIndustries, selectedSizes, location, sort]);

  const totalPages = Math.max(1, Math.ceil(results.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const paged = results.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  function runSearch(term) {
    setSearch(term);
    setPage(1);
  }

  function clearAll() {
    setKeyword("");
    setSearch("");
    setLocation("All Locations");
    setSelectedIndustries([]);
    setSelectedSizes([]);
    setPage(1);
  }

  const filterSidebar = (
    <div>
      <h3 className="text-sm font-bold">Industry</h3>
      <ul className="mt-4 space-y-3">
        {industries.map(([industry, count]) => (
          <li key={industry}>
            <label className="flex cursor-pointer items-center gap-2 text-sm text-slate-600">
              <input
                type="checkbox"
                checked={selectedIndustries.includes(industry)}
                onChange={() => {
                  setSelectedIndustries(toggleValue(selectedIndustries, industry));
                  setPage(1);
                }}
                className="h-4 w-4 accent-indigo-600"
              />
              {industry} ({count})
            </label>
          </li>
        ))}
      </ul>

      <h3 className="mt-10 text-sm font-bold">Company Size</h3>
      <ul className="mt-4 space-y-3">
        {COMPANY_SIZES.map((size) => (
          <li key={size}>
            <label className="flex cursor-pointer items-center gap-2 text-sm text-slate-600">
              <input
                type="checkbox"
                checked={selectedSizes.includes(size)}
                onChange={() => {
                  setSelectedSizes(toggleValue(selectedSizes, size));
                  setPage(1);
                }}
                className="h-4 w-4 accent-indigo-600"
              />
              {size} ({sizeCounts.get(size) || 0})
            </label>
          </li>
        ))}
      </ul>

      {(selectedIndustries.length > 0 || selectedSizes.length > 0 || search || location !== "All Locations") && (
        <button
          type="button"
          onClick={clearAll}
          className="mt-8 text-sm font-semibold text-indigo-600 underline underline-offset-2"
        >
          Clear search &amp; filters
        </button>
      )}
    </div>
  );

  return (
    <div className="px-4 py-8 sm:px-6 lg:px-10">
      {/* Header: same as Dashboard overview -- bell outside dropdown, NO Back to homepage */}
      <DashboardHeader title="Browse Companies" />

      {/* Search bar -- screenshot 2.7 style */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          runSearch(keyword.trim());
        }}
        className="mt-8 flex w-full flex-col gap-3 bg-white p-3 shadow-lg sm:p-4 md:flex-row md:items-center md:gap-5"
      >
        <label className="flex min-w-0 flex-1 items-center gap-3 border-b border-slate-200 px-2 py-2 md:border-0">
          <Search size={20} className="shrink-0 text-slate-700" />
          <input
            aria-label="Company title or keyword"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder="Company title or keyword"
            className="w-full min-w-0 bg-transparent text-sm outline-none placeholder:text-slate-400"
          />
        </label>
        <label className="flex min-w-0 flex-1 items-center gap-3 border-b border-slate-200 px-2 py-2 md:border-0">
          <MapPin size={20} className="shrink-0 text-slate-700" />
          <select
            aria-label="Location"
            value={location}
            onChange={(e) => {
              setLocation(e.target.value);
              setPage(1);
            }}
            className="w-full min-w-0 bg-white text-sm outline-none"
          >
            {locations.map((loc) => (
              <option key={loc}>{loc}</option>
            ))}
          </select>
          <ChevronDown size={16} className="pointer-events-none shrink-0 text-slate-400" />
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

      <button
        type="button"
        onClick={() => setShowFilters(!showFilters)}
        className="mb-6 mt-8 flex items-center gap-2 border border-slate-200 bg-white px-4 py-2 text-sm font-medium lg:hidden"
      >
        <SlidersHorizontal size={16} /> Filters
      </button>

      <div className="mt-2 grid gap-10 lg:grid-cols-[240px_1fr]">
        <aside className={`${showFilters ? "block" : "hidden"} lg:block`}>{filterSidebar}</aside>

        <div>
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">All Companies</h2>
              <p className="mt-1 text-sm text-slate-500">
                Showing {results.length} result{results.length === 1 ? "" : "s"}
                {search ? ` for "${search}"` : ""}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <label className="flex items-center gap-2 text-sm text-slate-500">
                Sort by:
                <select
                  value={sort}
                  onChange={(e) => {
                    setSort(e.target.value);
                    setPage(1);
                  }}
                  className="bg-white text-sm font-medium text-slate-800 outline-none"
                >
                  <option value="relevant">Most relevant</option>
                  <option value="name">Name (A-Z)</option>
                  <option value="jobs">Most jobs</option>
                </select>
              </label>
              <div className="flex border border-slate-200 bg-white">
                <button
                  type="button"
                  aria-label="Grid view"
                  onClick={() => setView("grid")}
                  className={`p-2 ${view === "grid" ? "bg-indigo-600 text-white" : "text-slate-500"}`}
                >
                  <LayoutGrid size={16} />
                </button>
                <button
                  type="button"
                  aria-label="List view"
                  onClick={() => setView("list")}
                  className={`p-2 ${view === "list" ? "bg-indigo-600 text-white" : "text-slate-500"}`}
                >
                  <List size={16} />
                </button>
              </div>
            </div>
          </div>

          {paged.length ? (
            <div
              className={`mt-7 grid gap-5 ${
                view === "grid" ? "sm:grid-cols-2 xl:grid-cols-3" : "grid-cols-1"
              }`}
            >
              {paged.map((company) => (
                <article
                  key={company.slug || company.id}
                  className="flex min-w-0 flex-col border border-slate-200 bg-white p-5 transition hover:border-indigo-500 hover:shadow-md"
                >
                  <div className="flex items-start justify-between gap-2">
                    <CompanyLogo company={company} />
                    <span className="shrink-0 border border-indigo-200 px-2 py-1 text-xs text-indigo-600">
                      {company.jobs} Jobs
                    </span>
                  </div>
                  <h3 className="mt-3 text-base font-bold">
                    <Link
                      href={`/dashboard/companies/${company.slug || company.id}`}
                      className="hover:text-indigo-600"
                    >
                      {company.name}
                    </Link>
                  </h3>
                  <p className="mt-1 text-xs text-slate-400">{company.location}</p>
                  <p className="mt-2 line-clamp-3 text-sm leading-5 text-slate-500">{company.about}</p>
                  <div className="mt-auto flex flex-wrap gap-1.5 pt-4">
                    {(company.categories || (company.industry ? [company.industry] : [])).map((tag, index) => (
                      <span
                        key={tag}
                        className={`rounded-full border px-2 py-1 text-[10px] ${
                          index === 0
                            ? "border-emerald-200 text-emerald-600"
                            : "border-orange-200 text-orange-500"
                        }`}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="mt-7 border border-slate-200 bg-white p-8 text-center">
              <p className="text-slate-500">No companies match your search.</p>
              <button
                type="button"
                onClick={clearAll}
                className="mt-4 text-sm font-semibold text-indigo-600 underline underline-offset-2"
              >
                Clear search &amp; filters
              </button>
            </div>
          )}

          {totalPages > 1 && (
            <nav className="mt-10 flex items-center justify-center gap-1" aria-label="Companies pages">
              <button
                type="button"
                disabled={safePage === 1}
                onClick={() => setPage(safePage - 1)}
                aria-label="Previous page"
                className="p-2 text-indigo-600 disabled:opacity-30"
              >
                <ChevronLeft size={18} />
              </button>
              {pageNumbers(safePage, totalPages).map((n, i) =>
                n === "..." ? (
                  <span key={`dots-${i}`} className="px-1 text-sm text-slate-400">
                    ...
                  </span>
                ) : (
                  <button
                    key={n}
                    type="button"
                    onClick={() => setPage(n)}
                    className={`h-9 w-9 text-sm font-medium ${
                      n === safePage ? "bg-indigo-600 text-white" : "text-indigo-600 hover:bg-indigo-50"
                    }`}
                  >
                    {n}
                  </button>
                )
              )}
              <button
                type="button"
                disabled={safePage >= totalPages}
                onClick={() => setPage(safePage + 1)}
                aria-label="Next page"
                className="p-2 text-indigo-600 disabled:opacity-30"
              >
                <ChevronRight size={18} />
              </button>
            </nav>
          )}
        </div>
      </div>

      {showFilters && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            aria-label="Close filters"
            className="absolute inset-0 bg-slate-950/50"
            onClick={() => setShowFilters(false)}
          />
          <aside className="absolute inset-y-0 left-0 flex w-[min(88vw,360px)] flex-col bg-white shadow-xl">
            <div className="flex items-center justify-between border-b p-4">
              <h2 className="text-lg font-bold">Filter companies</h2>
              <button onClick={() => setShowFilters(false)} aria-label="Close filters">
                <X size={22} />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-4">{filterSidebar}</div>
            <div className="border-t p-4">
              <button
                onClick={() => setShowFilters(false)}
                className="w-full bg-indigo-600 px-3 py-3 text-sm font-semibold text-white"
              >
                Show {results.length} companies
              </button>
            </div>
          </aside>
        </div>
      )}
    </div>
  );
}
