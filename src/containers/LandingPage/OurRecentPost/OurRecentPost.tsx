'use client'

import PostCard from "@/components/Post/PostCard";
import { GET_LATEST_POSTS } from "@/graphql/Query/PostQuery";
import { ItemCardBlogProps } from "@/type/typeProps";
import { useQuery } from "@apollo/client";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface OurRecentPostProps {
    initialPosts: ItemCardBlogProps[];
}

const OurRecentPost = ({initialPosts}: OurRecentPostProps) => {
    const [posts, setPosts] = useState<ItemCardBlogProps[]>(initialPosts);
    const [hasMore, setHasMore] = useState(true);
    const take = 6;

    const { data, loading, fetchMore } = useQuery(GET_LATEST_POSTS, {
        variables: { skip: 0, take },
        skip: true,
    });

    const handleLoadMore = async () => {
        const currentSkip = posts.length;

        if (!hasMore) return;
        try {
            const { data: moreData } = await fetchMore({
                variables: {
                    skip: currentSkip,
                    take,
                },
            });

            const newPosts = moreData?.postsLatest || [];

            if (newPosts.length > 0) {
                setPosts((prev) => [...prev, ...newPosts]);
            }

            if (newPosts.length < take) {
                setHasMore(false);
            }
        } catch {
            toast.error("Could not load more posts. Please try again.");
        }
    };

    useEffect(() => {
        if (data?.postsLatest && posts.length === 0) {
            setPosts(data.postsLatest);
            setHasMore(data.postsLatest.length === take);
        }
    }, [data, posts.length]);

    if (loading && posts.length === 0) {
        return <p className="text-center py-4">Loading...</p>;
    }

    if (!loading && posts.length === 0 && !data?.postsLatest?.length) {
        return <p className="text-center py-4">No posts found.</p>;
    }

    return (
        <>
            {posts.length > 0 && (
                <PostCard
                    title="Our Recent Post"
                    itemCards={posts}
                    totalItem={posts.length}
                    isOutstanding
                    actionLoadMore={hasMore ? handleLoadMore : undefined}
                />
            )}
        </>
    );
};
export default OurRecentPost;
