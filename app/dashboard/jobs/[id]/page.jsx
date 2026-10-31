"use client";

// Place this file at: app/dashboard/jobs/[id]/page.jsx
// Route: /dashboard/jobs/1, /dashboard/jobs/2, ...
// This is the DASHBOARD version of the job description (screenshot 2.6).
// It lives inside app/dashboard/layout.jsx, so it keeps the dashboard
// sidebar and has NO Navbar/Footer -- do not add them here.
// The public page at /jobs/[id] is a different route and is left
// untouched.
//
// DATA: jobs come from @/lib/jobs (same 12 jobs as the public page),
// and the detail text (description, responsibilities, who you are,
// nice-to-haves, skills) is the SAME `details` object as the public
// description page, copied here so the dashboard page does not depend
// on the public page's file. Edit the details here and the dashboard
// description changes; the public page has its own copy.
//
// APPLY: the Apply button opens components/JobApplicationModal.jsx --
// that file must already exist in your project (from the earlier
// application modal delivery). The modal itself is still demo
// submission, it does not yet save to MongoDB.
//
// NOTE on the screenshot's numbers: Apply Before (July 31, 2021) and
// Job Posted On (July 1, 2021) are reference dates from the screenshot
// -- your jobs data has no dates, so those two dates are display-only
// here, exactly as on the public page. Salary is your job's REAL
// salary from lib/jobs.js (€ ranges), not the screenshot's $75k-$85k.

import { useState } from "react";
import Link from "next/link";
import { jobs } from "@/lib/jobs";
import { useParams } from "next/navigation";
import {
  ArrowLeft,
  Check,
  Share2,
  Heart,
  MapPin,
  Sun,
  BookOpen,
  Users,
  Home,
  Bus,
  Sparkles,
} from "lucide-react";
import JobApplicationModal from "@/components/JobApplicationModal";

