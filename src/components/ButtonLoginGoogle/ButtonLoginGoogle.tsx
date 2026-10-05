"use client";

import { FcGoogle } from "react-icons/fc";
import Link from "next/link";

export default function ButtonLoginGoogle() {
    const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
    const redirectUri = `${process.env.NEXT_PUBLIC_URL_BLOG}/api/auth/callback/google`;
    const scope = "openid email profile";
    const responseType = "code";
    const prompt = "select_account";

    const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${encodeURIComponent(
        redirectUri,
    )}&response_type=${responseType}&scope=${encodeURIComponent(
        scope,
    )}&prompt=${prompt}`;

    return (
        <Link
            href={googleAuthUrl}
            target="_blank"
            className="btn flex w-full items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white py-3 text-gray-700 shadow-sm transition hover:bg-gray-50 hover:shadow"
        >
            <FcGoogle className="text-xl" />
            <span className="font-medium text-gray-700">Login with Google</span>
        </Link>
    );
}
