import PostCard from "@/components/Post/PostCard"
import { GET_ALL_POST_POPULAR } from "@/graphql/query";
import { useQuery } from "@apollo/client";

const PopularPost = () => {
  const { data } = useQuery(GET_ALL_POST_POPULAR);
  return (
    <PostCard title="Popular Post" itemCards={data?.popularPosts} />
  )
}
export default PopularPost