"use client";

// Place this file at: components/company/CompanyMessagesPage.jsx
// Company Messages (3.2), inside the company layout.
// Left: search box + conversation list (Jan Mayer first, unread dot).
// Right: selected candidate header (avatar, name, Designer Candidate,
// View Profile link), centre profile card, chat messages, reply box.
// View Profile links to that candidate's Applicant Details page
// (/company/applicants/<id>) -- for candidates who are not in the
// applicants list, the link goes to /company/applicants instead.
// Replies are LOCAL state only for now (not saved to MongoDB),
// like the Help Center votes. Company name in the page header
// comes from props (logged-in session, see the route file).

import { useMemo, useState } from "react";
import Link from "next/link";
import { Pencil, Search, Send, Smile, Star } from "lucide-react";
import { companyConversations } from "@/lib/company-messages-data";

function Avatar({ name, size = "md" }) {
  const cls = size === "lg" ? "h-16 w-16 text-xl" : "h-10 w-10 text-sm";
  return (
    <span className={`flex shrink-0 items-center justify-center rounded-full bg-indigo-100 font-bold text-indigo-600 ${cls}`}>
      {name.charAt(0)}
    </span>
  );
}

export default function CompanyMessagesPage({ companyName = "Nomad", companyInitial = "N" }) {
  const [selectedId, setSelectedId] = useState("jan-mayer");
  const [search, setSearch] = useState("");
  const [reply, setReply] = useState("");
  const [localMessages, setLocalMessages] = useState({});

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return companyConversations;
    return companyConversations.filter(
      (c) => c.name.toLowerCase().includes(q) || c.lastMessage.toLowerCase().includes(q)
    );
  }, [search]);

  const selected = companyConversations.find((c) => c.id === selectedId) || companyConversations[0];
  const messages = [...selected.messages, ...(localMessages[selected.id] || [])];

  function handleSend(e) {
    e.preventDefault();
    if (!reply.trim()) return;
    setLocalMessages((prev) => ({
      ...prev,
      [selected.id]: [...(prev[selected.id] || []), { from: "company", text: reply.trim(), time: "Just now" }],
    }));
    setReply("");
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

      <h2 className="mt-8 text-xl font-bold text-slate-800">Messages</h2>

      <div className="mt-6 grid gap-0 border border-slate-200 bg-white lg:grid-cols-[320px_minmax(0,1fr)]">
        {/* Conversation list */}
        <div className="border-b border-slate-200 lg:border-b-0 lg:border-r">
          <div className="flex items-center gap-2 border-b border-slate-200 px-4 py-3">
            <Search size={18} className="text-slate-400" />
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search messages"
              className="w-full text-sm outline-none placeholder:text-slate-400"
            />
          </div>
          <div className="max-h-[600px] overflow-y-auto">
            {filtered.map((c) => (
              <button
                key={c.id}
                type="button"
                onClick={() => setSelectedId(c.id)}
                className={`flex w-full items-center gap-3 px-4 py-3 text-left ${
                  selected.id === c.id ? "bg-indigo-50" : "hover:bg-slate-50"
                }`}
              >
                <Avatar name={c.name} />
                <span className="min-w-0 flex-1">
                  <span className="flex items-center justify-between gap-2">
                    <span className="truncate text-sm font-bold text-slate-800">{c.name}</span>
                    <span className="shrink-0 text-[11px] text-slate-400">{c.time}</span>
                  </span>
                  <span className="mt-0.5 block truncate text-xs text-slate-500">{c.lastMessage}</span>
                </span>
                {c.unread && selected.id !== c.id && (
                  <span className="h-2 w-2 shrink-0 rounded-full bg-indigo-600" />
                )}
              </button>
            ))}
            {filtered.length === 0 && (
              <p className="px-4 py-6 text-sm text-slate-500">No messages found.</p>
            )}
          </div>
        </div>

        {/* Chat detail */}
        <div className="flex min-h-[500px] flex-col">
          <div className="flex items-center justify-between gap-4 border-b border-slate-200 px-6 py-4">
            <div className="flex items-center gap-3">
              <Avatar name={selected.name} />
              <div>
                <p className="font-bold text-slate-800">{selected.name}</p>
                <p className="text-xs text-slate-500">{selected.role}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button type="button" aria-label="Edit" className="text-slate-400 hover:text-slate-800">
                <Pencil size={18} />
              </button>
              <button type="button" aria-label="Star" className="text-slate-400 hover:text-slate-800">
                <Star size={18} />
              </button>
              <Link href="/company/applicants" className="text-sm font-semibold text-indigo-600">
                View Profile
              </Link>
            </div>
          </div>

          {/* Centre profile card, like the screenshot */}
          <div className="flex flex-col items-center border-b border-slate-100 px-6 py-6 text-center">
            <Avatar name={selected.name} size="lg" />
            <p className="mt-3 font-bold text-slate-800">{selected.name}</p>
            <p className="text-xs text-slate-500">{selected.role}</p>
            <span className="mt-3 border border-slate-200 px-3 py-1 text-xs text-slate-500">Today</span>
          </div>

          <div className="flex-1 space-y-4 px-6 py-6">
            {messages.map((m, i) => (
              <div key={i} className={`flex gap-3 ${m.from === "company" ? "flex-row-reverse" : ""}`}>
                {m.from === "candidate" ? (
                  <Avatar name={selected.name} />
                ) : (
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-sm font-bold text-emerald-600">
                    {companyInitial}
                  </span>
                )}
                <div className={`max-w-[75%] ${m.from === "company" ? "text-right" : ""}`}>
                  <div
                    className={`inline-block px-4 py-3 text-sm leading-6 ${
                      m.from === "company" ? "bg-indigo-50 text-slate-700" : "bg-slate-50 text-slate-700"
                    }`}
                  >
                    {m.text}
                  </div>
                  <p className="mt-1 text-[11px] text-slate-400">{m.time}</p>
                </div>
              </div>
            ))}
          </div>

          <form onSubmit={handleSend} className="flex items-center gap-2 border-t border-slate-200 px-4 py-3">
            <input
              value={reply}
              onChange={(e) => setReply(e.target.value)}
              placeholder="Reply message"
              className="w-full border border-slate-200 px-4 py-2.5 text-sm outline-none placeholder:text-slate-400 focus:border-indigo-500"
            />
            <button type="button" aria-label="Emoji" className="p-2 text-slate-400 hover:text-slate-800">
              <Smile size={20} />
            </button>
            <button type="submit" aria-label="Send" className="bg-indigo-600 p-2.5 text-white hover:bg-indigo-700">
              <Send size={18} />
            </button>
          </form>
          <p className="border-t border-slate-100 px-4 py-2 text-[11px] text-slate-400">
            Replies here are local only for now -- they are not saved to MongoDB yet.
          </p>
        </div>
      </div>
    </div>
  );
}
