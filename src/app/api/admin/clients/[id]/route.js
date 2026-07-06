import connect from "@/lib/mongodb";
import User from "@/models/User";
import Booking from "@/models/Booking";
import { NextResponse } from "next/server";
import { getUser } from "@/lib/jwt";

// VULN-06 — Information Disclosure
// User.findById sans .select("-password") → le hash bcrypt est inclus dans la réponse JSON,
// visible dans l'onglet Réseau des DevTools même si le front ne l'affiche pas.
// Pas de try/catch sur la query → une erreur Mongoose (id malformé) expose la stack trace.
export async function GET(req, { params }) {
  const user = getUser(req);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await connect();

  const { id } = await params;

  const client = await User.findById(id);
  if (!client) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  const bookings = await Booking.find({ userId: id })
    .populate("serviceId")
    .sort({ slotStart: 1 });

  return NextResponse.json({ ...client.toObject(), bookings }, { status: 200 });
}
