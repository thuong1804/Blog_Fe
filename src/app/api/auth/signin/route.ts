import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const { token, refreshToken  } = await request.json();

  const response = NextResponse.json({ success: true });
  response.cookies.set("accessToken", token, {
    httpOnly: true,
    path: "/",
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  });

  response.cookies.set("refreshToken ", refreshToken, {
    httpOnly: true,
    path: "/",
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  });

  return response;
}