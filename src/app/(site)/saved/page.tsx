// app/saved/page.tsx (Server Component, auth-gated by middleware)
import BlogContainer from "@/components/Blog/BlogContainer";
import { GET_MY_BOOKMARKS } from "@/graphql/Query/PostQuery";
import { createApolloClient } from "@/lib/apolloClient";
import { ItemCardBlogProps } from "@/type/typeProps";
import { cookies } from "next/headers";

export const dynamic = "force-dynamic";

interface MyBookmarksData {
    myBookmarks: {
        items: ItemCardBlogProps[];
        meta: {
            total: number;
            totalPages: number;
            currentPage: number;
        };
    };
}

export default async function SavedPage({
    searchParams,
}: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
    const sParams = await searchParams;
    const page = Number(sParams.page ?? 1);
    const PAGE_SIZE = 12;

    // Authenticated query: forward the user's cookies to the backend.
    const cookieHeader = (await cookies()).toString();
    const client = createApolloClient({
        isServer: true,
        headers: { cookie: cookieHeader },
    });

    const { data } = await client.query<MyBookmarksData>({
        query: GET_MY_BOOKMARKS,
        variables: { page, pageSize: PAGE_SIZE },
    });

    const posts = data.myBookmarks.items;
    const { total, totalPages, currentPage } = data.myBookmarks.meta;

    const pathBreadcrumbs = [{ path: "Saved", slug: "/saved" }];

    return (
        <BlogContainer
            breadcrumbItem={pathBreadcrumbs}
            variant="blog"
            totalCount={total}
            totalPages={totalPages}
            currentPage={currentPage}
            dataCustom={posts}
            title="Saved posts"
            description="Articles you bookmarked for later reading."
        />
    );
}
