
import CompanySidebar from "@/components/company/CompanySidebar";
import { getCompanySessionUser } from "@/lib/company-session-data";



export default async function CompanyLayout({ children }) {
  const sessionData = await getCompanySessionUser();
  const sidebarUser = sessionData.loggedIn
    ? {
        name: sessionData.user.name,
        email: sessionData.user.email,
        avatarUrl: sessionData.user.image || "",
      }
    : null;

  return (
    <div className="flex min-h-screen bg-slate-50">
      <CompanySidebar user={sidebarUser} />
      <main className="min-w-0 flex-1">{children}</main>
    </div>
  );
}
