import { NextResponse } from "next/server";

const attempts = new Map();
const MAX_ATTEMPTS = 5;
const WINDOW_MS = 15 * 60 * 1000; // 15 minutes

export function proxy(req) {
  const ip = req.headers.get("x-forwarded-for") ?? "unknown";
  const now = Date.now();
  const entry = attempts.get(ip);

  if (entry && now - entry.firstAttempt < WINDOW_MS) {
    if (entry.count >= MAX_ATTEMPTS) {
      return NextResponse.json(
        { error: "Trop de tentatives, réessayez dans 15 minutes" },
        { status: 429 },
      );
    }
    entry.count++;
  } else {
    attempts.set(ip, { count: 1, firstAttempt: now });
  }

  return NextResponse.next();
}

export const config = {
  matcher: "/api/auth/login",
};
