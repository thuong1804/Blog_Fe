"use client";

import { useEffect, useRef, useState } from "react";
import { useLazyQuery, useMutation } from "@apollo/client";
import { toast } from "sonner";
import {
    FaBookmark,
    FaHeart,
    FaRegBookmark,
    FaRegHeart,
} from "react-icons/fa6";
import { useAuth } from "@/context/AuthContext/AuthContext";
import { TOGGLE_BOOKMARK, TOGGLE_LIKE } from "@/graphql/Mutation/Post";
import { GET_POST_ENGAGEMENT } from "@/graphql/Query/PostQuery";
import {
    SESSION_EXPIRED_MESSAGE,
    throwIfGraphQLErrors,
} from "@/lib/apolloClient";
import { signInHref } from "@/utils";
import { usePathname, useRouter } from "next/navigation";

type PostEngagementProps = {
    postId: number;
    initialLikesCount?: number | null;
};

const PostEngagement = ({
    postId,
    initialLikesCount,
}: PostEngagementProps) => {
    const { user } = useAuth();
    const router = useRouter();
    const pathname = usePathname();
    const [liked, setLiked] = useState(false);
    const [bookmarked, setBookmarked] = useState(false);
    const [likesCount, setLikesCount] = useState<number>(
        initialLikesCount ?? 0,
    );
    const loaded = useRef(false);

    const [fetchEngagement] = useLazyQuery(GET_POST_ENGAGEMENT);
    const [toggleLike] = useMutation(TOGGLE_LIKE);
    const [toggleBookmark] = useMutation(TOGGLE_BOOKMARK);

    // Load per-user status once (SSR is anonymous so it can't know it).
    useEffect(() => {
        if (!postId || !user || loaded.current) return;
        loaded.current = true;
        fetchEngagement({ variables: { id: Number(postId) } })
            .then(({ data }) => {
                const engagement = data?.post;
                if (!engagement) return;
                setLiked(Boolean(engagement.likedByMe));
                setBookmarked(Boolean(engagement.bookmarkedByMe));
                if (typeof engagement.likesCount === "number") {
                    setLikesCount(engagement.likesCount);
                }
            })
            .catch(() => {
                loaded.current = false;
            });
    }, [postId, user, fetchEngagement]);

    const goSignIn = () => {
        router.push(signInHref(pathname));
    };

    const requireLoginToast = () =>
        toast.error("Please sign in to continue", {
            action: { label: "Sign in", onClick: goSignIn },
        });

    const sessionToast = (err: unknown, fallback: string) =>
        toast.error(
            err instanceof Error && err.message === SESSION_EXPIRED_MESSAGE
                ? SESSION_EXPIRED_MESSAGE
                : fallback,
        );

    const handleToggleLike = async () => {
        if (!user) {
            requireLoginToast();
            return;
        }
        const next = !liked;
        setLiked(next);
        setLikesCount((c) => c + (next ? 1 : -1));
        try {
            const result = await toggleLike({
                variables: { postId: Number(postId) },
            });
            throwIfGraphQLErrors(result);
            const { data } = result;
            if (typeof data?.toggleLike?.likesCount === "number") {
                setLikesCount(data.toggleLike.likesCount);
            }
            setLiked(Boolean(data?.toggleLike?.liked));
        } catch (err) {
            setLiked(!next);
            setLikesCount((c) => c + (next ? -1 : 1));
            sessionToast(err, "Could not update like. Please try again.");
        }
    };

    const handleToggleBookmark = async () => {
        if (!user) {
            requireLoginToast();
            return;
        }
        const next = !bookmarked;
        setBookmarked(next);
        try {
            const result = await toggleBookmark({
                variables: { postId: Number(postId) },
            });
            throwIfGraphQLErrors(result);
            const bookmarkedNow = Boolean(result.data?.toggleBookmark?.bookmarked);
            setBookmarked(bookmarkedNow);
            toast.success(
                bookmarkedNow
                    ? "Saved to your reading list"
                    : "Removed from your reading list",
            );
        } catch (err) {
            setBookmarked(!next);
            sessionToast(err, "Could not save post. Please try again.");
        }
    };

    return (
        <div className="flex items-center gap-2">
            <button
                type="button"
                onClick={handleToggleLike}
                aria-label={liked ? "Unlike this post" : "Like this post"}
                aria-pressed={liked}
                className={`btn btn-sm btn-circle shadow-none transition-all ${
                    liked
                        ? "bg-rose-500 hover:bg-rose-600 text-white border-transparent"
                        : "bg-slate-100 text-slate-600 hover:bg-rose-50 hover:text-rose-500 border-transparent"
                }`}
            >
                {liked ? <FaHeart size={15} /> : <FaRegHeart size={15} />}
            </button>
            <span className="text-sm font-semibold text-slate-600 min-w-6">
                {likesCount}
            </span>
            <button
                type="button"
                onClick={handleToggleBookmark}
                aria-label={
                    bookmarked ? "Remove bookmark" : "Bookmark this post"
                }
                aria-pressed={bookmarked}
                className={`btn btn-sm btn-circle shadow-none transition-all ${
                    bookmarked
                        ? "bg-indigo-600 hover:bg-indigo-700 text-white border-transparent"
                        : "bg-slate-100 text-slate-600 hover:bg-indigo-50 hover:text-indigo-600 border-transparent"
                }`}
            >
                {bookmarked ? (
                    <FaBookmark size={15} />
                ) : (
                    <FaRegBookmark size={15} />
                )}
            </button>
        </div>
    );
};

export default PostEngagement;
