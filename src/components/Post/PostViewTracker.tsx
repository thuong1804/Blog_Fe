"use client";

import { useEffect, useRef } from "react";
import { useMutation } from "@apollo/client";
import { INCREMENT_POST_VIEWS } from "@/graphql/Mutation/Post";

type PostViewTrackerProps = {
    postId: number;
    onCounted?: (views: number) => void;
};

/**
 * Đếm +1 view cho bài viết, render nothing.
 * - Chặn double-fire của React StrictMode bằng ref.
 * - 1 tab chỉ đếm 1 lần (sessionStorage); server throttle tiếp 1 IP / 60 phút.
 * - Lỗi mạng thì bỏ qua lặng lẽ, không làm vỡ trang.
 */
const PostViewTracker = ({ postId, onCounted }: PostViewTrackerProps) => {
    const [increment] = useMutation(INCREMENT_POST_VIEWS);
    const fired = useRef(false);
    const onCountedRef = useRef(onCounted);
    onCountedRef.current = onCounted;

    useEffect(() => {
        if (!postId || fired.current) return;
        fired.current = true;

        const key = `viewed:post:${postId}`;
        try {
            if (sessionStorage.getItem(key)) return;
        } catch {
            /* storage không khả dụng thì vẫn đếm */
        }

        increment({ variables: { postId: Number(postId) } })
            .then(({ data }) => {
                const views = data?.incrementPostViews;
                if (typeof views === "number") {
                    try {
                        sessionStorage.setItem(key, String(views));
                    } catch {
                        /* ignore */
                    }
                    onCountedRef.current?.(views);
                }
            })
            .catch(() => {
                fired.current = false;
            });
    }, [postId, increment]);

    return null;
};

export default PostViewTracker;
