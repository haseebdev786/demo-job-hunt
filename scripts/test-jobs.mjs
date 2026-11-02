import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import { MongoClient } from "mongodb";
import nextEnv from "@next/env";

nextEnv.loadEnvConfig(process.cwd());
const base = process.env.TEST_BASE_URL || "http://localhost:3000";
const run = randomUUID();
const emails = ["company", "other", "seeker"].map((role) => `jobs-test-${run}-${role}@example.invalid`);
const password = `Test-${randomUUID()}!`;
const client = new MongoClient(process.env.MONGODB_URI, { serverSelectionTimeoutMS: 10000 });
const db = client.db(process.env.MONGODB_DB || "jobhuntly");

async function request(path, { body, cookie = "", origin = base } = {}) {
  const response = await fetch(`${base}${path}`, {
    method: body ? "POST" : "GET",
    headers: { "Content-Type": "application/json", Origin: origin, Cookie: cookie },
    ...(body ? { body: JSON.stringify(body) } : {}),
  });
  const data = await response.json();
  return { status: response.status, data, cookie: response.headers.getSetCookie().map((value) => value.split(";")[0]).join("; ") };
}

try {
  const accounts = [];
  for (let index = 0; index < emails.length; index++) {
    const result = await request("/api/auth/sign-up/email", { body: { name: `Job test ${run} ${index}`, email: emails[index], password, accountType: index === 2 ? "job-seeker" : "company" } });
    assert.equal(result.status, 200, "Test account signup");
    accounts.push(result);
  }
  await request("/api/auth/sign-out", { body: {}, cookie: accounts[0].cookie });
  const login = await request("/api/auth/sign-in/email", { body: { email: emails[0], password, accountType: "company" } });
  assert.equal(login.status, 200, "Company login");
  const payload = {
    title: `Integration job ${run}`, location: "Lahore, Pakistan", level: "Mid Level",
    employment: ["Full-Time", "Remote"], categories: ["Technology"], salaryMin: 10000, salaryMax: 20000,
    description: `Saved description ${run}`, responsibilities: "Build applications\nReview code",
    whoYouAre: "Experienced developer", niceToHaves: "Testing experience", skills: ["React"], perks: [],
    ownerUserId: accounts[1].data.user.id, companyName: "Spoofed company",
  };
  assert.equal((await request("/api/company/jobs", { body: payload })).status, 401);
  assert.equal((await request("/api/company/jobs", { body: payload, cookie: accounts[2].cookie })).status, 403);
  assert.equal((await request("/api/company/jobs", { body: payload, cookie: login.cookie, origin: "https://untrusted.example" })).status, 403);
  assert.equal((await request("/api/company/jobs", { body: { ...payload, salaryMax: 1 }, cookie: login.cookie })).status, 400);
  assert.equal((await request("/api/company/jobs", { body: { ...payload, description: "" }, cookie: login.cookie })).status, 400);
  const posted = await request("/api/company/jobs", { body: payload, cookie: login.cookie });
  assert.equal(posted.status, 201, "Publish job");
  const job = posted.data.job;
  assert.equal(job.company, accounts[0].data.user.name, "Company identity must come from the session");
  assert.equal(job.companySlug, accounts[0].data.user.id);
  assert.equal((await request("/api/company/jobs", { cookie: login.cookie })).data.jobs.some((item) => item.id === job.id), true);
  assert.equal((await request("/api/company/jobs", { cookie: accounts[1].cookie })).data.jobs.some((item) => item.id === job.id), false);
  assert.equal((await request("/api/jobs")).data.jobs.some((item) => item.id === job.id), true);
  const saved = await db.collection("jobPosts").findOne({ ownerUserId: accounts[0].data.user.id });
  assert.equal(saved.description, payload.description, "Persistence in MongoDB");
  for (const path of ["/", "/jobs", `/jobs/${job.id}`, "/companies", "/companies/search", `/companies/${job.companySlug}`, "/company/jobs", `/company/jobs/${job.id}`, "/dashboard/jobs", "/dashboard/companies"]) {
    const response = await fetch(`${base}${path}`, { headers: { Cookie: path.startsWith("/dashboard") ? accounts[2].cookie : login.cookie } });
    const html = await response.text();
    assert.equal(response.status, 200, path);
    assert(!html.includes('"digest":"') || !html.includes('INTERNAL_SERVER_ERROR'), `Render error at ${path}`);
    assert(html.includes(path.includes("companies") ? accounts[0].data.user.name : job.title), `Saved data missing at ${path}`);
    if (path === `/jobs/${job.id}`) assert(html.includes(payload.description), "Public description");
    console.log(`PASS ${path}`);
  }
  const hidden = await fetch(`${base}/company/jobs/${job.id}`, { headers: { Cookie: accounts[1].cookie } });
  const hiddenHtml = await hidden.text();
  assert(!hiddenHtml.includes(job.description), "Other companies cannot read private job details");
  const refresh = await request("/api/company/jobs", { cookie: login.cookie });
  assert(refresh.data.jobs.some((item) => item.id === job.id), "Job survives a new request");
  console.log("PASS: company login, publish, validation, origin/role/ownership checks, MongoDB persistence, listings and detail links.");
} finally {
  const users = await db.collection("user").find({ email: { $in: emails } }, { projection: { _id: 1 } }).toArray();
  const ids = users.flatMap((user) => [user._id, user._id.toString()]);
  if (ids.length) {
    await db.collection("jobPosts").deleteMany({ ownerUserId: { $in: users.map((user) => user._id.toString()) } });
    await db.collection("session").deleteMany({ userId: { $in: ids } });
    await db.collection("account").deleteMany({ userId: { $in: ids } });
    await db.collection("user").deleteMany({ _id: { $in: users.map((user) => user._id) } });
  }
  await client.close();
  console.log("Removed this run's temporary users, sessions and jobs.");
}
