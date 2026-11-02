import "server-only";
import { connection } from "next/server";
import { ObjectId } from "mongodb";
import { getDb } from "./db";
import { demoJobs, demoCompanies } from "./demo-catalog";

const dateLabel = (date) => new Date(date).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" });

export function publicJob(doc) {
  return {
    id: doc._id.toString(), slug: doc._id.toString(),
    title: doc.title, role: doc.title, company: doc.companyName,
    companySlug: doc.ownerUserId, location: doc.location,
    type: doc.employment.join(", "), employment: doc.employment, jobType: doc.employment[0],
    category: doc.categories[0], categories: doc.categories, level: doc.level,
    salaryMin: doc.salaryMin, salaryMax: doc.salaryMax,
    salary: doc.salaryMin == null ? "Not specified" : `$${doc.salaryMin.toLocaleString("en-US")} - $${doc.salaryMax.toLocaleString("en-US")} / year`,
    description: doc.description, responsibilities: doc.responsibilities,
    whoYouAre: doc.whoYouAre, niceToHaves: doc.niceToHaves,
    skills: doc.skills, perks: doc.perks,
    applicants: doc.applicants || 0, status: doc.status === "live" ? "Live" : "Closed",
    datePosted: dateLabel(doc.createdAt), dueDate: "Until filled", needs: "—",
    logo: doc.companyName.charAt(0).toUpperCase(), logoBg: "bg-indigo-50", logoColor: "text-indigo-600",
  };
}

export async function getPublishedJobs() {
  await connection();
  const db = await getDb();
  const published = (await db.collection("jobPosts").find({ status: "live" }).sort({ createdAt: -1 }).toArray()).map(publicJob);
  return [...published, ...demoJobs];
}

export async function getJobPost(id, ownerUserId) {
  if (!ownerUserId) {
    const demo = demoJobs.find((job) => job.id === String(id));
    if (demo) return demo;
  }
  if (!/^[a-f\d]{24}$/i.test(id)) return null;
  await connection();
  const db = await getDb();
  const query = { _id: new ObjectId(id), ...(ownerUserId ? { ownerUserId: String(ownerUserId) } : { status: "live" }) };
  const doc = await db.collection("jobPosts").findOne(query);
  return doc ? publicJob(doc) : null;
}

export async function getCompanyJobs(userId) {
  await connection();
  const db = await getDb();
  return (await db.collection("jobPosts").find({ ownerUserId: String(userId) }).sort({ createdAt: -1 }).toArray()).map(publicJob);
}

export async function getHiringCompanies() {
  const jobs = await getPublishedJobs();
  const companies = new Map();
  for (const job of jobs.filter((item) => !item.demo)) {
    const company = companies.get(job.companySlug) || {
      id: job.companySlug, slug: job.companySlug, name: job.company,
      location: job.location, industry: job.category, size: "Not listed",
      about: `Explore open positions posted by ${job.company}.`,
      description: `Explore open positions posted by ${job.company}.`,
      categories: [], jobs: 0, icon: job.logo, logo: job.logo,
      iconBg: "bg-indigo-50", iconColor: "text-indigo-600", color: "bg-indigo-600",
    };
    company.jobs += 1;
    company.categories = [...new Set([...company.categories, ...job.categories])];
    companies.set(company.slug, company);
  }
  return [...companies.values(), ...demoCompanies];
}
