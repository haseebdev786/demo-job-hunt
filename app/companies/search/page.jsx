import { Suspense } from "react";
import CompaniesSearchPage from "@/components/CompaniesSearchPage";
import { getHiringCompanies } from "@/lib/job-posts";
import Loading from "@/app/loading";
export default function Page() { return <Suspense fallback={<Loading />}><Content /></Suspense>; }
async function Content() { return <CompaniesSearchPage companies={await getHiringCompanies()} />; }
