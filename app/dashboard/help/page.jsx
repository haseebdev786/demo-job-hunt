// // Place this file at: app/dashboard/help/page.jsx
// // Route: /dashboard/help -- Help Center (2.12), inside the dashboard
// // layout (sidebar), like the other dashboard pages.
// // Header matches the reference: Help Center title, Back to homepage,
// // and the notifications bell (same panel as the Dashboard overview).
// // Next 16: connection() + instant = false, same blocking pattern as
// // the other dashboard pages (personal dashboard area, must not be
// // prerendered). The article content itself is static help content
// // from lib/help-data.js, rendered by HelpCenterPage.jsx below.

// import Link from "next/link";
// import { connection } from "next/server";
// import { getNotificationsData } from "@/lib/notifications-data";
// import NotificationsPanel from "@/components/dashboard/NotificationsPanel";
// import HelpCenterPage from "@/components/dashboard/HelpCenterPage";

// export const instant = false;

// export default async function HelpCenterPageRoute() {
//   await connection();
//   const notificationsData = await getNotificationsData();

//   return (
//     <div className="px-4 py-8 sm:px-6 lg:px-10">
//       <div className="flex flex-wrap items-start justify-between gap-4">
//         <h1 className="pl-10 text-2xl font-black text-slate-800 lg:pl-0">Help Center</h1>
//         <div className="flex items-center gap-3">
//           <Link
//             href="/"
//             className="border border-indigo-200 px-4 py-2 text-sm font-medium text-indigo-600 hover:bg-indigo-50"
//           >
//             Back to homepage
//           </Link>
//           <NotificationsPanel
//             initialNotifications={notificationsData.notifications}
//             initialUnreadCount={notificationsData.unreadCount}
//             connected={notificationsData.connected}
//           />
//         </div>
//       </div>

//       <HelpCenterPage />
//     </div>
//   );
// }








// Place this file at: app/dashboard/help/page.jsx
// Route: /dashboard/help -- Help Center (2.12), inside the dashboard
// layout (sidebar), like the other dashboard pages.
// Header matches the reference: Help Center title, Back to homepage,
// and the notifications bell (same panel as the Dashboard overview).
// Next 16: connection() + instant = false, same blocking pattern as
// the other dashboard pages (personal dashboard area, must not be
// prerendered). The article content itself is static help content
// from lib/help-data.js, rendered by HelpCenterPage.jsx below.

import { connection } from "next/server";
import { getNotificationsData } from "@/lib/notifications-data";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import HelpCenterPage from "@/components/dashboard/HelpCenterPage";

export const instant = false;

export default async function HelpCenterPageRoute() {
  await connection();
  const notificationsData = await getNotificationsData();

  return (
    <div className="px-4 py-8 sm:px-6 lg:px-10">
      {/* Header: same as Dashboard overview -- bell outside dropdown, NO Back to homepage */}
      <DashboardHeader title="Help Center" notifications={notificationsData} />

      <HelpCenterPage />
    </div>
  );
}
