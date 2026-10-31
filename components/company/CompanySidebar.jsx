"use client";

// Place this file at: components/company/CompanySidebar.jsx
// Company dashboard sidebar (3.1 Dashboard Company). This is a
// SEPARATE sidebar from the applicant dashboard sidebar
// (components/dashboard/Sidebar.jsx) -- do NOT merge them. A company
// user sees this sidebar, a job-seeker sees the applicant sidebar.
// Links are the sidebar labels from the 3.1 screenshot:
//   Dashboard, Messages, Company Profile, All Applicants,
//   Job Listing, My Schedule, then SETTINGS: Settings, Help Center.
// Only Dashboard (/company) is built in this delivery. The other
// company pages (/company/messages, /company/profile,
// /company/applicants, /company/jobs, /company/schedule,
// /company/settings, /company/help) will 404 until they are built --
// they are the next company pages, to be built from their screenshots,
// exactly like the applicant dashboard pages were built one by one.
// User at the bottom is the demo company user from the screenshot
// (Maria Kelly, Nomad). It is passed in as a prop from the company
// layout -- when the company dashboard is connected to the Better
// Auth session, the layout should pass the logged-in company user
// here instead of this demo user.

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  MessageSquare,
  Building2,
  Users,
  Briefcase,
  Calendar,
  Settings,
  HelpCircle,
  Menu,
  X,
} from "lucide-react";

const links = [
  { label: "Dashboard", href: "/company", icon: LayoutDashboard },
  { label: "Messages", href: "/company/messages", icon: MessageSquare, badge: 1 },
  { label: "Company Profile", href: "/company/profile", icon: Building2 },
  { label: "All Applicants", href: "/company/applicants", icon: Users },
  { label: "Job Listing", href: "/company/jobs", icon: Briefcase },
  { label: "My Schedule", href: "/company/schedule", icon: Calendar },
];

const settingsLinks = [
  { label: "Settings", href: "/company/settings", icon: Settings },
  { label: "Help Center", href: "/company/help", icon: HelpCircle },
];

function SidebarContent({ user, pathname, onNavigate }) {
  return (
    <div className="flex h-full flex-col bg-white">
      <Link href="/" className="flex items-center gap-2 px-6 pb-6 pt-6" onClick={onNavigate}>
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-600 text-sm font-black text-white">
          J
        </span>
        <span className="text-lg font-black tracking-tight text-slate-800">JobHuntly</span>
      </Link>

      <nav className="flex-1 space-y-1 px-3">
        {links.map((link) => {
          const Icon = link.icon;
          const active = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              onClick={onNavigate}
              className={`flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium ${
                active
                  ? "border-l-4 border-indigo-600 bg-indigo-50 text-indigo-600"
                  : "border-l-4 border-transparent text-slate-500 hover:bg-slate-50"
              }`}
            >
              <Icon size={18} />
              <span className="flex-1">{link.label}</span>
              {link.badge ? (
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-indigo-600 text-[10px] font-bold text-white">
                  {link.badge}
                </span>
              ) : null}
            </Link>
          );
        })}

        <p className="px-3 pb-1 pt-6 text-[11px] font-bold tracking-widest text-slate-400">SETTINGS</p>
        {settingsLinks.map((link) => {
          const Icon = link.icon;
          const active = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              onClick={onNavigate}
              className={`flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium ${
                active
                  ? "border-l-4 border-indigo-600 bg-indigo-50 text-indigo-600"
                  : "border-l-4 border-transparent text-slate-500 hover:bg-slate-50"
              }`}
            >
              <Icon size={18} />
              {link.label}
            </Link>
          );
        })}
      </nav>

      <div className="flex items-center gap-3 border-t border-slate-100 px-6 py-4">
        {user?.avatarUrl ? (
          <img src={user.avatarUrl} alt={user.name || "User"} className="h-10 w-10 rounded-full object-cover" />
        ) : (
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-100 text-sm font-bold text-indigo-600">
            {(user?.name || "M").charAt(0)}
          </span>
        )}
        <div className="min-w-0">
          <p className="truncate text-sm font-bold text-slate-800">{user?.name || "Maria Kelly"}</p>
          <p className="truncate text-xs text-slate-500">{user?.email || "mariakelly@email.com"}</p>
        </div>
      </div>
    </div>
  );
}

export default function CompanySidebar({ user }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        aria-label="Open menu"
        onClick={() => setOpen(true)}
        className="fixed left-4 top-4 z-40 border border-slate-200 bg-white p-2 text-slate-700 lg:hidden"
      >
        <Menu size={20} />
      </button>

      <aside className="hidden w-64 shrink-0 border-r border-slate-100 lg:block">
        <SidebarContent user={user} pathname={pathname} />
      </aside>

      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            aria-label="Close menu"
            onClick={() => setOpen(false)}
            className="absolute inset-0 bg-slate-950/50"
          />
          <aside className="absolute inset-y-0 left-0 w-72 bg-white shadow-xl">
            <button
              type="button"
              aria-label="Close menu"
              onClick={() => setOpen(false)}
              className="absolute right-3 top-3 z-10 p-1 text-slate-500"
            >
              <X size={20} />
            </button>
            <SidebarContent user={user} pathname={pathname} onNavigate={() => setOpen(false)} />
          </aside>
        </div>
      )}
    </>
  );
}
