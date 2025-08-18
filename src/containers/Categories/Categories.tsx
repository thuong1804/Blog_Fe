import Category from "@/components/Categories/Categories";
import { GET_ALL_CATEGORIES } from "@/graphql/Query/CategoryQuery";
import { createApolloClient } from "@/lib/apolloClient";

export default async function CategoriesPage() {
  const client = createApolloClient({isServer: true});
  const { data } = await client.query({
    query: GET_ALL_CATEGORIES,
  });

  const categories = data.categories || [];

  return (
    <Category items={categories}/>
  );
}