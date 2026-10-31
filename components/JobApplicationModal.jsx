"use client";

import { useEffect, useRef, useState } from "react";
import {
  X,
  Paperclip,
  Bold,
  Italic,
  Link2,
  List,
  CheckCircle2,
} from "lucide-react";

// Place this file at: components/JobApplicationModal.jsx
// It is opened from the Apply button on app/jobs/[id]/page.jsx:
//   <JobApplicationModal open={applicationOpen} onClose={() => setApplicationOpen(false)} job={job} />
// Design + validation only for now: on submit it shows a demo success
// state. Sending the application to a backend / MERN API is the next step.

function Field({ label, children }) {
  return (
    <div>
      <label className="text-sm font-bold text-slate-800">{label}</label>
      <div className="mt-2">{children}</div>
    </div>
  );
}

const inputClass =
  "w-full border border-slate-200 px-4 py-3 text-sm outline-none placeholder:text-slate-400 focus:border-indigo-500";

export default function JobApplicationModal({ open, onClose, job }) {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [linkedIn, setLinkedIn] = useState("");
  const [portfolio, setPortfolio] = useState("");
  const [coverLetter, setCoverLetter] = useState("");
  const [resume, setResume] = useState(null);
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const textareaRef = useRef(null);

  // Close on Escape, and lock page scroll while the modal is open.
  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKeyDown);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [open, onClose]);

  if (!open || !job) return null;

  const closeAndReset = () => {
    onClose();
    // Reset after close so the next applicant starts with a clean form.
    setTimeout(() => {
      setFullName("");
      setEmail("");
      setPhone("");
      setJobTitle("");
      setLinkedIn("");
      setPortfolio("");
      setCoverLetter("");
      setResume(null);
      setError("");
      setSubmitted(false);
    }, 200);
  };

  // Simple markdown helpers for the toolbar (Bold / Italic / Link / List).
  const wrapSelection = (before, after) => {
    const el = textareaRef.current;
    if (!el) return;
    const start = el.selectionStart;
    const end = el.selectionEnd;
    const next =
      coverLetter.slice(0, start) + before + coverLetter.slice(start, end) + after + coverLetter.slice(end);
    setCoverLetter(next.slice(0, 500));
    setTimeout(() => el.focus(), 0);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setError("");

    if (!fullName.trim() || !email.trim() || !phone.trim() || !jobTitle.trim()) {
      setError("Please fill in Full name, Email address, Phone number and Current or previous job title.");
      return;
    }
    if (!email.includes("@")) {
      setError("Please enter a valid email address.");
      return;
    }

    // Demo only -- nothing is sent anywhere yet.
    setSubmitted(true);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-slate-950/60 px-4 py-8"
      onClick={closeAndReset}
      role="dialog"
      aria-modal="true"
      aria-label={`Apply for ${job.title}`}
    >
      <div
        className="w-full max-w-lg bg-white p-6 shadow-2xl sm:p-8"
        onClick={(event) => event.stopPropagation()}
      >
        {submitted ? (
          <div className="py-10 text-center">
            <CheckCircle2 size={48} className="mx-auto text-emerald-500" />
            <h2 className="mt-4 text-2xl font-bold text-slate-800">Application submitted!</h2>
            <p className="mx-auto mt-3 max-w-sm text-sm leading-6 text-slate-500">
              Thanks, {fullName}. Your application for {job.title} at {job.company} has
              been received (demo). The company will contact you at {email}.
            </p>
            <button
              type="button"
              onClick={closeAndReset}
              className="mt-8 bg-indigo-600 px-8 py-3 text-sm font-semibold text-white hover:bg-indigo-700"
            >
              Done
            </button>
          </div>
        ) : (
          <>
            {/* Header: job + close, like the reference */}
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-md bg-indigo-600 text-xl font-black text-white">
                  {typeof job.logo === "string" ? job.logo : job.company.charAt(0)}
                </div>
                <div>
                  <h2 className="text-lg font-bold leading-6 text-slate-800">{job.title}</h2>
                  <p className="mt-1 text-xs text-slate-500">
                    {job.company} · {job.location} · {job.type}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={closeAndReset}
                aria-label="Close application form"
                className="shrink-0 p-1 text-slate-500 hover:text-slate-800"
              >
                <X size={20} />
              </button>
            </div>

            <div className="my-6 border-t border-slate-100" />

            <h3 className="text-xl font-bold text-slate-800">Submit your application</h3>
            <p className="mt-2 text-xs text-slate-500">
              The following is required and will only be shared with {job.company}
            </p>

            {error && (
              <p className="mt-4 border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">{error}</p>
            )}

            <form onSubmit={handleSubmit} className="mt-6 space-y-5">
              <Field label="Full name">
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Enter your full name"
                  className={inputClass}
                />
              </Field>

              <Field label="Email address">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  className={inputClass}
                />
              </Field>

              <Field label="Phone number">
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Enter your phone number"
                  className={inputClass}
                />
              </Field>

              <Field label="Current or previous job title">
                <input
                  type="text"
                  value={jobTitle}
                  onChange={(e) => setJobTitle(e.target.value)}
                  placeholder="What's your current or previous job title?"
                  className={inputClass}
                />
              </Field>

              <div>
                <h4 className="text-sm font-bold uppercase tracking-wide text-slate-800">Links</h4>
                <div className="mt-4 space-y-5">
                  <Field label="LinkedIn URL">
                    <input
                      type="url"
                      value={linkedIn}
                      onChange={(e) => setLinkedIn(e.target.value)}
                      placeholder="Link to your LinkedIn URL"
                      className={inputClass}
                    />
                  </Field>
                  <Field label="Portfolio URL">
                    <input
                      type="url"
                      value={portfolio}
                      onChange={(e) => setPortfolio(e.target.value)}
                      placeholder="Link to your portfolio URL"
                      className={inputClass}
                    />
                  </Field>
                </div>
              </div>

              <div>
                <label className="text-sm font-bold text-slate-800">Additional information</label>
                <textarea
                  ref={textareaRef}
                  value={coverLetter}
                  onChange={(e) => setCoverLetter(e.target.value.slice(0, 500))}
                  maxLength={500}
                  rows={4}
                  placeholder="Add a cover letter or anything else you want to share"
                  className={`${inputClass} mt-2 resize-y`}
                />
                {/* Toolbar + character counter, like the reference */}
                <div className="mt-2 flex items-center justify-between">
                  <div className="flex items-center gap-1 text-slate-500">
                    <button type="button" title="Bold" onClick={() => wrapSelection("**", "**")} className="p-1.5 hover:text-indigo-600">
                      <Bold size={16} />
                    </button>
                    <button type="button" title="Italic" onClick={() => wrapSelection("*", "*")} className="p-1.5 hover:text-indigo-600">
                      <Italic size={16} />
                    </button>
                    <button type="button" title="Link" onClick={() => wrapSelection("[", "](https://)")} className="p-1.5 hover:text-indigo-600">
                      <Link2 size={16} />
                    </button>
                    <button type="button" title="Bullet list" onClick={() => wrapSelection("\n- ", "")} className="p-1.5 hover:text-indigo-600">
                      <List size={16} />
                    </button>
                  </div>
                  <p className="text-xs text-slate-400">
                    Maximum 500 characters <span className="ml-2 text-slate-500">{coverLetter.length} / 500</span>
                  </p>
                </div>
              </div>

              <div>
                <p className="text-sm font-bold text-slate-800">Attach your resume</p>
                <div className="mt-2 flex flex-wrap items-center gap-3">
                  <label className="flex cursor-pointer items-center gap-2 border border-dashed border-indigo-300 px-4 py-2.5 text-sm font-medium text-indigo-600 hover:bg-indigo-50">
                    <Paperclip size={16} />
                    {resume ? resume.name : "Attach Resume/CV"}
                    <input
                      type="file"
                      accept=".pdf,.doc,.docx"
                      className="hidden"
                      onChange={(e) => setResume(e.target.files?.[0] || null)}
                    />
                  </label>
                  {resume && (
                    <button
                      type="button"
                      onClick={() => setResume(null)}
                      className="text-xs font-medium text-slate-500 underline"
                    >
                      Remove
                    </button>
                  )}
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-indigo-600 py-3.5 text-sm font-semibold text-white hover:bg-indigo-700"
              >
                Submit Application
              </button>

              <p className="text-center text-xs leading-5 text-slate-400">
                By sending the request you confirm that you accept our{" "}
                <a href="#" className="text-indigo-600">
                  Terms of Service
                </a>{" "}
                and{" "}
                <a href="#" className="text-indigo-600">
                  Privacy Policy
                </a>
              </p>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
