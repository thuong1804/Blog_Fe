import { NextResponse } from "next/server";

const isProd = process.env.NODE_ENV === "production";

export async function POST(request: Request) {
    const { token, refreshToken } = await request.json();

    if (
        typeof token !== "string" ||
        typeof refreshToken !== "string" ||
        !token ||
        !refreshToken ||
        token.length > 4096 ||
        refreshToken.length > 4096
    ) {
        return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
    }

    const response = NextResponse.json({ success: true });
    response.cookies.set("accessToken", token, {
        httpOnly: true,
        path: "/",
        secure: isProd,
        sameSite: "strict",
        maxAge: 60 * 60, // 1h, refreshed silently by middleware
    });

    response.cookies.set("refreshToken", refreshToken, {
        httpOnly: true,
        path: "/",
        secure: isProd,
        sameSite: "strict",
        maxAge: 30 * 24 * 60 * 60, // 30d
    });

    return response;
}
