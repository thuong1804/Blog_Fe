import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const code = req.nextUrl.searchParams.get("code");

  if (!code) {
    return NextResponse.json({ error: "Missing code" }, { status: 400 });
  }

  try {
    const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        code,
        client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!,
        client_secret: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_SECRET!,
        redirect_uri: "http://localhost:5000/api/auth/callback/google",
        grant_type: "authorization_code",
      }),
    });

    const tokens = await tokenRes.json();

    if (tokens.error) {
      return NextResponse.json(tokens, { status: 400 });
    }

    const response = await fetch("http://localhost:3005/graphql", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        query: `
          mutation LoginWithGoogle($idToken: String!) {
            loginWithGoogle(idToken: $idToken) {
              token
              user {
                id
                email
                name
                avatar
              }
            }
          }
        `,
        variables: { idToken: tokens.id_token },
      }),
    });

    const result = await response.json();
    const { token } = result.data.loginWithGoogle;
    const res = NextResponse.redirect("http://localhost:5000/");

    res.cookies.set("accessToken", token, { httpOnly: true, path: "/" });
    return res;

  } catch (err) {
    console.error("Google login error:", err);
    return NextResponse.json({ error: "OAuth failed" }, { status: 500 });
  }
}
