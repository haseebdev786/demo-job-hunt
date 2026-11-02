import { getCurrentUser } from "@/lib/session";
import { getDb } from "@/lib/db";
import { getCompanyJobs, publicJob } from "@/lib/job-posts";
import { validateJobPost } from "@/lib/job-validation";

export async function GET() {
  const user = await getCurrentUser();
  if (!user) return Response.json({ error: "Please log in." }, { status: 401 });
  if (user.accountType !== "company") return Response.json({ error: "Company account required." }, { status: 403 });
  return Response.json({ jobs: await getCompanyJobs(user.id) }, { headers: { "Cache-Control": "no-store" } });
}

export async function POST(request) {
  if (request.headers.get("origin") !== new URL(request.url).origin) return Response.json({ error: "Invalid origin." }, { status: 403 });
  if (!request.headers.get("content-type")?.includes("application/json")) return Response.json({ error: "JSON required." }, { status: 415 });
  try {
    const user = await getCurrentUser();
    if (!user) return Response.json({ error: "Please log in to post a job." }, { status: 401 });
    if (user.accountType !== "company") return Response.json({ error: "Only company accounts can post jobs." }, { status: 403 });
    let fields;
    try {
      const raw = await request.text();
      if (raw.length > 32000) return Response.json({ error: "Job information is too large." }, { status: 413 });
      fields = validateJobPost(JSON.parse(raw));
    } catch (error) {
      return Response.json({ error: error.message }, { status: 400 });
    }
    const db = await getDb();
    const doc = { ...fields, ownerUserId: String(user.id), companyName: user.name, status: "live", applicants: 0, createdAt: new Date() };
    const { insertedId } = await db.collection("jobPosts").insertOne(doc);
    return Response.json({ job: publicJob({ ...doc, _id: insertedId }) }, { status: 201 });
  } catch {
    return Response.json({ error: "Unable to save this job. Please try again." }, { status: 503 });
  }
}
