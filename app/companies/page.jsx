"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Search, MapPin, ChevronDown, Menu, X, Bell, BriefcaseBusiness, Building2 } from "lucide-react";
import { FaDropbox } from "react-icons/fa";
import { SiNetlify, SiUdacity, SiWebflow } from "react-icons/si";
import Navbar from "@/components/Navbar";
import PostJobsBanner from "@/components/PostJobBanner";
import Footer from "@/components/Footer";


const companies = [
  { id: 1, name: "Nomad", location: "Paris, France", jobs: 3, about: "Nomad is a leading technology company building tools that help people work from anywhere.", categories: ["Business Service"], icon: "N", iconBg: "bg-emerald-50", iconColor: "text-emerald-500" },
  { id: 2, name: "Discord", location: "San Francisco, USA", jobs: 3, about: "Discord is the easiest way to communicate over voice, video, and text with your communities.", categories: ["Technology"], icon: "D", iconBg: "bg-indigo-600", iconColor: "text-white" },
  { id: 3, name: "Maze", location: "San Francisco, USA", jobs: 3, about: "Maze helps teams build better products with continuous product discovery.", categories: ["Business Service"], icon: "M", iconBg: "bg-blue-600", iconColor: "text-white" },
  { id: 4, name: "Udacity", location: "Hamburg, Germany", jobs: 3, about: "Udacity is an online learning platform that helps people gain real-world technology skills.", categories: ["Business Service"], icon: SiUdacity, iconColor: "text-sky-500" },
  { id: 5, name: "Webflow", location: "San Francisco, USA", jobs: 3, about: "Webflow is the visual design and hosting platform built for the next generation of the web.", categories: ["Business Service", "Technology"], icon: SiWebflow, iconColor: "text-indigo-600" },
  { id: 6, name: "Foundation", location: "New York, USA", jobs: 3, about: "Foundation brings creators, artists, and collectors together in a creative marketplace.", categories: ["Business Service", "Technology"], icon: "F", iconBg: "bg-black", iconColor: "text-white" },
  { id: 7, name: "Pentagram", location: "London, UK", jobs: 3, about: "Independent design studio working across identity, products, and experiences.", categories: ["Design"], icon: "P", iconBg: "bg-white", iconColor: "text-red-500" },
  { id: 8, name: "Wolff Olins", location: "London, UK", jobs: 3, about: "Creative consultancy developing brands that move the world forward.", categories: ["Design"], icon: "W", iconBg: "bg-white", iconColor: "text-slate-900" },
  { id: 9, name: "Clay", location: "San Francisco, USA", jobs: 3, about: "Design and branding studio for innovative digital experiences.", categories: ["Design"], icon: "C", iconBg: "bg-slate-900", iconColor: "text-white" },
  { id: 10, name: "MediaMonks", location: "Amsterdam, Netherlands", jobs: 3, about: "Global creative and digital production company.", categories: ["Marketing"], icon: "M", iconBg: "bg-slate-900", iconColor: "text-white" },
  { id: 11, name: "Packer", location: "Lucerne, Switzerland", jobs: 3, about: "Building developer-focused tools and workflows.", categories: ["Technology"], icon: "P", iconBg: "bg-orange-50", iconColor: "text-orange-500" },
  { id: 12, name: "Square", location: "San Francisco, USA", jobs: 3, about: "Business software and payments tools for businesses of all sizes.", categories: ["Finance"], icon: "S", iconBg: "bg-black", iconColor: "text-white" },
  { id: 13, name: "Divvy", location: "Utah, USA", jobs: 3, about: "Expense management and financial tools for teams.", categories: ["Finance"], icon: "V", iconBg: "bg-white", iconColor: "text-black" },
  { id: 14, name: "Dropbox", location: "San Francisco, USA", jobs: 3, about: "Cloud storage and collaboration tools for teams.", categories: ["Technology"], icon: FaDropbox, iconColor: "text-blue-600" },
  { id: 15, name: "Netlify", location: "San Francisco, USA", jobs: 3, about: "Platform for building and deploying modern web experiences.", categories: ["Technology"], icon: SiNetlify, iconColor: "text-cyan-500" },
];

