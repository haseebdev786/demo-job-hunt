"use client";


import { useState } from "react";
import Link from "next/link";
import ProfileEditor from "./ProfileEditor";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import { Pencil, Plus, Mail, Phone, MapPin, Globe } from "lucide-react";
import { FaInstagram, FaTwitter, FaFacebookF, FaLinkedinIn, FaGlobe } from "react-icons/fa";

function Avatar({ name, avatarUrl, large }) {
  const size = large ? "h-20 w-20 text-2xl" : "h-11 w-11 text-sm";
  if (avatarUrl) {
    return (
      <img src={avatarUrl} alt={name} className={`${size} shrink-0 rounded-full object-cover`} />
    );
  }
  return (
    <span className={`${size} flex shrink-0 items-center justify-center rounded-full bg-indigo-100 font-bold text-indigo-600`}>
      {(name || "?").charAt(0)}
    </span>
  );
}

function SectionHeader({ title, onEdit, onAdd }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <h2 className="text-base font-bold text-slate-800">{title}</h2>
      <div className="flex items-center gap-1">
        <button type="button" onClick={onAdd || onEdit} aria-label={`Add ${title}`} className="p-1 text-slate-400 hover:text-indigo-600">
          <Plus size={16} />
        </button>
        <button
          type="button"
          aria-label={`Edit ${title}`}
          onClick={onEdit}
          className="p-1 text-slate-400 hover:text-indigo-600"
        >
          <Pencil size={16} />
        </button>
      </div>
    </div>
  );
}

function logoTileClass(name) {
  const n = (name || "").toLowerCase();
  if (n.includes("twitter")) return "bg-sky-500 text-white";
  if (n.includes("godaddy") || n.includes("go daddy")) return "bg-black text-white";
  if (n.includes("harvard")) return "bg-red-800 text-white";
  if (n.includes("toronto")) return "bg-blue-950 text-white";
  return "bg-indigo-50 text-indigo-600";
}

const socialIcons = {
  Instagram: FaInstagram,
  Twitter: FaTwitter,
  Facebook: FaFacebookF,
  LinkedIn: FaLinkedinIn,
  Linkedin: FaLinkedinIn,
};

