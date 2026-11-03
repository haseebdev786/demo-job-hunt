"use client";

import { useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

import { ArrowRight, Briefcase, Code, Globe, MapPin, PenTool, Search, ChevronDown, Wallet } from "lucide-react";
import Navbar from "@/components/Navbar";
import PostJobsBanner from "@/components/PostJobBanner";
import Footer from "@/components/Footer";

function CompanyLogo({ company, size = "normal" }) {
  const Icon = company.icon || company.logo;
  const small = size === "small";
  return (
    <div className={`flex shrink-0 items-center justify-center rounded-lg ${small ? "h-10 w-10" : "h-12 w-12"} ${company.iconBg || "bg-transparent"}`}>
      {typeof Icon === "string" ? (
        <span className={`${small ? "text-xl" : "text-2xl"} font-black ${company.iconColor}`}>{Icon}</span>
      ) : (
        <Icon aria-label={`${company.name} logo`} className={`${small ? "text-3xl" : "text-4xl"} ${company.iconColor}`} />
      )}
    </div>
  );
}

// Category cards, as in the screenshot (left to right).
// Each category lists companies BY NAME ONLY -- no jobs numbers
// here, so nothing fake can slip in. Jobs counts come from
// company.jobs (real, see the note at the top).
const CATEGORY_DATA = [{ name: "All", icon: Globe }, { name: "Design", icon: PenTool }, { name: "Technology", icon: Code }, { name: "Finance", icon: Wallet }, { name: "Business", icon: Briefcase }, { name: "Marketing", icon: Globe }, { name: "Engineering", icon: Code }, { name: "Sales", icon: Briefcase }, { name: "Customer Service", icon: Briefcase }, { name: "Human Resource", icon: Briefcase }];

export default function CompaniesPage({ companies }) {
  const router = useRouter();
  const [keyword, setKeyword] = useState("");
  const [location, setLocation] = useState("");
  const recommended = companies.slice(0, 6);

  // --- NEW: Companies by Category state ---
  const [activeCategory, setActiveCategory] = useState("All");
  const categoryScrollRef = useRef(null);

  const allCompanies = companies;

  const activeCategoryData = CATEGORY_DATA.find((c) => c.name === activeCategory) || CATEGORY_DATA[0];
  const ActiveCategoryIcon = activeCategoryData.icon;

  const categoryResults = useMemo(
    () =>
      allCompanies.filter((company) => activeCategory === "All" || company.categories.includes(activeCategory)),
    [activeCategory, allCompanies]
  );

  const totalResults = categoryResults.reduce((sum, c) => sum + (c.jobs || 0), 0);

  const search = (event) => {
    event.preventDefault();
    const params = new URLSearchParams();
    if (keyword.trim()) params.set("q", keyword.trim());
    if (location) params.set("location", location);
    const queryString = params.toString();
    router.push(`/companies/search${queryString ? `?${queryString}` : ""}`);
  };

  return (
    <main className="min-h-screen overflow-x-hidden bg-white text-slate-800">
    <section>
             <Navbar />
        </section>

      <section className="bg-gray-50 px-4 pb-12 pt-12 sm:px-6 md:pb-16 md:pt-16 lg:px-10">
        <div className="mx-auto max-w-7xl text-center">
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">Find your <span className="text-sky-400">dream companies</span></h1>
          <p className="mx-auto mt-4 max-w-xl text-sm leading-6 text-gray-500 sm:text-base">Find the dream companies you dream to work for</p>
          <form onSubmit={search} className="mx-auto mt-8 flex w-full max-w-4xl flex-col gap-3 bg-white p-3 shadow-lg sm:mt-10 md:flex-row md:items-center md:gap-4">
            <label className="flex min-w-0 flex-1 items-center gap-3 border-b border-gray-200 px-2 py-3 md:border-b-0"><Search size={20} className="shrink-0 text-slate-700"/><input value={keyword} onChange={(e) => setKeyword(e.target.value)} type="search" placeholder="Company name or keyword" className="min-w-0 flex-1 text-sm outline-none placeholder:text-gray-400"/></label>
            <label className="flex min-w-0 flex-1 items-center gap-3 border-b border-gray-200 px-2 py-3 md:border-b-0"><MapPin size={20} className="shrink-0 text-slate-700"/><select value={location} onChange={(e) => setLocation(e.target.value)} aria-label="Location" className="min-w-0 flex-1 bg-white text-sm outline-none"><option value="">All Locations</option>{[...new Set(companies.map((company) => company.location))].map((value) => <option key={value}>{value}</option>)}</select><ChevronDown size={16} className="pointer-events-none shrink-0 text-gray-400"/></label>
            <button type="submit" className="bg-indigo-600 px-8 py-3.5 text-sm font-semibold text-white hover:bg-indigo-700">Search</button>
          </form>
          <p className="mx-auto mt-3 max-w-4xl text-left text-xs text-slate-400">Popular: Twitter, Microsoft, Apple, Facebook</p>
        </div>
      </section>

      <section className="px-4 py-12 sm:px-6 md:py-16 lg:px-10">
        <div className="mx-auto max-w-7xl">
          <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">Recommended Companies</h2>
          <p className="mt-2 text-sm text-slate-500">Companies with published jobs on JobHuntly</p>
          {recommended.length ? <div className="mt-7 grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-3">
            {recommended.map((company) => <Link href={`/companies/${company.slug}`} key={company.slug} className="flex min-w-0 flex-col border border-slate-200 bg-white p-3 transition focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-indigo-600 hover:border-indigo-500 hover:shadow-md sm:p-5">
              <div className="flex items-start justify-between gap-2"><CompanyLogo company={company}/><span className="shrink-0 border border-indigo-200 px-1.5 py-1 text-[10px] text-indigo-600 sm:px-2">{company.jobs} Jobs</span></div>
              <h3 className="mt-3 text-sm font-bold sm:text-base">{company.name}</h3><p className="mt-2 line-clamp-3 text-[11px] leading-4 text-slate-500 sm:text-sm sm:leading-5">{company.about}</p>
              <div className="mt-auto flex flex-wrap gap-1.5 pt-4">{company.categories.map((tag) => <span key={tag} className="rounded-full border border-orange-200 px-2 py-1 text-[10px] text-orange-500">{tag}</span>)}</div>
            </Link>)}
          </div> : <p className="mt-8 text-slate-500">No companies match your search.</p>}
        </div>
      </section>

      <section className="bg-white px-4 py-6 sm:px-6 lg:px-10">
        <div className="relative mx-auto max-w-7xl overflow-hidden">
         <PostJobsBanner />
        </div>
      </section>

      {/* ===== NEW SECTION: Companies by Category (was missing after the banner) ===== */}
      <section className="bg-[#f5f7ff] px-4 py-12 sm:px-6 md:py-16 lg:px-10">
        <div className="mx-auto max-w-7xl">
          <h2 className="text-2xl font-bold tracking-tight text-slate-800 sm:text-3xl">Companies by Category</h2>

          {/* Category carousel, like the screenshot: active = purple, others = white.
              The purple arrow button scrolls the row, like the screenshot's arrow
              sitting on the right edge of the row. */}
          <div className="relative mt-8">
            <div ref={categoryScrollRef} className="flex gap-4 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {CATEGORY_DATA.map((cat) => {
                const Icon = cat.icon;
                const active = activeCategory === cat.name;
                return (
                  <button
                    key={cat.name}
                    type="button"
                    onClick={() => setActiveCategory(cat.name)}
                    className={`flex h-40 w-56 shrink-0 flex-col justify-between border p-6 text-left transition ${
                      active
                        ? "border-indigo-600 bg-indigo-600 text-white shadow-md"
                        : "border-slate-200 bg-white text-slate-800 hover:border-indigo-300"
                    }`}
                  >
                    <Icon size={36} className={active ? "text-white" : "text-indigo-600"} />
                    <span className="text-xl font-bold">{cat.name}</span>
                  </button>
                );
              })}
            </div>
            <button
              type="button"
              aria-label="Scroll categories"
              onClick={() => categoryScrollRef.current?.scrollBy({ left: 300, behavior: "smooth" })}
              className="absolute -right-2 top-1/2 flex h-12 w-12 -translate-y-1/2 items-center justify-center bg-indigo-600 text-white shadow-md hover:bg-indigo-700"
            >
              <ArrowRight size={20} />
            </button>
          </div>

          {/* Results header, like the screenshot: icon in a white circle + "X Results" */}
          <div className="mt-12 flex items-center gap-4">
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-indigo-600 shadow-sm">
              <ActiveCategoryIcon size={22} />
            </span>
            <p className="text-xl font-bold text-slate-800">{totalResults} Results</p>
          </div>

          {/* Results grid, like the screenshot: logo top-centre, name, "X Jobs" pill */}
          {categoryResults.length ? (
            <div className="mt-8 grid grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-4">
              {categoryResults.map((company) => (
                <Link
                  href={`/companies/${company.slug}`}
                  key={company.slug}
                  className="flex flex-col items-center border border-slate-200 bg-white px-4 py-8 text-center transition hover:border-indigo-500 hover:shadow-md"
                >
                  <div className="flex h-20 w-20 items-center justify-center">
                    <CompanyLogo company={company} />
                  </div>
                  <h3 className="mt-6 text-base font-bold text-slate-800 sm:text-lg">{company.name}</h3>
                  <span className="mt-4 bg-indigo-50 px-3 py-1.5 text-sm font-medium text-indigo-600">
                    {company.jobs || 0} Jobs
                  </span>
                </Link>
              ))}
            </div>
          ) : (
            <p className="mt-8 text-slate-500">No companies in this category yet.</p>
          )}

          {/* More companies is now only a link below the category grid.
              The old More companies grid section below this is removed,
              because it duplicated these same cards. */}
          <Link href="/companies/search" className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-indigo-600 hover:text-indigo-800">
            More companies <ArrowRight size={16} />
          </Link>
        </div>
      </section>

      <Footer />
    </main>
  );
}
