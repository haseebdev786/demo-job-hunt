"use client";

// Place this file at: components/dashboard/NotificationsPanel.jsx
// Bell button + Notifications panel for the Dashboard page (2.13).
// The bell sits in the dashboard header, next to "Back to homepage".
// Clicking it opens the panel on the right, overlapping the dashboard
// content, exactly like the reference screenshot. Clicking the bell
// again, clicking outside the panel, or pressing Escape closes it.
// "Mark all as read" calls POST /api/dashboard/notifications and
// clears the unread badge and the "New" badge -- it writes to
// MongoDB, it is not just a local hide.
//
// Avatars: the reference shows photos. No photo files are in this
// repo, so the panel shows an initial-letter circle (or
// actorAvatarUrl from MongoDB when one is set for that actor).

import { useEffect, useId, useRef, useState } from "react";
import { Bell, Calendar, Clock, X } from "lucide-react";

function ActorAvatar({ name, avatarUrl }) {
  if (avatarUrl) {
    return (
      <img src={avatarUrl} alt={name} className="h-10 w-10 shrink-0 rounded-full object-cover" />
    );
  }
  return (
    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-sm font-bold text-indigo-600">
      {(name || "?").charAt(0)}
    </span>
  );
}

function Badge({ text, tone }) {
  if (!text) return null;
  if (tone === "green") {
    return <span className="text-xs font-semibold text-emerald-600">{text}</span>;
  }
  return (
    <span className="inline-block rounded-full bg-indigo-100 px-2 py-0.5 text-[11px] font-bold text-indigo-600">
      {text}
    </span>
  );
}

export default function NotificationsPanel({ initialNotifications, initialUnreadCount, connected }) {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState(initialNotifications || []);
  const [unreadCount, setUnreadCount] = useState(initialUnreadCount || 0);
  const [marking, setMarking] = useState(false);
  const [error, setError] = useState("");
  const panelRef = useRef(null);
  const buttonRef = useRef(null);
  const panelId = useId();

  useEffect(() => {
    if (!open) return;
    function handleClickOutside(e) {
      if (panelRef.current && !panelRef.current.contains(e.target)) setOpen(false);
    }
    function handleEscape(e) {
      if (e.key === "Escape") {
        setOpen(false);
        buttonRef.current?.focus();
      }
    }
    document.addEventListener("pointerdown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("pointerdown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [open ]);

  async function handleMarkAllRead() {
    if (marking) return;
    setError("");
    setMarking(true);
    try {
      const res = await fetch("/api/dashboard/notifications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "mark-all-read" }),
      });
      if (!res.ok) throw new Error("Unable to update notifications");
      if (res.ok) {
        setNotifications((prev) => prev.map((n) => ({ ...n, read: true, badge: n.badge === "New" ? "" : n.badge })));
        setUnreadCount(0);
      }
    } catch {
      setError("Could not mark notifications as read. Please try again.");
    } finally {
      setMarking(false);
    }
  }

  return (
    <div ref={panelRef} className="static sm:relative">
      <button
        ref={buttonRef}
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label="Notifications"
        aria-expanded={open}
        aria-controls={open ? panelId : undefined}
        aria-haspopup="dialog"
        className="relative flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 hover:text-indigo-600 focus-visible:outline-2 focus-visible:outline-indigo-600"
      >
        <Bell size={18} />
        {unreadCount > 0 && (
          <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-indigo-600 px-1 text-[10px] font-bold text-white">
            {unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div id={panelId} role="dialog" aria-labelledby={`${panelId}-title`} className="absolute right-0 top-full z-50 mt-2 flex max-h-[min(70dvh,560px)] w-[380px] max-w-[calc(100vw-2rem)] flex-col overflow-hidden rounded-lg border border-slate-200 bg-white shadow-xl">
          <div className="flex shrink-0 flex-wrap items-center justify-between gap-2 px-4 py-3">
            <h2 id={`${panelId}-title`} className="text-base font-bold text-slate-800">Notifications</h2>
            <button type="button" aria-label="Close notifications" onClick={() => { setOpen(false); buttonRef.current?.focus(); }} className="ml-auto flex h-9 w-9 items-center justify-center rounded text-slate-500 hover:bg-slate-100">
              <X size={18} />
            </button>
            <button
              type="button"
              onClick={handleMarkAllRead}
              disabled={marking || !connected || unreadCount === 0}
              className="w-full text-left text-xs font-semibold text-indigo-600 hover:text-indigo-700 disabled:opacity-40"
            >
              {marking ? "Saving..." : "Mark all as read"}
            </button>
          </div>

          {error && <p role="alert" className="px-4 pb-3 text-xs text-red-600">{error}</p>}
          <div className="min-h-0 overflow-y-auto overscroll-contain border-t border-slate-100">
            {!connected && (
              <p className="px-5 py-6 text-sm text-slate-500">
                Notifications are unavailable right now. Please refresh and try again.
              </p>
            )}
            {connected && notifications.length === 0 && (
              <p className="px-5 py-6 text-sm text-slate-500">No notifications yet.</p>
            )}
            {notifications.map((n) => (
              <div key={n.id} className="border-b border-slate-100 px-5 py-4 last:border-b-0">
                <div className="flex gap-3">
                  <ActorAvatar name={n.actorName} avatarUrl={n.actorAvatarUrl} />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm leading-5 text-slate-700">
                      <span className="font-bold text-slate-800">{n.actorName}</span>
                      {n.actorCompany ? ` from ${n.actorCompany} ` : " "}
                      {n.text}
                    </p>
                    <div className="mt-1">
                      <Badge text={n.badge} tone={n.badgeTone} />
                    </div>
                    {n.kind !== "interview-detail" && (
                      <p className="mt-1 text-xs text-slate-400">{n.relativeTime}</p>
                    )}
                  </div>
                </div>

                {n.kind === "interview-detail" && n.detail && (
                  <div className="ml-[52px] mt-3 border-l-2 border-indigo-600 pl-3">
                    <p className="text-sm font-bold text-slate-800">{n.detail.title}</p>
                    <p className="mt-0.5 text-xs text-slate-500">{n.detail.role}</p>
                    <div className="mt-2 space-y-1 text-xs text-slate-600">
                      {n.detail.date && (
                        <p className="flex items-center gap-1.5">
                          <Calendar size={13} className="text-slate-400" />
                          <span className="font-semibold">Date</span> {n.detail.date}
                        </p>
                      )}
                      {n.detail.time && (
                        <p className="flex items-center gap-1.5">
                          <Clock size={13} className="text-slate-400" />
                          <span className="font-semibold">Time</span> {n.detail.time}
                        </p>
                      )}
                    </div>
                    <div className="mt-3 flex items-center gap-2">
                      <span className="flex h-7 w-7 items-center justify-center rounded-full bg-indigo-100 text-xs font-bold text-indigo-600">
                        {(n.detail.candidateName || "?").charAt(0)}
                      </span>
                      <span>
                        <span className="block text-xs font-semibold text-slate-800">{n.detail.candidateName}</span>
                        <span className="block text-xs text-slate-500">{n.detail.candidateEmail}</span>
                      </span>
                    </div>
                  </div>
                )}
                {n.kind === "interview-detail" && (
                  <p className="mt-3 text-xs text-slate-400">{n.sentAtLabel}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
