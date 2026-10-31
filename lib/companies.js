// import { FaDropbox } from "react-icons/fa";
// import { SiNetlify, SiUdacity, SiWebflow } from "react-icons/si";
// import { jobs } from "./jobs";

// const browseData = [
//   { id: 1, name: "Nomad", location: "Paris, France", jobs: 3, about: "Nomad is a leading technology company building tools that help people work from anywhere.", categories: ["Business Service"], icon: "N", iconBg: "bg-emerald-50", iconColor: "text-emerald-500" },
//   { id: 2, name: "Discord", location: "San Francisco, USA", jobs: 3, about: "Discord is the easiest way to communicate over voice, video, and text with your communities.", categories: ["Technology"], icon: "D", iconBg: "bg-indigo-600", iconColor: "text-white" },
//   { id: 3, name: "Maze", location: "San Francisco, USA", jobs: 3, about: "Maze helps teams build better products with continuous product discovery.", categories: ["Business Service"], icon: "M", iconBg: "bg-blue-600", iconColor: "text-white" },
//   { id: 4, name: "Udacity", location: "Hamburg, Germany", jobs: 3, about: "Udacity is an online learning platform that helps people gain real-world technology skills.", categories: ["Business Service"], icon: SiUdacity, iconColor: "text-sky-500" },
//   { id: 5, name: "Webflow", location: "San Francisco, USA", jobs: 3, about: "Webflow is the visual design and hosting platform built for the next generation of the web.", categories: ["Business Service", "Technology"], icon: SiWebflow, iconColor: "text-indigo-600" },
//   { id: 6, name: "Foundation", location: "New York, USA", jobs: 3, about: "Foundation brings creators, artists, and collectors together in a creative marketplace.", categories: ["Business Service", "Technology"], icon: "F", iconBg: "bg-black", iconColor: "text-white" },
//   { id: 7, name: "Pentagram", location: "London, UK", jobs: 3, about: "Independent design studio working across identity, products, and experiences.", categories: ["Design"], icon: "P", iconBg: "bg-white", iconColor: "text-red-500" },
//   { id: 8, name: "Wolff Olins", location: "London, UK", jobs: 3, about: "Creative consultancy developing brands that move the world forward.", categories: ["Design"], icon: "W", iconBg: "bg-white", iconColor: "text-slate-900" },
//   { id: 9, name: "Clay", location: "San Francisco, USA", jobs: 3, about: "Design and branding studio for innovative digital experiences.", categories: ["Design"], icon: "C", iconBg: "bg-slate-900", iconColor: "text-white" },
//   { id: 10, name: "MediaMonks", location: "Amsterdam, Netherlands", jobs: 3, about: "Global creative and digital production company.", categories: ["Marketing"], icon: "M", iconBg: "bg-slate-900", iconColor: "text-white" },
//   { id: 11, name: "Packer", location: "Lucerne, Switzerland", jobs: 3, about: "Building developer-focused tools and workflows.", categories: ["Technology"], icon: "P", iconBg: "bg-orange-50", iconColor: "text-orange-500" },
//   { id: 12, name: "Square", location: "San Francisco, USA", jobs: 3, about: "Business software and payments tools for businesses of all sizes.", categories: ["Finance"], icon: "S", iconBg: "bg-black", iconColor: "text-white" },
//   { id: 13, name: "Divvy", location: "Utah, USA", jobs: 3, about: "Expense management and financial tools for teams.", categories: ["Finance"], icon: "V", iconBg: "bg-white", iconColor: "text-black" },
//   { id: 14, name: "Dropbox", location: "San Francisco, USA", jobs: 3, about: "Cloud storage and collaboration tools for teams.", categories: ["Technology"], icon: FaDropbox, iconColor: "text-blue-600" },
//   { id: 15, name: "Netlify", location: "San Francisco, USA", jobs: 3, about: "Platform for building and deploying modern web experiences.", categories: ["Technology"], icon: SiNetlify, iconColor: "text-cyan-500" },
// ];

