import type { Metadata } from "next";
import BlogContainer from "@/components/Blog/BlogContainer";
import { GET_ALL_POSTS_BY_CATEGORY } from "@/graphql/Query/CategoryQuery";
import { GET_ALL_POST_SLUGS } from "@/graphql/Query/PostQuery";
import { createApolloClient } from "@/lib/apolloClient";
import { ItemCardBlogProps, PostSlugData } from "@/type/typeProps";
import { notFound } from "next/navigation";

export const revalidate = 300;
// Allow on-demand rendering when a path wasn't prerendered at build time
// (e.g. build ran without API access) instead of 404.
export const dynamicParams = true;

export type ChildrenPost = {
    posts: ItemCardBlogProps[];
};

type tParams = Promise<{ parent: string }>;

export async function generateMetadata(props: {
    params: tParams;
}): Promise<Metadata> {
    const { parent } = await props.params;
    try {
        const client = createApolloClient({ isServer: true });
        const { data } = await client.query({
            query: GET_ALL_POSTS_BY_CATEGORY,
            variables: { slug: parent },
            context: { fetchOptions: { next: { revalidate: 300 } } },
        });
        const category = data?.category;
        if (!category?.name) return {};
        return {
            title: `${category.name} articles`,
            ...(category.description
                ? { description: category.description }
                : {}),
            alternates: { canonical: `/${parent}` },
        };
    } catch {
        return {};
    }
}

export async function generateStaticParams() {
    try {
        const client = createApolloClient({isServer: true});
        const { data } = await client.query({
            query: GET_ALL_POST_SLUGS,
            context: {
                fetchOptions: { next: { revalidate: 300 } },
            },
        });

        const paths = (data?.postAllSlugs ?? [])
            .map((cat: PostSlugData) => {
                const slug = cat.category?.parent?.slug;
                return slug ? { parent: slug } : null;
            })
            .filter(Boolean);

        return paths;
    } catch {
        // Build must never fail when the API/env is unreachable —
        // pages render on demand at runtime via dynamicParams.
        return [];
    }
}

export default async function ParentCategoryPage(props: { params: tParams }) {
    const { parent } = await props.params;
    let category;
    try {
        const client = createApolloClient({ isServer: true });
        const { data } = await client.query({
            query: GET_ALL_POSTS_BY_CATEGORY,
            variables: { slug: parent },
            context: {
                fetchOptions: { next: { revalidate: 300 } },
            },
        });
        category = data?.category;
    } catch {
        category = undefined;
    }

    if (!category) {
        notFound();
    }

    const postData = category?.children.flatMap(
        (child: ChildrenPost) => child.posts,
    );
    if (!postData) {
        notFound();
    }

    const pathBreadcrumbs = [
        {
            path: category?.name,
            slug: category?.slug,
        },
    ];

    return (
        <BlogContainer
            breadcrumbItem={pathBreadcrumbs}
            variant="category"
            totalCount={postData.length}
            dataCustom={postData}
            title={category.name}
            description={category.description}
        />
    );
}
