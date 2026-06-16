import { NextResponse } from "next/server";
import { getAvailability } from "@/lib/availability";
import { verifyToken } from "@/lib/jwt";

export async function GET(request) {
  const authHeader = request.headers.get("authorization");
  const token = authHeader?.startsWith("Bearer ")
    ? authHeader.split(" ")[1]
    : null;

  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let user;
  try {
    user = verifyToken(token);
  } catch {
    return NextResponse.json({ error: "Invalid token" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const date = searchParams.get("date");
  const duration = Number(searchParams.get("duration"));
  const excludeBookingId = searchParams.get("excludeBookingId") || undefined;

  if (excludeBookingId && user.role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const slots = await getAvailability({ date, duration, excludeBookingId });
  return NextResponse.json(slots);
}