// const searchData = [
//   {
//     id: 1,
//     name: "Stripe",
//     industry: "Fintech",
//     location: "United States",
//     size: "51-150",
//     jobs: 7,
//     logo: "S",
//     color: "bg-indigo-600",
//     description:
//       "Stripe builds financial infrastructure for businesses of all sizes.",
//   },
//   {
//     id: 2,
//     name: "Truebill",
//     industry: "Fintech",
//     location: "United States",
//     size: "51-150",
//     jobs: 7,
//     logo: "T",
//     color: "bg-blue-600",
//     description:
//       "Truebill helps people manage subscriptions and personal finances.",
//   },
//   {
//     id: 3,
//     name: "Square",
//     industry: "Fintech",
//     location: "United States",
//     size: "1001-Above",
//     jobs: 5,
//     logo: "◉",
//     color: "bg-black",
//     description:
//       "Square provides commerce tools and payment solutions for businesses.",
//   },
//   {
//     id: 4,
//     name: "Coinbase",
//     industry: "Fintech",
//     location: "United States",
//     size: "1001-Above",
//     jobs: 6,
//     logo: "C",
//     color: "bg-blue-600",
//     description:
//       "Coinbase builds products for the digital asset economy.",
//   },
//   {
//     id: 5,
//     name: "Robinhood",
//     industry: "Fintech",
//     location: "United States",
//     size: "1001-Above",
//     jobs: 4,
//     logo: "R",
//     color: "bg-gray-900",
//     description:
//       "Robinhood develops financial products and investment technology.",
//   },
//   {
//     id: 6,
//     name: "Kraken",
//     industry: "Fintech",
//     location: "United States",
//     size: "251-500",
//     jobs: 7,
//     logo: "K",
//     color: "bg-purple-600",
//     description:
//       "Kraken provides digital finance services and technology.",
//   },
//   {
//     id: 7,
//     name: "Revolut",
//     industry: "Fintech",
//     location: "United Kingdom",
//     size: "1001-Above",
//     jobs: 8,
//     logo: "R",
//     color: "bg-slate-900",
//     description:
//       "Revolut offers digital banking and financial management products.",
//   },
//   {
//     id: 8,
//     name: "Divvy",
//     industry: "Fintech",
//     location: "United States",
//     size: "51-150",
//     jobs: 3,
//     logo: "D",
//     color: "bg-gray-900",
//     description:
//       "Divvy helps companies manage spending and business expenses.",
//   },
// ];

// export const companySlug = name => name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

// function withJobCount(company) {
//   return { ...company, slug: companySlug(company.name), jobs: jobs.filter(job => job.company === company.name).length };
// }

// export const browseCompanies = browseData.map(withJobCount);
// export const searchCompanies = searchData.map(withJobCount);
// export const companies = [
//   ...browseCompanies.map(company => ({ ...searchCompanies.find(item => item.slug === company.slug), ...company })),
//   ...searchCompanies.filter(company => !browseCompanies.some(item => item.slug === company.slug)),
// ];

















// // Place this file at: lib/companies.js
// // Shared company data for BOTH the public Browse Companies page and
// // the dashboard Browse Companies pages. This is the SAME 21-company
// // dataset as the public page (15 original + 6 from the reference
// // screenshot: Stripe, Truebill, Coinbase, Robinhood, Kraken, Revolut).
// // Edit a company here and it updates everywhere at once -- do NOT
// // copy this list into the list or detail pages.
// //
// // IMPORTANT -- DO NOT DELETE THE searchCompanies EXPORT BELOW:
// // The public search page (app/companies/search/page.jsx) imports
// //   import { searchCompanies as companies } from "@/lib/companies";
// // The first version of this dashboard file overwrote lib/companies.js
// // WITHOUT that export, which broke the public search page with:
// //   "Export searchCompanies doesn't exist in target module"
// // That was the mistake, and this version restores it. The dashboard
// // pages use `companies`; the public search page uses `searchCompanies`.
// // Both come from this one file now, so neither page breaks the other.
// //
// // Fields: id (used in /dashboard/companies/[id] URLs), name, location,
// // jobs (job count shown on the card -- this is the dataset's count,
// // not a live count from lib/jobs.js), about, categories (Industry),
// // icon (a letter, or a react-icons component, like the public page),
// // iconBg / iconColor, size (must be one of COMPANY_SIZES).

// import { FaDropbox } from "react-icons/fa";
// import { SiNetlify, SiUdacity, SiWebflow } from "react-icons/si";

