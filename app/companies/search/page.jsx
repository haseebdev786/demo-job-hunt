"use client";

import { Suspense, useMemo, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import {
  Search,
  MapPin,
  ChevronLeft,
  ChevronRight,
  SlidersHorizontal,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

import Link from "next/link";
import { searchCompanies as companies } from "@/lib/companies";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";



const filterGroups = [
  {
    title: "Industry",
    key: "industry",
    options: [
      "Advertising",
      "Business Service",
      "Blockchain",
      "Cloud",
      "Consumer Tech",
      "Education",
      "Fintech",
      "Gaming",
      "Food & Beverage",
      "Health Care",
      "Hosting",
      "Media",
    ],
  },
  {
    title: "Company Size",
    key: "size",
    options: [
      "01-50",
      "51-150",
      "151-250",
      "251-500",
      "501-1000",
      "1001-Above",
    ],
  },
  {
    title: "Location",
    key: "location",
    options: ["United States", "United Kingdom"],
  },
];

const PAGE_SIZE = 6;

// Counts automatically calculated from company data
function getFilterCount(key, value) {
  return companies.filter(
    (company) => company[key] === value
  ).length;
}

function FilterPanel({ filters, toggleFilter, clearFilters, disableClear }) {
  const [expanded, setExpanded] = useState({
    industry: true,
    size: true,
    location: true,
  });

  return (
    <div className="space-y-6">
      {filterGroups.map((group) => (
        <div
          key={group.key}
          className="border-b border-gray-100 pb-6"
        >
          <button
            type="button"
            onClick={() =>
              setExpanded((prev) => ({
                ...prev,
                [group.key]: !prev[group.key],
              }))
            }
            className="mb-5 flex w-full items-center justify-between text-left"
          >
            <h3 className="text-base font-bold text-slate-800">
              {group.title}
            </h3>

            {expanded[group.key] ? (
              <ChevronUp size={18} className="text-slate-600" />
            ) : (
              <ChevronDown size={18} className="text-slate-600" />
            )}
          </button>

          {expanded[group.key] && (
            <div className="space-y-4">
              {group.options.map((option) => {
                const checked = (
                  filters[group.key] || []
                ).includes(option);

                const count = getFilterCount(
                  group.key,
                  option
                );

                return (
                  <label
                    key={option}
                    className="flex cursor-pointer items-center gap-3"
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() =>
                        toggleFilter(group.key, option)
                      }
                      className="h-5 w-5 shrink-0 cursor-pointer accent-indigo-600"
                    />

                    <span className="text-sm text-slate-600">
                      {option} ({count})
                    </span>
                  </label>
                );
              })}
            </div>
          )}
        </div>
      ))}

      <button
        type="button"
        onClick={clearFilters}
        disabled={disableClear}
        className="text-sm font-semibold text-indigo-600 hover:text-indigo-700 disabled:cursor-not-allowed disabled:opacity-40"
      >
        Clear Filters
      </button>
    </div>
  );
}

function CompaniesSearchContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const initialQuery = searchParams.get("q") || "";
  const initialLocation = searchParams.get("location") || "";

  const [keyword, setKeyword] = useState(initialQuery);
  const [location, setLocation] = useState(initialLocation);

  const [filters, setFilters] = useState({});
  const [sortBy, setSortBy] = useState("relevant");
  const [page, setPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);

  const toggleFilter = (key, value) => {
    setFilters((current) => {
      const selected = current[key] || [];

      return {
        ...current,
        [key]: selected.includes(value)
          ? selected.filter((item) => item !== value)
          : [...selected, value],
      };
    });

    setPage(1);
  };

  // FIXED: The old version only did setFilters({}) + setPage(1).
  // But results are filtered by the URL (?q= and ?location=), and the
  // hero inputs are separate state. So clearing only the checkboxes
  // left the search itself active, and the results did not change --
  // which is why the button looked broken.
  // Now Clear Filters resets everything: sidebar filters, hero search
  // inputs, sort, page, mobile panel, AND the URL query itself.
  const clearFilters = () => {
    setFilters({});
    setKeyword("");
    setLocation("");
    setSortBy("relevant");
    setPage(1);
    setShowFilters(false);
    router.push("/companies/search");
  };

  // True when there is actually something to clear. This drives the
  // disabled/faded state of the button, so the user is not left
  // clicking a button that visibly does nothing.
  const hasActiveFilters =
    Object.values(filters).some((values) => values.length > 0) ||
    keyword.trim() !== "" ||
    location !== "" ||
    sortBy !== "relevant";

  const results = useMemo(() => {
    const query = initialQuery.toLowerCase().trim();
    const city = initialLocation.toLowerCase().trim();

    const filtered = companies.filter((company) => {
      const matchesQuery =
        !query ||
        company.name.toLowerCase().includes(query) ||
        company.industry.toLowerCase().includes(query) ||
        company.description.toLowerCase().includes(query);

      const matchesLocation =
        !city ||
        company.location.toLowerCase().includes(city);

      const matchesFilters = filterGroups.every((group) => {
        const values = filters[group.key] || [];

        return (
          values.length === 0 ||
          values.includes(company[group.key])
        );
      });

      return (
        matchesQuery &&
        matchesLocation &&
        matchesFilters
      );
    });

    if (sortBy === "name") {
      filtered.sort((a, b) =>
        a.name.localeCompare(b.name)
      );
    }

    if (sortBy === "jobs") {
      filtered.sort((a, b) => b.jobs - a.jobs);
    }

    return filtered;
  }, [initialQuery, initialLocation, filters, sortBy]);

  const totalPages = Math.ceil(results.length / PAGE_SIZE);

  const visibleCompanies = results.slice(
    (page - 1) * PAGE_SIZE,
    page * PAGE_SIZE
  );

  const handleSearch = (e) => {
    e.preventDefault();

    const params = new URLSearchParams();

    if (keyword.trim()) {
      params.set("q", keyword.trim());
    }

    if (location.trim()) {
      params.set("location", location.trim());
    }

    setPage(1);
    router.push(`/companies/search?${params.toString()}`);
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Search Hero */}
      <section className="bg-gray-50 px-4 py-10 sm:px-6 md:py-14">
        <div className="mx-auto max-w-6xl text-center">
          <h1 className="text-3xl font-bold text-slate-800 sm:text-4xl">
            Find your{" "}
            <span className="text-sky-400">
              dream companies
            </span>
          </h1>

          <p className="mt-3 text-sm text-slate-400">
            Find the dream companies you dream to work for
          </p>

          <form
            onSubmit={handleSearch}
            className="mx-auto mt-8 flex max-w-4xl flex-col gap-3 bg-white p-3 shadow-sm md:flex-row"
          >
            <div className="flex min-w-0 flex-1 items-center gap-3 px-3">
              <Search
                size={20}
                className="shrink-0 text-slate-700"
              />

              <input
                type="text"
                placeholder="Company name or keyword"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                className="w-full min-w-0 py-3 text-sm text-slate-700 outline-none"
              />
            </div>

            <div className="flex min-w-0 flex-1 items-center gap-3 border-t border-gray-100 px-3 md:border-l md:border-t-0">
              <MapPin
                size={20}
                className="shrink-0 text-slate-700"
              />

              <select
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                aria-label="Company location"
                className="w-full min-w-0 bg-white py-3 text-sm text-slate-700 outline-none"
              >
                <option value="">All Locations</option>
                <option value="United States">
                  United States
                </option>
                <option value="United Kingdom">
                  United Kingdom
                </option>
              </select>
            </div>

            <button
              type="submit"
              className="bg-indigo-600 px-8 py-3 text-sm font-semibold text-white hover:bg-indigo-700"
            >
              Search
            </button>
          </form>

          <p className="mx-auto mt-3 max-w-4xl text-left text-xs text-slate-400">
            Popular: Stripe, Revolut, Apple, Facebook
          </p>
        </div>
      </section>

      {/* Results Section */}
      <section className="px-4 py-10 sm:px-6 lg:py-14">
        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[230px_minmax(0,1fr)]">

          {/* Desktop Filters */}
          <aside className="hidden lg:block">
            <FilterPanel
              filters={filters}
              toggleFilter={toggleFilter}
              clearFilters={clearFilters}
              disableClear={!hasActiveFilters}
            />
          </aside>

          <div className="min-w-0">
            <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold text-slate-800">
                  All Companies
                </h2>

                <p className="mt-1 text-xs text-slate-400">
                  Showing {results.length} results
                </p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setShowFilters(!showFilters)}
                  className="flex items-center gap-2 border border-gray-200 px-3 py-2 text-sm text-slate-700 lg:hidden"
                  aria-expanded={showFilters}
                >
                  <SlidersHorizontal size={16} />
                  Filters
                </button>

                <select
                  value={sortBy}
                  onChange={(e) => {
                    setSortBy(e.target.value);
                    setPage(1);
                  }}
                  aria-label="Sort companies"
                  className="max-w-36 bg-white text-xs text-slate-700 outline-none sm:text-sm"
                >
                  <option value="relevant">
                    Most Relevant
                  </option>
                  <option value="name">
                    Name A-Z
                  </option>
                  <option value="jobs">
                    Most Jobs
                  </option>
                </select>
              </div>
            </div>

            {/* Mobile Filters */}
            {showFilters && (
              <div className="mb-6 border border-gray-200 bg-white p-4 lg:hidden">
                <FilterPanel
                  filters={filters}
                  toggleFilter={toggleFilter}
                  clearFilters={clearFilters}
                  disableClear={!hasActiveFilters}
                />
              </div>
            )}

            {/* Company Cards */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {visibleCompanies.map((company) => (
                <Link
                  href={`/companies/${company.slug}`}
                  key={company.id}
                  className="flex min-w-0 flex-col border border-slate-200 bg-white p-5 transition focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-indigo-600 hover:border-indigo-400 hover:shadow-md"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div
                      className={`flex h-10 w-10 items-center justify-center rounded-md text-xl font-bold text-white ${company.color}`}
                    >
                      {company.logo}
                    </div>

                    <span className="whitespace-nowrap border border-indigo-300 px-2 py-1 text-xs text-indigo-600">
                      {company.jobs} Jobs
                    </span>
                  </div>

                  <h3 className="mt-4 font-bold text-slate-800">
                    {company.name}
                  </h3>

                  <p className="mt-1 text-xs text-slate-500">
                    {company.industry} · {company.location}
                  </p>

                  <p className="mt-3 min-h-14 text-xs leading-5 text-slate-400">
                    {company.description}
                  </p>

                  <div className="mt-auto pt-4">
                    <span className="rounded-full bg-orange-50 px-3 py-1 text-xs text-orange-500">
                      {company.industry}
                    </span>
                  </div>
                </Link>
              ))}
            </div>

            {/* Empty State */}
            {results.length === 0 && (
              <div className="border border-gray-200 p-10 text-center text-sm text-slate-500">
                No companies found. Try another search
                or clear the filters.
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-10 flex items-center justify-center gap-2">
                <button
                  type="button"
                  disabled={page === 1}
                  onClick={() => setPage((prev) => prev - 1)}
                  className="p-2 disabled:opacity-30"
                  aria-label="Previous page"
                >
                  <ChevronLeft size={18} />
                </button>

                {Array.from(
                  { length: totalPages },
                  (_, index) => index + 1
                ).map((number) => (
                  <button
                    key={number}
                    type="button"
                    onClick={() => setPage(number)}
                    className={`h-8 w-8 text-xs ${
                      page === number
                        ? "bg-indigo-600 text-white"
                        : "text-slate-600"
                    }`}
                  >
                    {number}
                  </button>
                ))}

                <button
                  type="button"
                  disabled={page === totalPages}
                  onClick={() => setPage((prev) => prev + 1)}
                  className="p-2 disabled:opacity-30"
                  aria-label="Next page"
                >
                  <ChevronRight size={18} />
                </button>
              </div>
            )}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

export default function CompaniesSearchPage() {
  return (
    <Suspense fallback={<div className="p-10">Loading companies...</div>}>
      <CompaniesSearchContent />
    </Suspense>
  );
}
