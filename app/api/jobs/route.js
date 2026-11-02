import { getPublishedJobs } from "@/lib/job-posts";

export async function GET() {
  return Response.json({ jobs: await getPublishedJobs() }, { headers: { "Cache-Control": "no-store" } });
}
