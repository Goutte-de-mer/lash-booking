import connect from "@/lib/mongodb";
import User from "@/models/User";
import Booking from "@/models/Booking";
import { NextResponse } from "next/server";
import { getUser } from "@/lib/jwt";

export async function GET(req, { params }) {
  const user = getUser(req);
  if (!user || user.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    await connect();

    const { id } = await params;

    const client = await User.findById(id).select("-password");
    if (!client) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const bookings = await Booking.find({ userId: id })
      .populate("serviceId")
      .sort({ slotStart: 1 });

    return NextResponse.json({ ...client.toObject(), bookings }, { status: 200 });
  } catch {
    return NextResponse.json({ error: "Une erreur est survenue" }, { status: 500 });
  }
}
