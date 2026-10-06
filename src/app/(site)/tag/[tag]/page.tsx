// app/tag/[tag]/page.tsx (Server Component)
import BlogContainer from "@/components/Blog/BlogContainer";
import { GET_POSTS_BY_TAG } from "@/graphql/Query/PostQuery";
import { createApolloClient } from "@/lib/apolloClient";
import { ItemCardBlogProps } from "@/type/typeProps";

export const revalidate = 300;

interface PostsByTagData {
    posts: {
        items: ItemCardBlogProps[];
        meta: {
            total: number;
            totalPages: number;
            currentPage: number;
        };
    };
}

type tParams = Promise<{ tag: string }>;
type tSearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

export default async function TagPage(props: {
    params: tParams;
    searchParams: tSearchParams;
}) {
    const { tag } = await props.params;
    const sParams = await props.searchParams;
    const page = Number(sParams.page ?? 1);
    const PAGE_SIZE = 12;

    const tagName = decodeURIComponent(tag);
    const client = createApolloClient({ isServer: true });

    const { data } = await client.query<PostsByTagData>({
        query: GET_POSTS_BY_TAG,
        variables: {
            page,
            pageSize: PAGE_SIZE,
            tag: tagName,
        },
        context: {
            fetchOptions: {
                next: { revalidate: 300 },
            },
        },
    });

    const posts = data.posts.items;
    const { total, totalPages, currentPage } = data.posts.meta;

    const pathBreadcrumbs = [
        {
            path: `${tagName}`,
            slug: `/tag/${tag}`,
        },
    ];

    return (
        <BlogContainer
            breadcrumbItem={pathBreadcrumbs}
            variant="tag"
            totalCount={total}
            totalPages={totalPages}
            currentPage={currentPage}
            dataCustom={posts}
            title={`#${tagName}`}
            description={`All posts tagged with "${tagName}"`}
        />
    );
}
