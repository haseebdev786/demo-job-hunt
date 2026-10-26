"use client";

import { useState } from "react";
import Link from "next/link";
import { FaFacebookF, FaInstagram, FaLinkedinIn, FaTwitter } from "react-icons/fa";

export default function Footer() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  return (
    <footer className="bg-gray-900 px-4 py-12 text-white sm:px-6 lg:py-16">
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-x-6 gap-y-10 lg:grid-cols-12 lg:gap-10">
        <div className="col-span-2 lg:col-span-4">
          <Link href="/" className="text-xl font-bold"><span className="mr-2 text-indigo-400">◉</span>JobHuntly</Link>
          <p className="mt-4 max-w-xs text-sm leading-6 text-gray-400">Great platform for the job seeker that passionate about startups. Find your dream job easier.</p>
        </div>
        <div className="lg:col-span-2">
          <h3 className="mb-4 text-sm font-semibold">About</h3>
          <div className="flex flex-col gap-3 text-sm text-gray-400">
            {[["Companies", "/companies"], ["Pricing", "/pricing"], ["Terms", "/terms"], ["Advice", "/advice"], ["Privacy Policy", "/privacy"]].map(([label, href]) => <Link href={href} key={label} className="hover:text-white">{label}</Link>)}
          </div>
        </div>
        <div className="lg:col-span-2">
          <h3 className="mb-4 text-sm font-semibold">Resources</h3>
          <div className="flex flex-col gap-3 text-sm text-gray-400">
            {[["Help Docs", "/help"], ["Guide", "/guide"], ["Updates", "/updates"], ["Contact Us", "/contact"]].map(([label, href]) => <Link href={href} key={label} className="hover:text-white">{label}</Link>)}
          </div>
        </div>
        <div className="col-span-2 lg:col-span-4">
          <h3 className="mb-4 text-sm font-semibold">Get job notifications</h3>
          <p className="mb-4 text-sm leading-6 text-gray-400">The latest job news, articles, sent to your inbox weekly.</p>
          <form onSubmit={(e) => { e.preventDefault(); setMessage("Newsletter integration is not connected yet."); }} className="flex flex-col gap-2 sm:flex-row">
            <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email Address" className="min-w-0 flex-1 bg-white px-3 py-3 text-sm text-slate-900 outline-none" />
            <button type="submit" className="bg-indigo-600 px-4 py-3 text-sm font-semibold hover:bg-indigo-700">Subscribe</button>
          </form>
          {message && <p className="mt-2 text-xs text-gray-400">{message}</p>}
        </div>
      </div>
      <div className="mx-auto mt-12 flex max-w-7xl flex-col items-center justify-between gap-5 border-t border-gray-700 pt-6 sm:flex-row">
        <p className="text-xs text-gray-400">2026 © JobHuntly. All rights reserved.</p>
        <div className="flex items-center gap-4 text-gray-400">
          <a href="https://facebook.com" aria-label="Facebook" className="hover:text-white"><FaFacebookF /></a>
          <a href="https://instagram.com" aria-label="Instagram" className="hover:text-white"><FaInstagram /></a>
          <a href="https://linkedin.com" aria-label="LinkedIn" className="hover:text-white"><FaLinkedinIn /></a>
          <a href="https://twitter.com" aria-label="Twitter" className="hover:text-white"><FaTwitter /></a>
        </div>
      </div>
    </footer>
  );
}
