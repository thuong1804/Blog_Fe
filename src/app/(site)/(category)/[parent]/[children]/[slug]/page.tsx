import type { Metadata } from "next";
import PostDetail from "@/containers/Post/PostDetail";
import JsonLd, { toIsoDate } from "@/components/Seo/JsonLd";
import { GET_ALL_POST_SLUGS, GET_POST_BY_SLUG, GET_RELATED_POSTS } from "@/graphql/Query/PostQuery";
import { createApolloClient } from "@/lib/apolloClient";
import { GetAllPostSlugsData, PostSlugData } from "@/type/typeProps";
import { notFound } from "next/navigation";


export const revalidate = 60;
export const dynamicParams = true

type tParams = Promise<{ parent: string; children: string; slug: string }>;

export async function generateMetadata(props: {
    params: tParams;
}): Promise<Metadata> {
    const { parent, children, slug } = await props.params;
    try {
        const client = createApolloClient({ isServer: true });
        const { data } = await client.query({
            query: GET_POST_BY_SLUG,
            variables: { slug },
            context: { fetchOptions: { next: { revalidate: 60 } } },
        });
        const post = data?.post;
        if (!post?.title) return {};
        const description =
            post.description || post.excerpt || undefined;
        return {
            title: post.title,
            ...(description ? { description } : {}),
            alternates: { canonical: `/${parent}/${children}/${slug}` },
            openGraph: {
                title: post.title,
                ...(description ? { description } : {}),
                type: "article",
                ...(post.image ? { images: [{ url: post.image }] } : {}),
            },
        };
    } catch {
        return {};
    }
}

export async function generateStaticParams() {
    try {
        const client = createApolloClient({ isServer: true });

        const { data } = await client.query<GetAllPostSlugsData>({
            query: GET_ALL_POST_SLUGS,
        });

        if (!data || !data.postAllSlugs) return [];

        return data.postAllSlugs.map((post: PostSlugData) => {
            const parentSlug = post.category?.parent?.slug || "general";
            const childrenSlug = post.category?.slug || "post";
            const postSlug = post.slug;

            return {
                parent: parentSlug,
                children: childrenSlug,
                slug: postSlug,
            };
        });
    } catch {
        // Build must never fail when the API/env is unreachable —
        // pages render on demand at runtime via dynamicParams.
        return [];
    }
}

export default async function BlogDetail(props: { params: tParams }) {
    const { parent, children, slug } = await props.params;
    const client = createApolloClient({ isServer: true });

    let dataByPost;
    try {
        dataByPost = await client.query({
            query: GET_POST_BY_SLUG,
            variables: { slug: slug },
            context: {
                fetchOptions: { next: { revalidate: 60 } },
            },
        });
    } catch {
        notFound();
    }

    if (!dataByPost.data?.post) {
        notFound();
    }

    const postId = dataByPost.data.post.id;
    let relatedData;
    try {
        ({ data: relatedData } = await client.query({
            query: GET_RELATED_POSTS,
            variables: { postId, take: 4 },
            context: {
                fetchOptions: { next: { revalidate: 60 } },
            },
        }));
    } catch {
        relatedData = undefined;
    }

    const {
        title,
        category,
        createdAt,
        updatedAt,
        content,
        tags,
        image,
        author,
        views,
        readingTime,
        likesCount,
    } = dataByPost.data.post;

    const SITE = (
        process.env.NEXT_PUBLIC_URL_BLOG || "http://localhost:5000"
    ).replace(/\/$/, "");
    const postUrl = `${SITE}/${parent}/${children}/${slug}`;
    const publishedAt = toIsoDate(createdAt);
    const modifiedAt = toIsoDate(updatedAt) ?? publishedAt;
    const description = dataByPost.data.post.description
        || dataByPost.data.post.excerpt
        || undefined;

    return (
        <>
            <JsonLd
                data={{
                    "@context": "https://schema.org",
                    "@type": "BlogPosting",
                    headline: title,
                    ...(description ? { description } : {}),
                    ...(image ? { image: [image] } : {}),
                    ...(publishedAt ? { datePublished: publishedAt } : {}),
                    ...(modifiedAt ? { dateModified: modifiedAt } : {}),
                    author: {
                        "@type": "Person",
                        name: author?.name || author?.handle || "TECHNEWS",
                    },
                    publisher: {
                        "@type": "Organization",
                        name: "TECHNEWS",
                    },
                    mainEntityOfPage: {
                        "@type": "WebPage",
                        "@id": postUrl,
                    },
                }}
            />
            <JsonLd
                data={{
                    "@context": "https://schema.org",
                    "@type": "BreadcrumbList",
                    itemListElement: [
                        { "@type": "ListItem", position: 1, name: "Home", item: SITE },
                        ...(category?.parent
                            ? [{
                                "@type": "ListItem",
                                position: 2,
                                name: category.parent.name,
                                item: `${SITE}/${parent}`,
                            }]
                            : []),
                        {
                            "@type": "ListItem",
                            position: category?.parent ? 3 : 2,
                            name: category?.name,
                            item: `${SITE}/${parent}/${children}`,
                        },
                        { "@type": "ListItem", position: category?.parent ? 4 : 3, name: title },
                    ],
                }}
            />
            <PostDetail
            id={dataByPost.data.post.id}
            title={title}
            views={views}
            readingTime={readingTime}
            likesCount={likesCount}
            category={category}
            createdAt={createdAt}
            content={content}
            tags={tags}
            image={image}
            relatedPosts={relatedData?.relatedPosts ?? []}
            author={author}
            updatedAt={updatedAt}
        />
        </>
    );
}
