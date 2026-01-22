import BlogContainer from "@/components/Blog/BlogContainer";
import { GET_ALL_POSTS_BY_CATEGORY } from "@/graphql/Query/CategoryQuery";
import { GET_ALL_POST_SLUGS } from "@/graphql/Query/PostQuery";
import { createApolloClient } from "@/lib/apolloClient";
import { ItemCardBlogProps, PostSlugData } from "@/type/typeProps";

export const revalidate = 300;

export type ChildrenPost = {
    posts: ItemCardBlogProps[];
};

type tParams = Promise<{ parent: string }>;

export async function generateStaticParams() {
    const client = createApolloClient({isServer: true});
    const { data } = await client.query({
        query: GET_ALL_POST_SLUGS,
    });

    const paths = data.postAllSlugs
        .map((cat: PostSlugData) => {
            const slug = cat.category?.parent?.slug;
            return slug ? { parent: slug } : null;
        })
        .filter(Boolean);

    return paths;
}

export default async function BlogSlug(props: { params: tParams }) {
    const { parent } = await props.params;
    const client = createApolloClient({ isServer: true });
    const { data } = await client.query({
        query: GET_ALL_POSTS_BY_CATEGORY,
        variables: { slug: parent },
    });

    const { category } = data;

    const postData = category?.children.flatMap(
        (child: ChildrenPost) => child.posts,
    );
    if (!postData) {
        return "404";
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
            dataCustom={postData}
            title={category.name}
            description={category.description}
        />
    );
}
