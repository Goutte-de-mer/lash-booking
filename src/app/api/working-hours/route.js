import { NextResponse } from "next/server";
import connect from "@/lib/mongodb";
import WorkingHours from "@/models/WorkingHours";

export async function GET() {
  await connect();
  const workingHours = await WorkingHours.find({});
  return NextResponse.json(workingHours);
}
