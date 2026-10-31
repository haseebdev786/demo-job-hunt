// // Place this file at: app/dashboard/page.jsx
// // Route: /dashboard
// // Server component: it fetches live data from MongoDB on every request,
// // then renders it. No stats are hardcoded here --
// // change the data in MongoDB and this page changes automatically.
// //
// // NEXT 16 FIX: Do NOT use `export const dynamic = "force-dynamic"` here.
// // With `cacheComponents: true` (the Next 16.4 default in next.config.ts),
// // that export is rejected with:
// //   Route segment config "dynamic" is not compatible with
// //   `nextConfig.cacheComponents`. Please remove it.
// // The Next 16 replacement is `await connection()` below: it marks this
// // page as request-time (dynamic) without the old segment config.

// import Link from "next/link";
// import { connection } from "next/server";
// import { FileText, HelpCircle, Calendar } from "lucide-react";
// import { getDashboardData } from "@/lib/dashboard-data";
// import {
//   StatCard,
//   StatusDonut,
//   InterviewsCard,
//   ApplicationsHistory,
// } from "@/components/dashboard/DashboardWidgets";

// export default async function DashboardPage() {
//   // Render at request time in Next 16, so MongoDB data is never prerendered/cached.
//   await connection();
//   const data = await getDashboardData();
//   const greetingName = data.user?.firstName || "there";

//   return (
//     <div className="px-4 py-8 sm:px-6 lg:px-10">
//       {/* Header */}
//       <div className="flex flex-wrap items-start justify-between gap-4">
//         <h1 className="pl-10 text-2xl font-black text-slate-800 lg:pl-0">Dashboard</h1>
//         <div className="flex items-center gap-3">
//           <Link
//             href="/"
//             className="border border-indigo-200 px-4 py-2 text-sm font-medium text-indigo-600 hover:bg-indigo-50"
//           >
//             Back to homepage
//           </Link>
//           {data.user?.avatarUrl ? (
//             <img src={data.user.avatarUrl} alt={data.user.name} className="h-9 w-9 rounded-full object-cover" />
//           ) : (
//             <span className="flex h-9 w-9 items-center justify-center rounded-full bg-indigo-100 text-sm font-bold text-indigo-600">
//               {(data.user?.name || "J").charAt(0)}
//             </span>
//           )}
//         </div>
//       </div>

//       {/* MongoDB not connected notice -- shown only when there is no data source */}
//       {!data.connected && (
//         <div className="mt-6 border border-amber-200 bg-amber-50 px-5 py-4 text-sm leading-6 text-amber-800">
//           <p className="font-bold">MongoDB is not connected yet.</p>
//           <p>
//             Set <code className="font-mono text-xs">MONGODB_URI</code> in{" "}
//             <code className="font-mono text-xs">.env.local</code>, run{" "}
//             <code className="font-mono text-xs">npm install mongodb</code> and{" "}
//             <code className="font-mono text-xs">node scripts/seed-dashboard.js</code>, then reload.
//             Real applications saved in MongoDB will appear here automatically -- no code change needed.
//           </p>
//         </div>
//       )}

//       {/* Greeting + date range */}
//       <div className="mt-8 flex flex-wrap items-start justify-between gap-4">
//         <div>
//           <h2 className="text-xl font-bold text-slate-800 sm:text-2xl">Good morning, {greetingName}</h2>
//           <p className="mt-1 text-sm text-slate-500">
//             Here is what&apos;s happening with your job search applications from July 19 - July 25.
//           </p>
//         </div>
//         <button
//           type="button"
//           className="flex items-center gap-2 border border-slate-200 bg-white px-4 py-2 text-sm text-slate-600"
//         >
//           Jul 19 - Jul 25
//           <Calendar size={16} />
//         </button>
//       </div>

//       {/* Top row: stats + donut + interviews */}
//       <div className="mt-8 grid gap-5 lg:grid-cols-3">
//         <div className="space-y-5">
//           <StatCard
//             title="Total Jobs Applied"
//             value={data.stats.totalApplied}
//             icon={<FileText size={28} />}
//           />
//           <StatCard
//             title="Interviewed"
//             value={data.stats.interviewed}
//             icon={<HelpCircle size={28} />}
//           />
//         </div>

//         <StatusDonut
//           interviewedPercent={data.stats.interviewedPercent}
//           unsuitablePercent={data.stats.unsuitablePercent}
//         />

//         <InterviewsCard interviews={data.interviews} dateLabel={data.interviewsDateLabel} />
//       </div>

