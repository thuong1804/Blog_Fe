"use client";

import React, { useState, useCallback } from "react";
import Breadcrumbs from "@/components/Breadcumbs/Breadcumbs";
import { MarkdownExtra } from "@/components/Markdown/Markdown";
import { LuEye } from "react-icons/lu";
import { CiEdit } from "react-icons/ci";
import { IoIosTrash } from "react-icons/io";
import PostCard from "@/components/Post/PostCard";
import PostViewTracker from "@/components/Post/PostViewTracker";
import Modal from "@/components/Modal/Modal";
import { BlogCategoryProps } from "@/type/typeProps";
import dayjs from "dayjs";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { DATE_TIME_DISPLAY } from "@/constant";
import { renderImage } from "@/utils";
import { useAuth } from "@/context/AuthContext/AuthContext";
import { useMutation } from "@apollo/client";
import { DELETE_POST } from "@/graphql/Mutation/Post";
import { GET_POST_BY_AUTHOR } from "@/graphql/Query/AuthorQuery";
import { toast } from "sonner";

const BlogCategory: React.FC<BlogCategoryProps> = ({
    id,
    title,
    category,
    createdAt,
    updatedAt,
    content,
    tags,
    author,
    views,
    image,
    data,
}) => {
    const router = useRouter();
    const { user: userLogin } = useAuth();
    const [openModal, setOpenModal] = useState(false);
    const [displayViews, setDisplayViews] = useState<number>(views ?? 0);

    const isAuthor = Boolean(
        userLogin?.id && author && (
            (author.id && Number(userLogin.id) === Number(author.id)) ||
            (author.email && userLogin.email === author.email) ||
            (author.handle && userLogin.handle === author.handle)
        )
    );

    const targetHandle = author?.handle || userLogin?.handle;

    const [deletePost, { loading }] = useMutation(DELETE_POST, {
        update(cache, { data }) {
            if (data?.deletePost?.success && id) {
                const normalizedId = cache.identify({ __typename: "Post", id: Number(id) });
                cache.evict({ id: normalizedId });
                cache.gc();
            }
        },
        refetchQueries: targetHandle
            ? [
                  {
                      query: GET_POST_BY_AUTHOR,
                      variables: { handle: targetHandle },
                  },
              ]
            : [],
        onCompleted: (data) => {
            if (data?.deletePost?.success) {
                toast.success(data.deletePost.message || "Deleted post successfully");
                setOpenModal(false);
                router.push(author?.handle ? `/author/${author.handle}` : "/blog");
            } else {
                toast.error("Failed to delete post");
            }
        },
        onError: () => {
            toast.error("Failed to delete post");
        },
    });

    const handleDeletePost = useCallback(async () => {
        if (!id) {
            toast.error("Post ID is missing");
            return;
        }
        if (!userLogin?.id) {
            toast.error("Please login to delete this post");
            return;
        }
        await deletePost({
            variables: { postId: Number(id) },
        });
    }, [id, userLogin?.id, deletePost]);
    const formatCategory = (slug: string) => {
        return slug.toLowerCase().replace(/\s+/g, "-");
    };

    if (!category) return null;

    const parentSlug = category.parent
        ? formatCategory(category.parent.name)
        : "general";
    const childrenSlug = formatCategory(category.name);

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
                                {/* <Image
                                    src={author.avatar}
                                    alt="avatar"
                                    width={30}
                                    height={30}
                                /> */}
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
                    </div>

                    {/* Views & Author Actions */}
                    <div className="flex justify-between items-center flex-wrap gap-4 pt-1">
                        <div className="flex items-center gap-1 font-bold text-(--text-color-title)">
                            Views: {displayViews}
                            <LuEye />
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
                    <Modal
                        modal_id={`delete_detail_modal_${id}`}
                        title="Delete post"
                        open={openModal}
                        setOpenModal={setOpenModal}
                        onSubmit={handleDeletePost}
                        objectName="Delete"
                        loading={loading}
                    >
                        <p className="text-gray-600">
                            Are you sure you want to delete <strong>{title}</strong>? This action cannot be undone.
                        </p>
                    </Modal>
                )}

                <div className="w-full max-w-(--max-width-desktop) h-[2px] bg-gradient-to-r from-[#6D28D9] via-[#A3E635] to-[#6D28D9] mt-5 rounded-full"></div>

                <div className="w-full max-w-[1024px] mt-10 text-(--text-color-body)">
                    <MarkdownExtra content={content} />
                </div>
            </div>

            <div className="max-w-(--max-width-desktop) mx-auto mt-10">
                <PostCard title="Popular Post" itemCards={data} />
            </div>
        </div>
    );

};
export default BlogCategory;