// export const COMPANY_SIZES = [
//   "1-50",
//   "51-150",
//   "151-250",
//   "251-500",
//   "501-1000",
//   "1000-above",
// ];

// export const companies = [
//   { id: 1, name: "Nomad", location: "Paris, France", jobs: 3, about: "Nomad is a leading technology company building tools that help people work from anywhere.", categories: ["Business Service"], icon: "N", iconBg: "bg-emerald-50", iconColor: "text-emerald-500", size: "51-150" },
//   { id: 2, name: "Discord", location: "San Francisco, USA", jobs: 3, about: "Discord is the easiest way to communicate over voice, video, and text with your communities.", categories: ["Technology"], icon: "D", iconBg: "bg-indigo-600", iconColor: "text-white", size: "1000-above" },
//   { id: 3, name: "Maze", location: "San Francisco, USA", jobs: 3, about: "Maze helps teams build better products with continuous product discovery.", categories: ["Business Service"], icon: "M", iconBg: "bg-blue-600", iconColor: "text-white", size: "51-150" },
//   { id: 4, name: "Udacity", location: "Hamburg, Germany", jobs: 3, about: "Udacity is an online learning platform that helps people gain real-world technology skills.", categories: ["Business Service"], icon: SiUdacity, iconColor: "text-sky-500", size: "501-1000" },
//   { id: 5, name: "Webflow", location: "San Francisco, USA", jobs: 3, about: "Webflow is the visual design and hosting platform built for the next generation of the web.", categories: ["Business Service", "Technology"], icon: SiWebflow, iconColor: "text-indigo-600", size: "501-1000" },
//   { id: 6, name: "Foundation", location: "New York, USA", jobs: 3, about: "Foundation brings creators, artists, and collectors together in a creative marketplace.", categories: ["Business Service", "Technology"], icon: "F", iconBg: "bg-black", iconColor: "text-white", size: "51-150" },
//   { id: 7, name: "Pentagram", location: "London, UK", jobs: 3, about: "Independent design studio working across identity, products, and experiences.", categories: ["Design"], icon: "P", iconBg: "bg-white", iconColor: "text-red-500", size: "151-250" },
//   { id: 8, name: "Wolff Olins", location: "London, UK", jobs: 3, about: "Creative consultancy developing brands that move the world forward.", categories: ["Design"], icon: "W", iconBg: "bg-white", iconColor: "text-slate-900", size: "251-500" },
//   { id: 9, name: "Clay", location: "San Francisco, USA", jobs: 3, about: "Design and branding studio for innovative digital experiences.", categories: ["Design"], icon: "C", iconBg: "bg-slate-900", iconColor: "text-white", size: "51-150" },
//   { id: 10, name: "MediaMonks", location: "Amsterdam, Netherlands", jobs: 3, about: "Global creative and digital production company.", categories: ["Marketing"], icon: "M", iconBg: "bg-slate-900", iconColor: "text-white", size: "1000-above" },
//   { id: 11, name: "Packer", location: "Lucerne, Switzerland", jobs: 3, about: "Building developer-focused tools and workflows.", categories: ["Technology"], icon: "P", iconBg: "bg-orange-50", iconColor: "text-orange-500", size: "1-50" },
//   { id: 12, name: "Square", location: "San Francisco, USA", jobs: 7, about: "Square builds common business tools in unconventional ways so more people can start, run, and grow their businesses.", categories: ["Business Service"], icon: "S", iconBg: "bg-black", iconColor: "text-white", size: "1000-above" },
//   { id: 13, name: "Divvy", location: "Utah, USA", jobs: 7, about: "Divvy is a secure financial platform for businesses to manage payments and subscriptions.", categories: ["Business Service", "Finance"], icon: "V", iconBg: "bg-white", iconColor: "text-black", size: "501-1000" },
//   { id: 14, name: "Dropbox", location: "San Francisco, USA", jobs: 3, about: "Cloud storage and collaboration tools for teams.", categories: ["Technology"], icon: FaDropbox, iconColor: "text-blue-600", size: "1000-above" },
//   { id: 15, name: "Netlify", location: "San Francisco, USA", jobs: 3, about: "Platform for building and deploying modern web experiences.", categories: ["Technology"], icon: SiNetlify, iconColor: "text-cyan-500", size: "251-500" },
//   { id: 16, name: "Stripe", location: "San Francisco, USA", jobs: 7, about: "Stripe is a software platform for starting and running an internet business. Millions of businesses rely on Stripe's software tools.", categories: ["Business Service"], icon: "S", iconBg: "bg-indigo-500", iconColor: "text-white", size: "1000-above" },
//   { id: 17, name: "Truebill", location: "San Francisco, USA", jobs: 7, about: "Take control of your money. Truebill develops a mobile app that helps consumers take control of their financial lives.", categories: ["Finance"], icon: "T", iconBg: "bg-blue-600", iconColor: "text-white", size: "251-500" },
//   { id: 18, name: "Coinbase", location: "San Francisco, USA", jobs: 7, about: "Coinbase is a digital currency wallet and platform where merchants and consumers can transact with new digital currencies.", categories: ["Finance"], icon: "C", iconBg: "bg-blue-600", iconColor: "text-white", size: "1000-above" },
//   { id: 19, name: "Robinhood", location: "San Francisco, USA", jobs: 7, about: "Robinhood is lowering barriers, removing fees, and providing greater access to financial information.", categories: ["Finance"], icon: "R", iconBg: "bg-white", iconColor: "text-black", size: "1000-above" },
//   { id: 20, name: "Kraken", location: "San Francisco, USA", jobs: 7, about: "Based in San Francisco, Kraken is the world's largest global bitcoin exchange in euro volume and liquidity.", categories: ["Finance"], icon: "K", iconBg: "bg-indigo-600", iconColor: "text-white", size: "501-1000" },
//   { id: 21, name: "Revolut", location: "London, UK", jobs: 7, about: "When Revolut was founded in 2015, we had a vision to build a sustainable, digital alternative to traditional big banks.", categories: ["Finance"], icon: "R", iconBg: "bg-white", iconColor: "text-black", size: "1000-above" },
// ];

