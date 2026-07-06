import connect from "@/lib/mongodb";
import User from "@/models/User";
import Booking from "@/models/Booking";
import { NextResponse } from "next/server";
import { getUser } from "@/lib/jwt";

// VULN-06 (partiel) — aucun contrôle de rôle : n'importe quel user authentifié
// peut lister toutes les clientes (Broken Access Control)
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

  const users = await User.find({});
  const usersWithCount = await Promise.all(
    users.map(async (u) => {
      const bookingCount = await Booking.countDocuments({ userId: u._id });
      return { ...u.toObject(), bookingCount };
    }),
  );

  return NextResponse.json(usersWithCount, { status: 200 });
}
