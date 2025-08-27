import BlogContainer from "@/components/Blog/BlogContainer";
import { GET_ALL_POSTS_BY_CATEGORY } from "@/graphql/Query/CategoryQuery";
import { createApolloClient } from "@/lib/apolloClient";

type tParams = Promise<{ children: string }>;

export default async function BlogSlug(props: {params: tParams}) {
  const {children} = await props.params
  const client = createApolloClient({ isServer: true });
  const { data } = await client.query({
    query: GET_ALL_POSTS_BY_CATEGORY,
    variables: { slug: children }
  });

  const { category } = data

  const pathBreadcrumbs = [
    {
      path: category.parent.name,
      slug: category.parent.slug
    },
    {
      path: category.name,
      slug: category.slug
    }
  ]

  return (
    <BlogContainer
      breadcrumbItem={pathBreadcrumbs}
      itemPost={category}
      title={category.name}
      description={category.description}
    />
  )
}