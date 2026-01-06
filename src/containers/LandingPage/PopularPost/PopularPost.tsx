import PostCard from "@/components/Post/PostCard";
import { ItemCardBlogProps } from "@/type/typeProps";

type PropsPopularPost = {
    data: {
        popularPosts: ItemCardBlogProps[];
    };
};

const PopularPost = ({data} : PropsPopularPost) => {
    return <PostCard title="Popular Post" itemCards={data?.popularPosts} />;
};
export default PopularPost;
