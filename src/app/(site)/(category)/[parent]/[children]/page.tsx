import BlogContainer from "@/components/Blog/BlogContainer";
import { GET_ALL_POSTS_BY_CATEGORY } from "@/graphql/Query/CategoryQuery";
import { createApolloClient } from "@/lib/apolloClient";

export const revalidate = 300;

type tParams = Promise<{ children: string }>;

export default async function BlogSlug(props: { params: tParams }) {
    const { children } = await props.params;
    const client = createApolloClient({ isServer: true });
    const { data } = await client.query({
        query: GET_ALL_POSTS_BY_CATEGORY,
        variables: { slug: children },
    });

    const { category } = data;

    if (!category) {
        return "404";
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
    console.log(category)

    return (
        <BlogContainer
            breadcrumbItem={pathBreadcrumbs}
            variant="category"
            totalCount={category?.posts?.length}
            itemPost={category}
            title={category.name}
            description={category.description}
        />
    );
}
