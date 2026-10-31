"use client";

// Place this file at: components/company/ApplicantDetailsPage.jsx
// Applicant Details (3.5 Applicant Profile, 3.6 Resume,
// 3.7 Hiring Progress, 3.8 Interview Schedule), inside the
// company layout. One page, four tabs on the right, left card
// stays the same across tabs (like the screenshots).
// Left card: avatar, name, title, star rating, Applied Jobs,
// Stage progress bar, Schedule Interview button, Contact card.
// Tabs:
//   Applicant Profile: Personal Info + Professional Info (3.5)
//   Resume: resume document preview (3.6)
//   Hiring Progress: Current Stage pills, Stage Info, Move To
//     Next Step, Notes + Add Notes (3.7)
//   Interview Schedule: Interview List + Add Schedule Interview (3.8)
// Local-only actions (disclosed in the UI): stage progression,
// notes, interviews and feedback are LOCAL state only -- they are
// NOT saved to MongoDB yet, so they do not persist after reload.
// For Jerome Bell, all detail data comes from
// lib/company-applicants-data.js (jeromeBellDetail). For other
// applicants, detail data is GENERATED from their name/title/
// score/stage (see buildDetail below) -- it is demo filler,
// not screenshot data, and the page says so for non-Jerome rows.

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, ChevronDown, Mail, MessageSquare, Phone, Star } from "lucide-react";
import { jeromeBellDetail } from "@/lib/company-applicants-data";

function buildDetail(applicant) {
  if (applicant.id === "jerome-bell") return jeromeBellDetail;
  const emailName = applicant.name.toLowerCase().replace(/[^a-z ]/g, "").replace(/ /g, "");
  return {
    title: applicant.jobRole,
    appliedJob: { title: applicant.jobRole, category: "Marketing", type: "Full-Time", daysAgo: "2 days ago" },
    stage: applicant.stage,
    stageSteps: ["In Review", "Shortlisted", "Interview", "Hired / Declined"],
    contact: {
      email: `${emailName}45@email.com`,
      phone: "+44 1245 572 135",
      instagram: `instagram.com/${emailName}`,
      twitter: `twitter.com/${emailName}`,
      website: `www.${emailName}.com`,
    },
    profile: {
      fullName: applicant.name,
      gender: "Not specified",
      dateOfBirth: "Not specified",
      language: "English",
      address: "Not specified",
      aboutMe: `${applicant.name} is a ${applicant.jobRole} candidate. Full profile details for this demo applicant are not in the screenshots -- replace them in lib/company-applicants-data.js with real data.`,
      currentJob: applicant.jobRole,
      experienceYears: "Not specified",
      qualification: "Not specified",
      skills: [applicant.jobRole, "English"],
    },
    resume: {
      experiences: [{ title: applicant.jobRole, company: "Enterprise", period: "Present", text: "Demo resume experience for this applicant -- replace with real resume data." }],
      education: "Not specified",
      industryKnowledge: [applicant.jobRole],
      tools: ["Figma"],
      otherSkills: ["English"],
      languages: ["English"],
      social: [`www.${emailName}.com`],
    },
    hiring: {
      interviewDate: "Not scheduled yet",
      interviewLocation: "Not specified",
      interviewStatus: "On Progress",
      assignedTo: ["Maria Kelly"],
      notes: [],
    },
    interviews: [],
  };
}

