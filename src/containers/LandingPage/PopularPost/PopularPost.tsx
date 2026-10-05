import PostCard from "@/components/Post/PostCard";
import { ItemCardBlogProps } from "@/type/typeProps";

type PropsPopularPost = {
    data: {
        popularPosts: ItemCardBlogProps[];
    };
    gridColsClass?: string;
};

const PopularPost = ({ data, gridColsClass }: PropsPopularPost) => {
    return <PostCard title="Popular Post" itemCards={data?.popularPosts} gridColsClass={gridColsClass} />;
};
export default PopularPost;
