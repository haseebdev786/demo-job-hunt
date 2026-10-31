"use client";

// Place this file at: components/AuthNavLinks.jsx -- REPLACES the
// previous version. No change to Navbar.jsx itself is needed.
// CHANGE (your last message): the dropdown now has ONLY 3 things:
//     - Dashboard  -> /company for company accounts, /dashboard
//                     for job-seeker accounts (same rule as the
//                     login/signup redirect)
//     - My Profile -> /company/profile for company accounts,
//                     /dashboard/profile for job-seeker accounts
//     - Logout (outline pill button, like before) -> homepage "/"
//   Change Password and My Logins History are REMOVED from this
//   menu. Their pages are NOT deleted -- /dashboard/settings and
//   /dashboard/logins still exist if you open them directly --
//   they are just no longer listed in the dropdown.
//   Header (avatar + uppercase name + Company / Job Seeker
//   subtitle), outside-click / Escape close, and the logged-out
//   Login + Sign Up links are unchanged.
//   Avatar: session.user.image when set, otherwise an initial
//   circle (no photo file in this repo).

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronDown, LayoutDashboard, LogOut, User } from "lucide-react";
import { authClient } from "@/lib/auth-client";

function Avatar({ name, image, size }) {
  const cls = size === "large" ? "h-14 w-14 text-lg" : "h-9 w-9 text-sm";
  if (image) {
    return (
      <img src={image} alt={name} className={`${cls} shrink-0 rounded-full object-cover`} />
    );
  }
  return (
    <span className={`${cls} flex shrink-0 items-center justify-center rounded-full bg-indigo-100 font-bold text-indigo-600`}>
      {(name || "?").charAt(0)}
    </span>
  );
}

export default function AuthNavLinks({ onNavigate }) {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();
  const [open, setOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    if (!open) return;
    function handleClickOutside(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) setOpen(false);
    }
    function handleEscape(e) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [open ]);

  function handleItemClick() {
    setOpen(false);
    if (onNavigate) onNavigate();
  }

  async function handleLogout() {
    if (loggingOut) return;
    setLoggingOut(true);
    try {
      await authClient.signOut();
    } finally {
      setOpen(false);
      if (onNavigate) onNavigate();
      router.push("/");
      router.refresh();
      setLoggingOut(false);
    }
  }

  if (isPending) {
    return <span className="text-sm text-slate-400">Loading...</span>;
  }

  if (!session?.user) {
    return (
      <>
        <Link
          href="/login"
          onClick={handleItemClick}
          className="text-sm font-medium text-slate-600 hover:text-indigo-600"
        >
          Login
        </Link>
        <Link
          href="/signup"
          onClick={handleItemClick}
          className="bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700"
        >
          Sign Up
        </Link>
      </>
    );
  }

  const user = session.user;
  const name = user.name || user.email || "My Account";
  const accountType = user.accountType;
  const subtitle =
    accountType === "company"
      ? "Company"
      : accountType === "job-seeker"
        ? "Job Seeker"
        : user.email || "";

  const isCompany = accountType === "company";
  const menuItems = [
    { href: isCompany ? "/company" : "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: isCompany ? "/company/profile" : "/dashboard/profile", label: "My Profile", icon: User },
  ];

  return (
    <div ref={menuRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-label="Account menu"
        className="flex items-center gap-2 text-sm font-semibold text-slate-800 hover:text-indigo-600"
      >
        <Avatar name={name} image={user.image} />
        <span className="max-w-40 truncate">{name}</span>
        <ChevronDown size={16} className={`transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div className="absolute right-0 top-12 z-50 w-80 max-w-[90vw] border border-slate-200 bg-white shadow-xl">
          {/* Header: avatar + name + role, like the reference card */}
          <div className="flex items-center gap-3 px-5 py-4">
            <Avatar name={name} image={user.image} size="large" />
            <div className="min-w-0">
              <p className="truncate text-base font-bold uppercase tracking-wide text-slate-400">
                {name}
              </p>
              {subtitle && (
                <p className="truncate text-sm text-slate-400">{subtitle}</p>
              )}
            </div>
          </div>

          <div className="border-t border-slate-100 px-2 py-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={handleItemClick}
                  className="flex items-center gap-3 px-3 py-2.5 text-sm text-slate-600 hover:bg-indigo-50 hover:text-indigo-600"
                >
                  <Icon size={18} className="shrink-0 text-slate-400" />
                  {item.label}
                </Link>
              );
            })}
          </div>

          <div className="border-t border-slate-100 px-5 py-4">
            <button
              type="button"
              onClick={handleLogout}
              disabled={loggingOut}
              className="flex items-center gap-2 rounded-full border border-indigo-200 px-5 py-2 text-sm font-semibold text-indigo-600 hover:bg-indigo-50 disabled:opacity-50"
            >
              <LogOut size={16} />
              {loggingOut ? "Logging out..." : "Logout"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
