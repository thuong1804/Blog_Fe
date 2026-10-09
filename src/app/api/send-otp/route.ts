import { NextResponse } from "next/server";

export async function POST(req: Request) {
    const { email } = await req.json();

    const res = NextResponse.json({ success: true });
    res.cookies.set("emailVerify", email, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        path: "/",
        maxAge: 5 * 60,
    });
    return res;
}
