import { jobs } from "./jobs";
import { companies, companySlug } from "./companies";
import { demoDescriptions, demoPerks, featuredDemoJobs, latestDemoJobs } from "./demo-job-content";

function demoJob(job) {
  const reference = jobs.find((item) => item.title === job.title) || jobs.find((item) => item.company === job.company);
  const details = demoDescriptions[job.id] || demoDescriptions[reference?.id];
  return {
    ...job, id: String(job.id), slug: String(job.id), demo: true,
    companySlug: companySlug(job.company), role: job.title,
    logo: typeof job.logo === "string" && !job.logo.startsWith("/") ? job.logo : job.company.charAt(0),
    logoColor: job.logoColor || job.color || "text-indigo-600", logoBg: job.logoBg || "bg-indigo-50",
    type: job.type || "Full-Time", employment: [job.type || "Full-Time"],
    categories: job.tags || [job.category || reference?.category || "Design"],
    category: job.category || job.tags?.[0] || reference?.category || "Design",
    level: job.level || reference?.level || "Entry Level", salary: job.salary || reference?.salary || "Not specified",
    description: job.description || details?.description?.replaceAll(reference?.company || job.company, job.company) || `${job.company} is looking for a ${job.title}.`,
    companyAbout: details?.companyAbout?.replaceAll(reference?.company || job.company, job.company) || "",
    responsibilities: (details?.responsibilities || []).join("\n"),
    whoYouAre: (details?.whoYouAre || []).join("\n"), niceToHaves: (details?.niceToHaves || []).join("\n"),
    skills: details?.skills || [], perks: demoPerks,
    applicants: job.applicants ?? reference?.applicants ?? 0,
    datePosted: "July 1, 2021", dueDate: "July 31, 2021", status: "Live", jobType: job.type || "Full-Time",
  };
}

export const demoJobs = jobs.map(demoJob);

// Preserve the original homepage cards without reusing an unrelated job's ID.
function homepageJobs(items, prefix) {
  return items.map((item) => {
    const existing = demoJobs.find((job) => job.title === item.title && job.company === item.company);
    if (existing) return existing.id;
    const job = demoJob({ ...item, id: `demo-${prefix}-${item.id}` });
    demoJobs.push(job);
    return job.id;
  });
}

export const featuredDemoIds = homepageJobs(featuredDemoJobs, "featured");
export const latestDemoIds = homepageJobs(latestDemoJobs, "latest");

export const demoCompanies = companies.map((company) => ({
  ...company, demo: true,
  icon: typeof company.icon === "string" ? company.icon : company.name.charAt(0),
  logo: typeof company.logo === "string" ? company.logo : company.name.charAt(0),
  jobs: demoJobs.filter((job) => job.companySlug === company.slug).length,
}));

for (const job of demoJobs) {
  if (!demoCompanies.some((company) => company.slug === job.companySlug)) {
    demoCompanies.push({ id: job.companySlug, slug: job.companySlug, name: job.company, demo: true,
      location: job.location, industry: job.category, categories: job.categories, size: "Not listed",
      about: job.companyAbout, description: job.companyAbout, icon: job.logo, logo: job.logo,
      iconBg: job.logoBg, iconColor: job.logoColor, color: job.logoBg,
      jobs: demoJobs.filter((item) => item.companySlug === job.companySlug).length });
  }
}
