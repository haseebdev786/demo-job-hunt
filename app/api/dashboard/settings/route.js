import { NextResponse } from "next/server";
import { connection } from "next/server";
import { getDb } from "@/lib/mongodb";
import { getSettingsData, getCurrentUserId } from "@/lib/settings-data";
import { decodeProfilePhoto, saveProfileIdentity } from "@/lib/save-profile-identity";

export async function GET() {
  await connection();
  const data = await getSettingsData();
  return NextResponse.json(data);
}

export async function POST(request) {
  if (request.headers.get("origin") !== new URL(request.url).origin) return NextResponse.json({ error: "Invalid origin." }, { status: 403 });
  await connection();
  const db = await getDb().catch(() => null);
  if (!db) {
    return NextResponse.json(
      { error: "MongoDB is not connected. Set MONGODB_URI in .env or .env.local." },
      { status: 503 }
    );
  }

  const raw = await request.text();
  if (raw.length > 450000) return NextResponse.json({ error: "Profile upload is too large." }, { status: 413 });
  let body;
  try { body = JSON.parse(raw); } catch { return NextResponse.json({ error: "Invalid profile data." }, { status: 400 }); }
  if (!body || typeof body !== "object") return NextResponse.json({ error: "Invalid profile data." }, { status: 400 });
  const section = body.section;
  const userId = await getCurrentUserId();
  if (!userId) return NextResponse.json({ error: "Please log in." }, { status: 401 });

  if (section === "profile") {
    const fullName = String(body.fullName || "").trim();
    const email = String(body.email || "").trim();
    if (!fullName || fullName.length > 100) {
      return NextResponse.json({ error: "Full Name is required (maximum 100 characters)." }, { status: 400 });
    }
    if (email && !email.includes("@")) {
      return NextResponse.json({ error: "Please enter a valid email address." }, { status: 400 });
    }
    let photo;
    try { if (body.photo) photo = decodeProfilePhoto(body.photo); }
    catch (error) { return NextResponse.json({ error: error.message }, { status: 400 }); }
    try { await saveProfileIdentity(db, request, userId, fullName, photo); }
    catch { return NextResponse.json({ error: "Could not save your name or photo. Please try again." }, { status: 503 }); }
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
