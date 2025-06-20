import BlogCategory from "@/containers/Blog/BlogCategory"
import { GET_ALL_POSTS, GET_POST_BY_SLUG } from "@/graphql/query";
import { createApolloClient } from "@/lib/apolloClient";
import { Params } from "next/dist/server/request/params";

export default async function BlogDetail({ params }: { params: Params }) {
  const { slug } = await params
  const client = createApolloClient({ isServer: true });

  const dataByPost = await client.query({
    query: GET_POST_BY_SLUG,
    variables: { slug: slug },
  });

  const { data } = await client.query({
    query: GET_ALL_POSTS,
  });

  const dataPost = data.posts

  if (!dataByPost.data?.post) {
    return <div>Post not found</div>;
  }

  const { title, category, createdAt, updatedAt, content, tags, image, author } = dataByPost.data.post

  return (
    <BlogCategory
      title={title}
      category={category}
      createdAt={createdAt}
      content={content}
      tags={tags}
      image={image}
      data={dataPost}
      author={author}
      updatedAt={updatedAt}
    />
  )
}