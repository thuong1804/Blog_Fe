"use client";

import { useCallback, useState } from "react";
import { useMutation } from "@apollo/client";
import { toast } from "sonner";
import { DELETE_POST } from "@/graphql/Mutation/Post";
import { GET_POST_BY_AUTHOR } from "@/graphql/Query/AuthorQuery";

type UseDeletePostOptions = {
    postId?: number | string | null;
    postTitle?: string;
    /** Handle used to refetch the author's list after delete. */
    authorHandle?: string | null;
    /** Called after a successful delete (e.g. redirect away). */
    onDeleted?: () => void;
    /** Current user id — delete requires login. */
    userId?: number | string | null;
};

export function useDeletePost({
    postId,
    authorHandle,
    onDeleted,
    userId,
}: UseDeletePostOptions) {
    const [openModal, setOpenModal] = useState(false);

    const [deletePost, { loading }] = useMutation(DELETE_POST, {
        update(cache, { data }) {
            if (data?.deletePost?.success && postId != null) {
                // Try raw and numeric id: GraphQL Int keys use numbers,
                // but callers may hold string ids.
                const normalizedId =
                    cache.identify({ __typename: "Post", id: postId }) ??
                    cache.identify({
                        __typename: "Post",
                        id: Number(postId),
                    });
                if (normalizedId) {
                    cache.evict({ id: normalizedId });
                    cache.gc();
                }
            }
        },
        refetchQueries: authorHandle
            ? [
                  {
                      query: GET_POST_BY_AUTHOR,
                      variables: { handle: authorHandle },
                  },
              ]
            : [],
        onCompleted: (data) => {
            if (data?.deletePost?.success) {
                toast.success(data.deletePost.message || "Deleted post successfully");
                setOpenModal(false);
                onDeleted?.();
            } else {
                toast.error("Failed to delete post");
            }
        },
        onError: () => {
            toast.error("Failed to delete post");
        },
    });

    const handleDeletePost = useCallback(async () => {
        if (postId == null) {
            toast.error("Post ID is missing");
            return;
        }
        if (!userId) {
            toast.error("Please login to delete this post");
            return;
        }
        await deletePost({
            variables: { postId: Number(postId) },
        });
    }, [postId, userId, deletePost]);

    return { openModal, setOpenModal, loading, handleDeletePost };
}