export default function ProfilePage({ initialData }) {
  const [editor, setEditor] = useState(null);
  const user = initialData.user;
  const profile = initialData.profile;
  const [showAllExperiences, setShowAllExperiences] = useState(false);
  const [showAllEducations, setShowAllEducations] = useState(false);

  const experiences = initialData.experiences || [];
  const educations = initialData.educations || [];
  const visibleExperiences = showAllExperiences ? experiences : experiences.slice(0, 2);
  const visibleEducations = showAllEducations ? educations : educations.slice(0, 2);
  const additional = initialData.additionalDetails || {};
  const socialLinks = initialData.socialLinks || [];
  const hasAnyProfileData =
    profile || experiences.length > 0 || educations.length > 0 || (initialData.skills || []).length > 0;

  const sectionValues = {
    overview: { fullName: user?.name || "", title: profile?.title || "", location: profile?.location || "", openForOpportunities: profile?.openForOpportunities || false },
    about: { about: profile?.about || "" }, experiences, educations,
    skills: { skills: (initialData.skills || []).join(", ") },
    portfolios: initialData.portfolios || [], additionalDetails: { email: user?.email || "", ...additional }, socialLinks,
  };

  return (
    <div className="px-4 py-8 sm:px-6 lg:px-10">
      {editor && <ProfileEditor section={editor.section} initialValue={sectionValues[editor.section]} add={editor.add} onClose={() => setEditor(null)} />}
      {/* Header: same as Dashboard overview -- bell outside dropdown, NO Back to homepage */}
      <DashboardHeader title="My Profile" />

      {!initialData.connected && (
        <div className="mt-6 border border-amber-200 bg-amber-50 px-5 py-4 text-sm leading-6 text-amber-800">
          <p className="font-bold">MongoDB is not connected yet.</p>
          <p>
            Please refresh and try again.
            The page shows an empty state instead of a fake profile until then.
          </p>
        </div>
      )}

      {!hasAnyProfileData && initialData.connected && (
        <div className="mt-8 border border-slate-200 bg-white px-5 py-8 text-center">
          <p className="font-bold text-slate-800">No profile yet.</p>
          <p className="mx-auto mt-1 max-w-md text-sm text-slate-500">
            {user?.name ? `Hi ${user.firstName}, your ` : "Your "}
            profile sections will appear here when your profile details are added.
          </p>
        </div>
      )}

      {(hasAnyProfileData || user) && (
        <div className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
          {/* Left column */}
          <div className="space-y-6">
            {/* Profile header card -- reference has a pink-to-purple
                cover banner at the top, with the avatar photo overlapping
                its bottom-left corner. Avatar photo: the page shows
                user.avatarUrl when one is set in MongoDB, otherwise the
                initial letter (the reference photo is Jake's own photo,
                which is not in this repo -- add avatarUrl in MongoDB to
                replace the letter with a real photo). */}
            <div className="overflow-hidden border border-slate-200 bg-white">
              {/* No absolute overlay inside the banner: a positioned
                  overlay paints ABOVE the avatar below and hides its
                  top half behind the banner (that was the bug in the
                  screenshot -- only a sliver of the avatar showed).
                  The gradient on the banner div itself is enough. */}
              <div className="h-28 bg-gradient-to-r from-pink-200 via-fuchsia-300 to-purple-900 sm:h-32" />
              <div className="flex flex-wrap items-start justify-between gap-4 px-5 pb-5">
                <div className="flex items-start gap-4">
                  <div className="relative z-10 -mt-10 shrink-0 rounded-full ring-4 ring-white">
                    <Avatar name={user?.name} avatarUrl={user?.avatarUrl} large />
                  </div>
                  <div className="pt-2">
                    <h2 className="text-xl font-bold text-slate-800">{user?.name || "My Account"}</h2>
                    {profile?.title && (
                      <p className="mt-1 text-sm text-slate-500">{profile.title}</p>
                    )}
                    {profile?.location && (
                      <p className="mt-1 flex items-center gap-1 text-sm text-slate-500">
                        <MapPin size={14} className="shrink-0" />
                        {profile.location}
                      </p>
                    )}
                    {profile?.openForOpportunities && (
                      <span className="mt-2 inline-block rounded-full bg-emerald-50 px-3 py-1 text-[11px] font-bold text-emerald-600">
                        OPEN FOR OPPORTUNITIES
                      </span>
                    )}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setEditor({ section: "overview" })}
                  className="mt-2 border border-indigo-200 px-4 py-2 text-sm font-medium text-indigo-600 hover:bg-indigo-50"
                >
                  Edit Profile
                </button>
              </div>
            </div>

            {/* About Me */}
            <section className="border border-slate-200 bg-white p-5">
              <SectionHeader title="About Me" onEdit={() => setEditor({ section: "about" })} onAdd={() => setEditor({ section: "about", add: true })} />
              {profile?.about ? (
                <div className="mt-3 space-y-3">
                  {profile.about.split(/\n\n+/).map((para, i) => (
                    <p key={i} className="text-sm leading-6 text-slate-500">{para}</p>
                  ))}
                </div>
              ) : (
                <p className="mt-3 text-sm text-slate-400">No about section added yet.</p>
              )}
            </section>

            {/* Experiences */}
            <section className="border border-slate-200 bg-white p-5">
              <SectionHeader title="Experiences" onEdit={() => setEditor({ section: "experiences" })} onAdd={() => setEditor({ section: "experiences", add: true })} />
              {experiences.length === 0 ? (
                <p className="mt-3 text-sm text-slate-400">No experiences added yet.</p>
              ) : (
                <>
                  <ul className="mt-4 space-y-5">
                    {visibleExperiences.map((exp, i) => (
                      <li key={`${exp.company}-${exp.role}-${i}`} className="flex gap-3">
                        {(exp.company || "").toLowerCase().includes("twitter") ? (
                          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-sky-500 text-white">
                            <FaTwitter size={20} />
                          </span>
                        ) : (
                          <span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-sm font-black ${logoTileClass(exp.company)}`}>
                            {(exp.company || "?").charAt(0)}
                          </span>
                        )}
                        <div className="min-w-0">
                          <p className="text-sm font-bold text-slate-800">{exp.role}</p>
                          <p className="text-xs text-slate-500">
                            {exp.company}
                            {exp.employmentType ? ` · ${exp.employmentType}` : ""}
                            {exp.period ? ` · ${exp.period}` : ""}
                          </p>
                          {exp.location && (
                            <p className="text-xs text-slate-500">{exp.location}</p>
                          )}
                          {exp.description && (
                            <p className="mt-1 text-xs leading-5 text-slate-500">{exp.description}</p>
                          )}
                        </div>
                      </li>
                    ))}
                  </ul>
                  {experiences.length > 2 && (
                    <button
                      type="button"
                      onClick={() => setShowAllExperiences((v) => !v)}
                      className="mt-4 text-sm font-semibold text-indigo-600"
                    >
                      {showAllExperiences
                        ? "Show fewer experiences"
                        : `Show ${experiences.length - 2} more experiences`}
                    </button>
                  )}
                </>
              )}
            </section>

            {/* Educations */}
            <section className="border border-slate-200 bg-white p-5">
              <SectionHeader title="Educations" onEdit={() => setEditor({ section: "educations" })} onAdd={() => setEditor({ section: "educations", add: true })} />
              {educations.length === 0 ? (
                <p className="mt-3 text-sm text-slate-400">No educations added yet.</p>
              ) : (
                <>
                  <ul className="mt-4 space-y-5">
                    {visibleEducations.map((edu, i) => (
                      <li key={`${edu.school}-${edu.degree}-${i}`} className="flex gap-3">
                        <span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-md text-sm font-black ${logoTileClass(edu.school)}`}>
                          {(edu.school || "?").charAt(0)}
                        </span>
                        <div className="min-w-0">
                          <p className="text-sm font-bold text-slate-800">{edu.school}</p>
                          <p className="text-xs text-slate-500">
                            {[edu.degree, edu.period].filter(Boolean).join(" · ")}
                          </p>
                          {edu.description && (
                            <p className="mt-1 text-xs leading-5 text-slate-500">{edu.description}</p>
                          )}
                        </div>
                      </li>
                    ))}
                  </ul>
                  {educations.length > 2 && (
                    <button
                      type="button"
                      onClick={() => setShowAllEducations((v) => !v)}
                      className="mt-4 text-sm font-semibold text-indigo-600"
                    >
                      {showAllEducations
                        ? "Show fewer educations"
                        : `Show ${educations.length - 2} more educations`}
                    </button>
                  )}
                </>
              )}
            </section>

            {/* Skills */}
            <section className="border border-slate-200 bg-white p-5">
              <SectionHeader title="Skills" onEdit={() => setEditor({ section: "skills" })} onAdd={() => setEditor({ section: "skills", add: true })} />
              {(initialData.skills || []).length === 0 ? (
                <p className="mt-3 text-sm text-slate-400">No skills added yet.</p>
              ) : (
                <div className="mt-3 flex flex-wrap gap-2">
                  {(initialData.skills || []).map((skill) => (
                    <span
                      key={skill}
                      className="border border-slate-200 bg-gray-50 px-3 py-1 text-xs text-slate-600"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              )}
            </section>

            {/* Portfolios */}
            <section className="border border-slate-200 bg-white p-5">
              <SectionHeader title="Portfolios" onEdit={() => setEditor({ section: "portfolios" })} onAdd={() => setEditor({ section: "portfolios", add: true })} />
              {(initialData.portfolios || []).length === 0 ? (
                <p className="mt-3 text-sm text-slate-400">No portfolios added yet.</p>
              ) : (
                <div className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                  {(initialData.portfolios || []).map((item, i) => (
                    <div key={`${item.title}-${i}`} className="min-w-0">
                      {item.imageUrl ? (
                        <img
                          src={item.imageUrl}
                          alt={item.title}
                          className="h-28 w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-28 w-full items-center justify-center bg-indigo-50 text-2xl font-black text-indigo-600">
                          {(item.title || "?").charAt(0)}
                        </div>
                      )}
                      <p className="mt-2 text-xs font-medium leading-4 text-slate-700">{item.url ? <a href={item.url} target="_blank" rel="noreferrer" className="text-indigo-600">{item.title}</a> : item.title}</p>
                    </div>
                  ))}
                </div>
              )}
            </section>
          </div>

          {/* Right column */}
          <div className="space-y-6">
            <section className="border border-slate-200 bg-white p-5">
              <SectionHeader title="Additional Details" onEdit={() => setEditor({ section: "additionalDetails" })} onAdd={() => setEditor({ section: "additionalDetails", add: true })} />
              <ul className="mt-3 space-y-3 text-sm text-slate-600">
                {(additional.email || user?.email) && (
                  <li className="flex items-center gap-2">
                    <Mail size={16} className="shrink-0 text-slate-400" />
                    <span className="truncate">{additional.email || user.email}</span>
                  </li>
                )}
                {additional.phone && (
                  <li className="flex items-center gap-2">
                    <Phone size={16} className="shrink-0 text-slate-400" />
                    <span>{additional.phone}</span>
                  </li>
                )}
                {additional.location && (
                  <li className="flex items-center gap-2">
                    <MapPin size={16} className="shrink-0 text-slate-400" />
                    <span>{additional.location}</span>
                  </li>
                )}
                {additional.languages && (
                  <li className="flex items-center gap-2">
                    <Globe size={16} className="shrink-0 text-slate-400" />
                    <span>{additional.languages}</span>
                  </li>
                )}
                {!additional.email && !user?.email && !additional.phone && !additional.location && !additional.languages && (
                  <li className="text-sm text-slate-400">No additional details added yet.</li>
                )}
              </ul>
            </section>

            <section className="border border-slate-200 bg-white p-5">
              <SectionHeader title="Social Links" onEdit={() => setEditor({ section: "socialLinks" })} onAdd={() => setEditor({ section: "socialLinks", add: true })} />
              {socialLinks.length === 0 ? (
                <p className="mt-3 text-sm text-slate-400">No social links added yet.</p>
              ) : (
                <ul className="mt-3 space-y-3">
                  {socialLinks.map((link, i) => {
                    const Icon = link.platform === "Website" ? FaGlobe : socialIcons[link.platform] || Globe;
                    return (
                      <li key={`${link.platform}-${i}`}>
                        <a
                          href={link.url}
                          target="_blank"
                          rel="noreferrer"
                          className="flex items-start gap-2 hover:text-indigo-600"
                        >
                          <Icon size={16} className="mt-0.5 shrink-0 text-slate-400" />
                          <span className="min-w-0">
                            <span className="block text-sm text-slate-600">{link.platform}</span>
                            <span className="block truncate text-xs text-indigo-600">{link.url.replace(/^https?:\/\//, "")}</span>
                          </span>
                        </a>
                      </li>
                    );
                  })}
                </ul>
              )}
            </section>
          </div>
        </div>
      )}
    </div>
  );
}
