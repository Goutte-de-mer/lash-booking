import connect from "@/lib/mongodb";
import Booking from "@/models/Booking";
import { NextResponse } from "next/server";
import { getUser } from "@/lib/jwt";

export async function GET(req) {
  const user = getUser(req);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await connect();
  const bookings = await Booking.find({ userId: user.id }).populate(
    "serviceId",
  );
  return NextResponse.json(bookings, { status: 200 });
}

export async function POST(req) {
  const user = getUser(req);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await connect();
  const body = await req.json();

  // ⚠️ VULN-04 — Mass Assignment
  // Tout le body est spreadé sans whitelist.
  // Un attaquant peut envoyer { status: "confirmed", paymentStatus: "paid", amountPaid: 85 }
  // et Mongoose acceptera ces champs car ils sont dans le schéma.

  const booking = await Booking.create({
    ...body,
    userId: user.id,
  });
  return NextResponse.json(booking, { status: 201 });
}
