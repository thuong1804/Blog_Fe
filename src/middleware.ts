import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { print } from "graphql";
import { REFRESH_TOKEN } from "@/graphql/Mutation/Auth";
import jwt from "jsonwebtoken";

function getAccessSecret(): string | null {
    const secret = process.env.ACCESS_TOKEN_SECRET;
    if (!secret) {
        console.error("Missing ACCESS_TOKEN_SECRET");
        return null;
    }
    return secret;
}

function isTokenValid(token: string, secret: string): boolean {
    try {
        // Pin the algorithm: never accept "none" or an unexpected alg.
        jwt.verify(token, secret, { algorithms: ["HS256"] });
        return true;
    } catch {
        return false;
    }
}

export async function middleware(req: NextRequest) {
    const secret = getAccessSecret();
    if (!secret) {
        const url = req.nextUrl.clone();
        url.pathname = "/";
        return NextResponse.redirect(url);
    }

    const accessToken = req.cookies.get("accessToken")?.value;
    const refreshToken = req.cookies.get("refreshToken")?.value;
    const email = req.cookies.get("emailVerify")?.value;
    const url = req.nextUrl.clone();

    if (req.nextUrl.pathname.startsWith("/verify-otp") && !email) {
        url.pathname = "/signin";
        return NextResponse.redirect(url);
    }

    if (req.nextUrl.pathname.startsWith("/verify-otp")) {
        return NextResponse.next();
    }

    if (!accessToken && !refreshToken) {
        url.pathname = "/";
        return NextResponse.redirect(url);
    }

    const isAccessTokenValid = accessToken
        ? isTokenValid(accessToken, secret)
        : false;

    if (!isAccessTokenValid && refreshToken) {
        try {
            const queryString = print(REFRESH_TOKEN);
            const response = await fetch(`${process.env.NEXT_PUBLIC_URL_API}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    query: queryString,
                    variables: { refreshToken },
                }),
            });

            const { data } = await response.json();

            if (data?.refreshToken?.token) {
                const newAccessToken = data.refreshToken.token;

                const res = NextResponse.next();
                res.cookies.set("accessToken", newAccessToken, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === "production",
                    sameSite: "strict",
                    path: "/",
                    maxAge: 60 * 60,
                });
                return res;
            } else {
                url.pathname = "/";
                return NextResponse.redirect(url);
            }
        } catch {
            url.pathname = "/";
            return NextResponse.redirect(url);
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        "/profile/:path*",
        "/verify-otp",
        "/post/new",
        "/post/edit/:path*",
        "/edit-post/:path*",
    ],
};
