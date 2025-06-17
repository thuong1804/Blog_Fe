import Breadcrumbs from "@/components/Breadcumbs/Breadcumbs";
import ItemCardPost from "@/components/Post/ItemCardPost";
import { GET_ALL_POSTS } from "@/graphql/query";
import { createApolloClient } from "@/lib/apolloClient";
import { ItemCardBlogProps } from "@/type/typeProps";

export default async function BlogContainer() {
  const client = createApolloClient({ isServer: true });
  const { data } = await client.query({
    query: GET_ALL_POSTS,
  });

  const pathBreadcumbs = [
    {
      path: 'Blog',
      slug: '/blog'
    }
  ]

  return (
    <div className="w-full pt-16 pb-20">
      <div className="max-w-(--max-width-desktop) mx-auto">
        <div className="text-(--text-color-title)">
          <Breadcrumbs items={pathBreadcumbs}/>
        </div>
        <div className="flex flex-col items-center">
          <h4>OUR BLOGS</h4>
          <h1 className="mt-6">Find our all blogs from here</h1>
          <p className="mt-6">our blogs are written from very research research and well known writers writers so that
            we can provide
          </p>
          <p>you the best blogs and articles articles for you to read them all along</p>
        </div>
        <div className="grid grid-cols-3 gap-4 gap-y-10 mt-28">
          {data?.posts.map((post: ItemCardBlogProps, key: number) => (
            <ItemCardPost
              key={key}
              title={post.title}
              image={post.image}
              content={post.content}
              slug={post.slug}
              createdAt={post.createdAt}
              author={post.author}
              category={post.category}
            />
          ))}
        </div>
      </div>
    </div>
  )
}