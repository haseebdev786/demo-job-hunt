export const EMPLOYMENT_TYPES = ["Full-Time", "Part-Time", "Remote", "Internship", "Contract"];
export const JOB_CATEGORIES = ["Design", "Marketing", "Business", "Technology", "Finance", "Sales", "Customer Service", "Engineering", "Human Resource"];

export function validateJobPost(body) {
  const text = (value, name, max, required = false) => {
    if (typeof value !== "string" || value.trim().length > max || (required && !value.trim())) throw new Error(`${name} is required and must be at most ${max} characters.`);
    return value.trim();
  };
  const list = (value, name, allowed) => {
    if (!Array.isArray(value) || !value.length || value.length > 20) throw new Error(`Select ${name}.`);
    const result = [...new Set(value.map((item) => text(item, name, 100, true)))];
    if (allowed && result.some((item) => !allowed.includes(item))) throw new Error(`Invalid ${name}.`);
    return result;
  };
  if (!body || typeof body !== "object") throw new Error("Invalid job information.");
  const salaryMin = body.salaryMin === null ? null : body.salaryMin;
  const salaryMax = body.salaryMax === null ? null : body.salaryMax;
  if (!(salaryMin === null && salaryMax === null) &&
      (![salaryMin, salaryMax].every((v) => typeof v === "number" && Number.isFinite(v) && v >= 0 && v <= 1e9) || salaryMin > salaryMax)) throw new Error("Enter a valid salary range; minimum cannot exceed maximum.");
  if (!Array.isArray(body.perks) || body.perks.length > 20) throw new Error("Invalid benefits.");
  if (!["Entry Level", "Mid Level", "Senior Level", "Director"].includes(body.level)) throw new Error("Select a job level.");
  return {
    title: text(body.title, "Job title", 150, true),
    location: text(body.location, "Location", 150, true), level: body.level,
    employment: list(body.employment, "employment type", EMPLOYMENT_TYPES),
    categories: list(body.categories, "job category", JOB_CATEGORIES),
    salaryMin, salaryMax,
    description: text(body.description, "Job description", 500, true),
    responsibilities: text(body.responsibilities || "", "Responsibilities", 500),
    whoYouAre: text(body.whoYouAre || "", "Qualifications", 500),
    niceToHaves: text(body.niceToHaves || "", "Nice-to-haves", 500),
    skills: list(body.skills, "required skills"),
    perks: body.perks.map((perk) => ({ title: text(perk?.title, "Benefit title", 100, true), text: text(perk?.text, "Benefit description", 500) })),
  };
}
