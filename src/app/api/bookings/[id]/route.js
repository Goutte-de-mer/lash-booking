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

  // ⚠️ VULN-01 — IDOR (Insecure Direct Object Reference)
  // On cherche la réservation uniquement par son _id, sans vérifier
  // que booking.userId === user.id. N'importe quel utilisateur
  // authentifié peut lire la réservation de quelqu'un d'autre
  // en changeant l'id dans l'URL.

  const booking = await Booking.findById(id).populate("serviceId");

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

  // ⚠️ VULN-01 — même absence de vérification d'ownership
  const booking = await Booking.findByIdAndDelete(id);

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
  const body = await req.json();
  await connect();

  // ⚠️ VULN-01 + VULN-04 combinés ici aussi
  const booking = await Booking.findByIdAndUpdate(
    id,
    { ...body },
    { new: true },
  );

  if (!booking) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json(booking, { status: 200 });
}
