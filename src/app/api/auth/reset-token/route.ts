import { NextResponse } from "next/server";

const isProd = process.env.NODE_ENV === "production";

// Stores the password-reset token in an httpOnly cookie so it is never
// readable by JavaScript (XSS cannot steal it from localStorage anymore).
export async function POST(request: Request) {
    const { token } = await request.json();

    if (
        typeof token !== "string" ||
        !token ||
        token.length > 2048
    ) {
        return NextResponse.json({ error: "Invalid token" }, { status: 400 });
    }

    const res = NextResponse.json({ success: true });
    res.cookies.set("resetToken", token, {
        httpOnly: true,
        path: "/",
        secure: isProd,
        sameSite: "strict",
        maxAge: 5 * 60, // 5 minutes, single use
    });
    return res;
}

export async function DELETE() {
    const res = NextResponse.json({ success: true });
    res.cookies.set("resetToken", "", {
        httpOnly: true,
        path: "/",
        secure: isProd,
        sameSite: "strict",
        maxAge: 0,
    });
    return res;
}
