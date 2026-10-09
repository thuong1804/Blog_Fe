// lib/session.ts
import { jwtVerify } from "jose";
import { GET_USER_BY_ID } from "@/graphql/Query/AuthorQuery";
import { print } from "graphql";

interface JwtPayloadCustom {
    userId: number;
    email?: string;
    name?: string;
    provider?: string;
}

export async function getCurrentUserFromToken(token: string | undefined) {
    if (!token) return null;

    const secret = process.env.ACCESS_TOKEN_SECRET;
    if (!secret) {
        console.error("Missing ACCESS_TOKEN_SECRET");
        return null;
    }

    try {
        // Pin the algorithm: never accept "none" or an unexpected alg.
        // jose (ESM-native, Web Crypto) works in Node + Edge runtimes —
        // jsonwebtoken pulls Node-only CJS chains into every page via Header.
        const { payload } = await jwtVerify(
            token,
            new TextEncoder().encode(secret),
            { algorithms: ["HS256"] },
        );
        if (
            typeof payload?.userId !== "number"
        ) {
            return null;
        }
        const jwtPayload = payload as unknown as JwtPayloadCustom;
        const queryString = print(GET_USER_BY_ID);

        const response = await fetch(`${process.env.NEXT_PUBLIC_URL_API}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            // Auth data must never be cached.
            cache: "no-store",
            body: JSON.stringify({
                query: queryString,
                variables: { id: jwtPayload.userId },
            }),
        });

        if (!response.ok) return null;
        const data = await response.json().catch(() => null);
        if (!data?.data?.userDetail) return null;
        return {
            data: {
                ...data.data.userDetail,
                provider: jwtPayload.provider,
            },
        };
    } catch {
        return null;
    }
}