// Detail text per job id. Job 1 is the full reference example;
// the others use the same sections, written for that role.
const details = {
  1: {
    companyAbout:
      "Nomad is a leading technology company building tools that help people work from anywhere.",
    description:
      "Nomad is looking for a Social Media Assistant to help manage our online presence. You will be responsible for monitoring our social media channels, creating content, and helping our team engage with our community and build a strong brand voice.",
    responsibilities: [
      "Community engagement to ensure that we are connecting with our audience in a meaningful way",
      "Focus on social media content development and publication",
      "Marketing and strategy support",
      "Stay on top of trends on social media platforms, and suggest content ideas to the team",
      "Engage with online communities",
    ],
    whoYouAre: [
      "You get energy from people and building the ideal work environment",
      "You have a passion for fashion, food and travel",
      "You are a confident office manager, ready for added responsibilities",
      "You are detail-oriented and creative",
      "You are organised and able to multitask",
    ],
    niceToHaves: ["Fluent in English", "Project management skills", "Copywriting skills"],
    skills: ["Project Management", "Copywriting", "English", "Social Media Marketing", "Copy Editing"],
  },
  2: {
    companyAbout: "Dropbox is a file hosting service that offers cloud storage, file synchronization and personal cloud software.",
    description: "Dropbox is looking for a Brand Designer to shape how our brand looks and feels across every touchpoint, from marketing pages to product moments.",
    responsibilities: ["Design brand systems, guidelines and marketing assets", "Work closely with marketing and product teams on campaigns", "Present concepts clearly and iterate on feedback"],
    whoYouAre: ["You have a strong portfolio of brand and visual design work", "You care about typography, colour and layout details", "You communicate ideas clearly to non-designers"],
    niceToHaves: ["Motion design experience", "Experience with design systems"],
    skills: ["Branding", "Figma", "Typography", "Illustration"],
  },
  3: {
    companyAbout: "Terraform is a technology company building tools for modern engineering teams.",
    description: "Terraform is looking for an Interactive Developer to build engaging, interactive web experiences for users around the world.",
    responsibilities: ["Build interactive web experiences with modern JavaScript", "Work with designers to bring animations and interactions to life", "Keep performance and accessibility in mind in everything you ship"],
    whoYouAre: ["You are confident with React and modern front-end tooling", "You enjoy turning a design into a smooth, working product", "You test your work across browsers and devices"],
    niceToHaves: ["WebGL or canvas experience", "Experience with interactive products"],
    skills: ["JavaScript", "React", "Animation", "WebGL"],
  },
  4: {
    companyAbout: "Revolut offers digital banking and financial management products.",
    description: "Revolut is looking for an Email Marketing specialist to plan, build and optimise email campaigns that keep customers engaged.",
    responsibilities: ["Plan and build email campaigns and newsletters", "Write clear, engaging email copy with the design team", "Test subject lines and analyse campaign performance"],
    whoYouAre: ["You write clearly and pay attention to detail", "You enjoy testing and learning from data", "You are organised and meet deadlines reliably"],
    niceToHaves: ["Experience with email tools like Mailchimp or Klaviyo", "Basic HTML for email"],
    skills: ["Email Marketing", "Copywriting", "Analytics", "SEO"],
  },
  5: {
    companyAbout: "Canva is a design platform that makes it easy for anyone to create professional designs.",
    description: "Canva is looking for a Lead Engineer to lead a team building reliable, high-quality product features used by millions of people.",
    responsibilities: ["Lead design and delivery of major engineering projects", "Mentor engineers and raise the team's technical bar", "Work with product and design on roadmap and architecture"],
    whoYouAre: ["You have led engineering teams and shipped large products", "You make pragmatic architecture decisions", "You communicate clearly with technical and non-technical teams"],
    niceToHaves: ["Experience at scale", "Experience with design tools or media products"],
    skills: ["System Design", "APIs", "Testing", "Leadership"],
  },
  6: {
    companyAbout: "ClassPass is a fitness and wellness membership platform.",
    description: "ClassPass is looking for a Product Designer to design end-to-end experiences for members discovering classes and studios.",
    responsibilities: ["Design product flows, from research to final UI", "Test ideas with users and iterate quickly", "Work daily with engineers and product managers"],
    whoYouAre: ["You think in flows and systems, not just screens", "You back design decisions with research and data", "You present your work clearly and welcome feedback"],
    niceToHaves: ["Mobile product experience", "Prototyping skills"],
    skills: ["Product Design", "Figma", "User Research"],
  },
  7: {
    companyAbout: "Pitch is a presentation platform for modern teams.",
    description: "Pitch is looking for a Customer Manager to look after key customers, understand their needs and help them succeed with our product.",
    responsibilities: ["Own relationships with assigned customers", "Run onboarding and regular check-ins", "Spot risks early and turn feedback into product input"],
    whoYouAre: ["You are empathetic, organised and proactive", "You communicate clearly in writing and on calls", "You enjoy solving customer problems"],
    niceToHaves: ["SaaS customer success experience", "Experience with CRM tools"],
    skills: ["Communication", "Strategy", "CRM"],
  },
  8: {
    companyAbout: "Blinkist is a learning app that summarises non-fiction books into short, digestible insights.",
    description: "Blinkist is looking for a Visual Designer to create beautiful, clear visuals across marketing, product and brand.",
    responsibilities: ["Design visuals for marketing campaigns and product surfaces", "Work with brand guidelines and extend them thoughtfully", "Collaborate with content, marketing and product teams"],
    whoYouAre: ["You have a strong visual portfolio", "You care about layout, colour and typography", "You take feedback well and iterate fast"],
    niceToHaves: ["Illustration skills", "Motion design experience"],
    skills: ["Figma", "Typography", "Branding", "Illustration"],
  },
  9: {
    companyAbout: "Webflow is the visual design and hosting platform built for the next generation of the web.",
    description: "Webflow is looking for an HR Manager to look after hiring, onboarding and the day-to-day experience of our growing team.",
    responsibilities: ["Own recruitment and onboarding for new team members", "Support managers with performance reviews and growth plans", "Keep HR processes simple, fair and well documented"],
    whoYouAre: ["You are organised, discreet and people-focused", "You have experience hiring across different roles", "You communicate clearly and honestly"],
    niceToHaves: ["Experience in a startup environment", "HR software experience"],
    skills: ["Recruitment", "People Management", "Communication"],
  },
  10: {
    companyAbout: "GoDaddy is a domain registrar and web hosting company that helps entrepreneurs get online.",
    description: "GoDaddy is looking for a Financial Analyst intern to support reporting, budgeting and analysis for our finance team.",
    responsibilities: ["Help prepare reports, models and budgets", "Check data for accuracy and explain variances", "Support the finance team on month-end tasks"],
    whoYouAre: ["You are studying finance, accounting or a related field", "You are comfortable with spreadsheets and numbers", "You are curious, careful and eager to learn"],
    niceToHaves: ["Excel skills", "Basic accounting knowledge"],
    skills: ["Excel", "Financial Modelling", "Analysis"],
  },
  11: {
    companyAbout: "Notion is a connected workspace for docs, wikis and project management.",
    description: "Notion is looking for a Sales Specialist to help new customers understand our product and grow their accounts.",
    responsibilities: ["Run product demos and answer customer questions", "Qualify leads and manage a sales pipeline", "Work with marketing and customer success on handover"],
    whoYouAre: ["You are confident, organised and target-driven", "You listen first and sell honestly", "You write clear follow-ups and keep records tidy"],
    niceToHaves: ["SaaS sales experience", "Experience with CRM tools"],
    skills: ["Communication", "CRM", "Negotiation"],
  },
  12: {
    companyAbout: "Dropbox is a file hosting service that offers cloud storage, file synchronization and personal cloud software.",
    description: "Dropbox is looking for a Backend Developer to build reliable services and APIs that power our products for millions of users.",
    responsibilities: ["Design and build backend services and APIs", "Improve reliability, performance and security", "Work with frontend and product teams on new features"],
    whoYouAre: ["You are strong in a backend language and databases", "You think about edge cases, testing and monitoring", "You enjoy solving hard, real-world problems"],
    niceToHaves: ["Experience at scale", "Experience with cloud infrastructure"],
    skills: ["APIs", "Databases", "System Design", "Testing"],
  },
};

