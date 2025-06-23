import BlogContainer from "@/components/Blog/BlogContainer";
import { GET_ALL_POSTS_BY_CATEGORY } from "@/graphql/query";
import { createApolloClient } from "@/lib/apolloClient";
import { ItemCardBlogProps } from "@/type/typeProps";
import { Params } from "next/dist/server/request/params";

export type ChildrenPost = {
  posts: ItemCardBlogProps[]
}

export default async function BlogSlug({ params }: { params: Params }) {
  const {parent} = await params
  const client = createApolloClient({ isServer: true });
  const { data } = await client.query({
    query: GET_ALL_POSTS_BY_CATEGORY,
    variables: { slug: parent }
  });

  const { category } = data
  const postData = category?.children.flatMap((child: ChildrenPost) => child.posts)
  if (!postData) {
    return '404'
  }

  const pathBreadcrumbs = [
    {
      path: category.name,
      slug: category.slug
    }
  ]

  return (
    <BlogContainer
      breadcrumbItem={pathBreadcrumbs}
      dataCustom={postData}
      title={category.name}
      description={category.description}
    />
  )
}