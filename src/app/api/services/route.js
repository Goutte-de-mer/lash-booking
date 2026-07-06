import { NextResponse } from "next/server";
import connect from "@/lib/mongodb";
import Service from "@/models/Service";

export async function GET() {
  try {
    await connect();
  } catch {
    return NextResponse.json(
      { error: "Service indisponible, réessayez plus tard" },
      { status: 503 },
    );
  }
  const services = await Service.find({});
  return NextResponse.json(services);
}
