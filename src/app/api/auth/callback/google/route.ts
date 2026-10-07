import { NextRequest, NextResponse } from "next/server";
import { print } from "graphql";
import { LOGIN_WITH_GOOGLE } from "@/graphql/Mutation/Auth";

const STATE_COOKIE = "g_oauth_state";
const isProd = process.env.NODE_ENV === "production";

export async function GET(req: NextRequest) {
    const code = req.nextUrl.searchParams.get("code");
    const state = req.nextUrl.searchParams.get("state");
    const stateCookie = req.cookies.get(STATE_COOKIE)?.value;

    if (!code) {
        return NextResponse.json({ error: "Missing code" }, { status: 400 });
    }

    // CSRF protection: Google must echo back the `state` we set before redirect
    if (!state || !stateCookie || state !== stateCookie) {
        return NextResponse.json(
            { error: "Invalid OAuth state" },
            { status: 403 },
        );
    }

    const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
    const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
    if (!clientId || !clientSecret) {
        console.error("Google login misconfigured: missing client id/secret");
        return NextResponse.json(
            { error: "OAuth misconfigured" },
            { status: 500 },
        );
    }

    try {
        const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: new URLSearchParams({
                code,
                client_id: clientId,
                client_secret: clientSecret,
                redirect_uri: `${process.env.NEXT_PUBLIC_URL_BLOG}/api/auth/callback/google`,
                grant_type: "authorization_code",
            }),
        });

        if (!tokenRes.ok) {
            console.error("Google token exchange failed");
            return NextResponse.json(
                { error: "OAuth failed" },
                { status: 400 },
            );
        }
        const tokens = await tokenRes.json().catch(() => null);

        if (!tokens || tokens.error || !tokens.id_token) {
            console.error("Google token exchange failed");
            return NextResponse.json(
                { error: "OAuth failed" },
                { status: 400 },
            );
        }

        const response = await fetch(`${process.env.NEXT_PUBLIC_URL_API}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            cache: "no-store",
            body: JSON.stringify({
                query: print(LOGIN_WITH_GOOGLE),
                variables: { idToken: tokens.id_token },
            }),
        });

        if (!response.ok) {
            console.error("Backend Google login failed");
            return NextResponse.json(
                { error: "OAuth failed" },
                { status: 502 },
            );
        }
        const result = await response.json().catch(() => null);
        const session = result?.data?.loginWithGoogle;
        if (!session?.token) {
            console.error("Backend Google login failed");
            return NextResponse.json(
                { error: "OAuth failed" },
                { status: 502 },
            );
        }

        const base =
            process.env.NEXT_PUBLIC_URL_BLOG || "http://localhost:5000";
        const rawNext = req.cookies.get("g_oauth_next")?.value;
        let destination = base;
        if (rawNext) {
            try {
                const candidate = decodeURIComponent(rawNext);
                if (
                    candidate.startsWith("/") &&
                    !candidate.startsWith("//") &&
                    !candidate.includes("\\")
                ) {
                    destination = `${base}${candidate}`;
                }
            } catch {
                /* invalid encoding -> home */
            }
        }
        const res = NextResponse.redirect(destination);

        res.cookies.set("accessToken", session.token, {
            httpOnly: true,
            path: "/",
            secure: isProd,
            sameSite: "lax",
            maxAge: 7 * 24 * 60 * 60,
        });
        if (session.refreshToken) {
            res.cookies.set("refreshToken", session.refreshToken, {
                httpOnly: true,
                path: "/",
                secure: isProd,
                sameSite: "lax",
                maxAge: 30 * 24 * 60 * 60,
            });
        }
        // Single-use state: clear it
        res.cookies.set(STATE_COOKIE, "", { path: "/", maxAge: 0 });
        res.cookies.set("g_oauth_next", "", { path: "/", maxAge: 0 });
        return res;
    } catch (err) {
        // Log message only — the error object may contain the OAuth `code`.
        console.error(
            "Google login error:",
            err instanceof Error ? err.message : "unknown",
        );
        return NextResponse.json({ error: "OAuth failed" }, { status: 500 });
    }
}
