import { getDb } from "@/lib/db";

export async function GET(request, { params }) {
  const { id } = await params;
  if (!/^[a-f\d]{24}$/i.test(id)) return new Response(null, { status: 404 });
  const db = await getDb();
  const photo = await db.collection("profilePhotos").findOne({ _id: id });
  if (!photo) return new Response(null, { status: 404 });
  return new Response(new Uint8Array(photo.data.buffer), { headers: {
    "Content-Type": photo.contentType,
    "Cache-Control": "public, max-age=0, must-revalidate",
    "X-Content-Type-Options": "nosniff",
  } });
}
