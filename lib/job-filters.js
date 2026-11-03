import { EMPLOYMENT_TYPES, JOB_CATEGORIES } from "./job-validation";

const salaryRanges = {
  "$0 - $30k": [0, 30000],
  "$30k - $60k": [30000, 60000],
  "$60k - $100k": [60000, 100000],
  "$100k+": [100000, Infinity],
};

export const jobFilters = [
  { title: "Type of Employment", field: "type", options: EMPLOYMENT_TYPES },
  { title: "Categories", field: "category", options: JOB_CATEGORIES },
  { title: "Job Level", field: "level", options: ["Entry Level", "Mid Level", "Senior Level", "Director"] },
  { title: "Salary Range", field: "salary", options: [...Object.keys(salaryRanges), "Not specified"] },
];

// Use the same matching rules for checkbox counts and search results.
export function matchesJobFilter(job, field, option) {
  if (field === "type") return (job.employment || [job.type]).includes(option);
  if (field === "category") return (job.categories || [job.category]).includes(option);
  if (field === "salary") {
    const specified = Number.isFinite(job.salaryMin) && Number.isFinite(job.salaryMax);
    if (option === "Not specified") return !specified;
    const range = salaryRanges[option];
    return Boolean(specified && range && job.salaryMax >= range[0] && job.salaryMin < range[1]);
  }
  return job[field] === option;
}
