"use client";

// Place this file at: components/dashboard/MessagesChat.jsx -- REPLACES
// the previous version.
// CHANGE in this version (your last message): CHAT SCROLL, and
// always show the LAST message on open.
//   BEFORE: the messages list had no height limit, so it grew the
//   whole page and the whole SCREEN scrolled up/down. Opening a
//   chat showed the TOP (profile intro) first.
//   AFTER:
//   - The whole Messages section fits the screen height
//     (h-[100dvh] outer, grid flex-1 min-h-0). The PAGE itself
//     does not scroll.
//   - Only the chat area scrolls up/down: the conversation list
//     scrolls on its own, and the chat detail's middle area
//     (profile intro + day divider + messages) scrolls on its own.
//     The detail header and the reply box stay fixed at top and
//     bottom, they do not scroll away.
//   - On opening a conversation, and on every new message, the
//     chat scrolls to the BOTTOM, so the LAST message is always
//     visible -- not the top. On conversation change the jump is
//     instant (no scroll animation from the top); on a new
//     message in the same chat it is a smooth scroll.
//   Nothing else changed: conversations/messages still come from
//   props (MongoDB), reply still POSTs to /api/dashboard/messages.

import { useEffect, useMemo, useRef, useState } from "react";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import {
  Search,
  Star,
  MoreHorizontal,
  Paperclip,
  Smile,
  Send,
  ChevronDown,
  ArrowLeft,
} from "lucide-react";

function initials(name) {
  return String(name || "?")
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("");
}

function Avatar({ name, avatarUrl, size }) {
  const sizeClass = size === "lg" ? "h-20 w-20 text-2xl" : "h-11 w-11 text-sm";
  if (avatarUrl) {
    return (
      <img
        src={avatarUrl}
        alt={name}
        className={`${sizeClass} shrink-0 rounded-full object-cover`}
      />
    );
  }
  return (
    <span
      className={`${sizeClass} flex shrink-0 items-center justify-center rounded-full bg-indigo-100 font-bold text-indigo-600`}
    >
      {initials(name)}
    </span>
  );
}

