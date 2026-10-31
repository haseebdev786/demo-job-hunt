"use client";

// Place this file at: components/company/CompanySettingsPage.jsx
// Company Settings (3.18 Overview, 3.19 Social Links,
// 3.20 Team), inside the company layout, same-to-same.
// Tabs: Overview | Social Links | Team.
// Overview (3.18):
//   Basic Information: "This is company information that you
//   can update anytime."
//   Company Logo: logo tile + dashed "Click to replace or drag
//   and drop SVG, PNG, JPG or GIF (max. 400 x 400px)" box.
//   Company Details: Company Name (Nomad), Website,
//   Location pills (England, Japan, Australia), Employee
//   dropdown (1-50), Industry (Technology), Date Founded
//   (31 / July / 2021 dropdowns), Tech Stack pills
//   (HTML5, CSS3, Javascript).
//   About Company: Description textarea with toolbar,
//   "Maximum 500 characters" + live count (screenshot shows
//   0 / 500 even with text filled -- that is a template
//   inconsistency, the live count here is correct).
// Social Links (3.19):
//   Basic Information: "Add elsewhere links to your company
//   profile. You can add only username without full https links."
//   Instagram, Twitter, Facebook (prefilled, as in screenshot),
//   Linkedin, Youtube (empty, placeholders as in screenshot).
// Team (3.20):
//   Basic Information: "Add team members of your company"
//   "50 Members" (screenshot header count -- see note below),
//   + Add Members button, grid / list view toggle.
//   Cards, as in the screenshot: Célestin Gardinier
//   (CEO & Co-Founder), Reynaud Colbert (Co-Founder),
//   Arienne Lyon, Bernard Alexander, Christine Jhonson,
//   Aaron Morgan (all Managing Director), with Instagram /
//   LinkedIn icons.
// Save Changes (all tabs): shows a message, LOCAL only for
// now -- it is NOT saved to MongoDB yet, because there is no
// company profile document / file storage wired for companies
// yet. That is stated in the saved message, so it is not a
// fake success. Wiring company settings to MongoDB is the
// next step after this design page.
// Logo upload: file picker + drag-and-drop preview only --
// the image is NOT uploaded to any storage yet.
// Team note: the screenshot header says "50 Members" but only
// 6 cards are visible in it. The header here starts at 50
// (as in the screenshot) and increments when you add a
// member; the grid shows the 6 screenshot members plus any
// members you add. The other 44 members are not listed in
// the screenshot, so they are not invented here.
// Social icons use react-icons/fa (FaInstagram, FaLinkedinIn),
// because lucide-react no longer ships brand icons -- same
// fix as the applicant Profile page earlier.

import { useRef, useState } from "react";
import Link from "next/link";
import { Bold, Image as ImageIcon, Italic, LayoutGrid, Link as LinkIcon, List, Plus, X } from "lucide-react";
import { FaInstagram, FaLinkedinIn } from "react-icons/fa";

const LOCATION_OPTIONS = ["England", "Japan", "Australia", "United States", "Canada", "France", "Germany", "Spain"];
const TECH_OPTIONS = ["HTML5", "CSS3", "Javascript", "React", "Node.js", "Python", "Figma"];
const EMPLOYEE_OPTIONS = ["1 - 50", "51 - 100", "101 - 200", "201 - 500", "500+"];
const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

const INITIAL_TEAM = [
  { name: "Célestin Gardinier", role: "CEO & Co-Founder" },
  { name: "Reynaud Colbert", role: "Co-Founder" },
  { name: "Arienne Lyon", role: "Managing Director" },
  { name: "Bernard Alexander", role: "Managing Director" },
  { name: "Christine Jhonson", role: "Managing Director" },
  { name: "Aaron Morgan", role: "Managing Director" },
];

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

function PillInput({ pills, onRemove, onAdd, options, placeholder }) {
  return (
    <div>
      <div className="flex flex-wrap items-center gap-1.5 border border-slate-200 px-3 py-2">
        {pills.map((p) => (
          <span key={p} className="flex items-center gap-1 bg-indigo-50 px-2.5 py-1 text-xs text-indigo-600">
            {p}
            <button type="button" onClick={() => onRemove(p)} aria-label={`Remove ${p}`}><X size={12} /></button>
          </span>
        ))}
        <select
          value=""
          onChange={(e) => {
            if (e.target.value) onAdd(e.target.value);
          }}
          className="flex-1 min-w-[120px] bg-transparent text-sm text-slate-500 outline-none"
          aria-label={placeholder}
        >
          <option value="">{placeholder}</option>
          {options.filter((o) => !pills.includes(o)).map((o) => (
            <option key={o} value={o}>{o}</option>
          ))}
        </select>
      </div>
    </div>
  );
}

