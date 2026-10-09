"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useMutation, useQuery } from "@apollo/client";
import { sanitizeCommentHtml } from "@/utils/sanitize";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext/AuthContext";
import {
    CREATE_COMMENT,
    DELETE_COMMENT,
    UPDATE_COMMENT,
    VOTE_COMMENT,
} from "@/graphql/Mutation/Comment";
import { GET_COMMENTS } from "@/graphql/Query/CommentQuery";
import {
    SESSION_EXPIRED_MESSAGE,
    throwIfGraphQLErrors,
} from "@/lib/apolloClient";
import CommentEditor, {
    type CommentEditorHandle,
} from "./CommentEditor";
import { signInHref } from "@/utils/guards";
import { usePathname, useRouter } from "next/navigation";
import styles from "./CommentSection.module.css";

type CommentAuthor = {
    id: number;
    name?: string | null;
    handle: string;
    avatar?: string | null;
};

export type CommentNode = {
    id: number;
    content: string;
    parentId: number | null;
    score: number;
    myVote: number;
    repliesCount: number;
    createdAt: string;
    author: CommentAuthor;
    replies?: CommentNode[] | null;
};

type SortKey = "OLDEST" | "NEWEST" | "TOP";

const SORTS: { key: SortKey; label: string }[] = [
    { key: "OLDEST", label: "Oldest" },
    { key: "NEWEST", label: "Newest" },
    { key: "TOP", label: "Top" },
];

/** Client-side defense in depth: the backend already allowlists comment
 *  HTML, this strips anything unexpected before injecting. */
function safeCommentHtml(html: string): string {
    return sanitizeCommentHtml(html || "");
}

