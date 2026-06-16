import { NextResponse } from "next/server";
import connect from "@/lib/mongodb";
import Service from "@/models/Service";

export async function GET() {
  await connect();
  const services = await Service.find({});
  return NextResponse.json(services);
}
