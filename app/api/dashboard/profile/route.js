import { getCurrentUser } from "@/lib/session";
import { getDb } from "@/lib/db";
import { getProfileData } from "@/lib/profile-data";
import { validateProfileSection } from "@/lib/profile-fields";
import { saveProfileIdentity } from "@/lib/save-profile-identity";

export async function GET() {
  if (!await getCurrentUser()) return Response.json({ error: "Please log in." }, { status: 401 });
  return Response.json(await getProfileData(), { headers: { "Cache-Control": "no-store" } });
}

export async function POST(request) {
  if (request.headers.get("origin") !== new URL(request.url).origin) return Response.json({ error: "Invalid origin." }, { status: 403 });
  try {
    const user = await getCurrentUser();
    if (!user) return Response.json({ error: "Please log in." }, { status: 401 });
    let section, value;
    try {
      const raw = await request.text();
      if (raw.length > 150000) return Response.json({ error: "Profile details are too large." }, { status: 413 });
      const body = JSON.parse(raw);
      section = body.section;
      value = validateProfileSection(section, body.value);
    } catch (error) { return Response.json({ error: error.message }, { status: 400 }); }
    const db = await getDb();
    const userId = String(user.id);
    let update;
    if (section === "overview") {
      const { fullName, ...profile } = value;
      await saveProfileIdentity(db, request, userId, fullName);
      update = { ...profile, "additionalDetails.location": profile.location };
    } else if (section === "about") update = value;
    else if (section === "additionalDetails") update = { additionalDetails: value, location: value.location };
    else update = { [section]: value };
    await db.collection("profiles").updateOne({ userId }, { $set: update }, { upsert: true });
    return Response.json({ message: "Profile saved." });
  } catch { return Response.json({ error: "Could not save your profile. Please try again." }, { status: 503 }); }
}