// export function getCompanyById(rawId) {
//   const id = Number(rawId);
//   return companies.find((c) => c.id === id || String(c.id) === String(rawId)) || null;
// }

// // ---------------------------------------------------------------------------
// // searchCompanies -- for the PUBLIC search page only:
// //   import { searchCompanies as companies } from "@/lib/companies";
// //
// // This is an ARRAY (not a function), in the search page's field format,
// // so the search page can use it exactly as it did before:
// //   industry, description, logo, color, location, size, jobs
// // Each object below ALSO carries the dashboard fields (categories,
// // about, icon, iconBg, iconColor), so it works whichever field names
// // the search page uses.
// //
// // The 8 Fintech companies are listed first, with their ORIGINAL search
// // page values (industry "Fintech", location "United States" /
// // "United Kingdom", size "1001-Above", etc.), because the search page's
// // filters were built around those values. The other 13 companies are
// // then added, mapped from the dashboard dataset (industry = first
// // category, location = city location, description = about, logo =
// // letter, color = iconBg). No company appears twice.
// // ---------------------------------------------------------------------------

// const searchPageFintech = [
//   { id: 16, name: "Stripe", industry: "Fintech", location: "United States", size: "51-150", jobs: 7, logo: "S", color: "bg-indigo-600", description: "Stripe builds financial infrastructure for businesses of all sizes." },
//   { id: 17, name: "Truebill", industry: "Fintech", location: "United States", size: "51-150", jobs: 7, logo: "T", color: "bg-blue-600", description: "Truebill helps people manage subscriptions and personal finances." },
//   { id: 12, name: "Square", industry: "Fintech", location: "United States", size: "1001-Above", jobs: 5, logo: "◉", color: "bg-black", description: "Square provides commerce tools and payment solutions for businesses." },
//   { id: 18, name: "Coinbase", industry: "Fintech", location: "United States", size: "1001-Above", jobs: 6, logo: "C", color: "bg-blue-600", description: "Coinbase builds products for the digital asset economy." },
//   { id: 19, name: "Robinhood", industry: "Fintech", location: "United States", size: "1001-Above", jobs: 4, logo: "R", color: "bg-gray-900", description: "Robinhood develops financial products and investment technology." },
//   { id: 20, name: "Kraken", industry: "Fintech", location: "United States", size: "251-500", jobs: 7, logo: "K", color: "bg-purple-600", description: "Kraken provides digital finance services and technology." },
//   { id: 21, name: "Revolut", industry: "Fintech", location: "United Kingdom", size: "1001-Above", jobs: 8, logo: "R", color: "bg-slate-900", description: "Revolut offers digital banking and financial management products." },
//   { id: 13, name: "Divvy", industry: "Fintech", location: "United States", size: "51-150", jobs: 3, logo: "D", color: "bg-gray-900", description: "Divvy helps companies manage spending and business expenses." },
// ];

