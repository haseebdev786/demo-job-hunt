// Place this file at: app/company/layout.jsx
// (REPLACES the previous version of this file.)
// Company dashboard layout (section 3). Now uses the LOGGED-IN
// session user for the sidebar (lib/company-session-data.js),
// so the sidebar bottom shows the logged-in company user's name
// and email, not the demo Maria Kelly -- unless no one is logged
// in, in which case it falls back to Maria Kelly / Nomad as a
// preview only. No public Navbar / Footer here.

import CompanySidebar from "@/components/company/CompanySidebar";
import { getCompanySessionUser } from "@/lib/company-session-data";

const demoCompanyUser = {
  name: "Maria Kelly",
  email: "mariakelly@email.com",
  avatarUrl: "",
};

export default async function CompanyLayout({ children }) {
  const sessionData = await getCompanySessionUser();
  const sidebarUser = sessionData.loggedIn
    ? {
        name: sessionData.user.name,
        email: sessionData.user.email,
        avatarUrl: sessionData.user.image || "",
      }
    : demoCompanyUser;

  return (
    <div className="flex min-h-screen bg-slate-50">
      <CompanySidebar user={sidebarUser} />
      <main className="min-w-0 flex-1">{children}</main>
    </div>
  );
}
