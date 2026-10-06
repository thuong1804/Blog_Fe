// lib/session.ts
import jwt from "jsonwebtoken";
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
        const decoded = jwt.verify(token, secret, {
            algorithms: ["HS256"],
        });
        if (
            typeof decoded !== "object" ||
            decoded === null ||
            typeof (decoded as JwtPayloadCustom).userId !== "number"
        ) {
            return null;
        }
        const payload = decoded as JwtPayloadCustom;
        const queryString = print(GET_USER_BY_ID);

        const response = await fetch(`${process.env.NEXT_PUBLIC_URL_API}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            // Auth data must never be cached.
            cache: "no-store",
            body: JSON.stringify({
                query: queryString,
                variables: { id: payload.userId },
            }),
        });

        if (!response.ok) return null;
        const data = await response.json().catch(() => null);
        if (!data?.data?.userDetail) return null;
        return {
            data: {
                ...data.data.userDetail,
                provider: payload.provider,
            },
        };
    } catch {
        return null;
    }
}
