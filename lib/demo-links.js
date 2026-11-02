import { jobs } from "./jobs";
import { companyJobs } from "./company-jobs-data";

export function demoCompanyJobHref(title) {
  const companyJob = companyJobs.find((job) => job.role === title);
  if (companyJob) return `/company/jobs/${companyJob.slug}`;
  const publicJob = jobs.find((job) => job.title === title);
  return publicJob ? `/jobs/${publicJob.id}` : "/company/jobs";
}
