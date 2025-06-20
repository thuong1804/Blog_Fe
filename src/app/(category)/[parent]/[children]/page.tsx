import BlogContainer from "@/components/Blog/BlogContainer";
import { GET_ALL_POSTS_BY_CATEGORY } from "@/graphql/query";
import { createApolloClient } from "@/lib/apolloClient";
import { Params } from "next/dist/server/request/params";

export default async function BlogSlug({ params }: { params: Params }) {
  const {children} = await params
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
  console.log(category)
  return (
    <BlogContainer
      breadcrumbItem={pathBreadcrumbs}
      itemPost={category}
      title={category.name}
      description={category.description}
    />
  )
}