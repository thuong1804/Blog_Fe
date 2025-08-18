import BlogCategory from "@/containers/Blog/BlogCategory"
import { GET_ALL_POSTS, GET_POST_BY_SLUG } from "@/graphql/Query/PostQuery";
import { createApolloClient } from "@/lib/apolloClient";

type tParams = Promise<{ slug: string }>;

export default async function BlogDetail(props: {params: tParams}) {
  const { slug } =  await props.params
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

  const { title, category, createdAt, updatedAt, content, tags, image, author, views } = dataByPost.data.post

  return (
    <BlogCategory
      title={title}
      views={views}
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