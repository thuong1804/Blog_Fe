import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
    const SITE = (
        process.env.NEXT_PUBLIC_URL_BLOG || "http://localhost:5000"
    ).replace(/\/$/, "");
    return {
        rules: [
            {
                userAgent: "*",
                allow: "/",
                // Private / auth-gated / API routes must never be indexed.
                disallow: [
                    "/api/",
                    "/profile/",
                    "/saved",
                    "/post/new",
                    "/post/edit/",
                    "/edit-post/",
                    "/verify-otp",
                    "/send-otp",
                    "/change-password",
                ],
            },
        ],
        sitemap: `${SITE}/sitemap.xml`,
    };
}
