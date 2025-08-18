import AuthorPage from "@/containers/Author/Author";
import { GET_POST_BY_AUTHOR } from "@/graphql/Query/AuthorQuery";
import { createApolloClient } from "@/lib/apolloClient";

type tParams = Promise<{ handle: string }>;

export default async function Author(props: { params: tParams }) {
  const { handle } = await props.params
  const client = createApolloClient({ isServer: true });
  const { data } = await client.query({
    query: GET_POST_BY_AUTHOR,
    variables: { handle: handle }
  });

  return (
    <AuthorPage user={data.userByPosts} />
  )
}