import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import { MongoClient } from "mongodb";
import nextEnv from "@next/env";

nextEnv.loadEnvConfig(process.cwd());
const base = process.env.BETTER_AUTH_URL;
const run = randomUUID();
const emails = ["seeker", "company", "invalid"].map(role => `auth-test-${run}-${role}@example.invalid`);
const password = `Test-${randomUUID()}!`;
const client = new MongoClient(process.env.MONGODB_URI, { serverSelectionTimeoutMS: 10000 });
const db = client.db(process.env.MONGODB_DB);
const testIp = `192.0.2.${Math.floor(Math.random() * 250) + 1}`;

async function request(path, body, cookie = "", origin = base, ip = testIp) {
  const response = await fetch(`${base}/api/auth/${path}`, {
    method: body ? "POST" : "GET",
    headers: { "Content-Type": "application/json", Origin: origin, Cookie: cookie, "x-forwarded-for": ip },
    ...(body ? { body: JSON.stringify(body) } : {}),
  });
  const data = await response.json();
  const cookies = response.headers.getSetCookie();
  return { status: response.status, data, cookies, cookie: cookies.map(value => value.split(";")[0]).join("; ") };
}

try {
  assert.equal((await request("get-session")).data, null);
  const registered = await request("sign-up/email", { name: "Auth test seeker", email: emails[0], password, accountType: "job-seeker" });
  assert.equal(registered.status, 200, "Job seeker signup must succeed");
  assert.equal(registered.data.user.accountType, "job-seeker");
  assert.ok(registered.cookies.some(cookie => /session_token=.*HttpOnly/i.test(cookie)), "Session cookie must be HttpOnly");
  assert.ok(registered.cookies.some(cookie => /SameSite=Lax/i.test(cookie)));
  assert.equal((await request("get-session", null, registered.cookie)).data.user.email, emails[0]);
  assert.equal((await request("sign-up/email", { name: "Duplicate", email: emails[0].toUpperCase(), password, accountType: "job-seeker" })).status, 422);
  assert.equal((await request("sign-in/email", { email: emails[0], password: "Wrong-password-123", accountType: "job-seeker" })).status, 401);
  assert.equal((await request("sign-in/email", { email: emails[0], password, accountType: "company" })).status, 401);
  const invalid = await request("sign-up/email", { name: "Invalid role", email: emails[2], password, accountType: "admin" });
  assert.ok(invalid.status >= 400 && invalid.status < 500, "Unknown account types must be rejected");
  assert.equal((await request("update-user", { accountType: "company" }, registered.cookie)).status, 403);
  assert.equal((await request("sign-out", {}, registered.cookie, "https://untrusted.example")).status, 403);
  assert.equal((await request("sign-out", {}, registered.cookie)).status, 200);
  assert.equal((await request("get-session", null, registered.cookie)).data, null, "Logout must revoke the saved session");

  const login = await request("sign-in/email", { email: emails[0], password, accountType: "job-seeker", rememberMe: true });
  assert.equal(login.status, 200);
  assert.ok(login.cookies.some(cookie => /session_token=/.test(cookie) && /Max-Age=/.test(cookie)), "Remember me must create a persistent cookie");
  const temporary = await request("sign-in/email", { email: emails[0], password, accountType: "job-seeker", rememberMe: false });
  assert.equal(temporary.status, 200);
  assert.ok(temporary.cookies.some(cookie => /session_token=/.test(cookie) && !/Max-Age=/.test(cookie)), "Unchecked remember me must use a browser-session cookie");

  const company = await request("sign-up/email", { name: "Auth test company", email: emails[1], password, accountType: "company" });
  assert.equal(company.status, 200);
  assert.equal(company.data.user.accountType, "company");
  const companyLogin = await request("sign-in/email", { email: emails[1], password, accountType: "company" });
  assert.equal(companyLogin.status, 200);

  await client.connect();
  const user = await db.collection("user").findOne({ email: emails[0] });
  const account = await db.collection("account").findOne({ userId: user._id });
  assert.ok(account?.password && account.password !== password, "Database must contain a password hash");
  assert.equal(user.password, undefined);
  assert.equal(registered.data.user.password, undefined);
  assert.ok((await db.collection("user").indexes()).some(index => index.key.email === 1 && index.unique), "Email must have a unique index");

  let limited;
  for (let i = 0; i < 11; i++) {
    limited = await request("sign-in/email", { email: emails[0], password: "bad-password", accountType: "job-seeker" }, "", base, "198.51.100.77");
  }
  assert.equal(limited.status, 429, "Repeated login attempts must be rate limited");
  console.log("PASS: signup (both roles), login, validation, duplicates, stored password hash, sessions, remember me, logout, origin protection, immutable account type, and rate limiting.");
} finally {
  // Remove only this run's generated test users and their auth records.
  const users = await db.collection("user").find({ email: { $in: emails } }, { projection: { _id: 1 } }).toArray();
  const ids = users.flatMap(user => [user._id, user._id.toString()]);
  if (ids.length) {
    await db.collection("session").deleteMany({ userId: { $in: ids } });
    await db.collection("account").deleteMany({ userId: { $in: ids } });
    await db.collection("user").deleteMany({ _id: { $in: users.map(user => user._id) } });
  }
  await client.close();
  console.log("Temporary auth test accounts cleaned up.");
}
