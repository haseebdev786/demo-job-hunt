// Shared left panel for Sign Up / Login, matching the reference design.
// Place this file at: components/AuthLeftPanel.jsx
// It is imported by app/signup/page.jsx and app/login/page.jsx.
//
// Updated: the "100K+ People got hired" stat is now exactly like the
// reference crop -- a white card with a 3-bar chart icon on top,
// "100K+" in bold black, and "People got hired" in grey below it.
// The testimonial card on the right side is unchanged from the last fix.

import { Quote } from "lucide-react";

export default function AuthLeftPanel() {
  return (
    <div className="relative hidden overflow-hidden lg:block">
      <img
        src="https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=1200&auto=format&fit=crop"
        alt="Professional man in a suit"
        className="absolute inset-0 h-full w-full object-cover"
      />
      {/* Soft overlay so the white text stays readable */}
      <div className="absolute inset-0 bg-slate-900/10" />

      {/* Logo, top left */}
      <div className="absolute left-8 top-8 flex items-center gap-2">
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-600 text-sm font-black text-white">
          J
        </span>
        <span className="text-lg font-black tracking-tight text-white drop-shadow">
          JobHuntly
        </span>
      </div>

      {/* 100K+ card, like the reference: white card, 3 bars, bold text */}
      <div className="absolute left-8 top-24 w-[190px] bg-white p-5 shadow-lg">
        {/* Bar chart icon: short light bar, medium bar, tall dark bar */}
        <div className="flex items-end gap-1.5">
          <span className="h-4 w-2.5 rounded-sm bg-slate-200" />
          <span className="h-6 w-2.5 rounded-sm bg-indigo-400" />
          <span className="h-9 w-2.5 rounded-sm bg-indigo-600" />
        </div>
        <p className="mt-3 text-2xl font-black text-slate-900">100K+</p>
        <p className="mt-1 text-sm text-slate-500">People got hired</p>
      </div>

      {/* Testimonial card -- RIGHT side of the panel, like the reference */}
      <div className="absolute bottom-8 right-8 w-[340px] max-w-[calc(100%-4rem)] bg-white p-6 pt-7 shadow-xl">
        {/* Avatar overlapping the top-right corner of the card */}
        <img
          src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop"
          alt="Adam Sandler"
          className="absolute -top-7 right-6 h-14 w-14 rounded-full object-cover ring-4 ring-white"
        />

        {/* Blue quote marks + name, top-left of the card */}
        <div className="flex items-start gap-2">
          <Quote size={28} className="shrink-0 text-indigo-600" fill="currentColor" />
          <div>
            <p className="text-sm font-bold text-slate-800">Adam Sandler</p>
            <p className="text-xs text-slate-500">Lead Engineer at Canva</p>
          </div>
        </div>

        {/* Quote, bold black like the reference */}
        <p className="mt-4 text-[17px] font-bold leading-7 text-slate-900">
          &ldquo;Great platform for the job seeker that searching for new
          career heights.&rdquo;
        </p>
      </div>
    </div>
  );
}
