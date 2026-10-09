"use client";

import React, { useState } from "react";
import Breadcrumbs from "@/components/Breadcrumbs/Breadcrumbs";
import { MarkdownExtra } from "@/components/Markdown/Markdown";
import { LuEye } from "react-icons/lu";
import { CiEdit } from "react-icons/ci";
import { IoIosTrash } from "react-icons/io";
import PostCard from "@/components/Post/PostCard";
import PostEngagement from "@/components/Post/PostEngagement";
import CommentSection from "@/components/Comments/CommentSection";
import PostViewTracker from "@/components/Post/PostViewTracker";
import ReadingProgressBar from "@/components/Post/ReadingProgressBar";
import DeletePostModal from "@/components/Post/DeletePostModal";
import { PostDetailProps } from "@/type/typeProps";
import dayjs from "dayjs";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { DATE_TIME_DISPLAY, GENERAL_CATEGORY_SLUG } from "@/constant";
import { formatSlug } from "@/utils/slug";
import { renderImage } from "@/utils/render";
import { isPostAuthor } from "@/utils/guards";
import { useAuth } from "@/context/AuthContext/AuthContext";
import { useDeletePost } from "@/hooks/useDeletePost";

const PostDetail: React.FC<PostDetailProps> = ({
    id,
    title,
    category,
    createdAt,
    updatedAt,
    content,
    tags,
    author,
    views,
    readingTime,
    likesCount,
    image,
    relatedPosts = [],
}) => {
    const router = useRouter();
    const { user: userLogin } = useAuth();
    const [displayViews, setDisplayViews] = useState<number>(views ?? 0);

    const isAuthor = Boolean(
        userLogin && isPostAuthor(userLogin, author)
    );

    const targetHandle = author?.handle || userLogin?.handle;

    const { openModal, setOpenModal, loading, handleDeletePost } =
        useDeletePost({
            postId: id,
            authorHandle: targetHandle,
            userId: userLogin?.id,
            onDeleted: () => {
                router.push(
                    author?.handle ? `/author/${author.handle}` : "/blog",
                );
            },
        });

    if (!category) return null;

    const parentSlug = category.parent
        ? formatSlug(category.parent.name)
        : GENERAL_CATEGORY_SLUG;
    const childrenSlug = formatSlug(category.name);

    const breadcrumbsCategories = [
        ...(category.parent
            ? [
                  {
                      path: category.parent.name,
                      slug: parentSlug,
                  },
              ]
            : []),
        {
            path: category.name,
            slug: `${parentSlug}/${childrenSlug}`,
        },
    ];

    return (
        <div className="w-full lg:pt-14 py-6 px-6 lg:px-6">
            <ReadingProgressBar />
            {id != null && (
                <PostViewTracker
                    postId={Number(id)}
                    onCounted={setDisplayViews}
                />
            )}
            {/* Breadcrumbs */}
            <div className="max-w-(--max-width-desktop) mx-auto">
                <Breadcrumbs items={breadcrumbsCategories} />
            </div>

            {/* Main Content */}
            <div className="flex flex-col items-center mt-10">
                {/* Title */}
                <h1 className="w-full max-w-[1024px] text-center">
                    {title}
                </h1>

                {/* Banner Image */}
                <div className="relative w-full max-w-(--max-width-desktop) h-[300px] sm:h-[450px] lg:h-[600px] mt-14">
                    <Image
                        src={image || "/images/banner.jpg"}
                        alt="banner-post"
                        fill
                        sizes="(max-width: 1232px)"
                        className="object-cover rounded-2xl"
                        priority
                        unoptimized={Boolean(typeof image === "string" && image.endsWith(".gif"))}
                    />
                </div>

                {/* Meta Info */}
                <div className="w-full max-w-[1024px] mt-5 flex flex-col gap-2">
                    <div className="flex justify-between flex-wrap items-center gap-4">
                        {/* Author */}
                        <div className="flex items-center gap-2 font-bold text-(--text-color-title)">
                            <div className="w-[30px] h-[30px] rounded overflow-hidden">
                                {renderImage(author.avatar)}
                            </div>

                            <Link
                                href={`/author/${author.handle}`}
                                className="hover:text-blue-400 hover:underline"
                            >
                                {author.name}
                            </Link>

                            <span className="font-normal">· {author.email}</span>
                        </div>

                        {/* Tags */}
                        <div className="flex flex-wrap gap-2">
                            {tags.map((tag, index) => (
                                <Link
                                    key={index}
                                    href={`/tag/${encodeURIComponent(tag.name)}`}
                                    className="px-3 py-1 border border-[#6D28D9]/30 bg-[#A3E635]/15 rounded-xl shadow text-(--text-color-title) hover:bg-[#A3E635]/30 transition-colors"
                                >
                                    {tag.name}
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* Date */}
                    <div className="flex flex-wrap items-center gap-2 text-(--text-color-body)">
                        <span>
                            {dayjs(Number(createdAt))
                                .locale("en")
                                .format(DATE_TIME_DISPLAY)}
                        </span>
                        <span>-</span>
                        <span>
                            Updated{" "}
                            {dayjs(Number(updatedAt))
                                .locale("en")
                                .format(DATE_TIME_DISPLAY)}
                        </span>
                        {typeof readingTime === "number" && readingTime > 0 && (
                            <>
                                <span>-</span>
                                <span className="font-semibold">
                                    {readingTime} min read
                                </span>
                            </>
                        )}
                    </div>

                    {/* Views & Author Actions */}
                    <div className="flex justify-between items-center flex-wrap gap-4 pt-1">
                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-1 font-bold text-(--text-color-title)">
                                Views: {displayViews}
                                <LuEye />
                            </div>
                            {id != null && (
                                <PostEngagement
                                    postId={Number(id)}
                                    initialLikesCount={likesCount}
                                />
                            )}
                        </div>

                        {isAuthor && id && (
                            <div className="flex items-center gap-2.5">
                                <Link
                                    href={`/post/edit/${id}`}
                                    className="btn btn-sm btn-outline border-gray-300 text-gray-700 hover:bg-gray-100 rounded-xl flex items-center gap-1.5"
                                >
                                    <CiEdit size={16} /> Edit
                                </Link>
                                <button
                                    onClick={() => setOpenModal(true)}
                                    className="btn btn-sm bg-red-500 hover:bg-red-600 text-white rounded-xl flex items-center gap-1.5"
                                >
                                    <IoIosTrash size={16} /> Delete
                                </button>
                            </div>
                        )}
                    </div>
                </div>
                {id && (
                    <DeletePostModal
                        modalId={`delete_detail_modal_${id}`}
                        postTitle={title}
                        open={openModal}
                        setOpenModal={setOpenModal}
                        onSubmit={handleDeletePost}
                        loading={loading}
                    />
                )}

                <div className="w-full max-w-(--max-width-desktop) h-[2px] bg-gradient-to-r from-[#6D28D9] via-[#A3E635] to-[#6D28D9] mt-5 rounded-full"></div>

                <div className="w-full max-w-[1024px] mt-10 text-(--text-color-body)">
                    <MarkdownExtra content={content} />
                </div>
            </div>

            <div className="max-w-[1024px] mx-auto mt-10">
                {id != null && <CommentSection postId={Number(id)} />}
            </div>

            {relatedPosts.length > 0 && (
                <div className="max-w-(--max-width-desktop) mx-auto mt-10">
                    <PostCard
                        title="Related Posts"
                        itemCards={relatedPosts}
                        isViewAll={false}
                    />
                </div>
            )}
        </div>
    );

};
export default PostDetail;
