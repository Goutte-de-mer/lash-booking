import connect from "@/lib/mongodb";
import Booking from "@/models/Booking";
import { NextResponse } from "next/server";
import { getUser } from "@/lib/jwt";

export async function GET(req, { params }) {
  const user = getUser(req);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  await connect();

  const booking = await Booking.findOne({ _id: id, userId: user.id }).populate("serviceId");

  if (!booking) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json(booking, { status: 200 });
}

export async function DELETE(req, { params }) {
  const user = getUser(req);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  await connect();

  const booking = await Booking.findOneAndDelete({ _id: id, userId: user.id });

  if (!booking) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json({ message: "Deleted" }, { status: 200 });
}

export async function PATCH(req, { params }) {
  const user = getUser(req);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const { status } = await req.json();
  await connect();

  const booking = await Booking.findOneAndUpdate(
    { _id: id, userId: user.id },
    { status },
    { new: true },
  );

  if (!booking) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json(booking, { status: 200 });
}
