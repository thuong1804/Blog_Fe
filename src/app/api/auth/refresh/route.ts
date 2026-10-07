import { NextRequest, NextResponse } from "next/server";
import { print } from "graphql";
import { REFRESH_TOKEN } from "@/graphql/Mutation/Auth";

const isProd = process.env.NODE_ENV === "production";

/**
 * Silent session refresh for client-side mutations: reads the httpOnly
 * refreshToken cookie, rotates it at the backend, and re-sets both cookies.
 * Used by the Apollo error link to retry an operation once after a 401.
 */
export async function POST(req: NextRequest) {
    const refreshToken = req.cookies.get("refreshToken")?.value;
    if (!refreshToken) {
        return NextResponse.json({ ok: false }, { status: 401 });
    }

    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_URL_API}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            cache: "no-store",
            body: JSON.stringify({
                query: print(REFRESH_TOKEN),
                variables: { refreshToken },
            }),
        });
        if (!response.ok) {
            return NextResponse.json({ ok: false }, { status: 401 });
        }
        const { data } = await response.json().catch(() => ({}));
        const payload = data?.refreshToken;
        if (!payload?.token) {
            return NextResponse.json({ ok: false }, { status: 401 });
        }

        const res = NextResponse.json({ ok: true });
        res.cookies.set("accessToken", payload.token, {
            httpOnly: true,
            secure: isProd,
            sameSite: "strict",
            path: "/",
            maxAge: 60 * 60,
        });
        if (typeof payload.refreshToken === "string" && payload.refreshToken) {
            res.cookies.set("refreshToken", payload.refreshToken, {
                httpOnly: true,
                secure: isProd,
                sameSite: "strict",
                path: "/",
                maxAge: 30 * 24 * 60 * 60,
            });
        }
        return res;
    } catch {
        return NextResponse.json({ ok: false }, { status: 401 });
    }
}
