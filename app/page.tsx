"use client";

import Link from "next/link";
import Navbar from "@/components/Navbar";
import PostJobsBanner from "@/components/PostJobBanner";


import {
  PenTool,
  ChartNoAxesColumnIncreasing,
  Megaphone,
  Wallet,
  Monitor,
  CodeXml,
  BriefcaseBusiness,
  UsersRound,
  ArrowRight,
} from "lucide-react";

import {
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
  FaTwitter,
  FaDribbble,
} from "react-icons/fa";

import FeaturedJobs from "@/components/FeaturedJobs";
import { FaArrowRight } from "react-icons/fa6";

// import { ArrowRight } from "lucide-react";
import { FaDropbox } from "react-icons/fa";
import {
  SiNetlify,
  SiUdacity,
  SiWebflow,
} from "react-icons/si";
import { useState } from "react";

const jobs = [
  {
    id: 1,
    title: "Social Media Assistant",
    company: "Nomad",
    location: "Paris, France",
    logo: "N",
    color: "text-emerald-500",
  },
  {
    id: 2,
    title: "Social Media Assistant",
    company: "Netlify",
    location: "Paris, France",
    logo: SiNetlify,
    color: "text-cyan-500",
  },
  {
    id: 3,
    title: "Brand Designer",
    company: "Dropbox",
    location: "San Francisco, USA",
    logo: FaDropbox,
    color: "text-blue-600",
  },
  {
    id: 4,
    title: "Brand Designer",
    company: "Maze",
    location: "San Francisco, USA",
    logo: "M",
    color: "text-blue-600",
  },
  {
    id: 5,
    title: "Interactive Developer",
    company: "Terraform",
    location: "Hamburg, Germany",
    logo: "T",
    color: "text-cyan-500",
  },
  {
    id: 6,
    title: "Interactive Developer",
    company: "Udacity",
    location: "Hamburg, Germany",
    logo: SiUdacity,
    color: "text-sky-500",
  },
  {
    id: 7,
    title: "HR Manager",
    company: "Packer",
    location: "Lucern, Switzerland",
    logo: "P",
    color: "text-red-500",
  },
  {
    id: 8,
    title: "HR Manager",
    company: "Webflow",
    location: "Lucern, Switzerland",
    logo: SiWebflow,
    color: "text-indigo-600",
  },
];


const categories = [
  {
    name: "Design",
    jobs: 235,
    icon: PenTool,
  },
  {
    name: "Sales",
    jobs: 756,
    icon: ChartNoAxesColumnIncreasing,
  },
  {
    name: "Marketing",
    jobs: 140,
    icon: Megaphone,
  },
  {
    name: "Finance",
    jobs: 325,
    icon: Wallet,
  },
  {
    name: "Technology",
    jobs: 436,
    icon: Monitor,
  },
  {
    name: "Engineering",
    jobs: 542,
    icon: CodeXml,
  },
  {
    name: "Business",
    jobs: 211,
    icon: BriefcaseBusiness,
  },
  {
    name: "Human Resource",
    jobs: 346,
    icon: UsersRound,
  },
];


