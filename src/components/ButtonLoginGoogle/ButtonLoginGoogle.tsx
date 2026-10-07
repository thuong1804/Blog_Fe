"use client";

import { useEffect, useState } from "react";
import { FcGoogle } from "react-icons/fc";
import Link from "next/link";

const STATE_COOKIE = "g_oauth_state";
const NEXT_COOKIE = "g_oauth_next";

function newState(): string {
    const arr = new Uint8Array(16);
    crypto.getRandomValues(arr);
    return Array.from(arr)
        .map((b) => b.toString(16).padStart(2, "0"))
        .join("");
}

export default function ButtonLoginGoogle({ next }: { next?: string }) {
    const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
    const redirectUri = `${process.env.NEXT_PUBLIC_URL_BLOG}/api/auth/callback/google`;
    const scope = "openid email profile";
    const responseType = "code";
    const prompt = "select_account";

    const [state, setState] = useState("");

    useEffect(() => {
        const s = newState();
        setState(s);
        // Cookie (not httpOnly on purpose): server callback reads it to
        // verify `state` and reject forged logins (CSRF). Short-lived.
        document.cookie = `${STATE_COOKIE}=${s}; Max-Age=600; Path=/; SameSite=Lax`;
        if (next && next !== "/") {
            document.cookie = `${NEXT_COOKIE}=${encodeURIComponent(next)}; Max-Age=600; Path=/; SameSite=Lax`;
        }
    }, [next]);

    const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${encodeURIComponent(
        redirectUri,
    )}&response_type=${responseType}&scope=${encodeURIComponent(
        scope,
    )}&prompt=${prompt}&state=${state}&access_type=offline&include_granted_scopes=true`;

    return (
        <Link
            href={state ? googleAuthUrl : "#"}
            target="_blank"
            aria-disabled={!state}
            className="btn flex w-full items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white py-3 text-gray-700 shadow-sm transition hover:bg-gray-50 hover:shadow"
        >
            <FcGoogle className="text-xl" />
            <span className="font-medium text-gray-700">Login with Google</span>
        </Link>
    );
}
