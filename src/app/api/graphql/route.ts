import { NextRequest, NextResponse } from "next/server";

// Same-origin GraphQL proxy: the browser calls /api/graphql (cookies for
// THIS origin are attached automatically), and we forward to the real
// backend with the httpOnly accessToken as a Bearer header — JS never sees
// the token, and there's no cross-origin cookie problem.
export async function POST(req: NextRequest) {
    const apiUrl = process.env.NEXT_PUBLIC_URL_API;
    if (!apiUrl) {
        return NextResponse.json(
            { errors: [{ message: "GraphQL endpoint is not configured." }] },
            { status: 500 },
        );
    }

    let body: string;
    try {
        body = await req.text();
    } catch {
        return NextResponse.json(
            { errors: [{ message: "Invalid request body." }] },
            { status: 400 },
        );
    }

    const token = req.cookies.get("accessToken")?.value;

    let upstream: Response;
    try {
        upstream = await fetch(apiUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                ...(token ? { Authorization: `Bearer ${token}` } : {}),
            },
            body,
            cache: "no-store",
        });
    } catch {
        return NextResponse.json(
            { errors: [{ message: "Cannot reach GraphQL backend." }] },
            { status: 502 },
        );
    }

    const text = await upstream.text().catch(() => "");
    return new NextResponse(text, {
        status: upstream.status,
        headers: { "Content-Type": "application/json" },
    });
}
