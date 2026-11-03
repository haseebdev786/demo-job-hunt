import "server-only";
import { randomUUID } from "node:crypto";
import { auth } from "./auth";

export function decodeProfilePhoto(photo) {
  if (typeof photo !== "string" || photo.length > 400000) throw new Error("Profile photo is too large.");
  const match = /^data:image\/(webp|png|jpeg);base64,([A-Za-z0-9+/]+={0,2})$/.exec(photo);
  if (!match) throw new Error("Invalid profile photo.");
  const data = Buffer.from(match[2], "base64");
  const valid = match[1] === "webp" ? data.toString("ascii", 0, 4) === "RIFF" && data.toString("ascii", 8, 12) === "WEBP"
    : match[1] === "png" ? data.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]))
    : data[0] === 255 && data[1] === 216 && data[2] === 255;
  if (!valid || data.length > 256 * 1024) throw new Error("Invalid or oversized profile photo.");
  return { data, contentType: `image/${match[1]}` };
}

export async function saveProfileIdentity(db, request, userId, name, photo) {
  let image;
  if (photo) {
    const version = randomUUID();
    await db.collection("profilePhotos").updateOne({ _id: userId }, { $set: { ...photo, version } }, { upsert: true });
    image = `/api/avatar/${encodeURIComponent(userId)}?v=${version}`;
  }
  await auth.api.updateUser({ headers: request.headers, body: { name, ...(image ? { image } : {}) } });
  await db.collection("users").updateOne({ userId }, { $set: { name, ...(image ? { avatarUrl: image } : {}) } }, { upsert: true });
}
