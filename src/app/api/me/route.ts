import { getCurrentUserFromToken } from "@/lib/Session";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const token = req.cookies.get("accessToken")?.value;

  const userDetail = await getCurrentUserFromToken(token);

  if (!userDetail) {
    return NextResponse.json({ user: null }, { status: 401 });
  }

  return NextResponse.json({ userDetail }, { status: 200 });
}
