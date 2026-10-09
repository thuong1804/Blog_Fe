import PostDetail from "@/containers/Post/PostDetail";
import { GET_ALL_POST_SLUGS, GET_POST_BY_SLUG, GET_RELATED_POSTS } from "@/graphql/Query/PostQuery";
import { createApolloClient } from "@/lib/apolloClient";
import { GetAllPostSlugsData, PostSlugData } from "@/type/typeProps";
import { notFound } from "next/navigation";


export const revalidate = 60;
export const dynamicParams = true

type tParams = Promise<{ slug: string }>;

export async function generateStaticParams() {
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
}

export default async function BlogDetail(props: { params: tParams }) {
    const { slug } = await props.params;
    const client = createApolloClient({ isServer: true });

    const dataByPost = await client.query({
        query: GET_POST_BY_SLUG,
        variables: { slug: slug },
        context: {
            fetchOptions: { next: { revalidate: 60 } },
        },
    });

    if (!dataByPost.data?.post) {
        notFound();
    }

    const postId = dataByPost.data.post.id;
    const { data: relatedData } = await client.query({
        query: GET_RELATED_POSTS,
        variables: { postId, take: 4 },
        context: {
            fetchOptions: { next: { revalidate: 60 } },
        },
    });

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

    return (
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
    );
}
