"use client";

// Place this file at: components/company/CompanyProfilePage.jsx
// Company Profile (3.3), inside the company layout.
// Structure from the 3.3 screenshot (see lib/company-profile-data.js
// for the note about its small, hard-to-read text):
//   header (company logo + name + Public View / Profile Settings),
//   About paragraph, Tech Stack, Contact, Offices,
//   Working-at photo grid, Team, Benefits, Open Jobs.
// Public View opens company browsing; Profile Settings opens
// /company/settings. Settings changes are still local previews.
// Company name / initial come from props (logged-in session).

import Link from "next/link";
import { Globe, Mail } from "lucide-react";
import { companyProfileData } from "@/lib/company-profile-data";

export default function CompanyProfilePage({ companyName = "Nomad", companyInitial = "N" }) {
  const data = companyProfileData;

  return (
    <div className="px-4 py-8 sm:px-6 lg:px-10">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex items-center gap-4">
          <span className="flex h-14 w-14 items-center justify-center rounded-lg bg-emerald-50 text-2xl font-black text-emerald-500">
            {companyInitial}
          </span>
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-slate-400">Company</p>
            <h1 className="text-2xl font-black text-slate-800">{companyName}</h1>
          </div>
        </div>
        <div className="flex gap-2">
          <Link href="/companies" className="border border-indigo-200 px-4 py-2 text-sm font-semibold text-indigo-600 hover:bg-indigo-50">
            Public View
          </Link>
          <Link href="/company/settings" className="bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700">
            Profile Settings
          </Link>
        </div>
      </div>
      <p className="mt-2 text-xs text-slate-400">
        Settings changes are previews only and reset when the page is reloaded.
      </p>

      <div className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div className="space-y-6">
          <section className="border border-slate-200 bg-white p-6">
            <h2 className="text-base font-bold text-slate-800">Company Profile</h2>
            <p className="mt-3 text-sm leading-6 text-slate-500">{data.about}</p>
          </section>

          <section className="border border-slate-200 bg-white p-6">
            <h2 className="text-base font-bold text-slate-800">Working at {companyName}</h2>
            <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
              {data.workingPhotos.map((photo) => (
                <div key={photo.label} className={`flex h-28 items-center justify-center p-3 text-center text-xs font-semibold text-slate-600 ${photo.color}`}>
                  {photo.label}
                </div>
              ))}
            </div>
            <p className="mt-2 text-xs text-slate-400">
              Office photos are placeholders -- replace them with real photos in public/ when you have them.
            </p>
          </section>

          <section className="border border-slate-200 bg-white p-6">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-slate-800">Team</h2>
              <button type="button" className="text-sm font-semibold text-indigo-600">View all team members</button>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-4">
              {data.team.map((member) => (
                <div key={member.name} className="border border-slate-200 p-4 text-center">
                  <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-indigo-100 text-sm font-bold text-indigo-600">
                    {member.name.charAt(0)}
                  </span>
                  <p className="mt-2 text-sm font-bold text-slate-800">{member.name}</p>
                  <p className="text-xs text-slate-500">{member.role}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="border border-slate-200 bg-white p-6">
            <h2 className="text-base font-bold text-slate-800">Benefit</h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {data.benefits.map((b) => (
                <div key={b.title} className="border border-slate-200 p-4">
                  <p className="text-sm font-bold text-slate-800">{b.title}</p>
                  <p className="mt-1 text-xs leading-5 text-slate-500">{b.text}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="border border-slate-200 bg-white p-6">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-slate-800">Open Positions</h2>
              <Link href="/company/jobs" className="text-sm font-semibold text-indigo-600">Show all jobs</Link>
            </div>
            <div className="mt-4 divide-y divide-slate-100">
              {data.openJobs.map((job) => (
                <div key={job.title} className="flex flex-wrap items-center justify-between gap-3 py-3">
                  <div>
                    <p className="text-sm font-bold text-slate-800">{job.title}</p>
                    <p className="text-xs text-slate-500">{job.type} - {job.location}</p>
                  </div>
                  <p className="text-xs text-slate-500">{job.applied} applied of {job.capacity} capacity</p>
                </div>
              ))}
            </div>
          </section>
        </div>

        <div className="space-y-6">
          <section className="border border-slate-200 bg-white p-6">
            <h2 className="text-base font-bold text-slate-800">Tech Stack</h2>
            <div className="mt-4 flex flex-wrap gap-2">
              {data.techStack.map((tech) => (
                <span key={tech.name} className={`px-3 py-1.5 text-xs font-bold text-white ${tech.color}`}>
                  {tech.name}
                </span>
              ))}
            </div>
          </section>

          <section className="border border-slate-200 bg-white p-6">
            <h2 className="text-base font-bold text-slate-800">Contact</h2>
            <ul className="mt-4 space-y-3 text-sm text-slate-600">
              <li className="flex items-center gap-2"><Mail size={16} className="shrink-0 text-slate-400" /> {data.contact.email}</li>
              <li className="flex items-center gap-2"><Globe size={16} className="shrink-0 text-slate-400" /> {data.contact.website}</li>
              <li>Twitter: {data.contact.twitter}</li>
              <li>Facebook: {data.contact.facebook}</li>
              <li>LinkedIn: {data.contact.linkedin}</li>
            </ul>
          </section>

          <section className="border border-slate-200 bg-white p-6">
            <h2 className="text-base font-bold text-slate-800">Offices / Locations</h2>
            <ul className="mt-4 space-y-2 text-sm text-slate-600">
              {data.offices.map((office) => (
                <li key={office} className="border-b border-slate-100 pb-2">{office}</li>
              ))}
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
}
