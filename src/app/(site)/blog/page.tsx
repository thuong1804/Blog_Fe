// app/blog/page.tsx (Server Component)
import BlogContainer from "@/components/Blog/BlogContainer";
import { GET_ALL_POSTS, GET_SITE_STATS } from "@/graphql/Query/PostQuery";
import { createApolloClient } from "@/lib/apolloClient";
import { ItemCardBlogProps } from "@/type/typeProps";

interface GetAllPostsData {
    posts: {
        items: ItemCardBlogProps[];
        meta: {
            total: number;
            totalPages: number;
            currentPage: number;
        }
    }
}

export default async function BlogPage({
    searchParams,
}: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
    const sParams = await searchParams;
    const page = Number(sParams.page ?? 1);
    const search = (sParams.search as string) ?? null;
    const PAGE_SIZE = 12;

    const client = createApolloClient({isServer: true});

    const { data } = await client.query<GetAllPostsData>({
        query: GET_ALL_POSTS,
        variables: {
            page,
            pageSize: PAGE_SIZE,
            search
        },
        context: {
            fetchOptions: {
                next: { revalidate: 300 }
            }
        }
    });

    const { data: statsData } = await client.query({
        query: GET_SITE_STATS,
        context: {
            fetchOptions: {
                next: { revalidate: 300 }
            }
        }
    });

    const posts = data.posts.items;
    const { total, totalPages, currentPage } = data.posts.meta;

    const pathBreadcrumbs = [
        { path: "Blog", slug: "/blog" },
    ];

    return (
        <BlogContainer
            breadcrumbItem={pathBreadcrumbs}
            variant="blog"
            totalCount={total}
            totalViews={statsData?.siteStats?.totalViews}
            totalPages={totalPages}
            currentPage={currentPage}
            dataCustom={posts}
            title="Find our all blogs from here"
            description="Our blogs are written from research..."
        />
    );
}