export function timeAgo(value: string): string {
    const ms = Number(value);
    const date = Number.isFinite(ms) ? new Date(ms) : new Date(value);
    const diff = Date.now() - date.getTime();
    if (Number.isNaN(diff) || diff < 0) return "just now";
    const minutes = Math.floor(diff / 60000);
    if (minutes < 1) return "just now";
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h`;
    const days = Math.floor(hours / 24);
    if (days < 30) return `${days}d`;
    const months = Math.floor(days / 30);
    if (months < 12) return `${months}mo`;
    return `${Math.floor(months / 12)}y`;
}

function Avatar({ author }: { author: CommentAuthor }) {
    if (author?.avatar) {
        return (
            <Image
                src={author.avatar}
                alt={author.name || author.handle}
                width={38}
                height={38}
                className={styles.avatar}
            />
        );
    }
    return (
        <span aria-hidden className={styles.avatarFallback}>
            {(author?.name || author?.handle || "?").charAt(0).toUpperCase()}
        </span>
    );
}

function displayName(author: CommentAuthor): string {
    return author?.name || `@${author?.handle}`;
}

function useCommentMutations(postId: number, sort: SortKey) {
    const refetch = {
        query: GET_COMMENTS,
        variables: { postId, sort },
    };
    const [createComment, { loading: creating }] = useMutation(
        CREATE_COMMENT,
        { refetchQueries: [refetch] },
    );
    const [updateComment] = useMutation(UPDATE_COMMENT, {
        refetchQueries: [refetch],
    });
    const [deleteComment] = useMutation(DELETE_COMMENT, {
        refetchQueries: [refetch],
    });
    const [voteComment] = useMutation(VOTE_COMMENT, {
        refetchQueries: [refetch],
    });
    return { createComment, creating, updateComment, deleteComment, voteComment };
}

function sessionToast(err: unknown, fallback: string) {
    toast.error(
        err instanceof Error && err.message === SESSION_EXPIRED_MESSAGE
            ? SESSION_EXPIRED_MESSAGE
            : fallback,
    );
}

function Composer({
    postId,
    sort,
    replyTo,
    onDone,
}: {
    postId: number;
    sort: SortKey;
    replyTo: { id: number; handle: string } | null;
    onDone?: () => void;
}) {
    const { user } = useAuth();
    const [hasText, setHasText] = useState(false);
    const [previewHtml, setPreviewHtml] = useState("");
    const editorRef = useRef<CommentEditorHandle>(null);
    const { createComment, creating } = useCommentMutations(postId, sort);
    const pathname = usePathname();

    if (!user) {
        return (
            <div className={styles.loginPrompt}>
                <Link href={signInHref(pathname)}>Sign in</Link> to join the
                discussion.
            </div>
        );
    }

    const submit = async () => {
        const html = editorRef.current?.getHtml() ?? "";
        const empty = editorRef.current?.isEmpty() ?? true;
        if (empty || creating) return;
        try {
            const result = await createComment({
                variables: {
                    postId: Number(postId),
                    content: html,
                    parentId: replyTo?.id ?? null,
                },
            });
            throwIfGraphQLErrors(result);
            editorRef.current?.clear();
            setHasText(false);
            onDone?.();
        } catch (err) {
            sessionToast(err, "Could not post comment. Please try again.");
        }
    };

    return (
        <div className={styles.composer}>
            {replyTo && (
                <div className={styles.replyingBar}>
                    <span>Replying to @{replyTo.handle}</span>
                    <button
                        type="button"
                        className={styles.replyingClose}
                        onClick={onDone}
                        aria-label="Cancel reply"
                    >
                        ✕
                    </button>
                </div>
            )}
            <div className={styles.composerRow}>
                <Avatar
                    author={{
                        id: 0,
                        name: user.name || user.handle,
                        handle: user.handle,
                        avatar: user.avatar,
                    }}
                />
                <CommentEditor
                    ref={editorRef}
                    autoFocus={replyTo !== null}
                    placeholder={
                        replyTo
                            ? `Reply to @${replyTo.handle}...`
                            : "Share your thoughts..."
                    }
                    onInput={(html, text) => {
                        setPreviewHtml(html);
                        setHasText(text.trim().length > 0);
                    }}
                    onSubmitShortcut={submit}
                />
            </div>
            <div className={styles.composerFoot}>
                <span className={styles.hint}>
                    Select text, then B / I / quote / list · Ctrl+Enter to post
                </span>
                <button
                    type="button"
                    className={styles.submit}
                    disabled={!hasText || creating}
                    onClick={submit}
                >
                    {creating ? "Posting..." : "Comment"}
                </button>
            </div>
            {hasText && (
                <div className={styles.preview}>
                    <div className={styles.previewLabel}>Preview</div>
                    <div
                        className={styles.content}
                        dangerouslySetInnerHTML={{
                            __html: safeCommentHtml(previewHtml),
                        }}
                    />
                </div>
            )}
        </div>
    );
}

function CommentItem({
    postId,
    sort,
    comment,
    depth,
    onReply,
}: {
    postId: number;
    sort: SortKey;
    comment: CommentNode;
    depth: number;
    onReply: (target: { id: number; handle: string }) => void;
}) {
    const { user } = useAuth();
    const { updateComment, deleteComment, voteComment } = useCommentMutations(
        postId,
        sort,
    );
    const [editing, setEditing] = useState(false);
    const editRef = useRef<CommentEditorHandle>(null);
    const [confirmingDelete, setConfirmingDelete] = useState(false);
    const router = useRouter();
    const pathname = usePathname();

    const isOwner =
        !!user?.id && Number(user.id) === Number(comment.author?.id);

    const requireLoginToast = () => {
        toast.error("Please sign in to continue", {
            action: {
                label: "Sign in",
                onClick: () => router.push(signInHref(pathname)),
            },
        });
    };

    const vote = async (value: 1 | -1) => {
        if (!user) {
            requireLoginToast();
            return;
        }
        try {
            const result = await voteComment({
                variables: { commentId: Number(comment.id), value },
            });
            throwIfGraphQLErrors(result);
        } catch (err) {
            sessionToast(err, "Could not vote. Please try again.");
        }
    };

    const saveEdit = async () => {
        if (editRef.current?.isEmpty()) {
            toast.error("Comment cannot be empty");
            return;
        }
        try {
            const result = await updateComment({
                variables: {
                    id: Number(comment.id),
                    content: editRef.current?.getHtml() ?? "",
                },
            });
            throwIfGraphQLErrors(result);
            setEditing(false);
        } catch (err) {
            sessionToast(err, "Could not update comment. Please try again.");
        }
    };

    const remove = async () => {
        if (!confirmingDelete) {
            setConfirmingDelete(true);
            return;
        }
        try {
            const result = await deleteComment({
                variables: { id: Number(comment.id) },
            });
            throwIfGraphQLErrors(result);
            toast.success("Comment deleted");
        } catch (err) {
            sessionToast(err, "Could not delete comment. Please try again.");
            setConfirmingDelete(false);
        }
    };

    // Score never displays below zero — downvotes beyond 0 still count
    // internally (sorting, toggle math) but the UI floors at 0.
    const upvotes = Math.max(0, comment.score);
    const scoreLabel =
        upvotes === 1 ? "1 upvote" : `${upvotes} upvotes`;

    return (
        <li className={styles.item}>
            <Avatar author={comment.author} />
            <div className={styles.body}>
                <div className={styles.meta}>
                    <span className={styles.name}>
                        {displayName(comment.author)}
                    </span>
                    <span className={styles.handle}>
                        @{comment.author?.handle}
                    </span>
                    <span className={styles.dot}>·</span>
                    <span className={styles.time}>
                        {timeAgo(comment.createdAt)}
                    </span>
                </div>

                {editing ? (
                    <div className={styles.editor}>
                        <div className={styles.composer}>
                            <div className={styles.composerRow}>
                                <CommentEditor
                                    ref={editRef}
                                    autoFocus
                                    initialHtml={comment.content}
                                    placeholder="Edit your comment..."
                                />
                            </div>
                            <div className={styles.composerFoot}>
                                <span />
                                <span>
                                    <button
                                        type="button"
                                        className={styles.textButton}
                                        onClick={() => setEditing(false)}
                                    >
                                        Cancel
                                    </button>{" "}
                                    <button
                                        type="button"
                                        className={styles.submit}
                                        onClick={saveEdit}
                                    >
                                        Save
                                    </button>
                                </span>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div
                        className={styles.content}
                        dangerouslySetInnerHTML={{
                            __html: safeCommentHtml(comment.content),
                        }}
                    />
                )}

                <div className={styles.actions}>
                    <button
                        type="button"
                        aria-label="Upvote"
                        title="Upvote"
                        onClick={() => vote(1)}
                        className={`${styles.voteButton} ${comment.myVote === 1 ? styles.voteActiveUp : ""}`}
                    >
                        ▲
                    </button>
                    <button
                        type="button"
                        aria-label="Downvote"
                        title="Downvote"
                        onClick={() => vote(-1)}
                        className={`${styles.voteButton} ${comment.myVote === -1 ? styles.voteActiveDown : ""}`}
                    >
                        ▼
                    </button>
                    <button
                        type="button"
                        className={styles.textButton}
                        onClick={() =>
                            onReply({
                                id: comment.id,
                                handle: comment.author?.handle,
                            })
                        }
                    >
                        Reply
                    </button>
                    {isOwner && !editing && (
                        <>
                            <button
                                type="button"
                                className={styles.textButton}
                                onClick={() => setEditing(true)}
                            >
                                Edit
                            </button>
                            <button
                                type="button"
                                className={`${styles.textButton} ${confirmingDelete ? styles.textButtonConfirm : styles.textButtonDanger}`}
                                onClick={remove}
                                onBlur={() => setConfirmingDelete(false)}
                            >
                                {confirmingDelete ? "Confirm?" : "Delete"}
                            </button>
                        </>
                    )}
                    <span className={styles.score}>{scoreLabel}</span>
                </div>

                {comment.replies && comment.replies.length > 0 && depth < 4 && (
                    <ul className={styles.replies}>
                        {comment.replies.map((reply) => (
                            <CommentItem
                                key={reply.id}
                                postId={postId}
                                sort={sort}
                                comment={reply}
                                depth={depth + 1}
                                onReply={onReply}
                            />
                        ))}
                    </ul>
                )}
            </div>
        </li>
    );
}

function CommentSkeletonList() {
    return (
        <ul className={styles.skeletonList} aria-label="Loading comments">
            {[0, 1, 2].map((row) => (
                <li key={row} className={styles.skeletonItem}>
                    <span
                        className={`${styles.skeletonAvatar} ${styles.shimmer}`}
                    />
                    <div className={styles.skeletonBody}>
                        <span
                            className={`${styles.skeletonLine} ${styles.shimmer}`}
                            style={{ width: "38%", height: 14 }}
                        />
                        <span
                            className={`${styles.skeletonLine} ${styles.shimmer}`}
                            style={{ width: "92%", height: 14 }}
                        />
                        <span
                            className={`${styles.skeletonLine} ${styles.shimmer}`}
                            style={{ width: "71%", height: 14 }}
                        />
                    </div>
                </li>
            ))}
        </ul>
    );
}

const CommentSection = ({ postId }: { postId: number }) => {
    const [sort, setSort] = useState<SortKey>("OLDEST");
    const [replyTo, setReplyTo] = useState<{
        id: number;
        handle: string;
    } | null>(null);

    const { data, previousData, loading } = useQuery(GET_COMMENTS, {
        variables: { postId: Number(postId), sort },
    });

    // Keep the previous list for the count while refetching; the list area
    // itself shows fixed-height skeletons so the layout never jumps.
    const shown = data ?? previousData;
    const comments: CommentNode[] = shown?.comments ?? [];
    const totalCount =
        comments.length +
        comments.reduce((sum, c) => sum + (c.repliesCount ?? 0), 0);

    return (
        <section className={styles.thread} aria-label="Discussion">
            <div className={styles.kicker}>
                Discussion
                <span className={styles.kickerCount}>
                    {totalCount} {totalCount === 1 ? "comment" : "comments"}
                </span>
            </div>

            <Composer
                postId={Number(postId)}
                sort={sort}
                replyTo={replyTo}
                onDone={() => setReplyTo(null)}
            />

            <div
                className={styles.sortRow}
                role="tablist"
                aria-label="Sort comments"
            >
                {SORTS.map((option) => (
                    <button
                        key={option.key}
                        type="button"
                        role="tab"
                        aria-selected={sort === option.key}
                        className={`${styles.sortButton} ${sort === option.key ? styles.sortButtonActive : ""}`}
                        onClick={() => setSort(option.key)}
                    >
                        {option.label} {option.key === "OLDEST" ? "first ⇅" : ""}
                    </button>
                ))}
            </div>

            {loading ? (
                <CommentSkeletonList />
            ) : comments.length === 0 ? (
                <p className={styles.empty}>
                    No comments yet — be the first to share your thoughts.
                </p>
            ) : (
                <ul className={styles.list}>
                    {comments.map((comment) => (
                        <CommentItem
                            key={comment.id}
                            postId={Number(postId)}
                            sort={sort}
                            comment={comment}
                            depth={0}
                            onReply={setReplyTo}
                        />
                    ))}
                </ul>
            )}
        </section>
    );
};

export default CommentSection;