export default function ApplicantDetailsPage({ applicant, companyName = "Nomad" }) {
  const detail = buildDetail(applicant);
  const isJerome = applicant.id === "jerome-bell";
  const [tab, setTab] = useState("profile");
  const [stageIndex, setStageIndex] = useState(() => {
    if (applicant.stage === "Hired") return 3;
    if (applicant.stage === "Interviewed" || applicant.stage === "Interview") return 2;
    if (applicant.stage === "Shortlisted") return 1;
    return 0;
  });
  const [notes, setNotes] = useState(detail.hiring.notes);
  const [noteText, setNoteText] = useState("");
  const [showNoteForm, setShowNoteForm] = useState(false);
  const [interviews, setInterviews] = useState(detail.interviews);
  const [showInterviewForm, setShowInterviewForm] = useState(false);
  const [newInterview, setNewInterview] = useState({ name: "", date: "", time: "", type: "" });
  const [feedbackFor, setFeedbackFor] = useState(null);
  const [feedbackText, setFeedbackText] = useState("");
  const [feedbacks, setFeedbacks] = useState({});

  const currentStageLabel = detail.stageSteps[stageIndex] || applicant.stage;
  const progressPercent = Math.round(((stageIndex + 1) / detail.stageSteps.length) * 100);

  return (
    <div className="px-4 py-8 sm:px-6 lg:px-10">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <Link href="/company/applicants" className="flex items-center gap-2 text-lg font-bold text-slate-800">
          <ArrowLeft size={20} /> Applicant Details
        </Link>
        <button type="button" className="flex items-center gap-1 border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-600">
          <ChevronDown size={16} /> More Action
        </button>
      </div>
      {!isJerome && (
        <p className="mt-2 text-xs text-slate-400">
          Detail data for this applicant is demo filler (name/title/score/stage based) -- only Jerome Bell&apos;s detail is from the screenshots.
        </p>
      )}

      <div className="mt-6 grid gap-6 lg:grid-cols-[320px_minmax(0,1fr)]">
        {/* Left card */}
        <div className="space-y-6">
          <section className="border border-slate-200 bg-white p-6">
            <div className="flex items-center gap-4">
              <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-xl font-bold text-indigo-600">
                {applicant.name.charAt(0)}
              </span>
              <div>
                <p className="font-bold text-slate-800">{applicant.name}</p>
                <p className="text-xs text-slate-500">{detail.title}</p>
                <p className="mt-1 flex items-center gap-1 text-xs text-amber-500"><Star size={12} fill="currentColor" /> {applicant.score.toFixed(1)}</p>
              </div>
            </div>

            <div className="mt-5 border border-slate-200 p-4">
              <div className="flex items-center justify-between text-xs text-slate-500">
                <span>Applied Jobs</span>
                <span>{detail.appliedJob.daysAgo}</span>
              </div>
              <p className="mt-2 text-sm font-bold text-slate-800">{detail.appliedJob.title}</p>
              <p className="text-xs text-slate-500">{detail.appliedJob.category} - {detail.appliedJob.type}</p>
            </div>

            <div className="mt-5">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500">Stage</span>
                <span className="font-semibold text-indigo-600">{currentStageLabel}</span>
              </div>
              <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-slate-100">
                <div className="h-full bg-indigo-600" style={{ width: `${progressPercent}%` }} />
              </div>
            </div>

            <div className="mt-5 flex gap-2">
              <button type="button" onClick={() => setTab("schedule")} className="flex-1 border border-indigo-200 py-2 text-sm font-semibold text-indigo-600 hover:bg-indigo-50">
                Schedule Interview
              </button>
              <Link href="/company/messages" className="flex items-center justify-center border border-slate-200 px-3 text-slate-500" aria-label="Message">
                <MessageSquare size={18} />
              </Link>
            </div>
          </section>

          <section className="border border-slate-200 bg-white p-6">
            <h2 className="text-base font-bold text-slate-800">Contact</h2>
            <ul className="mt-4 space-y-3 text-sm text-slate-600">
              <li className="flex items-center gap-2"><Mail size={16} className="shrink-0 text-slate-400" /> {detail.contact.email}</li>
              <li className="flex items-center gap-2"><Phone size={16} className="shrink-0 text-slate-400" /> {detail.contact.phone}</li>
              <li>Instagram: {detail.contact.instagram}</li>
              <li>Twitter: {detail.contact.twitter}</li>
              <li>Website: {detail.contact.website}</li>
            </ul>
          </section>
        </div>

        {/* Right tabs */}
        <div>
          <div className="flex flex-wrap gap-6 border-b border-slate-200 text-sm">
            {[
              { id: "profile", label: "Applicant Profile" },
              { id: "resume", label: "Resume" },
              { id: "hiring", label: "Hiring Progress" },
              { id: "schedule", label: "Interview Schedule" },
            ].map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setTab(t.id)}
                className={`-mb-px pb-2 ${tab === t.id ? "border-b-2 border-indigo-600 font-bold text-slate-800" : "text-slate-500 hover:text-slate-800"}`}
              >
                {t.label}
              </button>
            ))}
          </div>

          {tab === "profile" && (
            <div className="mt-6 space-y-6">
              <section className="border border-slate-200 bg-white p-6">
                <h2 className="text-base font-bold text-slate-800">Personal Info</h2>
                <dl className="mt-4 grid gap-4 sm:grid-cols-2 text-sm">
                  <div><dt className="text-xs text-slate-500">Full Name</dt><dd className="font-semibold text-slate-800">{detail.profile.fullName}</dd></div>
                  <div><dt className="text-xs text-slate-500">Gender</dt><dd className="font-semibold text-slate-800">{detail.profile.gender}</dd></div>
                  <div><dt className="text-xs text-slate-500">Date of Birth</dt><dd className="font-semibold text-slate-800">{detail.profile.dateOfBirth}</dd></div>
                  <div><dt className="text-xs text-slate-500">Language</dt><dd className="font-semibold text-slate-800">{detail.profile.language}</dd></div>
                  <div className="sm:col-span-2"><dt className="text-xs text-slate-500">Address</dt><dd className="font-semibold text-slate-800">{detail.profile.address}</dd></div>
                </dl>
              </section>
              <section className="border border-slate-200 bg-white p-6">
                <h2 className="text-base font-bold text-slate-800">Professional Info</h2>
                <h3 className="mt-4 text-sm font-bold text-slate-800">About Me</h3>
                <p className="mt-2 whitespace-pre-line text-sm leading-6 text-slate-500">{detail.profile.aboutMe}</p>
                <dl className="mt-4 grid gap-4 sm:grid-cols-2 text-sm">
                  <div><dt className="text-xs text-slate-500">Current Job</dt><dd className="font-semibold text-slate-800">{detail.profile.currentJob}</dd></div>
                  <div><dt className="text-xs text-slate-500">Experience in Years</dt><dd className="font-semibold text-slate-800">{detail.profile.experienceYears}</dd></div>
                  <div><dt className="text-xs text-slate-500">Highest Qualification Held</dt><dd className="font-semibold text-slate-800">{detail.profile.qualification}</dd></div>
                  <div>
                    <dt className="text-xs text-slate-500">Skill set</dt>
                    <dd className="mt-1 flex flex-wrap gap-1.5">
                      {detail.profile.skills.map((s) => (
                        <span key={s} className="bg-indigo-50 px-2.5 py-1 text-xs text-indigo-600">{s}</span>
                      ))}
                    </dd>
                  </div>
                </dl>
              </section>
            </div>
          )}

          {tab === "resume" && (
            <section className="mt-6 border border-slate-200 bg-white p-6 sm:p-8">
              <div className="flex flex-wrap items-start justify-between gap-4 border-b border-slate-800 pb-4">
                <div>
                  <h2 className="text-2xl font-black text-slate-800">{applicant.name}</h2>
                  <p className="text-sm text-slate-500">{detail.title}</p>
                </div>
                <div className="text-right text-xs text-slate-500">
                  <p>{detail.contact.email}</p>
                  <p>{detail.contact.website}</p>
                </div>
              </div>
              <div className="mt-6 grid gap-8 md:grid-cols-[minmax(0,1fr)_220px]">
                <div>
                  {detail.resume.experiences.map((exp) => (
                    <div key={exp.title} className="mb-6">
                      <h3 className="font-bold text-slate-800">{exp.title}</h3>
                      <p className="text-xs text-slate-500">{exp.company} - {exp.period}</p>
                      <p className="mt-1 text-sm leading-6 text-slate-500">{exp.text}</p>
                    </div>
                  ))}
                  <h3 className="font-bold text-slate-800">Education</h3>
                  <p className="mt-1 text-sm text-slate-500">{detail.resume.education}</p>
                </div>
                <div className="space-y-5 text-sm">
                  <div><h3 className="font-bold text-slate-800">Industry Knowledge</h3><p className="mt-1 text-slate-500">{detail.resume.industryKnowledge.join(", ")}</p></div>
                  <div><h3 className="font-bold text-slate-800">Tools & Technologies</h3><p className="mt-1 text-slate-500">{detail.resume.tools.join(", ")}</p></div>
                  <div><h3 className="font-bold text-slate-800">Other Skills</h3><p className="mt-1 text-slate-500">{detail.resume.otherSkills.join(", ")}</p></div>
                  <div><h3 className="font-bold text-slate-800">Languages</h3><p className="mt-1 text-slate-500">{detail.resume.languages.join(", ")}</p></div>
                  <div><h3 className="font-bold text-slate-800">Social</h3><p className="mt-1 text-slate-500">{detail.resume.social.join(", ")}</p></div>
                </div>
              </div>
            </section>
          )}

          {tab === "hiring" && (
            <div className="mt-6 space-y-6">
              <section className="border border-slate-200 bg-white p-6">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <h2 className="text-base font-bold text-slate-800">Current Stage</h2>
                  <button type="button" className="border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600">Give Rating</button>
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  {detail.stageSteps.map((step, i) => (
                    <span key={step} className={`px-4 py-2 text-xs font-semibold ${i === stageIndex ? "bg-indigo-600 text-white" : i < stageIndex ? "bg-indigo-50 text-indigo-600" : "bg-slate-100 text-slate-500"}`}>
                      {step}
                    </span>
                  ))}
                </div>
                <h3 className="mt-6 text-sm font-bold text-slate-800">Stage Info</h3>
                <dl className="mt-3 grid gap-4 sm:grid-cols-2 text-sm">
                  <div><dt className="text-xs text-slate-500">Interview Date</dt><dd className="font-semibold text-slate-800">{detail.hiring.interviewDate}</dd></div>
                  <div><dt className="text-xs text-slate-500">Interview Status</dt><dd className="font-semibold text-slate-800">{detail.hiring.interviewStatus}</dd></div>
                  <div className="sm:col-span-2"><dt className="text-xs text-slate-500">Interview Location</dt><dd className="whitespace-pre-line font-semibold text-slate-800">{detail.hiring.interviewLocation}</dd></div>
                  <div><dt className="text-xs text-slate-500">Assigned to</dt><dd className="font-semibold text-slate-800">{detail.hiring.assignedTo.join(", ")}</dd></div>
                </dl>
                <button
                  type="button"
                  disabled={stageIndex >= detail.stageSteps.length - 1}
                  onClick={() => setStageIndex((i) => Math.min(i + 1, detail.stageSteps.length - 1))}
                  className="mt-5 border border-indigo-200 px-4 py-2 text-sm font-semibold text-indigo-600 hover:bg-indigo-50 disabled:opacity-40"
                >
                  Move To Next Step
                </button>
                <p className="mt-1 text-xs text-slate-400">Stage changes here are local only for now -- not saved to MongoDB yet.</p>
              </section>

              <section className="border border-slate-200 bg-white p-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-base font-bold text-slate-800">Notes</h2>
                  <button type="button" onClick={() => setShowNoteForm(!showNoteForm)} className="text-sm font-semibold text-indigo-600">+ Add Notes</button>
                </div>
                {showNoteForm && (
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      if (!noteText.trim()) return;
                      setNotes((prev) => [{ author: "Maria Kelly", date: "Just now", text: noteText.trim(), replies: "" }, ...prev]);
                      setNoteText("");
                      setShowNoteForm(false);
                    }}
                    className="mt-4 space-y-3"
                  >
                    <textarea value={noteText} onChange={(e) => setNoteText(e.target.value)} rows={3} placeholder="Write a note..." className="w-full border border-slate-200 px-3 py-2 text-sm outline-none focus:border-indigo-500" />
                    <button type="submit" className="bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700">Save Note (local only)</button>
                  </form>
                )}
                <div className="mt-4 space-y-4">
                  {notes.map((note, i) => (
                    <div key={i} className="flex gap-3 border-b border-slate-100 pb-4">
                      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-sm font-bold text-indigo-600">{note.author.charAt(0)}</span>
                      <div>
                        <p className="text-sm font-bold text-slate-800">{note.author} <span className="ml-2 text-xs font-normal text-slate-400">{note.date}</span></p>
                        <p className="mt-1 text-sm leading-6 text-slate-500">{note.text}</p>
                        {note.replies && <p className="mt-1 text-xs text-indigo-600">{note.replies}</p>}
                      </div>
                    </div>
                  ))}
                  {notes.length === 0 && <p className="text-sm text-slate-500">No notes yet.</p>}
                </div>
              </section>
            </div>
          )}

          {tab === "schedule" && (
            <section className="mt-6 border border-slate-200 bg-white p-6">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <h2 className="text-base font-bold text-slate-800">Interview List</h2>
                <button type="button" onClick={() => setShowInterviewForm(!showInterviewForm)} className="text-sm font-semibold text-indigo-600">+ Add Schedule Interview</button>
              </div>
              {showInterviewForm && (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (!newInterview.name.trim() || !newInterview.date.trim()) return;
                    setInterviews((prev) => [{ name: newInterview.name.trim(), date: newInterview.date.trim(), time: newInterview.time.trim() || "10:00 AM - 11:00 AM", type: newInterview.type.trim() || "Interview", location: `Silver Crysta Room, ${companyName}` }, ...prev]);
                    setNewInterview({ name: "", date: "", time: "", type: "" });
                    setShowInterviewForm(false);
                  }}
                  className="mt-4 grid gap-3 sm:grid-cols-2"
                >
                  <input value={newInterview.name} onChange={(e) => setNewInterview({ ...newInterview, name: e.target.value })} placeholder="Interviewer name" className="border border-slate-200 px-3 py-2 text-sm outline-none focus:border-indigo-500" />
                  <input value={newInterview.date} onChange={(e) => setNewInterview({ ...newInterview, date: e.target.value })} placeholder="Date, e.g. 14 July, 2021" className="border border-slate-200 px-3 py-2 text-sm outline-none focus:border-indigo-500" />
                  <input value={newInterview.time} onChange={(e) => setNewInterview({ ...newInterview, time: e.target.value })} placeholder="Time, e.g. 10:00 AM - 11:00 AM" className="border border-slate-200 px-3 py-2 text-sm outline-none focus:border-indigo-500" />
                  <input value={newInterview.type} onChange={(e) => setNewInterview({ ...newInterview, type: e.target.value })} placeholder="Type, e.g. Written Test" className="border border-slate-200 px-3 py-2 text-sm outline-none focus:border-indigo-500" />
                  <button type="submit" className="bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700 sm:col-span-2">Add Interview (local only)</button>
                </form>
              )}
              <div className="mt-4 divide-y divide-slate-100">
                {interviews.map((iv, i) => (
                  <div key={i} className="py-4">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <span className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-100 text-sm font-bold text-indigo-600">{iv.name.charAt(0)}</span>
                        <div>
                          <p className="text-sm font-bold text-slate-800">{iv.name}</p>
                          <p className="text-xs text-slate-500">{iv.type} - {iv.location}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-semibold text-slate-800">{iv.time}</p>
                        <p className="text-xs text-slate-500">{iv.date}</p>
                      </div>
                      <button type="button" onClick={() => setFeedbackFor(feedbackFor === i ? null : i)} className="border border-indigo-200 px-3 py-1.5 text-xs font-semibold text-indigo-600 hover:bg-indigo-50">
                        Add Feedback
                      </button>
                    </div>
                    {feedbacks[i] && <p className="mt-2 border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-800">{feedbacks[i]}</p>}
                    {feedbackFor === i && (
                      <form
                        onSubmit={(e) => {
                          e.preventDefault();
                          if (!feedbackText.trim()) return;
                          setFeedbacks((prev) => ({ ...prev, [i]: feedbackText.trim() }));
                          setFeedbackText("");
                          setFeedbackFor(null);
                        }}
                        className="mt-3 flex gap-2"
                      >
                        <input value={feedbackText} onChange={(e) => setFeedbackText(e.target.value)} placeholder="Write feedback..." className="w-full border border-slate-200 px-3 py-2 text-sm outline-none focus:border-indigo-500" />
                        <button type="submit" className="bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700">Save</button>
                      </form>
                    )}
                  </div>
                ))}
                {interviews.length === 0 && <p className="py-4 text-sm text-slate-500">No interviews scheduled yet. Use + Add Schedule Interview above.</p>}
              </div>
              <p className="mt-2 text-xs text-slate-400">Interviews and feedback here are local only for now -- not saved to MongoDB yet.</p>
            </section>
          )}
        </div>
      </div>
    </div>
  );
}
