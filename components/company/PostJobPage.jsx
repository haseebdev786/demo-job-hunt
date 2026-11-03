"use client";

// Company job publishing form. Jobs are saved through the authenticated API.

import { useState } from "react";
import Link from "next/link";
import { validateJobPost, JOB_CATEGORIES, EMPLOYMENT_TYPES } from "@/lib/job-validation";
import { ArrowLeft, Bold, Briefcase, FileText, Gift, Italic, Link as LinkIcon, List, Plus, X } from "lucide-react";

const ALL_PERKS = [
  { title: "Full Healthcare", text: "We believe in thriving communities and that starts with our team being happy and healthy." },
  { title: "Unlimited Vacation", text: "We believe you should have a flexible schedule that makes space for family, wellness, and fun." },
  { title: "Skill Development", text: "We believe in always learning and leveling up our skills. Whether it's a conference or online course." },
  { title: "Team Summits", text: "Every 6 months we have a full team summit where we have fun, reflect, and plan for the upcoming quarter." },
  { title: "Remote Working", text: "You know how you perform your best. Work from home, coffee shop or anywhere when you feel like it." },
  { title: "Commuter Benefits", text: "We're grateful for all the time and energy each team member puts into getting to work every day." },
  { title: "We give back", text: "We anonymously match any donation our employees make (up to $/€ 600) so they can support the organizations they care about most, times two." },
];


