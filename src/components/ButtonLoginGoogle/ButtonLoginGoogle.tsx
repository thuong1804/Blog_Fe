"use client";

import Button from "../Button/Button";
import { FcGoogle } from "react-icons/fc";
import Link from "next/link";

export default function ButtonLoginGoogle() {
  const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
  const redirectUri = `${process.env.NEXT_PUBLIC_URL_BLOG}/api/auth/callback/google`;
  const scope = "openid email profile";
  const responseType = "code";
  const prompt = "select_account";

  const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${encodeURIComponent(
    redirectUri
  )}&response_type=${responseType}&scope=${encodeURIComponent(
    scope
  )}&prompt=${prompt}`;


  return (
    <Button type="button" classNames="bg-white w-full rounded-[30px] w-full  hover:bg-gray-100 transition">
      <Link href={googleAuthUrl} target="_blank" className="flex items-center justify-center gap-2">
        <FcGoogle className="text-xl" />
        <span className="text-gray-700 font-medium">Login with Google</span>
      </Link>
    </Button>
  );
}
