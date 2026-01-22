import BlogCategory from "@/containers/Blog/BlogCategory";
import { GET_ALL_POST_POPULAR, GET_ALL_POST_SLUGS, GET_POST_BY_SLUG } from "@/graphql/Query/PostQuery";
import { createApolloClient } from "@/lib/apolloClient";
import { GetAllPostSlugsData, PostSlugData } from "@/type/typeProps";

export const dynamicParams = true;

export const revalidate = 300;

type tParams = Promise<{ slug: string }>;

export async function generateStaticParams() {
    const client = createApolloClient({ isServer: true });

    const { data } = await client.query<GetAllPostSlugsData>({
        query: GET_ALL_POST_SLUGS,
    });

    if (!data || !data.postAllSlugs) return [];

   return data.postAllSlugs.slice(0, 50).map((post: PostSlugData) => ({
        parent: post.category?.parent?.slug || "general",
        children: post.category?.slug || "post",
        slug: post.slug,
    }));
}

export default async function BlogDetail(props: { params: tParams }) {
    const { slug } = await props.params;
    const client = createApolloClient({ isServer: true });

    const dataByPost = await client.query({
        query: GET_POST_BY_SLUG,
        variables: { slug: slug },
    });
    console.log(dataByPost)

    const { data: popularPosts } = await client.query({
        query: GET_ALL_POST_POPULAR,
    });


    if (!dataByPost.data?.post) {
        return <div>Post not found</div>;
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
    } = dataByPost.data.post;

    return (
        <BlogCategory
            title={title}
            views={views}
            category={category}
            createdAt={createdAt}
            content={content}
            tags={tags}
            image={image}
            data={popularPosts.popularPosts}
            author={author}
            updatedAt={updatedAt}
        />
    );
}
