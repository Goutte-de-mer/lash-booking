import connect from "@/lib/mongodb";
import Booking from "@/models/Booking";
import Service from "@/models/Service";
import { NextResponse } from "next/server";
import { getUser } from "@/lib/jwt";

export async function GET(req) {
  const user = getUser(req);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    await connect();
  } catch {
    return NextResponse.json(
      { error: "Service indisponible, réessayez plus tard" },
      { status: 503 },
    );
  }

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

  try {
    await connect();
  } catch {
    return NextResponse.json(
      { error: "Service indisponible, réessayez plus tard" },
      { status: 503 },
    );
  }

  const body = await req.json();

  const service = await Service.findById(body.serviceId);
  if (!service) {
    return NextResponse.json({ error: "Service not found" }, { status: 404 });
  }

  const defaultAmountPaid =
    body.paymentType === "full" ? service.price : service.depositAmount;
  const defaultPaymentStatus = body.paymentType === "full" ? "paid" : "partial";
  const status = "confirmed";

  // VULN-04 — Mass Assignment
  // Les valeurs par défaut sont correctes si le body ne précise rien,
  // mais le spread du body après écrase tout champ envoyé par le client
  // (ex: { amountPaid: 0, paymentStatus: "paid", status: "confirmed" }).
  // Mongoose accepte ces champs car ils sont dans le schéma.

  const booking = await Booking.create({
    amountPaid: defaultAmountPaid,
    paymentStatus: defaultPaymentStatus,
    status,
    ...body,
    userId: user.id,
  });
  return NextResponse.json(booking, { status: 201 });
}
