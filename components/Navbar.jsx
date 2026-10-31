
"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import AuthNavLinks from "./AuthNavLinks";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="w-full bg-gray-50">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6">

        <div className="flex items-center gap-10">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-xl font-bold text-slate-800">
              JobHuntly
            </span>
          </Link>

          <div className="hidden items-center gap-6 md:flex">
            <Link href="/jobs" className="text-sm text-slate-600 hover:text-indigo-600">
              Find Jobs
            </Link>

            <Link href="/companies" className="text-sm text-slate-600 hover:text-indigo-600">
              Browse Companies
            </Link>
          </div>
        </div>

        <div className="hidden items-center gap-4 md:flex">
          <AuthNavLinks />
        </div>

        <button
          type="button"
          onClick={() => setMenuOpen(!menuOpen)}
          className="text-slate-800 md:hidden"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
          aria-controls="mobile-nav"
        >
          {menuOpen ? <X size={26} /> : <Menu size={26} />}
        </button>
      </div>

      {menuOpen && (
        <div
          id="mobile-nav"
          className="flex flex-col gap-5 border-t border-gray-200 bg-gray-50 px-6 py-6 md:hidden"
        >
          <Link
            href="/jobs"
            onClick={() => setMenuOpen(false)}
            className="text-sm text-slate-600"
          >
            Find Jobs
          </Link>

          <Link
            href="/companies"
            onClick={() => setMenuOpen(false)}
            className="text-sm text-slate-600"
          >
            Browse Companies
          </Link>

          <div className="border-t border-gray-200"></div>

          <AuthNavLinks onNavigate={() => setMenuOpen(false)} />
        </div>
      )}
    </nav>
  );
}
