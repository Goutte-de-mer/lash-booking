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

  const bookings = await Booking.find({ userId: user.id }).populate("serviceId");
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

  const { serviceId, slotStart, duration, paymentType } = await req.json();

  const service = await Service.findById(serviceId);
  if (!service) {
    return NextResponse.json({ error: "Service not found" }, { status: 404 });
  }

  const amountPaid = paymentType === "full" ? service.price : service.depositAmount;
  const paymentStatus = paymentType === "full" ? "paid" : "partial";

  const booking = await Booking.create({
    serviceId,
    slotStart,
    duration,
    paymentType,
    amountPaid,
    paymentStatus,
    status: "pending",
    userId: user.id,
  });

  return NextResponse.json(booking, { status: 201 });
}