const perks = [
  { icon: Heart, title: "Full Healthcare", text: "We believe in thriving communities and that starts with our team being happy and healthy." },
  { icon: Sun, title: "Unlimited Vacation", text: "We believe you should have a flexible schedule that makes space for family, wellness, and fun." },
  { icon: BookOpen, title: "Skill Development", text: "We believe in always learning and leveling up our skills. Whether it's a conference or online course." },
  { icon: Users, title: "Team Summits", text: "Every 6 months we have a full team summit where we have fun, reflect, and plan for the upcoming quarter." },
  { icon: Home, title: "Remote Working", text: "You know how you perform your best. Work from home, coffee shop or anywhere when you feel like it." },
  { icon: Bus, title: "Commuter Benefits", text: "We are grateful for all the time and energy you spend getting to work every day, so we offer commuter benefits." },
  { icon: Sparkles, title: "We Give Back", text: "We anonymously match any donation our employees make, so they can support the organisations they care about." },
];

function JobLogo({ job, large }) {
  const Logo = job.logo;
  const size = large ? "h-14 w-14 text-3xl" : "h-10 w-10 text-xl";
  if (!Logo) {
    return (
      <span className={`flex shrink-0 items-center justify-center rounded-lg bg-slate-50 font-black text-indigo-600 ${size}`}>
        {(job.company || "?").charAt(0)}
      </span>
    );
  }
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

export default function DashboardJobDescriptionPage() {
  const params = useParams();
  const [applicationOpen, setApplicationOpen] = useState(false);
  const [saved, setSaved] = useState(false);

  // Route is app/dashboard/jobs/[id], so Next.js gives params.id.
  const rawId = params?.id;
  const id = Number(rawId);
  const job = jobs.find((item) => item.id === id || String(item.id) === String(rawId));

  if (!job) {
    return (
      <div className="px-4 py-20 text-center sm:px-6 lg:px-10">
        <h1 className="text-3xl font-bold text-slate-800">Job not found</h1>
        <p className="mt-3 text-sm text-slate-500">
          This job link may be old, or the id does not match any job yet.
        </p>
        <div className="mt-6 flex justify-center gap-4">
          <Link href="/dashboard/jobs" className="bg-indigo-600 px-6 py-3 text-sm font-semibold text-white">
            Back to Find Jobs
          </Link>
          <Link href="/" className="border border-slate-200 px-6 py-3 text-sm font-semibold text-slate-700">
            Back to homepage
          </Link>
        </div>
      </div>
    );
  }

  const detail = details[job.id] || {
    description: `${job.company} is looking for a ${job.title}.`,
    responsibilities: [],
    whoYouAre: [],
    niceToHaves: [],
    skills: [],
  };
  const applicants = job.applicants || 0;
  const appliedPercent = Math.min(100, (applicants / 10) * 100);

  return (
    <div className="px-4 py-8 sm:px-6 lg:px-10">
      {/* Header -- screenshot 2.6: back arrow + Job Description, Back to homepage */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <Link
          href="/dashboard/jobs"
          className="flex items-center gap-2 pl-10 text-2xl font-black text-slate-800 hover:text-indigo-600 lg:pl-0"
        >
          <ArrowLeft size={22} />
          Job Description
        </Link>
        <Link
          href="/"
          className="border border-indigo-200 px-4 py-2 text-sm font-medium text-indigo-600 hover:bg-indigo-50"
        >
          Back to homepage
        </Link>
      </div>

      {/* Job header card */}
      <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border border-slate-200 bg-white p-5">
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
          <button
            type="button"
            aria-label="Save this job"
            onClick={() => setSaved((v) => !v)}
            className={`border border-slate-200 p-3 ${saved ? "text-red-500" : "text-slate-500 hover:text-red-500"}`}
          >
            <Heart size={18} fill={saved ? "currentColor" : "none"} />
          </button>
          <button
            type="button"
            onClick={() => setApplicationOpen(true)}
            className="bg-indigo-600 px-8 py-3 text-sm font-semibold text-white hover:bg-indigo-700"
          >
            Apply
          </button>
        </div>
      </div>

      {/* Main + right sidebar */}
      <div className="mt-10 grid gap-10 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div>
          <h2 className="text-xl font-bold">Description</h2>
          <p className="mt-3 text-sm leading-6 text-slate-500">{detail.description}</p>

          {detail.responsibilities.length > 0 && (
            <>
              <h2 className="mt-10 text-xl font-bold">Responsibilities</h2>
              <BulletList items={detail.responsibilities} />
            </>
          )}

          {detail.whoYouAre.length > 0 && (
            <>
              <h2 className="mt-10 text-xl font-bold">Who You Are</h2>
              <BulletList items={detail.whoYouAre} />
            </>
          )}

          {detail.niceToHaves.length > 0 && (
            <>
              <h2 className="mt-10 text-xl font-bold">Nice-To-Haves</h2>
              <BulletList items={detail.niceToHaves} />
            </>
          )}
        </div>

        <aside>
          <h2 className="text-xl font-bold">About this role</h2>
          <div className="mt-4 border border-slate-200 bg-gray-50 p-5">
            <p className="text-sm text-slate-600">
              <span className="font-bold text-slate-800">{applicants} applied</span> of 10 capacity
            </p>
            <div className="mt-3 h-2 w-full bg-slate-200">
              <div className="h-2 bg-emerald-400" style={{ width: `${appliedPercent}%` }} />
            </div>
            <dl className="mt-6 space-y-4 text-sm">
              <div className="flex justify-between gap-4">
                <dt className="text-slate-400">Apply Before</dt>
                <dd className="font-medium">July 31, 2021</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-slate-400">Job Posted On</dt>
                <dd className="font-medium">July 1, 2021</dd>
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
            {job.category && (
              <span className="rounded-full border border-orange-200 px-3 py-1 text-xs text-orange-500">{job.category}</span>
            )}
            {job.type && (
              <span className="rounded-full border border-indigo-200 px-3 py-1 text-xs text-indigo-600">{job.type}</span>
            )}
          </div>

          {detail.skills.length > 0 && (
            <>
              <h3 className="mt-10 text-lg font-bold">Required Skills</h3>
              <div className="mt-3 flex flex-wrap gap-2">
                {detail.skills.map((skill) => (
                  <span key={skill} className="border border-slate-200 bg-gray-50 px-3 py-1 text-xs text-slate-600">
                    {skill}
                  </span>
                ))}
              </div>
            </>
          )}
        </aside>
      </div>

      {/* Perks & Benefits -- full width, like the screenshot */}
      <section className="mt-12 border-t border-slate-100 pt-10">
        <h2 className="text-2xl font-bold">Perks &amp; Benefits</h2>
        <p className="mt-2 text-sm text-slate-500">This job comes with several perks and benefits</p>
        <div className="mt-8 grid gap-8 sm:grid-cols-2 xl:grid-cols-4">
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
      </section>

      <div className="mt-10">
        <Link href="/dashboard/jobs" className="text-sm font-semibold text-indigo-600">
          ← Back to Find Jobs
        </Link>
      </div>

      <JobApplicationModal
        open={applicationOpen}
        onClose={() => setApplicationOpen(false)}
        job={job}
      />
    </div>
  );
}