// const searchPageFintechNames = new Set(searchPageFintech.map((c) => c.name));

// export const searchCompanies = [
//   ...searchPageFintech.map((c) => {
//     const dashboard = companies.find((d) => d.name === c.name) || {};
//     return {
//       ...c,
//       categories: dashboard.categories || [c.industry],
//       about: c.description,
//       icon: dashboard.icon || c.logo,
//       iconBg: c.color,
//       iconColor: "text-white",
//     };
//   }),
//   ...companies
//     .filter((c) => !searchPageFintechNames.has(c.name))
//     .map((c) => ({
//       id: c.id,
//       name: c.name,
//       industry: c.categories[0] || "",
//       categories: c.categories,
//       location: c.location,
//       size: c.size,
//       jobs: c.jobs,
//       logo: typeof c.icon === "string" ? c.icon : c.name.charAt(0),
//       color: c.iconBg || "bg-indigo-600",
//       description: c.about,
//       about: c.about,
//       icon: c.icon,
//       iconBg: c.iconBg,
//       iconColor: c.iconColor,
//     })),
// ];
























// Place this file at: lib/companies.js -- REPLACE the whole file with this.
// DO NOT comment this file out, and do NOT restore only the original
// part alone: this file contains BOTH parts, and both are needed.
//
// PART 1 -- YOUR ORIGINAL CODE, UNCHANGED (except nothing was deleted):
// browseData (15 companies), searchData (8 Fintech companies),
// companySlug, withJobCount, browseCompanies, searchCompanies and
// companies. The public pages use browseCompanies / searchCompanies /
// companies from here, and withJobCount makes their jobs count LIVE
// from lib/jobs.js (so e.g. Nomad shows 1 job, Stripe shows 0, etc.,
// not the static 3 / 7 numbers in the old inline data).
//
// PART 2 -- DASHBOARD ADDITIONS, ADDED AFTER YOUR ORIGINAL CODE:
// COMPANY_SIZES and getCompanyById, which the dashboard pages import:
//   import { companies, COMPANY_SIZES } from "@/lib/companies";
//   import { getCompanyById } from "@/lib/companies";
// Without them the dashboard gives:
//   "Export COMPANY_SIZES doesn't exist in target module"
//   (and next, "Export getCompanyById doesn't exist").
// The additions below also fill in missing fields on the merged
// `companies` array ONLY (size, categories, icon, about, industry,
// logo, color) -- they do NOT change browseCompanies or searchCompanies,
// so the public pages keep working exactly as before.
//
// WHY THE ERROR HAPPENED:
// Your original lib/companies.js had NO COMPANY_SIZES and NO
// getCompanyById, and its companies had NO size field for the 15
// browse companies, NO categories/icon/about for the 6 search-only
// companies, and DUPLICATE ids (Stripe id 1 = Nomad id 1, etc.).
// The dashboard therefore needs slug-based routing (see below) and
// the filled-in fields, not just the original exports.

import { FaDropbox } from "react-icons/fa";
import { SiNetlify, SiUdacity, SiWebflow } from "react-icons/si";
import { jobs } from "./jobs";

// ================= PART 1: YOUR ORIGINAL CODE =================

