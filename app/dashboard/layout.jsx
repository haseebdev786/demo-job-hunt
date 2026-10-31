// Place this file at: app/dashboard/layout.jsx
// This layout replaces Navbar/Footer for every /dashboard/* page.
// It is a server component: it reads the user from MongoDB once and
// passes only the user to the client Sidebar. The sidebar stays mounted
// when you navigate between dashboard subpages.

import Sidebar from "@/components/dashboard/Sidebar";
import { connection } from "next/server";
import { getDashboardData } from "@/lib/dashboard-data";

export default async function DashboardLayout({ children }) {
  // Same Next 16 fix as the page: the layout also reads MongoDB, so it
  // must also run at request time, not at build/prerender time.
  await connection();
  const data = await getDashboardData().catch(() => ({ user: null }));

  return (
    <div className="flex min-h-screen bg-white text-slate-800">
      <Sidebar user={data.user} />
      <main className="min-w-0 flex-1 bg-[#F8F8FD]">{children}</main>
    </div>
  );
}