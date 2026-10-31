// Place this file at: components/dashboard/DashboardWidgets.jsx -- REPLACES
// the previous version. ONLY the InterviewsCard is changed, everything
// else (StatCard, StatusDonut, ApplicationsHistory) is unchanged.
//
// FIX for the Upcoming Interviews screenshot you sent:
//   The highlighted interview (Alex Morgan, 10:30 AM) was overflowing
//   the card on the right and was misaligned with the other rows.
//   WHY: every row was time (w-16) + a flex-1 line + a flex-1
//   name/box. On the 3-column dashboard the card is narrow
//   (~300px), so the highlighted box only got ~100px of width,
//   but its avatar + name + role need ~170px. Flex items do not
//   shrink below their content by default, so the box pushed
//   past the card's padding / border on the right, exactly as in
//   your screenshot.
//   FIX:
//   - Highlighted rows NO LONGER render the middle line. They are
//     now time + highlighted box only, so the box gets the full
//     remaining width and fits inside the card padding.
//   - The highlighted box and the plain name both get min-w-0 and
//     truncate, so long names/roles wrap / cut instead of pushing
//     the card wider.
//   - Non-highlighted rows keep time + line + name, unchanged
//     otherwise, so Jan Mayer / Emma Wilson / Joe Bartmann /
//     Ally Wales still line up as before, just without overflow.

import Link from "next/link";
import { MoreHorizontal, ChevronLeft, ChevronRight } from "lucide-react";

export function StatCard({ title, value, icon }) {
  return (
    <div className="border border-slate-200 bg-white p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm text-slate-500">{title}</p>
          <p className="mt-2 text-4xl font-black text-slate-800">{value}</p>
        </div>
        <span className="text-slate-300">{icon}</span>
      </div>
    </div>
  );
}

export function StatusDonut({ interviewedPercent, unsuitablePercent }) {
  // SVG donut with pathLength=100, so percentages map directly to the arc.
  // No chart library needed. Arc starts at the top (offset 25).
  return (
    <div className="border border-slate-200 bg-white p-5">
      <h3 className="text-sm font-bold text-slate-800">Jobs Applied Status</h3>
      <div className="mt-4 flex items-center gap-5">
        <div className="relative h-28 w-28 shrink-0">
          <svg viewBox="0 0 100 100" className="h-full w-full -rotate-0">
            <circle cx="50" cy="50" r="40" fill="none" stroke="#E2E8F0" strokeWidth="12" />
            <circle
              cx="50"
              cy="50"
              r="40"
              fill="none"
              stroke="#4F46E5"
              strokeWidth="12"
              strokeLinecap="round"
              pathLength="100"
              strokeDasharray={`${interviewedPercent} 100`}
              strokeDashoffset="25"
              transform="rotate(-90 50 50)"
            />
          </svg>
        </div>
        <ul className="space-y-2 text-sm text-slate-500">
          <li className="flex items-center gap-2">
            <span className="h-3 w-3 bg-indigo-600" />
            {unsuitablePercent}% Unsuitable
          </li>
          <li className="flex items-center gap-2">
            <span className="h-3 w-3 bg-slate-200" />
            {interviewedPercent}% Interviewed
          </li>
        </ul>
      </div>
      <Link href="/dashboard/applications" className="mt-4 inline-block text-sm font-semibold text-indigo-600">
        View All Applications →
      </Link>
    </div>
  );
}

export function InterviewsCard({ interviews, dateLabel }) {
  return (
    <div className="border border-slate-200 bg-white p-5">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold text-slate-800">Upcoming Interviews</h3>
        <div className="flex gap-1 text-slate-400">
          <button type="button" aria-label="Previous day" className="p-1 hover:text-indigo-600">
            <ChevronLeft size={16} />
          </button>
          <button type="button" aria-label="Next day" className="p-1 hover:text-indigo-600">
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
      <p className="mt-1 text-xs text-slate-500">{dateLabel}</p>

      {interviews.length === 0 ? (
        <p className="mt-6 text-sm text-slate-500">No upcoming interviews yet.</p>
      ) : (
        <ul className="mt-5 space-y-4">
          {interviews.map((interview) => (
            <li key={interview.id} className="flex min-w-0 items-start gap-4">
              <span className="w-16 shrink-0 pt-1 text-xs text-slate-500">{interview.time}</span>
              {interview.highlighted ? (
                <div className="flex min-w-0 flex-1 items-center gap-3 rounded-md bg-indigo-50 p-3">
                  {interview.avatarUrl ? (
                    <img src={interview.avatarUrl} alt={interview.name} className="h-10 w-10 shrink-0 rounded-full object-cover" />
                  ) : (
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-sm font-bold text-indigo-600">
                      {interview.name.charAt(0)}
                    </span>
                  )}
                  <div className="min-w-0">
                    <p className="truncate text-sm font-bold text-slate-800">{interview.name}</p>
                    <p className="truncate text-xs text-slate-500">
                      {interview.role} at {interview.company}
                    </p>
                  </div>
                </div>
              ) : (
                <>
                  <span className="mt-1.5 h-px min-w-0 flex-1 bg-slate-100" />
                  <span className="min-w-0 flex-1 truncate pt-1 text-xs text-slate-400">{interview.name}</span>
                </>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

const statusStyles = {
  "In Review": "border-orange-300 bg-orange-50 text-orange-500",
  Shortlisted: "border-indigo-300 bg-indigo-50 text-indigo-600",
  Declined: "border-red-300 bg-red-50 text-red-500",
  Interviewed: "border-emerald-300 bg-emerald-50 text-emerald-600",
  Unsuitable: "border-slate-300 bg-slate-50 text-slate-500",
};

export function ApplicationsHistory({ applications }) {
  return (
    <div className="border border-slate-200 bg-white p-5">
      <h3 className="text-sm font-bold text-slate-800">Recent Applications History</h3>

      {applications.length === 0 ? (
        <p className="mt-6 text-sm text-slate-500">
          No applications yet. Applications you submit will appear here automatically once they are saved in MongoDB.
        </p>
      ) : (
        <ul className="mt-5 space-y-3">
          {applications.map((app) => (
            <li
              key={app.id}
              className="flex flex-wrap items-center gap-4 bg-gray-50 px-4 py-3"
            >
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-white text-xl font-black text-indigo-600">
                {app.company.charAt(0)}
              </span>
              <div className="min-w-0 flex-1">
                <Link href="/dashboard/applications" className="block truncate text-sm font-bold text-slate-800 hover:text-indigo-600">
                  {app.title}
                </Link>
                <p className="truncate text-xs text-slate-500">
                  {app.company} · {app.location} · {app.type}
                </p>
              </div>
              <div className="hidden sm:block">
                <p className="text-xs text-slate-400">Date Applied</p>
                <p className="text-xs font-medium text-slate-600">{app.dateApplied}</p>
              </div>
              <span
                className={`rounded-full border px-3 py-1 text-[11px] font-medium ${
                  statusStyles[app.status] || statusStyles.Unsuitable
                }`}
              >
                {app.status}
              </span>
              <button type="button" aria-label="More options" className="p-1 text-slate-400 hover:text-slate-700">
                <MoreHorizontal size={18} />
              </button>
            </li>
          ))}
        </ul>
      )}

      <div className="mt-5 text-center">
        <Link href="/dashboard/applications" className="text-sm font-semibold text-indigo-600">
          View all applications history →
        </Link>
      </div>
    </div>
  );
}