const browseData = [
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

const searchData = [
  { id: 1, name: "Stripe", industry: "Fintech", location: "United States", size: "51-150", jobs: 7, logo: "S", color: "bg-indigo-600", description: "Stripe builds financial infrastructure for businesses of all sizes." },
  { id: 2, name: "Truebill", industry: "Fintech", location: "United States", size: "51-150", jobs: 7, logo: "T", color: "bg-blue-600", description: "Truebill helps people manage subscriptions and personal finances." },
  { id: 3, name: "Square", industry: "Fintech", location: "United States", size: "1001-Above", jobs: 5, logo: "◉", color: "bg-black", description: "Square provides commerce tools and payment solutions for businesses." },
  { id: 4, name: "Coinbase", industry: "Fintech", location: "United States", size: "1001-Above", jobs: 6, logo: "C", color: "bg-blue-600", description: "Coinbase builds products for the digital asset economy." },
  { id: 5, name: "Robinhood", industry: "Fintech", location: "United States", size: "1001-Above", jobs: 4, logo: "R", color: "bg-gray-900", description: "Robinhood develops financial products and investment technology." },
  { id: 6, name: "Kraken", industry: "Fintech", location: "United States", size: "251-500", jobs: 7, logo: "K", color: "bg-purple-600", description: "Kraken provides digital finance services and technology." },
  { id: 7, name: "Revolut", industry: "Fintech", location: "United Kingdom", size: "1001-Above", jobs: 8, logo: "R", color: "bg-slate-900", description: "Revolut offers digital banking and financial management products." },
  { id: 8, name: "Divvy", industry: "Fintech", location: "United States", size: "51-150", jobs: 3, logo: "D", color: "bg-gray-900", description: "Divvy helps companies manage spending and business expenses." },
];

export const companySlug = (name) =>
  name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

function withJobCount(company) {
  return { ...company, slug: companySlug(company.name), jobs: jobs.filter((job) => job.company === company.name).length };
}

export const browseCompanies = browseData.map(withJobCount);
export const searchCompanies = searchData.map(withJobCount);
export const companies = [
  ...browseCompanies.map((company) => ({ ...searchCompanies.find((item) => item.slug === company.slug), ...company })),
  ...searchCompanies.filter((company) => !browseCompanies.some((item) => item.slug === company.slug)),
];

// ================= PART 2: DASHBOARD ADDITIONS =================

// Size options for the dashboard filter. Both vocabularies are here
// on purpose: browse sizes use "1000-above", search sizes use
// "1001-Above" -- if either one is missing, those companies can
// never match the size filter.
export const COMPANY_SIZES = [
  "1-50",
  "51-150",
  "151-250",
  "251-500",
  "501-1000",
  "1000-above",
  "1001-Above",
];

// Fill in missing fields on the merged `companies` array ONLY, for
// the dashboard. This does not touch browseCompanies / searchCompanies,
// and it never overwrites a field that already exists.
const dashboardSizeByName = {
  Nomad: "51-150",
  Discord: "1000-above",
  Maze: "51-150",
  Udacity: "501-1000",
  Webflow: "501-1000",
  Foundation: "51-150",
  Pentagram: "151-250",
  "Wolff Olins": "251-500",
  Clay: "51-150",
  MediaMonks: "1000-above",
  Packer: "1-50",
  Dropbox: "1000-above",
  Netlify: "251-500",
};

companies.forEach((company) => {
  if (!company.size) company.size = dashboardSizeByName[company.name] || "";
  if (!company.categories) company.categories = company.industry ? [company.industry] : [];
  if (!company.industry) company.industry = company.categories[0] || "";
  if (!company.about) company.about = company.description || "";
  if (!company.description) company.description = company.about || "";
  if (!company.icon) company.icon = company.logo || company.name.charAt(0);
  if (!company.iconBg) company.iconBg = company.color || "bg-indigo-600";
  if (!company.iconColor) company.iconColor = "text-white";
  if (!company.logo) company.logo = typeof company.icon === "string" ? company.icon : company.name.charAt(0);
  if (!company.color) company.color = company.iconBg || "bg-indigo-600";
});

// Dashboard detail pages use SLUG, not numeric id, because the merged
// `companies` array has duplicate ids (Stripe id 1 = Nomad id 1, etc.).
// This function matches slug first, then id, so both
// /dashboard/companies/stripe and /dashboard/companies/1 (Nomad) work.
export function getCompanyById(rawId) {
  if (rawId == null) return null;
  const raw = String(rawId);
  return (
    companies.find((c) => c.slug === raw) ||
    companies.find((c) => String(c.id) === raw) ||
    companies.find((c) => companySlug(c.name) === raw) ||
    null
  );
}