//       {/* Recent applications history */}
//       <div className="mt-5">
//         <ApplicationsHistory applications={data.recentApplications} />
//       </div>
//     </div>
//   );
// }
























// Place this file at: app/dashboard/page.jsx -- REPLACES the previous
// overview page version.
// CHANGE in this version: the header is now DashboardHeader
// (components/dashboard/DashboardHeader.jsx), the SAME account
// menu as the main navbar. The old header (Back to homepage
// button + bell + static avatar circle) is removed:
//   - NO Back to homepage button, as you asked.
//   - Bell stays OUTSIDE the dropdown, as you asked.
//   - Account dropdown has Dashboard, My Profile, Logout, so
//     you can logout from inside the dashboard without going
//     out to the main site navbar.
// Everything below the header (greeting, stats, donut, interviews,
// recent applications) is unchanged.
//
// NEXT 16 FIX: Do NOT use `export const dynamic = "force-dynamic"` here.
// With `cacheComponents: true` (the Next 16.4 default in next.config.ts),
// that export is rejected with:
//   Route segment config "dynamic" is not compatible with
//   `nextConfig.cacheComponents`. Please remove it.
// The Next 16 replacement is `await connection()` below: it marks this
// page as request-time (dynamic) without the old segment config.

import { connection } from "next/server";

// Same Next 16 "[block]" fix as the dashboard layout: this page reads
// uncached MongoDB data, so it is intentionally a blocking route, not
// a prerendered / instant one. See app/dashboard/layout.jsx for why.
export const instant = false;
import { FileText, HelpCircle, Calendar } from "lucide-react";
import { getDashboardData } from "@/lib/dashboard-data";
import { getNotificationsData } from "@/lib/notifications-data";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import {
  StatCard,
  StatusDonut,
  InterviewsCard,
  ApplicationsHistory,
} from "@/components/dashboard/DashboardWidgets";

export default async function DashboardPage() {
  // Render at request time in Next 16, so MongoDB data is never prerendered/cached.
  await connection();
  const [data, notificationsData] = await Promise.all([
    getDashboardData(),
    getNotificationsData(),
  ]);
  const greetingName = data.user?.firstName || "there";

  return (
    <div className="px-4 py-8 sm:px-6 lg:px-10">
      {/* Header: same account menu as the main navbar, bell outside
          the dropdown, NO Back to homepage. See DashboardHeader. */}
      <DashboardHeader title="Dashboard" notifications={notificationsData} />

      {/* MongoDB not connected notice -- shown only when there is no data source */}
      {!data.connected && (
        <div className="mt-6 border border-amber-200 bg-amber-50 px-5 py-4 text-sm leading-6 text-amber-800">
          <p className="font-bold">MongoDB is not connected yet.</p>
          <p>
            Set <code className="font-mono text-xs">MONGODB_URI</code> in{" "}
            <code className="font-mono text-xs">.env.local</code>, run{" "}
            <code className="font-mono text-xs">npm install mongodb</code> and{" "}
            <code className="font-mono text-xs">node scripts/seed-dashboard.js</code>, then reload.
            Real applications saved in MongoDB will appear here automatically -- no code change needed.
          </p>
        </div>
      )}

      {/* Greeting + date range */}
      <div className="mt-8 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-800 sm:text-2xl">Good morning, {greetingName}</h2>
          <p className="mt-1 text-sm text-slate-500">
            Here is what&apos;s happening with your job search applications from July 19 - July 25.
          </p>
        </div>
        <button
          type="button"
          className="flex items-center gap-2 border border-slate-200 bg-white px-4 py-2 text-sm text-slate-600"
        >
          Jul 19 - Jul 25
          <Calendar size={16} />
        </button>
      </div>

      {/* Top row: stats + donut + interviews */}
      <div className="mt-8 grid gap-5 lg:grid-cols-3">
        <div className="space-y-5">
          <StatCard
            title="Total Jobs Applied"
            value={data.stats.totalApplied}
            icon={<FileText size={28} />}
          />
          <StatCard
            title="Interviewed"
            value={data.stats.interviewed}
            icon={<HelpCircle size={28} />}
          />
        </div>

        <StatusDonut
          interviewedPercent={data.stats.interviewedPercent}
          unsuitablePercent={data.stats.unsuitablePercent}
        />

        <InterviewsCard interviews={data.interviews} dateLabel={data.interviewsDateLabel} />
      </div>

      {/* Recent applications history */}
      <div className="mt-5">
        <ApplicationsHistory applications={data.recentApplications} />
      </div>
    </div>
  );
}