function CompanyLogo({ company, size = "normal" }) {
  const Icon = company.icon;
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




export default function CompaniesPage() {
  const [keyword, setKeyword] = useState("");
  const [location, setLocation] = useState("Florence, Italy");
  const [submittedKeyword, setSubmittedKeyword] = useState("");
  const [showAll, setShowAll] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const filtered = useMemo(() => companies.filter((company) => (`${company.name} ${company.about} ${company.categories.join(" ")}`).toLowerCase().includes(submittedKeyword.toLowerCase())), [submittedKeyword]);
  const recommended = filtered.slice(0, 6);
  const others = filtered.slice(6);
  const visibleOthers = showAll ? others : others.slice(0, 8);
  const search = (event) => { event.preventDefault(); setSubmittedKeyword(keyword.trim()); setShowAll(false); };

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
            <label className="flex min-w-0 flex-1 items-center gap-3 border-b border-gray-200 px-2 py-3 md:border-b-0"><MapPin size={20} className="shrink-0 text-slate-700"/><select value={location} onChange={(e) => setLocation(e.target.value)} aria-label="Location" className="min-w-0 flex-1 bg-white text-sm outline-none"><option>Florence, Italy</option><option>Islamabad, Pakistan</option><option>Lahore, Pakistan</option><option>Remote</option></select><ChevronDown size={16} className="pointer-events-none shrink-0 text-gray-400"/></label>
            <button type="submit" className="bg-indigo-600 px-8 py-3.5 text-sm font-semibold text-white hover:bg-indigo-700">Search</button>
          </form>
          <p className="mx-auto mt-3 max-w-4xl text-left text-xs text-slate-400">Popular: Twitter, Microsoft, Apple, Facebook</p>
        </div>
      </section>

      <section className="px-4 py-12 sm:px-6 md:py-16 lg:px-10">
        <div className="mx-auto max-w-7xl">
          <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">Recommended Companies</h2>
          <p className="mt-2 text-sm text-slate-500">Based on your profile, company preferences, and recent activity</p>
          {recommended.length ? <div className="mt-7 grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-3">
            {recommended.map((company) => <article key={company.id} className="flex min-w-0 flex-col border border-slate-200 bg-white p-3 transition hover:border-indigo-500 hover:shadow-md sm:p-5">
              <div className="flex items-start justify-between gap-2"><CompanyLogo company={company}/><span className="shrink-0 border border-indigo-200 px-1.5 py-1 text-[10px] text-indigo-600 sm:px-2">{company.jobs} Jobs</span></div>
              <h3 className="mt-3 text-sm font-bold sm:text-base">{company.name}</h3><p className="mt-2 line-clamp-3 text-[11px] leading-4 text-slate-500 sm:text-sm sm:leading-5">{company.about}</p>
              <div className="mt-auto flex flex-wrap gap-1.5 pt-4">{company.categories.map((tag) => <span key={tag} className="rounded-full border border-orange-200 px-2 py-1 text-[10px] text-orange-500">{tag}</span>)}</div>
            </article>)}
          </div> : <p className="mt-8 text-slate-500">No companies match your search.</p>}
        </div>
      </section>

      <section className="bg-white px-4 py-6 sm:px-6 lg:px-10">
        <div className="relative mx-auto max-w-7xl overflow-hidden">
         <PostJobsBanner />
        </div>
      </section>

      {others.length > 0 && <section className="bg-gray-50 px-4 py-12 sm:px-6 md:py-16 lg:px-10"><div className="mx-auto max-w-7xl"><h2 className="mb-7 text-2xl font-bold sm:text-3xl">More companies</h2><div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-5 lg:grid-cols-4">{visibleOthers.map((company) => <article key={company.id} className="flex min-w-0 flex-col border border-slate-200 bg-white p-3 transition hover:border-indigo-500 hover:shadow-md sm:p-5"><CompanyLogo company={company} size="small"/><h3 className="mt-4 break-words text-sm font-bold sm:text-base">{company.name}</h3><Link href={`/jobs?company=${encodeURIComponent(company.name)}`} className="mt-3 w-fit text-xs font-medium text-indigo-600 underline underline-offset-2">{company.jobs} Jobs</Link></article>)}</div>{others.length > 8 && <button type="button" onClick={() => setShowAll(!showAll)} className="mt-7 flex items-center gap-2 text-sm font-semibold text-indigo-600">{showAll ? "Show fewer companies" : "View more design companies"}<ArrowRight size={16}/></button>}</div></section>}
      <Footer />
    </main>
  );
}
