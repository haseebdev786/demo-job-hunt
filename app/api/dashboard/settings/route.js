// Place this file at: app/api/dashboard/settings/route.js
// GET: returns the same data as lib/settings-data.js (for debugging).
// POST: saves one settings section. Body: { section, ...fields }
//
//   section "profile":      { fullName, phone, email, dateOfBirth,
//                             gender, accountType }
//                           -> users (name, email), profiles
//                              (additionalDetails.phone), settings
//                              (dateOfBirth, gender, accountType)
//   section "login-email":   { newEmail }
//                           -> users.email, settings.emailVerified = false
//   section "notifications": { notifications: { applications, jobs,
//                             recommendations } }
//                           -> settings.notifications
//   section "password":      NOT implemented (see below) -- returns
//                           400 with an honest error, never a fake
//                           success. There is no login/password system
//                           connected yet (users have no stored password
//                           hash, signup/login are demo), so there is
//                           no old password to verify and no safe
//                           place to store a new one.
//   section "close":         NOT implemented, on purpose -- deleting
//                           a user's data needs a confirmed, logged-in
//                           account owner. Returns 400, deletes nothing.
//
// USER ID: same placeholder as the rest of the dashboard
// (DASHBOARD_USER_ID / "demo-jake") until login is connected.

import { NextResponse } from "next/server";
import { connection } from "next/server";
import { getDb } from "@/lib/mongodb";
import { getSettingsData, getCurrentUserId } from "@/lib/settings-data";

export async function GET() {
  await connection();
  const data = await getSettingsData();
  return NextResponse.json(data);
}

export async function POST(request) {
  await connection();
  const db = await getDb().catch(() => null);
  if (!db) {
    return NextResponse.json(
      { error: "MongoDB is not connected. Set MONGODB_URI in .env or .env.local." },
      { status: 503 }
    );
  }

  const body = await request.json().catch(() => ({}));
  const section = body.section;
  const userId = getCurrentUserId();

  if (section === "profile") {
    const fullName = String(body.fullName || "").trim();
    const email = String(body.email || "").trim();
    if (!fullName) {
      return NextResponse.json({ error: "Full Name is required." }, { status: 400 });
    }
    if (email && !email.includes("@")) {
      return NextResponse.json({ error: "Please enter a valid email address." }, { status: 400 });
    }
    await db.collection("users").updateOne(
      { userId },
      { $set: { name: fullName, ...(email ? { email } : {}) } },
      { upsert: true }
    );
    await db.collection("profiles").updateOne(
      { userId },
      {
        $set: {
          "additionalDetails.phone": String(body.phone || ""),
          ...(email ? { "additionalDetails.email": email } : {}),
        },
      },
      { upsert: true }
    );
    await db.collection("settings").updateOne(
      { userId },
      {
        $set: {
          dateOfBirth: String(body.dateOfBirth || ""),
          gender: String(body.gender || ""),
          accountType: body.accountType === "employer" ? "employer" : "jobSeeker",
        },
      },
      { upsert: true }
    );
    return NextResponse.json({ message: "Profile saved." });
  }

  if (section === "login-email") {
    const newEmail = String(body.newEmail || "").trim();
    if (!newEmail || !newEmail.includes("@")) {
      return NextResponse.json({ error: "Please enter a valid new email address." }, { status: 400 });
    }
    await db.collection("users").updateOne({ userId }, { $set: { email: newEmail } });
    await db.collection("settings").updateOne(
      { userId },
      { $set: { emailVerified: false } },
      { upsert: true }
    );
    return NextResponse.json({
      message: "Email updated. It is now marked unverified until a verification flow is connected.",
    });
  }

  if (section === "notifications") {
    const n = body.notifications || {};
    await db.collection("settings").updateOne(
      { userId },
      {
        $set: {
          notifications: {
            applications: Boolean(n.applications),
            jobs: Boolean(n.jobs),
            recommendations: Boolean(n.recommendations),
          },
        },
      },
      { upsert: true }
    );
    return NextResponse.json({ message: "Notification preferences saved." });
  }

  if (section === "password") {
    return NextResponse.json(
      {
        error:
          "Password change is not connected yet: there is no login system with stored passwords in this project, so the old password cannot be verified and a new password cannot be stored safely. Connect login/auth first, then this endpoint can check the old password hash and store the new one.",
      },
      { status: 400 }
    );
  }

  if (section === "close") {
    return NextResponse.json(
      {
        error:
          "Close Account is not enabled yet: deleting account data needs a confirmed, logged-in account owner. Nothing was deleted.",
      },
      { status: 400 }
    );
  }

  return NextResponse.json({ error: "Unknown settings section." }, { status: 400 });
}
