
import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { FaDropbox } from "react-icons/fa";
import { TbCircleDottedLetterR } from "react-icons/tb";

const jobs = [
  {
    id: 1,
    title: "Email Marketing",
    company: "Revolut",
    location: "Madrid, Spain",
    logo: TbCircleDottedLetterR,
    description:
      "Revolut is looking for Email Marketing to help team manage campaigns.",
    tags: ["Marketing", "Design"],
  },
  {
    id: 2,
    title: "Brand Designer",
    company: "Dropbox",
    location: "San Francisco, US",
    logo: FaDropbox,
    description:
      "Dropbox is looking for Brand Designer to help the team.",
    tags: ["Design", "Business"],
  },
  {
    id: 3,
    title: "Email Marketing",
    company: "Pitch",
    location: "Berlin, Germany",
    logo: "/logos/pitch.png",
    description:
      "Pitch is looking for Customer Manager to join the marketing team.",
    tags: ["Marketing"],
  },
  {
    id: 4,
    title: "Visual Designer",
    company: "Blinkist",
    location: "Granada, Spain",
    logo: "/logos/blinkist.png",
    description:
      "Blinkist is looking for Visual Designer to help the design team.",
    tags: ["Design"],
  },
  {
    id: 5,
    title: "Product Designer",
    company: "ClassPass",
    location: "Manchester, UK",
    logo: "/logos/classpass.png",
    description:
      "ClassPass is looking for Product Designer to help us improve.",
    tags: ["Marketing", "Design"],
  },
  {
    id: 6,
    title: "Lead Designer",
    company: "Canva",
    location: "Ontario, Canada",
    logo: "/logos/canva.png",
    description:
      "Canva is looking for Lead Engineer to help develop new products.",
    tags: ["Design", "Business"],
  },
  {
    id: 7,
    title: "Brand Strategist",
    company: "GoDaddy",
    location: "Marseille, France",
    logo: "/logos/godaddy.png",
    description:
      "GoDaddy is looking for Brand Strategist to join the team.",
    tags: ["Marketing"],
  },
  {
    id: 8,
    title: "Data Analyst",
    company: "Twitter",
    location: "San Diego, US",
    logo: "/logos/twitter.png",
    description:
      "Twitter is looking for Data Analyst to help team design data solutions.",
    tags: ["Technology"],
  },
];

const tagColors = {
  Marketing: "bg-orange-50 text-orange-400",
  Design: "bg-teal-50 text-teal-500",
  Business: "bg-indigo-50 text-indigo-600",
  Technology: "bg-red-50 text-red-500",
};

export default function FeaturedJobs() {
  return (
    <section className="w-full min-w-0 bg-white px-3 py-10 sm:px-6 sm:py-14 lg:px-8 lg:py-16">
      <div className="mx-auto w-full max-w-7xl">

        <div className="mb-6 flex flex-col items-start gap-3 sm:mb-10 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-2xl font-bold tracking-tight text-slate-800 sm:text-3xl lg:text-4xl">
            Featured <span className="text-sky-400">jobs</span>
          </h2>

          <Link
            href="/jobs"
            className="flex items-center gap-2 text-sm font-semibold text-indigo-600 transition-all hover:gap-3"
          >
            Show all jobs
            <ArrowRight size={18} />
          </Link>
        </div>

        <div className="grid grid-cols-2 gap-2 sm:gap-5 lg:grid-cols-4">
          {jobs.map((job) => {
            const Logo = job.logo;

            return (
              <div
                key={job.id}
                className="flex min-w-0 flex-col border border-slate-200 bg-white p-2.5 transition-all duration-300 hover:-translate-y-1 hover:border-indigo-600 hover:shadow-lg sm:min-h-64 sm:p-4"
              >
                <div className="mb-3 flex items-start justify-between gap-1 sm:mb-4 sm:gap-2">

                  <div className="flex h-7 w-7 shrink-0 items-center justify-center sm:h-9 sm:w-9">
                    {typeof Logo === "string" ? (
                      <Image
                        src={Logo}
                        alt={job.company}
                        width={36}
                        height={36}
                        className="h-7 w-7 object-contain sm:h-9 sm:w-9"
                      />
                    ) : (
                      <Logo
                        className="text-2xl text-blue-600 sm:text-3xl"
                        aria-label={job.company}
                      />
                    )}
                  </div>

                  <span className="shrink-0 whitespace-nowrap border border-indigo-500 px-1 py-1 text-[9px] text-indigo-600 sm:px-2 sm:text-xs">
                    Full Time
                  </span>
                </div>

                <h3 className="mb-1 text-sm font-bold leading-5 text-slate-800 sm:text-base">
                  {job.title}
                </h3>

                <p className="mb-2 break-words text-[10px] leading-4 text-slate-500 sm:mb-3 sm:text-xs">
                  {job.company} · {job.location}
                </p>

                <p className="mb-3 line-clamp-3 text-[10px] leading-4 text-slate-400 sm:mb-4 sm:line-clamp-2 sm:text-xs sm:leading-5">
                  {job.description}
                </p>

                <div className="mt-auto flex flex-wrap gap-1 sm:gap-2">
                  {job.tags.map((tag) => (
                    <span
                      key={tag}
                      className={`rounded-full px-2 py-1 text-[9px] font-medium sm:px-3 sm:text-xs ${tagColors[tag]}`}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
