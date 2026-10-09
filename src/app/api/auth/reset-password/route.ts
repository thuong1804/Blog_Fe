import { NextResponse } from "next/server";
import { print } from "graphql";
import { RESET_PASSWORD } from "@/graphql/Mutation/Auth";

// Proxy: reads the reset token from the httpOnly cookie server-side and
// forwards it to the GraphQL API. The token never touches client JS.
export async function POST(request: Request) {
    const { newPassword } = await request.json();

    if (
        typeof newPassword !== "string" ||
        newPassword.length < 8 ||
        newPassword.length > 128
    ) {
        return NextResponse.json(
            { error: "Invalid password" },
            { status: 400 },
        );
    }

    // Convex-style cookie read without next/headers: parse from the request.
    const cookieHeader = request.headers.get("cookie") ?? "";
    const resetToken = cookieHeader
        .split(";")
        .map((c) => c.trim())
        .find((c) => c.startsWith("resetToken="))
        ?.slice("resetToken=".length);

    if (!resetToken) {
        return NextResponse.json(
            { error: "Reset session expired. Please request a new code." },
            { status: 401 },
        );
    }

    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_URL_API}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                query: print(RESET_PASSWORD),
                variables: { token: resetToken, newPassword },
            }),
        });

        const result = await response.json();
        const payload = result?.data?.resetPassword;

        if (!payload?.success) {
            return NextResponse.json(
                { error: "Unable to reset password. Please try again." },
                { status: 400 },
            );
        }

        const res = NextResponse.json({ success: true });
        // Single use: burn the cookie after success.
        res.cookies.set("resetToken", "", {
            httpOnly: true,
            path: "/",
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 0,
        });
        return res;
    } catch {
        return NextResponse.json(
            { error: "Unable to reset password. Please try again." },
            { status: 502 },
        );
    }
}