export default function CompanySettingsPage({ companyName = "Nomad", companyInitial = "N" }) {
  const [tab, setTab] = useState("overview");
  const [savedMessage, setSavedMessage] = useState("");

  // Overview state (prefilled as in screenshot 3.18)
  const [logoPreview, setLogoPreview] = useState("");
  const [companyNameField, setCompanyNameField] = useState(companyName);
  const [website, setWebsite] = useState("https://www.nomad.com");
  const [locations, setLocations] = useState(["England", "Japan", "Australia"]);
  const [employee, setEmployee] = useState("1 - 50");
  const [industry, setIndustry] = useState("Technology");
  const [foundDay, setFoundDay] = useState("31");
  const [foundMonth, setFoundMonth] = useState("July");
  const [foundYear, setFoundYear] = useState("2021");
  const [techStack, setTechStack] = useState(["HTML5", "CSS3", "Javascript"]);
  const [about, setAbout] = useState("Nomad is part of the Information Technology Industry. We believe travellers want to experience real life and meet local people. Nomad has 30 total employees across all of its locations and generates $1.58 million in sales.");

  // Social Links state (prefilled as in screenshot 3.19)
  const [social, setSocial] = useState({
    Instagram: "https://www.instagram.com/nomad/",
    Twitter: "https://twitter.com/nomad/",
    Facebook: "https://web.facebook.com/nomad/",
    Linkedin: "",
    Youtube: "",
  });

  // Team state
  const [team, setTeam] = useState(INITIAL_TEAM);
  const [memberCount, setMemberCount] = useState(50);
  const [teamView, setTeamView] = useState("grid");
  const [memberFormOpen, setMemberFormOpen] = useState(false);
  const [newMember, setNewMember] = useState({ name: "", role: "" });

  const fileRef = useRef(null);

  function handleLogoFile(file) {
    if (!file) return;
    setLogoPreview(URL.createObjectURL(file));
  }

  function handleSave() {
    setSavedMessage("Changes saved locally only for now -- they are NOT saved to MongoDB yet. Company settings database wiring is the next step.");
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

      <h2 className="mt-8 text-xl font-bold text-slate-800">Settings</h2>

      <div className="mt-4 flex gap-6 border-b border-slate-200 text-sm">
        {[
          { id: "overview", label: "Overview" },
          { id: "social", label: "Social Links" },
          { id: "team", label: "Team" },
        ].map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => {
              setTab(t.id);
              setSavedMessage("");
            }}
            className={`-mb-px pb-2 ${tab === t.id ? "border-b-2 border-indigo-600 font-bold text-slate-800" : "text-slate-500 hover:text-slate-800"}`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {savedMessage && (
        <p className="mt-4 border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">{savedMessage}</p>
      )}

      {tab === "overview" && (
        <div className="mt-2 border border-slate-200 bg-white px-6">
          <p className="pt-6 text-base font-bold text-slate-800">Basic Information</p>
          <p className="text-sm text-slate-500">This is company information that you can update anytime.</p>

          <FieldRow label="Company Logo" helper="This image will be shown publicly as company logo">
            <div className="flex flex-wrap items-center gap-6">
              {logoPreview ? (
                <img src={logoPreview} alt="Company logo preview" className="h-16 w-16 object-contain" />
              ) : (
                <span className="flex h-16 w-16 items-center justify-center rounded-lg bg-emerald-50 text-2xl font-black text-emerald-500">
                  {companyInitial}
                </span>
              )}
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  e.preventDefault();
                  handleLogoFile(e.dataTransfer.files?.[0]);
                }}
                className="flex max-w-md flex-1 flex-col items-center gap-1 border-2 border-dashed border-indigo-300 px-6 py-6 text-center text-sm text-slate-500 hover:bg-indigo-50"
              >
                <ImageIcon size={20} className="text-indigo-600" />
                <span>Click to replace or drag and drop</span>
                <span className="text-xs">SVG, PNG, JPG or GIF (max. 400 x 400px)</span>
              </button>
              <input ref={fileRef} type="file" accept=".svg,.png,.jpg,.jpeg,.gif" className="hidden" onChange={(e) => handleLogoFile(e.target.files?.[0])} aria-label="Upload company logo" />
            </div>
            <p className="mt-1 text-xs text-slate-400">Logo preview only for now -- the file is not uploaded to any storage yet.</p>
          </FieldRow>

          <FieldRow label="Company Details" helper="Introduce your company core info quickly to users by fill up company details">
            <div className="max-w-xl space-y-4">
              <div>
                <label className="mb-1 block text-xs font-semibold text-slate-700">Company Name</label>
                <input value={companyNameField} onChange={(e) => setCompanyNameField(e.target.value)} className="w-full border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-indigo-500" />
              </div>
              <div>
                <label className="mb-1 block text-xs font-semibold text-slate-700">Website</label>
                <input value={website} onChange={(e) => setWebsite(e.target.value)} className="w-full border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-indigo-500" />
              </div>
              <div>
                <label className="mb-1 block text-xs font-semibold text-slate-700">Location</label>
                <PillInput
                  pills={locations}
                  onRemove={(p) => setLocations((prev) => prev.filter((x) => x !== p))}
                  onAdd={(p) => setLocations((prev) => [...prev, p])}
                  options={LOCATION_OPTIONS}
                  placeholder="Select location"
                />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-xs font-semibold text-slate-700">Employee</label>
                  <select value={employee} onChange={(e) => setEmployee(e.target.value)} className="w-full border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none">
                    {EMPLOYEE_OPTIONS.map((o) => (
                      <option key={o} value={o}>{o}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="mb-1 block text-xs font-semibold text-slate-700">Industry</label>
                  <input value={industry} onChange={(e) => setIndustry(e.target.value)} className="w-full border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-indigo-500" />
                </div>
              </div>
              <div>
                <label className="mb-1 block text-xs font-semibold text-slate-700">Date Founded</label>
                <div className="grid grid-cols-3 gap-3">
                  <select value={foundDay} onChange={(e) => setFoundDay(e.target.value)} className="border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none" aria-label="Day founded">
                    {Array.from({ length: 31 }, (_, i) => String(i + 1)).map((d) => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                  <select value={foundMonth} onChange={(e) => setFoundMonth(e.target.value)} className="border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none" aria-label="Month founded">
                    {MONTHS.map((m) => (
                      <option key={m} value={m}>{m}</option>
                    ))}
                  </select>
                  <select value={foundYear} onChange={(e) => setFoundYear(e.target.value)} className="border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none" aria-label="Year founded">
                    {Array.from({ length: 126 }, (_, i) => String(2025 - i)).map((y) => (
                      <option key={y} value={y}>{y}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <label className="mb-1 block text-xs font-semibold text-slate-700">Tech Stack</label>
                <PillInput
                  pills={techStack}
                  onRemove={(p) => setTechStack((prev) => prev.filter((x) => x !== p))}
                  onAdd={(p) => setTechStack((prev) => [...prev, p])}
                  options={TECH_OPTIONS}
                  placeholder="Select tech"
                />
              </div>
            </div>
          </FieldRow>

          <FieldRow label="About Company" helper="Brief description for your company. URLs are hyperlinked.">
            <div className="max-w-xl">
              <label className="mb-1 block text-xs font-semibold text-slate-700">Description</label>
              <textarea value={about} onChange={(e) => setAbout(e.target.value)} maxLength={500} rows={4} className="w-full border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-indigo-500" />
              <Toolbar />
              <div className="mt-1 flex items-center justify-between text-xs text-slate-400">
                <span>Maximum 500 characters</span>
                <span>{about.length} / 500</span>
              </div>
            </div>
          </FieldRow>

          <div className="flex justify-end py-6">
            <button type="button" onClick={handleSave} className="bg-indigo-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700">
              Save Changes
            </button>
          </div>
        </div>
      )}

      {tab === "social" && (
        <div className="mt-2 border border-slate-200 bg-white px-6">
          <FieldRow label="Basic Information" helper="Add elsewhere links to your company profile. You can add only username without full https links.">
            <div className="max-w-xl space-y-4">
              {Object.keys(social).map((key) => (
                <div key={key}>
                  <label className="mb-1 block text-xs font-semibold text-slate-700">{key}</label>
                  <input
                    value={social[key]}
                    onChange={(e) => setSocial((prev) => ({ ...prev, [key]: e.target.value }))}
                    placeholder={`Enter your ${key.toLowerCase()} address`}
                    className="w-full border border-slate-200 px-3 py-2.5 text-sm outline-none placeholder:text-slate-400 focus:border-indigo-500"
                  />
                </div>
              ))}
            </div>
          </FieldRow>
          <div className="flex justify-end py-6">
            <button type="button" onClick={handleSave} className="bg-indigo-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700">
              Save Changes
            </button>
          </div>
        </div>
      )}

      {tab === "team" && (
        <div className="mt-2 border border-slate-200 bg-white px-6 py-6">
          <div className="grid gap-4 md:grid-cols-[280px_minmax(0,1fr)]">
            <div>
              <p className="text-sm font-bold text-slate-800">Basic Information</p>
              <p className="mt-1 text-xs leading-5 text-slate-500">Add team members of your company</p>
            </div>
            <div>
              <div className="flex flex-wrap items-center justify-between gap-4">
                <p className="text-base font-bold text-slate-800">{memberCount} Members</p>
                <div className="flex items-center gap-3">
                  <button type="button" onClick={() => setMemberFormOpen(!memberFormOpen)} className="flex items-center gap-1 bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700">
                    <Plus size={16} /> Add Members
                  </button>
                  <span className="flex gap-1 text-slate-400">
                    <button type="button" onClick={() => setTeamView("grid")} aria-label="Grid view" className={teamView === "grid" ? "text-indigo-600" : ""}><LayoutGrid size={18} /></button>
                    <button type="button" onClick={() => setTeamView("list")} aria-label="List view" className={teamView === "list" ? "text-indigo-600" : ""}><List size={18} /></button>
                  </span>
                </div>
              </div>

              {memberFormOpen && (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (!newMember.name.trim()) return;
                    setTeam((prev) => [{ name: newMember.name.trim(), role: newMember.role.trim() || "Team Member" }, ...prev]);
                    setMemberCount((c) => c + 1);
                    setNewMember({ name: "", role: "" });
                    setMemberFormOpen(false);
                  }}
                  className="mt-4 flex flex-wrap gap-2"
                >
                  <input value={newMember.name} onChange={(e) => setNewMember({ ...newMember, name: e.target.value })} placeholder="Member name" className="flex-1 min-w-[160px] border border-slate-200 px-3 py-2 text-sm outline-none focus:border-indigo-500" />
                  <input value={newMember.role} onChange={(e) => setNewMember({ ...newMember, role: e.target.value })} placeholder="Role" className="flex-1 min-w-[160px] border border-slate-200 px-3 py-2 text-sm outline-none focus:border-indigo-500" />
                  <button type="submit" className="bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700">Add</button>
                </form>
              )}

              {teamView === "grid" ? (
                <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {team.map((member) => (
                    <div key={member.name} className="border border-slate-200 p-6 text-center">
                      <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-indigo-100 text-xl font-bold text-indigo-600">
                        {member.name.charAt(0)}
                      </span>
                      <p className="mt-3 text-sm font-bold text-slate-800">{member.name}</p>
                      <p className="text-xs text-slate-500">{member.role}</p>
                      <p className="mt-3 flex items-center justify-center gap-3 text-slate-400">
                        <FaInstagram size={16} />
                        <FaLinkedinIn size={16} />
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="mt-6 divide-y divide-slate-100">
                  {team.map((member) => (
                    <div key={member.name} className="flex items-center justify-between gap-4 py-3">
                      <div className="flex items-center gap-3">
                        <span className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-100 text-sm font-bold text-indigo-600">
                          {member.name.charAt(0)}
                        </span>
                        <div>
                          <p className="text-sm font-bold text-slate-800">{member.name}</p>
                          <p className="text-xs text-slate-500">{member.role}</p>
                        </div>
                      </div>
                      <p className="flex items-center gap-3 text-slate-400">
                        <FaInstagram size={16} />
                        <FaLinkedinIn size={16} />
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
          <div className="flex justify-end py-6">
            <button type="button" onClick={handleSave} className="bg-indigo-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700">
              Save Changes
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
