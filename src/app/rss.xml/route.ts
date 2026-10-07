import { GET_LATEST_POSTS } from "@/graphql/Query/PostQuery";
import { createApolloClient } from "@/lib/apolloClient";
import { GENERAL_CATEGORY_SLUG } from "@/constant";
import { formatSlug } from "@/utils";

export const revalidate = 3600;

const SITE = (
    process.env.NEXT_PUBLIC_URL_BLOG || "http://localhost:5000"
).replace(/\/$/, "");

function escapeXml(value: string | null | undefined): string {
    return String(value ?? "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&apos;");
}

function toUTCString(value?: string | null): string {
    if (!value) return new Date().toUTCString();
    const numeric = Number(value);
    const date = Number.isFinite(numeric) ? new Date(numeric) : new Date(value);
    return Number.isNaN(date.getTime())
        ? new Date().toUTCString()
        : date.toUTCString();
}

type FeedPost = {
    title: string;
    slug: string;
    description?: string | null;
    excerpt?: string | null;
    createdAt?: string | null;
    category?: {
        name?: string | null;
        parent?: { name?: string | null } | null;
    } | null;
};

export async function GET() {
    let items = "";
    try {
        const client = createApolloClient({ isServer: true });
        const { data } = await client.query({
            query: GET_LATEST_POSTS,
            variables: { skip: 0, take: 20 },
            context: { fetchOptions: { next: { revalidate: 3600 } } },
        });

        items = ((data?.postsLatest || []) as FeedPost[])
            .map((post) => {
                const url =
                    `${SITE}/${formatSlug(post.category?.parent?.name || GENERAL_CATEGORY_SLUG)}` +
                    `/${formatSlug(post.category?.name || "post")}/${post.slug}`;
                return [
                    "    <item>",
                    `      <title>${escapeXml(post.title)}</title>`,
                    `      <link>${url}</link>`,
                    `      <guid>${url}</guid>`,
                    `      <description>${escapeXml(post.description || post.excerpt)}</description>`,
                    `      <pubDate>${toUTCString(post.createdAt)}</pubDate>`,
                    "    </item>",
                ].join("\n");
            })
            .join("\n");
    } catch {
        // Empty feed is better than a 500 when the API is unreachable.
        items = "";
    }

    const xml = [
        '<?xml version="1.0" encoding="UTF-8"?>',
        '<rss version="2.0">',
        "  <channel>",
        "    <title>TECHNEWS</title>",
        `    <link>${SITE}/blog</link>`,
        "    <description>Latest posts from TECHNEWS</description>",
        items,
        "  </channel>",
        "</rss>",
        "",
    ].join("\n");

    return new Response(xml, {
        headers: { "Content-Type": "application/rss+xml; charset=utf-8" },
    });
}
