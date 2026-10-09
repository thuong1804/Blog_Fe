import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { print } from "graphql";
import { REFRESH_TOKEN } from "@/graphql/Mutation/Auth";
import { jwtVerify } from "jose";

function getAccessSecret(): string | null {
    const secret = process.env.ACCESS_TOKEN_SECRET;
    if (!secret) {
        console.error("Missing ACCESS_TOKEN_SECRET");
        return null;
    }
    return secret;
}

async function isTokenValid(
    token: string,
    secret: string,
): Promise<boolean> {
    try {
        // Pin the algorithm: never accept "none" or an unexpected alg.
        await jwtVerify(token, new TextEncoder().encode(secret), {
            algorithms: ["HS256"],
        });
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

    const redirectToSignIn = () => {
        const next = `${req.nextUrl.pathname}${req.nextUrl.search}`;
        url.pathname = "/signin";
        url.search = `?next=${encodeURIComponent(next)}`;
        return NextResponse.redirect(url);
    };

    if (req.nextUrl.pathname.startsWith("/verify-otp") && !email) {
        url.pathname = "/signin";
        return NextResponse.redirect(url);
    }

    if (req.nextUrl.pathname.startsWith("/verify-otp")) {
        return NextResponse.next();
    }

    if (!accessToken && !refreshToken) {
        return redirectToSignIn();
    }

    const isAccessTokenValid = accessToken
        ? await isTokenValid(accessToken, secret)
        : false;

    if (!isAccessTokenValid && refreshToken) {
        try {
            const queryString = print(REFRESH_TOKEN);
            const response = await fetch(`${process.env.NEXT_PUBLIC_URL_API}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                // Token refresh must never be cached.
                cache: "no-store",
                body: JSON.stringify({
                    query: queryString,
                    variables: { refreshToken },
                }),
            });

            if (!response.ok) {
                return redirectToSignIn();
            }
            const { data } = await response.json().catch(() => ({}));

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
                // Persist the rotated refresh token — otherwise the rotation
                // chain breaks and the user is logged out on next refresh.
                const newRefreshToken = data.refreshToken.refreshToken;
                if (typeof newRefreshToken === "string" && newRefreshToken) {
                    res.cookies.set("refreshToken", newRefreshToken, {
                        httpOnly: true,
                        secure: process.env.NODE_ENV === "production",
                        sameSite: "strict",
                        path: "/",
                        maxAge: 30 * 24 * 60 * 60,
                    });
                }
                return res;
            } else {
                return redirectToSignIn();
            }
        } catch {
            return redirectToSignIn();
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        "/profile/:path*",
        "/verify-otp",
        "/post/new",
        "/post/:id",
        "/post/edit/:path*",
        "/edit-post/:path*",
        "/saved",
    ],
};