function Stepper({ step }) {
  const steps = [
    { n: 1, label: "Job Information", icon: Briefcase },
    { n: 2, label: "Job Description", icon: FileText },
    { n: 3, label: "Perks & Benefit", icon: Gift },
  ];
  return (
    <div className="flex flex-wrap items-center gap-4 border border-slate-200 bg-white px-6 py-4">
      {steps.map((s, i) => {
        const Icon = s.icon;
        const active = step === s.n;
        const done = step > s.n;
        return (
          <div key={s.n} className="flex flex-1 items-center gap-3">
            <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${active || done ? "bg-indigo-600 text-white" : "bg-indigo-50 text-indigo-600"}`}>
              <Icon size={18} />
            </span>
            <span>
              <span className="block text-xs text-slate-400">Step {s.n}/3</span>
              <span className={`block text-sm font-bold ${active || done ? "text-slate-800" : "text-slate-500"}`}>{s.label}</span>
            </span>
            {i < steps.length - 1 && <span className="mx-2 hidden h-px flex-1 bg-slate-200 sm:block" />}
          </div>
        );
      })}
    </div>
  );
}

function FieldRow({ label, helper, children }) {
  return (
    <div className="grid gap-4 border-b border-slate-100 py-6 md:grid-cols-[280px_minmax(0,1fr)]">
      <div>
        <p className="text-sm font-bold text-slate-800">{label}</p>
        {helper && <p className="mt-1 text-xs leading-5 text-slate-500">{helper}</p>}
      </div>
      <div>{children}</div>
    </div>
  );
}

function Toolbar() {
  return (
    <div className="flex items-center gap-3 border border-t-0 border-slate-200 bg-white px-3 py-2 text-slate-400">
      <span title="Emoji">😊</span>
      <button type="button" aria-label="Bold"><Bold size={16} /></button>
      <button type="button" aria-label="Italic"><Italic size={16} /></button>
      <button type="button" aria-label="List"><List size={16} /></button>
      <button type="button" aria-label="Link"><LinkIcon size={16} /></button>
    </div>
  );
}

function TextAreaField({ value, onChange, placeholder }) {
  return (
    <div>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        maxLength={500}
        rows={5}
        placeholder={placeholder}
        className="w-full border border-slate-200 px-4 py-3 text-sm outline-none placeholder:text-slate-400 focus:border-indigo-500"
      />
      <Toolbar />
      <div className="mt-1 flex items-center justify-between text-xs text-slate-400">
        <span>Maximum 500 characters</span>
        <span>{value.length} / 500</span>
      </div>
    </div>
  );
}

export default function PostJobPage({ companyName = "Your Company", companyInitial = "C" }) {
  const [step, setStep] = useState(1);
  const [title, setTitle] = useState("");
  const [titleError, setTitleError] = useState("");
  const [location, setLocation] = useState("");
  const [level, setLevel] = useState("Entry Level");
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState("");
  const [employment, setEmployment] = useState([]);
  const [salaryMin, setSalaryMin] = useState("");
  const [salaryMax, setSalaryMax] = useState("");
  const [categories, setCategories] = useState([]);
  const [skills, setSkills] = useState([]);
  const [newSkill, setNewSkill] = useState("");
  const [showSkillInput, setShowSkillInput] = useState(false);
  const [description, setDescription] = useState("");
  const [responsibilities, setResponsibilities] = useState("");
  const [whoYouAre, setWhoYouAre] = useState("");
  const [niceToHaves, setNiceToHaves] = useState("");
  const [perks, setPerks] = useState([]);
  const [showPerkPicker, setShowPerkPicker] = useState(false);
  const [reviewOpen, setReviewOpen] = useState(false);
  const [posted, setPosted] = useState(false);

  async function postJob() {
    if (saving || posted) return;
    setSaveError("");
    setSaving(true);
    try {
      const fields = validateJobPost({ title, location, level, employment, salaryMin, salaryMax, categories, skills, description, responsibilities, whoYouAre, niceToHaves, perks });
      const response = await fetch("/api/company/jobs", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(fields) });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Could not post the job.");
      setPosted(result.job.id);
    } catch (error) {
      setSaveError(error.message || "Could not post the job. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  const salaryMinPct = Math.min(100, Math.max(0, (salaryMin / 50000) * 100));
  const salaryMaxPct = Math.min(100, Math.max(0, (salaryMax / 50000) * 100));

  function toggleEmployment(type) {
    setEmployment((prev) => (prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]));
  }

  function handleNextFromStep1() {
    if (!title.trim() || !location.trim() || !employment.length || !categories.length || !skills.length || salaryMin < 0 || salaryMax < salaryMin) {
      setTitleError("Enter a title, location, employment type, category, skills and a valid salary range.");
      return;
    }
    setTitleError("");
    setStep(2);
  }

  function handleBack() {
    if (step > 1) setStep(step - 1);
  }

  return (
    <div className="px-4 py-8 sm:px-6 lg:px-10">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-slate-400">Company</p>
          <div className="mt-2 flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-50 text-xl font-black text-emerald-500">
              {companyInitial}
            </span>
            <h1 className="text-2xl font-black text-slate-800">{companyName}</h1>
          </div>
        </div>
        <Link href="/company/jobs/new" className="bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700">
          + Post a job
        </Link>
      </div>

      <div className="mt-8 flex items-center gap-2">
        {step > 1 ? (
          <button type="button" onClick={handleBack} aria-label="Back to previous step" className="text-slate-800 hover:text-indigo-600">
            <ArrowLeft size={22} />
          </button>
        ) : (
          <Link href="/company/jobs" aria-label="Back to Job Listing" className="text-slate-800 hover:text-indigo-600">
            <ArrowLeft size={22} />
          </Link>
        )}
        <h2 className="text-xl font-bold text-slate-800">Post a Job</h2>
      </div>

      <div className="mt-6">
        <Stepper step={step} />
      </div>

      <div className="mt-6 border border-slate-200 bg-white px-6">
        {step === 1 && (
          <div>
            <p className="pt-6 text-base font-bold text-slate-800">Basic Information</p>
            <p className="text-sm text-slate-500">This information will be displayed publicly</p>

            <FieldRow label="Job Title" helper="Job titles must be describe one position">
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Software Engineer"
                className="w-full max-w-md border border-slate-200 px-4 py-3 text-sm outline-none placeholder:text-slate-400 focus:border-indigo-500"
              />
              <p className="mt-1 text-xs text-slate-400">Use a clear title for one position.</p>
              {titleError && <p role="alert" className="mt-1 text-xs text-red-600">{titleError}</p>}
            </FieldRow>

            <FieldRow label="Location" helper="City and country, or Remote">
              <input value={location} onChange={(e) => setLocation(e.target.value)} maxLength={150} aria-label="Job location" className="w-full max-w-md border border-slate-200 px-4 py-3 text-sm" />
            </FieldRow>
            <FieldRow label="Job Level" helper="Select the experience level for this role">
              <select value={level} onChange={(e) => setLevel(e.target.value)} aria-label="Job level" className="border border-slate-200 px-4 py-3 text-sm">
                {["Entry Level", "Mid Level", "Senior Level", "Director"].map((value) => <option key={value}>{value}</option>)}
              </select>
            </FieldRow>
            <FieldRow label="Type of Employment" helper="You can select multiple type of employment">
              <div className="space-y-2.5">
                {EMPLOYMENT_TYPES.map((type) => (
                  <label key={type} className="flex cursor-pointer items-center gap-2 text-sm text-slate-600">
                    <input type="checkbox" checked={employment.includes(type)} onChange={() => toggleEmployment(type)} className="h-4 w-4 accent-indigo-600" />
                    {type}
                  </label>
                ))}
              </div>
            </FieldRow>

            <FieldRow label="Salary" helper="Estimated annual salary range in USD">
              <div className="max-w-md">
                <div className="flex items-center gap-3">
                  <label className="flex flex-1 items-center gap-1 border border-slate-200 px-3 py-2 text-sm">
                    <span className="text-slate-400">$</span>
                    <input type="number" value={salaryMin} onChange={(e) => setSalaryMin(Number(e.target.value))} className="w-full outline-none" aria-label="Minimum salary" />
                  </label>
                  <span className="text-sm text-slate-400">to</span>
                  <label className="flex flex-1 items-center gap-1 border border-slate-200 px-3 py-2 text-sm">
                    <span className="text-slate-400">$</span>
                    <input type="number" value={salaryMax} onChange={(e) => setSalaryMax(Number(e.target.value))} className="w-full outline-none" aria-label="Maximum salary" />
                  </label>
                </div>
                {/* Visual slider track: dots move when the $ amounts change. */}
                <div className="relative mt-6 h-1 bg-slate-200">
                  <div className="absolute h-1 bg-indigo-600" style={{ left: `${salaryMinPct}%`, width: `${Math.max(0, salaryMaxPct - salaryMinPct)}%` }} />
                  <span className="absolute top-1/2 h-4 w-4 -translate-y-1/2 rounded-full bg-indigo-600" style={{ left: `calc(${salaryMinPct}% - 8px)` }} />
                  <span className="absolute top-1/2 h-4 w-4 -translate-y-1/2 rounded-full bg-indigo-600" style={{ left: `calc(${salaryMaxPct}% - 8px)` }} />
                </div>
              </div>
            </FieldRow>

            <FieldRow label="Categories" helper="You can select multiple job categories">
              <div className="max-w-md">
                <p className="mb-1 text-xs font-semibold text-slate-700">Select Job Categories</p>
                <select
                  value=""
                  onChange={(e) => {
                    if (e.target.value && !categories.includes(e.target.value)) setCategories((prev) => [...prev, e.target.value]);
                  }}
                  className="w-full border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-500 outline-none"
                  aria-label="Select Job Categories"
                >
                  <option value="">Select Job Categories</option>
                  {JOB_CATEGORIES.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {categories.map((c) => (
                    <span key={c} className="flex items-center gap-1 bg-indigo-50 px-2.5 py-1 text-xs text-indigo-600">
                      {c}
                      <button type="button" onClick={() => setCategories((prev) => prev.filter((x) => x !== c))} aria-label={`Remove ${c}`}><X size={12} /></button>
                    </span>
                  ))}
                </div>
              </div>
            </FieldRow>

            <FieldRow label="Required Skills" helper="Add required skills for the job">
              <div>
                {!showSkillInput ? (
                  <button type="button" onClick={() => setShowSkillInput(true)} className="flex items-center gap-1 border border-indigo-200 px-3 py-1.5 text-xs font-semibold text-indigo-600 hover:bg-indigo-50">
                    <Plus size={14} /> Add Skills
                  </button>
                ) : (
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      if (newSkill.trim() && !skills.includes(newSkill.trim())) setSkills((prev) => [...prev, newSkill.trim()]);
                      setNewSkill("");
                      setShowSkillInput(false);
                    }}
                    className="flex max-w-md gap-2"
                  >
                    <input value={newSkill} onChange={(e) => setNewSkill(e.target.value)} placeholder="e.g. Figma" className="w-full border border-slate-200 px-3 py-2 text-sm outline-none focus:border-indigo-500" />
                    <button type="submit" className="bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700">Add</button>
                  </form>
                )}
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {skills.map((s) => (
                    <span key={s} className="flex items-center gap-1 bg-indigo-50 px-2.5 py-1 text-xs text-indigo-600">
                      {s}
                      <button type="button" onClick={() => setSkills((prev) => prev.filter((x) => x !== s))} aria-label={`Remove ${s}`}><X size={12} /></button>
                    </span>
                  ))}
                </div>
              </div>
            </FieldRow>
          </div>
        )}

        {step === 2 && (
          <div>
            <p className="pt-6 text-base font-bold text-slate-800">Details</p>
            <p className="text-sm text-slate-500">Add the description of the job, responsibilities, who you are, and nice-to-haves.</p>
            <FieldRow label="Job Descriptions" helper="Job titles must be describe one position">
              <TextAreaField value={description} onChange={setDescription} placeholder="Enter job description" />
            </FieldRow>
            <FieldRow label="Responsibilities" helper="Outline the core responsibilities of the position">
              <TextAreaField value={responsibilities} onChange={setResponsibilities} placeholder="Enter job responsibilities" />
            </FieldRow>
            <FieldRow label="Who You Are" helper="Add your preferred candidates qualifications">
              <TextAreaField value={whoYouAre} onChange={setWhoYouAre} placeholder="Enter qualifications" />
            </FieldRow>
            <FieldRow label="Nice-To-Haves" helper="Add nice-to-have skills and qualifications for the role to encourage a more diverse set of candidates to apply.">
              <TextAreaField value={niceToHaves} onChange={setNiceToHaves} placeholder="Enter nice-to-haves" />
            </FieldRow>
          </div>
        )}

        {step === 3 && (
          <div>
            <p className="pt-6 text-base font-bold text-slate-800">Basic Information</p>
            <p className="text-sm text-slate-500">List out your top perks and benefits.</p>
            <FieldRow label="Perks and Benefits" helper="Encourage more people to apply by sharing the attractive rewards and benefits you offer your employees">
              <div>
                {!showPerkPicker ? (
                  <button type="button" onClick={() => setShowPerkPicker(true)} className="flex items-center gap-1 border border-indigo-200 px-3 py-1.5 text-xs font-semibold text-indigo-600 hover:bg-indigo-50">
                    <Plus size={14} /> Add Benefit
                  </button>
                ) : (
                  <div className="flex max-w-md flex-wrap gap-2">
                    {ALL_PERKS.map((perk) => {
                      const added = perks.some((p) => p.title === perk.title);
                      return (
                        <button
                          key={perk.title}
                          type="button"
                          disabled={added}
                          onClick={() => {
                            setPerks((prev) => [...prev, perk]);
                            setShowPerkPicker(false);
                          }}
                          className="border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-indigo-50 disabled:opacity-40"
                        >
                          {added ? `${perk.title} (added)` : perk.title}
                        </button>
                      );
                    })}
                    <button type="button" onClick={() => setShowPerkPicker(false)} className="text-xs text-slate-500">Cancel</button>
                  </div>
                )}
                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  {perks.map((perk) => (
                    <div key={perk.title} className="relative border border-slate-200 p-4">
                      <button type="button" onClick={() => setPerks((prev) => prev.filter((p) => p.title !== perk.title))} aria-label={`Remove ${perk.title}`} className="absolute right-2 top-2 text-slate-400 hover:text-slate-800">
                        <X size={16} />
                      </button>
                      <p className="pr-6 text-sm font-bold text-slate-800">{perk.title}</p>
                      <p className="mt-1 text-xs leading-5 text-slate-500">{perk.text}</p>
                    </div>
                  ))}
                  {perks.length === 0 && <p className="text-sm text-slate-500">No perks added yet. Use + Add Benefit above.</p>}
                </div>
              </div>
            </FieldRow>
          </div>
        )}

        <div className="flex justify-end py-6">
          {step < 3 ? (
            <button
              type="button"
              onClick={() => (step === 1 ? handleNextFromStep1() : setStep(3))}
              className="bg-indigo-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700"
            >
              Next Step
            </button>
          ) : (
            <button
              type="button"
              onClick={() => setReviewOpen(true)}
              className="bg-indigo-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700"
            >
              Do a Review
            </button>
          )}
        </div>
      </div>

      {/* Review modal */}
      {reviewOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" onClick={() => setReviewOpen(false)}>
          <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto bg-white p-6 shadow-xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-start justify-between gap-4">
              <h2 className="text-lg font-bold text-slate-800">Review Your Job Post</h2>
              <button type="button" onClick={() => setReviewOpen(false)} aria-label="Close" className="text-slate-400 hover:text-slate-800"><X size={20} /></button>
            </div>
            {posted ? (
              <div className="mt-4 border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
                <p className="font-bold">Job published successfully.</p>
                <p className="mt-1">
                  Your job is now visible to job seekers and saved in your Job Listing.
                </p>
                <Link href="/company/jobs" className="mt-3 inline-block font-semibold text-indigo-600">Go to Job Listing</Link>
                <Link href={`/jobs/${posted}`} className="ml-4 mt-3 inline-block font-semibold text-indigo-600">View published job</Link>
              </div>
            ) : (
              <div className="mt-4 space-y-3 text-sm text-slate-600">
                <p><span className="font-bold text-slate-800">Job Title:</span> {title || "(not filled)"}</p>
                <p><span className="font-bold text-slate-800">Type of Employment:</span> {employment.length ? employment.join(", ") : "(none selected)"}</p>
                <p><span className="font-bold text-slate-800">Salary:</span> ${salaryMin.toLocaleString()} - ${salaryMax.toLocaleString()}</p>
                <p><span className="font-bold text-slate-800">Categories:</span> {categories.length ? categories.join(", ") : "(none selected)"}</p>
                <p><span className="font-bold text-slate-800">Required Skills:</span> {skills.join(", ")}</p>
                <p><span className="font-bold text-slate-800">Job Description:</span> {description || "(not filled)"}</p>
                <p><span className="font-bold text-slate-800">Responsibilities:</span> {responsibilities || "(not filled)"}</p>
                <p><span className="font-bold text-slate-800">Who You Are:</span> {whoYouAre || "(not filled)"}</p>
                <p><span className="font-bold text-slate-800">Nice-To-Haves:</span> {niceToHaves || "(not filled)"}</p>
                <p><span className="font-bold text-slate-800">Perks:</span> {perks.map((p) => p.title).join(", ") || "(none)"}</p>
                {saveError && <p role="alert" className="text-red-600">{saveError}</p>}
                <button type="button" onClick={postJob} disabled={saving} className="w-full bg-indigo-600 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700 disabled:opacity-50">
                  {saving ? "Publishing..." : "Post Job"}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
