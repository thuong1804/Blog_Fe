import type { Metadata } from "next";
import BlogContainer from "@/components/Blog/BlogContainer";
import JsonLd from "@/components/Seo/JsonLd";
import { GET_ALL_POSTS_BY_CATEGORY } from "@/graphql/Query/CategoryQuery";
import { createApolloClient } from "@/lib/apolloClient";
import { notFound } from "next/navigation";

export const revalidate = 300;

type tParams = Promise<{ parent: string; children: string }>;

export async function generateMetadata(props: {
    params: tParams;
}): Promise<Metadata> {
    const { parent, children } = await props.params;
    try {
        const client = createApolloClient({ isServer: true });
        const { data } = await client.query({
            query: GET_ALL_POSTS_BY_CATEGORY,
            variables: { slug: children },
            context: { fetchOptions: { next: { revalidate: 300 } } },
        });
        const category = data?.category;
        if (!category?.name) return {};
        return {
            title: `${category.name} articles`,
            ...(category.description
                ? { description: category.description }
                : {}),
            alternates: { canonical: `/${parent}/${children}` },
        };
    } catch {
        return {};
    }
}

export default async function ChildCategoryPage(props: { params: tParams }) {
    const { parent, children } = await props.params;
    let category;
    try {
        const client = createApolloClient({ isServer: true });
        const { data } = await client.query({
            query: GET_ALL_POSTS_BY_CATEGORY,
            variables: { slug: children },
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

    const pathBreadcrumbs = [
        ...(category?.parent
            ? [
                  {
                      path: category.parent.name,
                      slug: category.parent.slug,
                  },
              ]
            : []),
        {
            path: category?.name,
            slug: category?.slug,
        },
    ];

    return (
        <>
            <JsonLd
                data={{
                    "@context": "https://schema.org",
                    "@type": "BreadcrumbList",
                    itemListElement: [
                        {
                            "@type": "ListItem",
                            position: 1,
                            name: "Home",
                            item: (process.env.NEXT_PUBLIC_URL_BLOG || "http://localhost:5000").replace(/\/$/, ""),
                        },
                        ...(category?.parent
                            ? [{
                                "@type": "ListItem",
                                position: 2,
                                name: category.parent.name,
                                item: `${(process.env.NEXT_PUBLIC_URL_BLOG || "").replace(/\/$/, "")}/${parent}`,
                            }]
                            : []),
                        { "@type": "ListItem", position: category?.parent ? 3 : 2, name: category?.name },
                    ],
                }}
            />
            <BlogContainer
                breadcrumbItem={pathBreadcrumbs}
                variant="category"
                totalCount={category?.posts?.length}
                itemPost={category}
                title={category.name}
                description={category.description}
            />
        </>
    );
}
