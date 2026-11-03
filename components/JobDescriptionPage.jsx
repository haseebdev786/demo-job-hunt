"use client";

import { useState } from "react";
import Link from "next/link";


import {
  Check,
  Share2,
  MapPin,
  Sparkles,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
// ADDED ONLY: application modal import. Nothing else was deleted.
import JobApplicationModal from "@/components/JobApplicationModal";



function JobLogo({ job, large }) {
  const Logo = job.logo;
  const size = large ? "h-14 w-14 text-3xl" : "h-10 w-10 text-xl";
  return (
    <div className={`flex shrink-0 items-center justify-center rounded-lg ${size} ${job.logoBg || "bg-slate-50"}`}>
      {typeof Logo === "string" ? (
        <span className={`font-black ${job.logoColor}`}>{Logo}</span>
      ) : (
        <Logo className={`text-3xl ${job.logoColor}`} aria-label={job.company} />
      )}
    </div>
  );
}

function BulletList({ items }) {
  return (
    <ul className="mt-4 space-y-3">
      {items.map((item) => (
        <li key={item} className="flex gap-3 text-sm leading-6 text-slate-500">
          <span className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-emerald-500">
            <Check size={13} />
          </span>
          {item}
        </li>
      ))}
    </ul>
  );
}

export default function JobDescriptionPage({ job, jobs = [], dashboard = false }) {
  const [applicationOpen, setApplicationOpen] = useState(false);
  const lines = (value) => value.split(/\r?\n/).map((line) => line.trim()).filter(Boolean);
  const detail = { ...job, responsibilities: lines(job.responsibilities), whoYouAre: lines(job.whoYouAre), niceToHaves: lines(job.niceToHaves), companyAbout: job.companyAbout || "View this company's other open positions." };
  const perks = job.perks.map((perk) => ({ ...perk, icon: Sparkles }));
  const similarJobs = jobs.filter((item) => item.id !== job.id).slice(0, 8);
  return (
    <div className="min-h-screen bg-white text-slate-800">
      {!dashboard && <Navbar />}

      <section className="bg-gray-50 px-4 py-8 sm:px-6 lg:px-10">
        <div className="mx-auto max-w-7xl">
          <p className="text-xs text-slate-400">
            <Link href="/" className="hover:text-indigo-600">Home</Link>
            {" / "}
            <Link href="/jobs" className="hover:text-indigo-600">Jobs</Link>
            {" / "}
            {job.company}
            {" / "}
            <span className="text-slate-700">{job.title}</span>
          </p>

          <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border border-slate-200 bg-white p-5">
            <div className="flex items-center gap-4">
              <JobLogo job={job} large />
              <div>
                <h1 className="text-2xl font-bold sm:text-3xl">{job.title}</h1>
                <p className="mt-1 flex flex-wrap items-center gap-2 text-sm text-slate-500">
                  <span>{job.company}</span>
                  <span>·</span>
                  <span className="flex items-center gap-1">
                    <MapPin size={14} /> {job.location}
                  </span>
                  <span>·</span>
                  <span>{job.type}</span>
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button type="button" aria-label="Share this job" className="border border-slate-200 p-3 text-slate-500 hover:text-indigo-600">
                <Share2 size={18} />
              </button>
              {/* ADDED ONLY: onClick opens the application modal. */}
              <button
                type="button"
                onClick={() => setApplicationOpen(true)}
                className="bg-indigo-600 px-8 py-3 text-sm font-semibold text-white hover:bg-indigo-700"
              >
                Apply
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="px-4 py-12 sm:px-6 lg:px-10">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[minmax(0,1fr)_320px]">
          <div>
            <h2 className="text-xl font-bold">Description</h2>
            <p className="mt-3 text-sm leading-6 text-slate-500">{detail.description}</p>

            <h2 className="mt-10 text-xl font-bold">Responsibilities</h2>
            <BulletList items={detail.responsibilities} />

            <h2 className="mt-10 text-xl font-bold">Who You Are</h2>
            <BulletList items={detail.whoYouAre} />

            <h2 className="mt-10 text-xl font-bold">Nice-To-Haves</h2>
            <BulletList items={detail.niceToHaves} />
          </div>

          <aside>
            <h2 className="text-xl font-bold">About this role</h2>
            <div className="mt-4 border border-slate-200 bg-gray-50 p-5">
              <p className="text-sm text-slate-600">
                <span className="font-bold text-slate-800">{job.applicants} applied</span>
              </p>
              <dl className="mt-6 space-y-4 text-sm">
                <div className="flex justify-between gap-4">
                  <dt className="text-slate-400">Apply Before</dt>
                  <dd className="font-medium">{job.dueDate}</dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-slate-400">Job Posted On</dt>
                  <dd className="font-medium">{job.datePosted}</dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-slate-400">Job Type</dt>
                  <dd className="font-medium">{job.type}</dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-slate-400">Job Level</dt>
                  <dd className="font-medium">{job.level}</dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-slate-400">Salary</dt>
                  <dd className="font-medium">{job.salary}</dd>
                </div>
              </dl>
            </div>

            <h3 className="mt-10 text-lg font-bold">Categories</h3>
            <div className="mt-3 flex flex-wrap gap-2">
              <span className="rounded-full border border-orange-200 px-3 py-1 text-xs text-orange-500">{job.category}</span>
              <span className="rounded-full border border-indigo-200 px-3 py-1 text-xs text-indigo-600">{job.type}</span>
            </div>

            <h3 className="mt-10 text-lg font-bold">Required Skills</h3>
            <div className="mt-3 flex flex-wrap gap-2">
              {detail.skills.map((skill) => (
                <span key={skill} className="border border-slate-200 bg-gray-50 px-3 py-1 text-xs text-slate-600">
                  {skill}
                </span>
              ))}
            </div>
          </aside>
        </div>
      </section>

      <section className="border-t border-slate-100 px-4 py-12 sm:px-6 lg:px-10">
        <div className="mx-auto max-w-7xl">
          <h2 className="text-2xl font-bold">Perks &amp; Benefits</h2>
          <p className="mt-2 text-sm text-slate-500">{perks.length ? "Benefits shared by the employer" : "No benefits listed."}</p>
          <div className="mt-8 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {perks.map((perk) => {
              const Icon = perk.icon;
              return (
                <div key={perk.title}>
                  <Icon size={24} className="text-indigo-600" />
                  <h3 className="mt-3 font-bold">{perk.title}</h3>
                  <p className="mt-2 text-xs leading-5 text-slate-500">{perk.text}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="border-t border-slate-100 px-4 py-12 sm:px-6 lg:px-10">
        <div className="mx-auto grid max-w-7xl items-center gap-8 lg:grid-cols-2">
          <div>
            <div className="flex items-center gap-4">
              <JobLogo job={job} />
              <div>
                <h3 className="text-xl font-bold">{job.company}</h3>
                <Link
                  href={`/companies/${job.companySlug}`}
                  className="text-sm font-medium text-indigo-600"
                >
                  Read more about {job.company} →
                </Link>
              </div>
            </div>
            <p className="mt-4 text-sm leading-6 text-slate-500">{detail.companyAbout}</p>
          </div>


        </div>
      </section>

      <section className="bg-gray-50 px-4 py-12 sm:px-6 lg:px-10">
        <div className="mx-auto max-w-7xl">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">Similar Jobs</h2>
            <Link href="/jobs" className="text-sm font-semibold text-indigo-600">
              Show all Jobs →
            </Link>
          </div>
          <div className="mt-7 grid gap-4 sm:grid-cols-2">
            {similarJobs.map((similar) => (
              <article key={similar.id} className="relative border border-slate-200 bg-white p-5 transition hover:border-indigo-500 hover:shadow-md">
                <div className="flex items-start justify-between gap-3">
                  <JobLogo job={similar} />
                  <span className="border border-indigo-200 px-2 py-1 text-xs text-indigo-600">Jobs</span>
                </div>
                <h3 className="mt-3 font-bold">
                  <Link href={`/jobs/${similar.id}`} className="after:absolute after:inset-0 hover:text-indigo-600">
                    {similar.title}
                  </Link>
                </h3>
                <p className="mt-1 text-xs text-slate-500">
                  {similar.company} · {similar.location}
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  <span className="rounded-full border border-emerald-200 px-2 py-1 text-[10px] text-emerald-600">{similar.type}</span>
                  <span className="rounded-full border border-orange-200 px-2 py-1 text-[10px] text-orange-500">{similar.category}</span>
                  <span className="rounded-full border border-indigo-200 px-2 py-1 text-[10px] text-indigo-600">{similar.level}</span>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ADDED ONLY: the application modal, rendered at the end of the page. */}
      <JobApplicationModal
        open={applicationOpen}
        onClose={() => setApplicationOpen(false)}
        job={job}
      />

      {!dashboard && <Footer />}
    </div>
  );
}