export default function Home() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: { preventDefault: () => void; }) => {
    e.preventDefault();

    if (!email.trim()) return;

    setSubscribed(true);
    setEmail("");
  };


  return (
    <div className="min-h-screen w-full overflow-x-clip bg-gray-50">

      <Navbar />
     {/* <nav className="w-full bg-gray-50">
        <Navbar />
      </nav>
     */}
      <section className="hero w-full px-4 py-10 sm:px-6 sm:py-14 lg:py-20">
        <div className="mx-auto max-w-7xl">
          <div className="max-w-2xl">
            <h1 className="text-[clamp(2.35rem,10vw,4rem)] font-bold leading-[1.12] tracking-tight text-slate-800 sm:text-6xl lg:text-7xl">
              Discover
              <br />
              more than
              <br />
              <span className="font-serif text-sky-400">5000+ Jobs</span>
            </h1>

            <p className="mt-5 max-w-md text-sm leading-7 text-slate-400 sm:text-base">
              Great platform for the job seeker that searching for new career heights and passionate about startups.
            </p>

          </div>
          

          
          <div className="mt-8 w-full max-w-2xl bg-white p-3 shadow-md sm:p-4">
            <div className="flex min-w-0 flex-col items-stretch gap-3 md:flex-row md:items-center md:gap-4">

              <div className="flex min-w-0 w-full flex-1 items-center gap-3 px-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="22"
                  height="22"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  className="text-slate-700"
                >
                  <circle cx="11" cy="11" r="8" />
                  <path d="m21 21-4.35-4.35" />
                </svg>

                <input
                  type="text"
                  placeholder="Job title or keyword"
                  className="min-w-0 w-full border-b border-gray-200 py-3 text-sm text-slate-700 outline-none placeholder:text-gray-400 focus:border-indigo-600"
                />
              </div>

              {/* Location */}
              <div className="flex min-w-0 w-full flex-1 items-center gap-3 px-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="22"
                  height="22"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  className="text-slate-700"
                >
                  <path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z" />
                  <circle cx="12" cy="10" r="2.5" />
                </svg>

                <select
                  defaultValue="Florence, Italy"
                  aria-label="Job location"
                  className="min-w-0 w-full cursor-pointer border-b border-gray-200 bg-white py-3 text-sm text-slate-700 outline-none focus:border-indigo-600"
                >
                  <option>Florence, Italy</option>
                  <option>Islamabad, Pakistan</option>
                  <option>Lahore, Pakistan</option>
                  <option>Karachi, Pakistan</option>
                  <option>Remote</option>
                </select>
              </div>

              {/* Search Button */}
              <button
                type="button"
                className="w-full whitespace-nowrap bg-indigo-600 px-7 py-4 text-sm font-semibold text-white hover:bg-indigo-700 md:w-auto"
              >
                Search my job
              </button>

            </div>
          </div>

          <div>
            <p className="mt-3 max-w-md text-sm  text-slate-600 sm:text-base">
              Popular : UI Designer, UX Researcher, Android, Admin
            </p>
          </div>

        </div>
      </section>
      
      <section className="w-full bg-white py-10 sm:py-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <p className="mb-8 text-lg text-gray-400">
            Companies we helped grow
          </p>

          <div className="grid grid-cols-2 items-center justify-items-center gap-x-3 gap-y-7 pt-2 sm:grid-cols-3 sm:gap-8 lg:grid-cols-5">
            <div className="flex items-center gap-2 text-gray-400">
              {/* <SiVodafone className="text-3xl" /> */}
              <span className="font-serif text-base font-bold sm:text-xl">vodafone</span>
            </div>

            <div className="flex items-center justify-center text-gray-400">
              {/* <SiIntel className="text-6xl" /> */}
              <span className="font-serif text-base font-bold sm:text-xl">Intel</span>
            </div>

            <div className="flex items-center justify-center text-gray-400">
              {/* <SiTesla className="text-7xl" /> */}
              <span className="font-serif text-base font-bold sm:text-xl">Tesla</span>
            </div>

            <div className="flex items-center justify-center text-gray-400">
              {/* <SiAmd className="text-6xl" /> */}
              <span className="font-serif text-base font-bold sm:text-xl">AMD</span>
            </div>

            <div className="flex items-center justify-center text-gray-400">
              <span className="font-serif text-base font-bold sm:text-lg">
                Talkit
              </span>
            </div>
          </div>
        </div>
      </section>



      <section className="w-full bg-white px-4 py-10 sm:px-6 sm:py-14 lg:py-16">
        <div className="mx-auto w-full max-w-7xl">
          <div className="mb-7 flex flex-col items-start gap-3 sm:mb-10 sm:flex-row sm:items-center sm:justify-between">
            <h2 className="text-2xl font-bold leading-tight tracking-tight text-slate-800 sm:text-3xl lg:text-5xl">
              Explore By <span className="text-sky-400">Category</span>
            </h2>
            <Link href="/jobs" className="inline-flex shrink-0 items-center gap-2 text-sm font-semibold text-indigo-600">
              Show all Job <FaArrowRight size={15} />
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4">
            {categories.map((category) => {
              const Icon = category.icon;
              return (
                <div
                  key={category.name}
                  className="group flex min-w-0 min-h-33 cursor-pointer flex-col justify-between gap-5 border border-slate-200 bg-white p-3 transition-colors duration-300 hover:border-indigo-600 hover:bg-indigo-600 sm:min-h-38 sm:p-5"
                >
                  <Icon size={28} strokeWidth={1.8} className="shrink-0 text-indigo-600 group-hover:text-white" />
                  <div className="min-w-0">
                    <h3 className="break-words text-sm font-bold leading-5 text-slate-800 group-hover:text-white sm:text-lg lg:text-xl">
                      {category.name}
                    </h3>
                    <div className="mt-2 flex items-center gap-1.5">
                      <p className="min-w-0 text-[11px] leading-4 text-slate-400 group-hover:text-white sm:text-sm">
                        {category.jobs} jobs available
                      </p>
                      <ArrowRight size={15} className="shrink-0 text-slate-800 group-hover:text-white" />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-7xl">
        <PostJobsBanner />
      </section>

    <section className="mx-auto w-full max-w-7xl">
      <FeaturedJobs />
    </section>

    

   
<section className="relative w-full overflow-hidden bg-gray-50 px-3 py-10 sm:px-6 sm:py-14 md:px-10 md:py-20">

  <div className="pointer-events-none absolute -right-20 top-10 h-40 w-72 rotate-[-25deg] border border-indigo-200"></div>

  <div className="pointer-events-none absolute -bottom-20 right-20 h-52 w-52 rotate-45 border border-indigo-200"></div>

  <div className="relative mx-auto w-full max-w-7xl">

    <div className="mb-6 flex flex-col items-start gap-3 sm:mb-10 sm:flex-row sm:items-center sm:justify-between">
      <h2 className="text-2xl font-bold leading-tight tracking-tight text-slate-800 sm:text-3xl md:text-4xl">
        Latest <span className="text-sky-400">jobs open</span>
      </h2>

      <Link
        href="/jobs"
        className="flex items-center gap-2 text-sm font-semibold text-indigo-600 hover:text-indigo-700"
      >
        Show all jobs
        <ArrowRight size={18} />
      </Link>
    </div>

    <div className="grid grid-cols-2 gap-2 sm:gap-4">
      {jobs.map((job) => {
        const Logo = job.logo;

        return (
          <div
            key={job.id}
            className="flex min-w-0 flex-col gap-3 bg-white p-3 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg sm:flex-row sm:items-start sm:gap-5 sm:p-5"
          >
            <div className="flex h-8 w-8 shrink-0 items-center justify-center sm:h-12 sm:w-12">
              {typeof Logo === "string" ? (
                <div
                  className={`flex h-8 w-8 items-center justify-center rounded-lg bg-gray-100 text-xl font-bold sm:h-10 sm:w-10 sm:text-2xl ${job.color}`}
                >
                  {Logo}
                </div>
              ) : (
                <Logo
                  className={`text-3xl sm:text-4xl ${job.color}`}
                  aria-label={job.company}
                />
              )}
            </div>

            <div className="min-w-0 flex-1">
              <h3 className="text-sm font-semibold leading-5 text-slate-800 sm:text-base">
                {job.title}
              </h3>

              <p className="mt-1 break-words text-[10px] leading-4 text-slate-500 sm:text-xs sm:leading-5">
                {job.company} · {job.location}
              </p>

              <div className="mt-3 flex flex-wrap items-center gap-1.5 sm:gap-2">
                <span className="rounded-full bg-teal-50 px-2 py-1 text-[9px] text-teal-500 sm:px-3 sm:text-xs">
                  Full-Time
                </span>

                <span className="rounded-full border border-orange-300 px-2 py-1 text-[9px] text-orange-400 sm:px-3 sm:text-xs">
                  Marketing
                </span>

                <span className="rounded-full border border-indigo-400 px-2 py-1 text-[9px] text-indigo-600 sm:px-3 sm:text-xs">
                  Design
                </span>
              </div>
            </div>
          </div>
        );
      })}
    </div>

  </div>
</section>



     <footer className="w-full bg-gray-900 px-4 pb-8 pt-12 text-white sm:px-6 md:px-10 md:pt-16">
      <div className="mx-auto max-w-7xl">

        <div className="grid grid-cols-2 gap-x-5 gap-y-10 lg:grid-cols-12 lg:gap-10">

          <div className="col-span-2 lg:col-span-4">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-indigo-600">
                <div className="h-4 w-4 rounded-full border-4 border-white"></div>
              </div>

              <span className="text-xl font-bold">
                JobHuntly
              </span>
            </Link>

            <p className="mt-5 max-w-xs text-sm leading-6 text-gray-400">
              Great platform for the job seeker that
              passionate about startups. Find your dream
              job easier.
            </p>
          </div>

          <div className="col-span-1 lg:col-span-2">
            <h3 className="mb-5 text-base font-semibold">
              About
            </h3>

            <div className="flex flex-col gap-4 text-sm text-gray-400">
              <Link href="/companies" className="hover:text-white">
                Companies
              </Link>
              <Link href="/pricing" className="hover:text-white">
                Pricing
              </Link>
              <Link href="/terms" className="hover:text-white">
                Terms
              </Link>
              <Link href="/advice" className="hover:text-white">
                Advice
              </Link>
              <Link href="/privacy" className="hover:text-white">
                Privacy Policy
              </Link>
            </div>
          </div>

          <div className="col-span-1 lg:col-span-2">
            <h3 className="mb-5 text-base font-semibold">
              Resources
            </h3>

            <div className="flex flex-col gap-4 text-sm text-gray-400">
              <Link href="/help" className="hover:text-white">
                Help Docs
              </Link>
              <Link href="/guide" className="hover:text-white">
                Guide
              </Link>
              <Link href="/updates" className="hover:text-white">
                Updates
              </Link>
              <Link href="/contact" className="hover:text-white">
                Contact Us
              </Link>
            </div>
          </div>

          <div className="col-span-2 lg:col-span-4">
            <h3 className="mb-5 text-base font-semibold">
              Get job notifications
            </h3>

            <p className="mb-5 text-sm leading-6 text-gray-400">
              The latest job news, articles, sent to your
              inbox weekly.
            </p>

            <form
              onSubmit={handleSubscribe}
              className="flex flex-col gap-2 sm:flex-row"
            >
              <input
                type="email"
                required
                placeholder="Email Address"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setSubscribed(false);
                }}
                className="min-w-0 flex-1 bg-white px-4 py-3 text-sm text-slate-800 outline-none placeholder:text-gray-400"
              />

              <button
                type="submit"
                className="bg-indigo-600 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-indigo-700"
              >
                Subscribe
              </button>
            </form>

            {subscribed && (
              <p className="mt-3 text-sm text-green-400">
                Email received! Subscription setup is pending.
              </p>
            )}
          </div>
        </div>

        <div className="mt-10 border-t border-gray-700 pt-7 sm:mt-16">
          <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">

            <p className="text-xs text-gray-400">
              2026 © JobHuntly. All rights reserved.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4">
              <a
                href="https://facebook.com"
                aria-label="Facebook"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-700 text-gray-300 hover:bg-indigo-600 hover:text-white"
              >
                <FaFacebookF size={13} />
              </a>

              <a
                href="https://instagram.com"
                aria-label="Instagram"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-700 text-gray-300 hover:bg-indigo-600 hover:text-white"
              >
                <FaInstagram size={14} />
              </a>

              <a
                href="https://linkedin.com"
                aria-label="LinkedIn"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-700 text-gray-300 hover:bg-indigo-600 hover:text-white"
              >
                <FaLinkedinIn size={14} />
              </a>

              <a
                href="https://dribbble.com"
                aria-label="Dribbble"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-700 text-gray-300 hover:bg-indigo-600 hover:text-white"
              >
                <FaDribbble size={14} />
              </a>

              <a
                href="https://twitter.com"
                aria-label="Twitter"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-700 text-gray-300 hover:bg-indigo-600 hover:text-white"
              >
                <FaTwitter size={14} />
              </a>
            </div>

          </div>
        </div>

      </div>
    </footer>
  
  </div>
    
  );
}

