// "use client";

// // Place this file at: components/dashboard/DashboardHeader.jsx
// // Dashboard header, SAME as the main navbar, for /dashboard/* pages.
// // This is the component to use in every dashboard page header,
// // replacing the old header right-side block.
// //
// // BEFORE (old dashboard header):
// //   Title | Back to homepage button + bell + static avatar circle
// //   (no menu, no logout -- to logout you had to go out to the
// //   main site navbar).
// // AFTER (this component):
// //   Title | bell (OUTSIDE the dropdown, still visible) +
// //           main-navbar account dropdown (name + avatar)
// //   - NO "Back to homepage" button, as you asked.
// //   - The dropdown is the SAME AuthNavLinks component as the
// //     main navbar (components/AuthNavLinks.jsx), so it has the
// //     SAME 3 items: Dashboard, My Profile, Logout. Logout goes
// //     to homepage "/", so you can logout from inside the
// //     dashboard, without going out to the main site.
// //   - The bell is NOT inside the dropdown. It stays outside,
// //     next to the dropdown, as you asked ("notification wala
// //     bahar hi rahe").
// //   - Clicking the bell closes the account dropdown and vice
// //     versa, because each one closes on an outside click.
// //
// // Usage (server page, with notifications, e.g. Dashboard overview
// // and Help Center -- they already fetch getNotificationsData()):
// //   <DashboardHeader
// //     title="Dashboard"
// //     notifications={notificationsData}
// //   />
// //   where notificationsData = { notifications, unreadCount,
// //   connected } from getNotificationsData().
// //
// // Usage (page without notifications data, e.g. Browse Companies):
// //   <DashboardHeader title="Browse Companies" />
// //   -- no bell is shown then, only the account dropdown.
// //   This component is a client component, so it works in both
// //   server pages and client dashboard components.
// //
// // NOTE on the name/avatar: this shows the Better Auth session
// // name (the same name as the main navbar), NOT the MongoDB demo
// // user (Jake) that the old static avatar circle showed. That is
// // intentional -- it is the same account menu as the main navbar,
// // so the name and logout must match the logged-in session.

// import AuthNavLinks from "@/components/AuthNavLinks";
// import NotificationsPanel from "@/components/dashboard/NotificationsPanel";

// export default function DashboardHeader({ title, notifications }) {
//   return (
//     <div className="flex flex-wrap items-start justify-between gap-4">
//       <h1 className="pl-10 text-2xl font-black text-slate-800 lg:pl-0">{title}</h1>
//       <div className="flex items-center gap-3">
//         {/* Bell stays OUTSIDE the account dropdown, as requested. */}
//         {notifications && (
//           <NotificationsPanel
//             initialNotifications={notifications.notifications}
//             initialUnreadCount={notifications.unreadCount}
//             connected={notifications.connected}
//           />
//         )}
//         {/* Same account menu as the main navbar: Dashboard, My Profile, Logout. */}
//         <AuthNavLinks />
//       </div>
//     </div>
//   );
// }















"use client";

// Place this file at: components/dashboard/DashboardHeader.jsx -- REPLACES
// the previous v1 version.
// Dashboard header, SAME as the main navbar, for EVERY /dashboard/* page.
// This is the component to use in every dashboard page header,
// replacing the old header right-side block.
//
// v2 CHANGE (your last message: "har page per apne apne header ha,
// notification sab per kase le ker ayu?"):
//   v1 only showed the bell when the page itself fetched
//   getNotificationsData() on the server and passed it in as a prop.
//   Most dashboard pages are CLIENT components (Applications, Browse
//   Companies, Profile, Find Jobs, Settings, Messages) -- they do NOT
//   fetch notifications on the server, so with v1 they got NO bell.
//   v2 fixes that: if you do NOT pass a notifications prop, this
//   component fetches the bell data ITSELF, on the client, from
//   GET /api/dashboard/notifications (which returns the same
//   getNotificationsData() as the server pages use). So EVERY page
//   now only needs ONE line, no per-page server fetch:
//     <DashboardHeader title="My Applications" />
//   and the bell appears automatically, with real MongoDB data.
//   If you DO pass notifications (server pages like Dashboard
//   overview and Help Center, which already fetch it), no extra
//   fetch happens -- the prop is used directly.
//   While the client fetch is loading, a plain bell icon is shown
//   (no badge), then it is replaced by the real panel once data
//   arrives. If MongoDB is down, the panel shows its honest
//   "not connected" message, same as before.
//
// BEFORE (old dashboard header):
//   Title | Back to homepage button + bell + static avatar circle
//   (no menu, no logout -- to logout you had to go out to the
//   main site navbar).
// AFTER (this component):
//   Title | bell (OUTSIDE the dropdown, still visible) +
//           main-navbar account dropdown (name + avatar)
//   - NO "Back to homepage" button, as you asked.
//   - The dropdown is the SAME AuthNavLinks component as the
//     main navbar (components/AuthNavLinks.jsx), so it has the
//     SAME 3 items: Dashboard, My Profile, Logout. Logout goes
//     to homepage "/", so you can logout from inside the
//     dashboard, without going out to the main site.
//   - The bell is NOT inside the dropdown. It stays outside,
//     next to the dropdown, as you asked ("notification wala
//     bahar hi rahe").
//   - Clicking the bell closes the account dropdown and vice
//     versa, because each one closes on an outside click.
//
// Usage (ALL pages, the only pattern you need now):
//   <DashboardHeader title="My Applications" />
//   <DashboardHeader title="Browse Companies" />
//   <DashboardHeader title="My Profile" />
//   etc. -- bell + account dropdown appear on every page.
//   Server pages that already fetch notifications can still pass:
//     <DashboardHeader title="Dashboard" notifications={notificationsData} />
//   This component is a client component, so it works in both
//   server pages and client dashboard components.
//
// NOTE on the name/avatar: this shows the Better Auth session
// name (the same name as the main navbar), NOT the MongoDB demo
// user (Jake) that the old static avatar circle showed. That is
// intentional -- it is the same account menu as the main navbar,
// so the name and logout must match the logged-in session.

import { useEffect, useState } from "react";
import { Bell } from "lucide-react";
import AuthNavLinks from "@/components/AuthNavLinks";
import NotificationsPanel from "@/components/dashboard/NotificationsPanel";

export default function DashboardHeader({ title, notifications }) {
  const [fetched, setFetched] = useState(null);

  // Only fetch when the page did not pass server notifications.
  useEffect(() => {
    if (notifications) return;
    let cancelled = false;
    fetch("/api/dashboard/notifications")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (!cancelled && data) setFetched(data);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [notifications]);

  const effective = notifications || fetched;

  return (
    <div className="flex shrink-0 flex-wrap items-start justify-between gap-4">
      <h1 className="pl-10 text-2xl font-black text-slate-800 lg:pl-0">{title}</h1>
      <div className="flex items-center gap-3">
        {/* Bell stays OUTSIDE the account dropdown, as requested. */}
        {effective ? (
          <NotificationsPanel
            initialNotifications={effective.notifications}
            initialUnreadCount={effective.unreadCount}
            connected={effective.connected}
          />
        ) : (
          <span className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-400" aria-label="Loading notifications">
            <Bell size={18} />
          </span>
        )}
        {/* Same account menu as the main navbar: Dashboard, My Profile, Logout. */}
        <AuthNavLinks />
      </div>
    </div>
  );
}
