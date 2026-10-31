// Place this file at: app/api/dashboard/route.js
// GET /api/dashboard -> the same data the dashboard page renders.
// The page itself reads lib/dashboard-data.js directly (server-side,
// no HTTP loop). This route exists so client components, mobile apps,
// or a future refresh button can fetch the same live data.
//
// NEXT 16 FIX: same as the page -- do NOT use
// `export const dynamic = "force-dynamic"` with cacheComponents: true.
// Route handlers use `await connection()` instead to stay dynamic.

import { NextResponse, connection } from "next/server";
import { getDashboardData } from "@/lib/dashboard-data";

export async function GET() {
  await connection();
  const data = await getDashboardData();
  return NextResponse.json(data);
}