export default function MessagesChat({ initialData }) {
  const [conversations, setConversations] = useState(initialData.conversations || []);
  const [activeId, setActiveId] = useState(
    initialData.conversations?.[0]?.id || null
  );
  const [search, setSearch] = useState("");
  const [draft, setDraft] = useState("");
  const [sending, setSending] = useState(false);
  const [mobileChatOpen, setMobileChatOpen] = useState(false);
  const chatScrollRef = useRef(null);
  const prevActiveIdRef = useRef(null);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return conversations;
    return conversations.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        (c.lastMessage || "").toLowerCase().includes(q)
    );
  }, [conversations, search]);

  const active = conversations.find((c) => c.id === activeId) || null;
  const activeMessageCount = active?.messages?.length || 0;

  // Always show the LAST message: scroll the chat area (not the
  // page) to its bottom whenever the conversation changes, on
  // first open, and whenever a message is added. Conversation
  // change = instant jump (so you never see the top first);
  // new message in the same chat = smooth scroll.
  useEffect(() => {
    const el = chatScrollRef.current;
    if (!el || !active) return;
    const changedConversation = prevActiveIdRef.current !== active.id;
    prevActiveIdRef.current = active.id;
    el.scrollTo({ top: el.scrollHeight, behavior: changedConversation ? "auto" : "smooth" });
  }, [active, activeMessageCount]);

  function selectConversation(id) {
    setActiveId(id);
    setMobileChatOpen(true);
    // Mark as read locally (the unread badge in the sidebar is still
    // static -- see the note in the delivery message).
    setConversations((prev) =>
      prev.map((c) => (c.id === id ? { ...c, unreadCount: 0 } : c))
    );
  }

  async function sendReply(event) {
    event.preventDefault();
    const text = draft.trim();
    if (!text || !active) return;
    setDraft("");
    setSending(true);

    const localMessage = {
      id: `local-${Date.now()}`,
      conversationId: active.id,
      sender: "you",
      senderName: "You",
      text,
      sentAt: new Date().toISOString(),
      timeLabel: "Just now",
    };

    // Optimistic update: show it straight away.
    setConversations((prev) =>
      prev.map((c) =>
        c.id === active.id
          ? { ...c, messages: [...(c.messages || []), localMessage], lastMessage: text, timeLabel: "Just now" }
          : c
      )
    );

    try {
      const res = await fetch("/api/dashboard/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ conversationId: active.id, text }),
      });
      if (!res.ok) {
        // No database / API error: the message stays visible locally
        // for this session, but it is NOT saved. The page shows the
        // "not connected" notice in that case.
        return;
      }
      const saved = await res.json();
      // Replace the optimistic message with the saved one.
      setConversations((prev) =>
        prev.map((c) =>
          c.id === active.id
            ? {
                ...c,
                messages: c.messages.map((m) => (m.id === localMessage.id ? saved.message : m)),
              }
            : c
        )
      );
    } catch {
      // Offline / API unreachable: keep the local message only.
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="flex h-[100dvh] flex-col px-4 py-8 sm:px-6 lg:px-10">
      {/* Header: same as Dashboard overview -- bell outside dropdown, NO Back to homepage.
          Scroll fix from the previous version is kept: this header is shrink-0,
          the chat area below is the only scrolling part. */}
      <DashboardHeader title="Messages" />

      {/* Empty state -- honest, no fake conversations */}
      {conversations.length === 0 && (
        <div className="mt-8 border border-slate-200 bg-white px-5 py-8 text-center">
          <p className="font-bold text-slate-800">No messages yet.</p>
          <p className="mx-auto mt-1 max-w-md text-sm text-slate-500">
            When a recruiter messages you, their conversation will appear here.
            {initialData.connected
              ? " Messages are read from the conversations and messages collections in MongoDB."
              : " Connect MongoDB and run node scripts/seed-messages.js to see the reference conversations."}
          </p>
        </div>
      )}

      {conversations.length > 0 && (
        <div className="mt-8 grid min-h-0 flex-1 overflow-hidden border border-slate-200 bg-white lg:grid-cols-[360px_1fr]">
          {/* Conversation list -- its own internal scroll, page does not scroll */}
          <div className={`${mobileChatOpen ? "hidden" : "flex"} min-h-0 flex-col border-b border-slate-200 lg:flex lg:border-b-0 lg:border-r`}>
            <div className="shrink-0 border-b border-slate-100 p-4">
              <label className="flex items-center gap-2 border border-slate-200 px-3 py-2">
                <Search size={16} className="shrink-0 text-slate-400" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search messages"
                  className="w-full text-sm outline-none placeholder:text-slate-400"
                />
              </label>
            </div>
            <div className="min-h-0 flex-1 overflow-y-auto">
              {filtered.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => selectConversation(c.id)}
                  className={`flex w-full items-center gap-3 border-b border-slate-100 px-4 py-3 text-left ${
                    c.id === activeId ? "bg-indigo-50" : "hover:bg-slate-50"
                  }`}
                >
                  <Avatar name={c.name} avatarUrl={c.avatarUrl} />
                  <span className="min-w-0 flex-1">
                    <span className="flex items-center gap-1.5">
                      <span className="truncate text-sm font-bold text-slate-800">{c.name}</span>
                      {c.unreadCount > 0 && (
                        <span className="h-2 w-2 shrink-0 rounded-full bg-indigo-600" />
                      )}
                    </span>
                    <span className="block truncate text-xs text-slate-500">{c.lastMessage}</span>
                  </span>
                  <span className="shrink-0 text-xs text-slate-400">{c.timeLabel}</span>
                </button>
              ))}
              {filtered.length === 0 && (
                <p className="px-4 py-6 text-sm text-slate-500">
                  No conversation matches &ldquo;{search}&rdquo;.
                </p>
              )}
            </div>
          </div>

          {/* Chat detail -- header + reply box stay fixed, middle scrolls */}
          {active && (
            <div className={`${mobileChatOpen ? "flex" : "hidden"} min-h-0 flex-col lg:flex`}>
              {/* Detail header */}
              <div className="flex shrink-0 items-center gap-3 border-b border-slate-100 px-5 py-4">
                <button
                  type="button"
                  onClick={() => setMobileChatOpen(false)}
                  className="p-1 text-slate-500 lg:hidden"
                  aria-label="Back to messages"
                >
                  <ArrowLeft size={20} />
                </button>
                <Avatar name={active.name} avatarUrl={active.avatarUrl} />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-bold text-slate-800">{active.name}</p>
                  <p className="truncate text-xs text-slate-500">
                    {active.role && active.company
                      ? `${active.role} at ${active.company}`
                      : active.role || active.company || "Direct message"}
                  </p>
                </div>
                <button type="button" className="p-2 text-slate-400 hover:text-slate-600" aria-label="Search in conversation">
                  <Search size={18} />
                </button>
                <button type="button" className="p-2 text-slate-400 hover:text-slate-600" aria-label="Star conversation">
                  <Star size={18} />
                </button>
                <button type="button" className="p-2 text-slate-400 hover:text-slate-600" aria-label="More options">
                  <MoreHorizontal size={18} />
                </button>
              </div>

              {/* Scrollable chat area ONLY -- this is what scrolls up/down.
                  The page itself does not scroll, and this container is
                  scrolled to the bottom on open / new message. */}
              <div ref={chatScrollRef} className="min-h-0 flex-1 overflow-y-auto">
              {/* Profile intro */}
              <div className="flex flex-col items-center px-5 pb-2 pt-8 text-center">
                <Avatar name={active.name} avatarUrl={active.avatarUrl} size="lg" />
                <p className="mt-3 text-base font-bold text-slate-800">{active.name}</p>
                <p className="text-sm text-slate-500">
                  {active.role && active.company
                    ? `${active.role} at ${active.company}`
                    : active.role || active.company || ""}
                </p>
                <p className="mt-1 text-xs text-slate-400">
                  This is the very beginning of your direct message with {active.name}
                </p>
              </div>

              {/* Day divider */}
              <div className="flex items-center gap-3 px-5 py-4">
                <span className="h-px flex-1 bg-slate-100" />
                <button
                  type="button"
                  className="flex items-center gap-1 border border-slate-200 px-3 py-1 text-xs font-medium text-slate-600"
                >
                  Today
                  <ChevronDown size={14} />
                </button>
                <span className="h-px flex-1 bg-slate-100" />
              </div>

              {/* Messages */}
              <div className="space-y-5 px-5 pb-4">
                {(active.messages || []).map((m) => {
                  if (m.sender === "you") {
                    return (
                      <div key={m.id} className="flex items-end justify-end gap-3">
                        <div className="max-w-[75%]">
                          <div className="bg-indigo-50 px-4 py-3 text-sm leading-6 text-slate-700">
                            {m.text}
                          </div>
                          <p className="mt-1 text-right text-xs text-slate-400">{m.timeLabel}</p>
                        </div>
                        <Avatar name={initialData.user?.name || "You"} avatarUrl={initialData.user?.avatarUrl} />
                      </div>
                    );
                  }
                  return (
                    <div key={m.id} className="flex items-end gap-3">
                      <Avatar name={m.senderName || active.name} avatarUrl={active.avatarUrl} />
                      <div className="max-w-[75%]">
                        <p className="mb-1 text-xs font-bold text-slate-700">
                          {m.senderName || active.name}
                        </p>
                        <div className="border border-slate-200 bg-white px-4 py-3 text-sm leading-6 text-slate-700">
                          {m.text}
                        </div>
                        <p className="mt-1 text-xs text-slate-400">{m.timeLabel}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
              </div>

              {/* Reply box -- fixed at the bottom, does not scroll away */}
              <form onSubmit={sendReply} className="shrink-0 border-t border-slate-100 p-4">
                <div className="flex items-center gap-2 border border-slate-200 px-3 py-2">
                  <button type="button" className="p-1 text-slate-400 hover:text-slate-600" aria-label="Attach file">
                    <Paperclip size={18} />
                  </button>
                  <input
                    type="text"
                    value={draft}
                    onChange={(e) => setDraft(e.target.value)}
                    placeholder="Reply message"
                    className="w-full text-sm outline-none placeholder:text-slate-400"
                  />
                  <button type="button" className="p-1 text-slate-400 hover:text-slate-600" aria-label="Emoji">
                    <Smile size={18} />
                  </button>
                  <button
                    type="submit"
                    disabled={sending || !draft.trim()}
                    className="flex h-9 w-9 shrink-0 items-center justify-center bg-indigo-600 text-white disabled:opacity-50"
                    aria-label="Send message"
                  >
                    <Send size={16} />
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
