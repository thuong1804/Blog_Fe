import type { MetadataRoute } from "next";
import { GET_ALL_CATEGORIES } from "@/graphql/Query/CategoryQuery";
import { GET_ALL_POST_SLUGS } from "@/graphql/Query/PostQuery";
import { createApolloClient } from "@/lib/apolloClient";

export const revalidate = 3600;

const SITE = (
    process.env.NEXT_PUBLIC_URL_BLOG || "http://localhost:5000"
).replace(/\/$/, "");

function toDate(value?: string | null): Date | undefined {
    if (!value) return undefined;
    const numeric = Number(value);
    const date = Number.isFinite(numeric) ? new Date(numeric) : new Date(value);
    return Number.isNaN(date.getTime()) ? undefined : date;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const staticPages: MetadataRoute.Sitemap = [
        { url: SITE, changeFrequency: "daily", priority: 1 },
        { url: `${SITE}/blog`, changeFrequency: "daily", priority: 0.9 },
        { url: `${SITE}/about`, changeFrequency: "monthly", priority: 0.5 },
        { url: `${SITE}/contact`, changeFrequency: "monthly", priority: 0.5 },
    ];

    try {
        const client = createApolloClient({ isServer: true });
        const [{ data: slugsData }, { data: catsData }] = await Promise.all([
            client.query({
                query: GET_ALL_POST_SLUGS,
                context: { fetchOptions: { next: { revalidate: 3600 } } },
            }),
            client.query({
                query: GET_ALL_CATEGORIES,
                context: { fetchOptions: { next: { revalidate: 3600 } } },
            }),
        ]);

        const categoryPages: MetadataRoute.Sitemap = (
            catsData?.categories || []
        ).flatMap(
            (cat: { slug: string; children?: { slug: string }[] }) => [
                { url: `${SITE}/${cat.slug}`, changeFrequency: "weekly" as const, priority: 0.7 },
                ...(cat.children || []).map((child) => ({
                    url: `${SITE}/${cat.slug}/${child.slug}`,
                    changeFrequency: "weekly" as const,
                    priority: 0.7,
                })),
            ],
        );

        const postPages: MetadataRoute.Sitemap = (
            slugsData?.postAllSlugs || []
        ).map(
            (post: {
                slug: string;
                updatedAt?: string | null;
                category?: {
                    slug?: string | null;
                    parent?: { slug?: string | null } | null;
                } | null;
            }) => ({
                url: `${SITE}/${post.category?.parent?.slug || "general"}/${post.category?.slug || "post"}/${post.slug}`,
                lastModified: toDate(post.updatedAt),
                changeFrequency: "weekly" as const,
                priority: 0.8,
            }),
        );

        return [...staticPages, ...categoryPages, ...postPages];
    } catch {
        // Sitemap must never break the build when the API is unreachable.
        return staticPages;
    }
}
