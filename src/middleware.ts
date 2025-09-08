import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { print } from "graphql";
import { REFRESH_TOKEN } from "@/graphql/Mutation/Auth";
import jwt from "jsonwebtoken";

export async function middleware(req: NextRequest) {
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

  let isAccessTokenValid = true;
  if (accessToken) {
    try {
      jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET!);
    } catch (err) {
      console.log(err)
      isAccessTokenValid = false;
    }
  } else {
    isAccessTokenValid = false;
  }

  if (!isAccessTokenValid && refreshToken) {
    try {
      const queryString = print(REFRESH_TOKEN);
      const response = await fetch("http://localhost:3005/graphql", {
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
        });
        return res;
      } else {
        url.pathname = "/";
        return NextResponse.redirect(url);
      }
    } catch (err) {
      console.log(err)
      url.pathname = "/";
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/profile/:path*", "/verify-otp"],
};
