import { Suspense } from "react";
import CompaniesPage from "@/components/CompaniesPage";
import { getHiringCompanies } from "@/lib/job-posts";
import Loading from "../loading";
export default function Page() { return <Suspense fallback={<Loading />}><Content /></Suspense>; }
async function Content() { return <CompaniesPage companies={await getHiringCompanies()} />; }
