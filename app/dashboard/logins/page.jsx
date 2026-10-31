// Place this file at: app/dashboard/logins/page.jsx
// Route: /dashboard/logins -- My Logins History, linked from the
// navbar account dropdown. Inside the dashboard layout (sidebar),
// like the other dashboard pages.
// Next 16: connection() + instant = false, same blocking pattern
// as the other dashboard pages (personal data, must not be prerendered).

import Link from "next/link";
import { connection } from "next/server";
import { getLoginsData } from "@/lib/logins-data";
import DashboardHeader from "@/components/dashboard/DashboardHeader";

export const instant = false;

export default async function LoginsHistoryPage() {
  await connection();
  const data = await getLoginsData();

  return (
    <div className="px-4 py-8 sm:px-6 lg:px-10">
      {/* Header: same as Dashboard overview -- bell outside dropdown, NO Back to homepage */}
      <DashboardHeader title="My Logins History" />

      {!data.loggedIn && (
        <div className="mt-8 border border-slate-200 bg-white px-5 py-8 text-center">
          <p className="font-bold text-slate-800">Please log in to see your logins history.</p>
          <p className="mx-auto mt-1 max-w-md text-sm text-slate-500">
            This page shows the sessions for your logged-in Better Auth account.
          </p>
          <Link href="/login" className="mt-4 inline-block bg-indigo-600 px-5 py-2 text-sm font-semibold text-white hover:bg-indigo-700">
            Login
          </Link>
        </div>
      )}

      {data.loggedIn && !data.connected && (
        <div className="mt-6 border border-amber-200 bg-amber-50 px-5 py-4 text-sm text-amber-800">
          <p className="font-bold">Auth database is not connected yet.</p>
          <p>Set MONGODB_URI in .env or .env.local and restart the server.</p>
        </div>
      )}

      {data.loggedIn && data.connected && data.sessions.length === 0 && (
        <div className="mt-8 border border-slate-200 bg-white px-5 py-8 text-center">
          <p className="font-bold text-slate-800">No logins yet.</p>
          <p className="mx-auto mt-1 max-w-md text-sm text-slate-500">
            Sessions for {data.user?.name || data.user?.email} will appear here after sign-in.
            Older sessions may not have recorded an IP address or device.
          </p>
        </div>
      )}

      {data.loggedIn && data.connected && data.sessions.length > 0 && (
        <div className="mt-8 space-y-4">
          {data.sessions.map((s) => (
            <div key={s.id} className="flex flex-wrap items-start justify-between gap-4 border border-slate-200 bg-white p-5">
              <div>
                <p className="text-sm font-bold text-slate-800">
                  {s.device}
                  {s.isCurrent && (
                    <span className="ml-2 rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-bold text-emerald-600">
                      Current
                    </span>
                  )}
                  {s.isExpired && !s.isCurrent && (
                    <span className="ml-2 rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-bold text-slate-500">
                      Expired
                    </span>
                  )}
                </p>
                <p className="mt-1 text-sm text-slate-500">
                  IP: {s.ipAddress || "Unknown IP"}
                </p>
                {s.userAgent && (
                  <p className="mt-1 max-w-xl truncate text-xs text-slate-400">{s.userAgent}</p>
                )}
              </div>
              <div className="text-right text-xs text-slate-500">
                <p>Signed in: {s.createdAtLabel}</p>
                {s.expiresAtLabel && <p className="mt-1">Expires: {s.expiresAtLabel}</p>}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
