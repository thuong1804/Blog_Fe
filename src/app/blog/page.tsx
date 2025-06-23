import BlogContainer from "@/components/Blog/BlogContainer";
import { GET_ALL_POSTS } from "@/graphql/query";
import { createApolloClient } from "@/lib/apolloClient";

export default async function Blog() {
  const client = createApolloClient({ isServer: true });
  const { data } = await client.query({
    query: GET_ALL_POSTS,
  });

  const pathBreadcrumbs = [
    {
      path: 'Blog',
      slug: '/blog'
    }
  ]

  return (
    <BlogContainer
      breadcrumbItem={pathBreadcrumbs}
      itemPost={data}
      title="Find our all blogs from here"
      description="Our blogs are written from very research research and well known writers writers so that  we can provide you the best blogs and articles articles for you to read them all along"
    />
  )
}