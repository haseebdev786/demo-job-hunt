import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, Building2, MapPin, Users, BriefcaseBusiness, Heart, Sun, BookOpen, Home, Bus, Sparkles } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { companies } from "@/lib/companies";
import { jobs } from "@/lib/jobs";

const gallery = [
  { photo: "photo-1497366216548-37526070297c", alt: "Bright shared workspace" },
  { photo: "photo-1522071820081-009f0129c71c", alt: "People collaborating around a table" },
  { photo: "photo-1497366811353-6870744d04b2", alt: "Open office with plants and natural light" },
];

const benefits = [
  { icon: Heart, title: "Full Healthcare", text: "Support for a happy, healthy team and their families." },
  { icon: Sun, title: "Unlimited Vacation", text: "Time to recharge and make room for life outside work." },
  { icon: BookOpen, title: "Skill Development", text: "Opportunities to learn, grow, and develop your skills." },
  { icon: Users, title: "Team Summits", text: "Time together to connect, share ideas, and celebrate." },
  { icon: Home, title: "Remote Working", text: "Flexibility to do your best work wherever you are." },
  { icon: Bus, title: "Commuter Benefits", text: "Support to make the journey to work a little easier." },
  { icon: Sparkles, title: "We Give Back", text: "Opportunities to support the communities we care about." },
];

export function generateStaticParams() {
  return companies.map(({ slug }) => ({ slug }));
}

function CompanyLogo({ company, large = false }) {
  const Icon = company.icon || company.logo;
  return (
    <div className={`flex shrink-0 items-center justify-center ${large ? "h-24 w-24 text-6xl sm:h-32 sm:w-32 sm:text-7xl" : "h-12 w-12 text-3xl"} ${company.iconBg || company.color || "bg-indigo-50"} ${company.iconColor || "text-white"}`}>
      {typeof Icon === "string" ? <span className="font-bold">{Icon}</span> : <Icon aria-hidden="true" />}
    </div>
  );
}

