import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const response = NextResponse.redirect(new URL("/dashboard", request.url), 303);
  response.cookies.set("cloudguard_session", "demo", {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 8
  });
  return response;
}
