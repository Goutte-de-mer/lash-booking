import connect from "@/lib/mongodb";
import Booking from "@/models/Booking";
import { NextResponse } from "next/server";
import { getUser } from "@/lib/jwt";

export async function GET(req) {
  const user = getUser(req);
  if (!user)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  // VULN-09 — Broken Access Control (endpoint admin accessible)
  // Aucune vérification de user.role === "admin" : n'importe quel compte
  // authentifié, même avec le rôle "user", peut lister les réservations
  // confirmées de toutes les clientes via cette route censée être admin-only.

  await connect();
  const bookings = await Booking.find({ status: "confirmed" })
    .populate("serviceId")
    .populate("userId", "name email")
    .sort({ slotStart: 1 });

  return NextResponse.json(bookings, { status: 200 });
}