export default async function CompanyProfilePage({ params }) {
  const { slug } = await params;
  const company = companies.find((item) => item.slug === slug);
  if (!company) notFound();

  const openJobs = jobs.filter((job) => job.company === company.name);
  const industry = company.industry || company.categories.join(" / ");

  return (
    <div className="min-h-screen bg-white text-slate-800">
      <Navbar />
      <header className="bg-[#F8F8FD] px-4 pb-12 pt-6 sm:px-6 lg:px-10">
        <div className="mx-auto max-w-7xl">
          <nav aria-label="Breadcrumb" className="mb-9 flex flex-wrap gap-2 text-sm text-slate-500">
            <Link href="/" className="hover:text-indigo-600">Home</Link><span>/</span>
            <Link href="/companies" className="hover:text-indigo-600">Companies</Link><span>/</span>
            <span aria-current="page" className="text-slate-800">{company.name}</span>
          </nav>
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:gap-8">
            <CompanyLogo company={company} large />
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-4">
                <h1 className="text-3xl font-bold sm:text-4xl">{company.name}</h1>
                <a href="#open-jobs" className="border border-indigo-300 px-3 py-2 text-sm font-medium text-indigo-600 hover:bg-indigo-50">{openJobs.length} Jobs</a>
              </div>
              <dl className="mt-6 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
                {[
                  { icon: MapPin, label: "Location", value: company.location },
                  { icon: Building2, label: "Industry", value: industry },
                  { icon: Users, label: "Company size", value: company.size ? `${company.size} employees` : "Not listed" },
                  { icon: BriefcaseBusiness, label: "Open positions", value: openJobs.length },
                ].map(({ icon: Icon, label, value }) => (
                  <div key={label} className="flex items-center gap-3">
                    <span className="rounded-full bg-white p-3 text-indigo-600"><Icon size={20} aria-hidden="true" /></span>
                    <div><dt className="text-xs text-slate-500">{label}</dt><dd className="mt-1 text-sm font-semibold">{value}</dd></div>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </div>
      </header>

      <main>
        <section className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)] lg:gap-16 lg:px-10">
          <div className="min-w-0">
            <h2 className="text-2xl font-bold">Company Profile</h2>
            <p className="mt-4 text-sm leading-7 text-slate-600">{company.about || company.description}</p>
            <h3 className="mt-7 text-lg font-bold">Contact</h3>
            <p className="mt-3 text-sm text-slate-500">Contact information has not been added yet.</p>
            <figure className="mt-8">
              <div className="grid h-72 grid-cols-2 grid-rows-2 gap-3 sm:h-96">
                {gallery.map((photo, index) => (
                  // Existing demo photography; replace with each company's own photos when available.
                  // eslint-disable-next-line @next/next/no-img-element
                  <img key={photo.photo} src={`https://images.unsplash.com/${photo.photo}?auto=format&fit=crop&w=800&q=80`} alt={photo.alt} width={800} height={600} loading="lazy" className={`h-full w-full object-cover ${index === 0 ? "row-span-2" : ""}`} />
                ))}
              </div>
              <figcaption className="mt-2 text-xs text-slate-500">Illustrative workspace photos.</figcaption>
            </figure>
          </div>
          <aside className="space-y-8">
            <div>
              <h2 className="text-2xl font-bold">Tech stack</h2>
              <p className="mt-3 text-sm leading-6 text-slate-500">Technology details have not been shared yet.</p>
            </div>
            <div className="border-t border-slate-200 pt-8">
              <h2 className="text-2xl font-bold">Office Location</h2>
              <p className="mt-4 flex items-start gap-3 text-sm text-slate-600"><MapPin size={20} className="shrink-0 text-indigo-600" />{company.location}</p>
            </div>
          </aside>
        </section>

        <section className="mx-auto max-w-7xl border-t border-slate-100 px-4 py-10 sm:px-6 lg:px-10">
          <h2 className="text-2xl font-bold">Team</h2>
          <div className="mt-6 flex items-center gap-4 border border-slate-200 p-6 text-slate-500">
            <Users size={28} className="shrink-0 text-indigo-600" />
            <p className="text-sm">Meet the people behind {company.name}. Team profiles have not been added yet.</p>
          </div>
        </section>

        <section className="mx-auto max-w-7xl border-t border-slate-100 px-4 py-12 sm:px-6 lg:px-10">
          <h2 className="text-2xl font-bold">Perks &amp; Benefits</h2>
          <p className="mt-3 text-sm text-slate-500">Sample benefits — confirm availability in the individual job listing.</p>
          <div className="mt-8 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {benefits.map(({ icon: Icon, title, text }) => (
              <div key={title}>
                <Icon size={28} className="text-indigo-600" aria-hidden="true" />
                <h3 className="mt-4 font-bold">{title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-500">{text}</p>
              </div>
            ))}
          </div>
        </section>

        <section id="open-jobs" className="scroll-mt-6 bg-[#F8F8FD] px-4 py-12 sm:px-6 lg:px-10">
          <div className="mx-auto max-w-7xl">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <h2 className="text-2xl font-bold">Open Jobs <span className="text-base font-normal text-slate-500">({openJobs.length})</span></h2>
              <Link href="/jobs" className="flex min-h-11 items-center gap-3 text-sm font-semibold text-indigo-600">Browse all jobs <ArrowRight size={18} /></Link>
            </div>
            <div className="mt-6 grid gap-4 md:grid-cols-2">
              {openJobs.map((job) => (
                <Link key={job.id} href={`/jobs/${job.id}`} className="flex items-start gap-5 border border-slate-200 bg-white p-5 transition hover:border-indigo-500 hover:shadow-md focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-indigo-600 sm:p-6">
                  <CompanyLogo company={company} />
                  <div className="min-w-0">
                    <h3 className="font-bold">{job.title}</h3>
                    <p className="mt-2 text-sm text-slate-500">{job.company} · {job.location}</p>
                    <div className="mt-4 flex flex-wrap gap-2 text-xs">
                      <span className="rounded-full bg-emerald-50 px-3 py-1 text-emerald-700">{job.type}</span>
                      <span className="rounded-full border border-orange-200 px-3 py-1 text-orange-700">{job.category}</span>
                      <span className="rounded-full border border-indigo-200 px-3 py-1 text-indigo-600">{job.level}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
            {openJobs.length === 0 && <p className="mt-6 border border-slate-200 bg-white p-8 text-sm text-slate-500">No open jobs listed for {company.name} right now. Check back soon or browse all jobs.</p>}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
