"use client";

import React, { useState, useCallback } from "react";
import Image from "next/image";
import Button from "../Button/Button";
import ItemCardPost from "./ItemCardPost";
import { ItemCardBlogProps } from "@/type/typeProps";
import dayjs from "dayjs";
import "dayjs/locale/en";
import { DATE_TIME_DISPLAY } from "@/constant";
import Link from "next/link";
import { joinSlugCategory } from "@/utils";
import { IoIosMore } from "react-icons/io";
import Modal from "../Modal/Modal";
import { DELETE_POST } from "@/graphql/Mutation/Post";
import { GET_POST_BY_AUTHOR } from "@/graphql/Query/AuthorQuery";
import { useMutation } from "@apollo/client";
import { useAuth } from "@/context/AuthContext/AuthContext";
import { toast } from "sonner";

type PostCardProps = {
    title: string;
    isOutstanding?: boolean;
    itemCards: ItemCardBlogProps[];
    isViewAll?: boolean;
    isLogin?: boolean;
    actionLoadMore?: () => void;
    totalItem?: number;
    gridColsClass?: string;
};

const PostCard: React.FC<PostCardProps> = ({
    title,
    itemCards,
    isOutstanding = false,
    isViewAll = true,
    isLogin = false,
    actionLoadMore,
    totalItem,
    gridColsClass,
}) => {
    const cardAnother = itemCards?.[0];
    const [openModal, setOpenModal] = useState(false);
    const { user: userLogin } = useAuth();

    const isCardAnotherAuthor = Boolean(
        isLogin ?? (
            userLogin?.id && cardAnother?.author && (
                (cardAnother.author.id && Number(userLogin.id) === Number(cardAnother.author.id)) ||
                (cardAnother.author.email && userLogin.email === cardAnother.author.email) ||
                (cardAnother.author.handle && userLogin.handle === cardAnother.author.handle)
            )
        )
    );

    const targetHandle = cardAnother?.author?.handle || userLogin?.handle;

    const [deletePost, { loading }] = useMutation(DELETE_POST, {
        update(cache, { data }) {
            if (data?.deletePost?.success && cardAnother?.id) {
                const normalizedId = cache.identify({ __typename: "Post", id: Number(cardAnother.id) });
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
            } else {
                toast.error("Failed to delete post");
            }
        },
        onError: () => {
            toast.error("Failed to delete post");
        },
    });

    const handleDeleteCardAnother = useCallback(async () => {
        if (!cardAnother?.id) {
            toast.error("Post ID is missing");
            return;
        }
        if (!userLogin?.id) {
            toast.error("Please login to delete this post");
            return;
        }
        await deletePost({
            variables: { postId: Number(cardAnother.id) },
        });
    }, [cardAnother?.id, userLogin?.id, deletePost]);

    const handleLoadMore = () => {
        actionLoadMore?.();
    };

    return (
        <section className="max-w-desktop mx-auto">
            <div className="flex items-center justify-between flex-wrap gap-4 pb-2 border-b border-slate-100">
                <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">
                    {title}
                </h2>
                {isViewAll && (
                    <Link href="/blog">
                        <Button
                            title="View all"
                            classNames="px-5 py-2.5 h-auto min-h-0 text-sm font-semibold rounded-xl bg-slate-900 text-white shadow-sm border border-slate-800/10 transition-all duration-300 hover:scale-105"
                        />
                    </Link>
                )}
            </div>
            {isOutstanding && cardAnother && (
                <div className="mt-16 flex flex-col lg:flex-row gap-12 text-black relative">
                    {isCardAnotherAuthor && (
                        <div className="absolute top-2 right-2 z-20">
                            <div className="dropdown dropdown-end">
                                <button
                                    tabIndex={0}
                                    aria-label="Post options"
                                    className="btn btn-sm btn-circle btn-ghost bg-white/80 backdrop-blur-xs text-black hover:bg-gray-700 hover:text-white transition-all shadow"
                                >
                                    <IoIosMore size={20} />
                                </button>
                                <ul
                                    tabIndex={0}
                                    className="dropdown-content menu bg-white text-gray-700 rounded-xl shadow-lg w-28 p-2 border border-gray-400"
                                >
                                    <li>
                                        <Link
                                            href={`/post/edit/${cardAnother.id}`}
                                            className="hover:bg-gray-400 hover:text-white rounded-lg px-3 py-2 transition-colors"
                                        >
                                            Edit
                                        </Link>
                                    </li>
                                    <li>
                                        <button
                                            onClick={() => setOpenModal(true)}
                                            className="hover:bg-red-500 hover:text-white rounded-lg px-3 py-2 transition-colors text-left"
                                        >
                                            Delete
                                        </button>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    )}

                    {/* Image */}
                    <div className="relative w-full lg:w-3/5 h-[260px] md:h-[360px] lg:h-[456px] overflow-hidden rounded-2xl">
                        <Link
                            href={joinSlugCategory(
                                cardAnother.category?.parent?.name,
                                cardAnother.category?.name,
                                cardAnother.slug
                            )}
                        >
                            <Image
                                src={cardAnother.image || "/images/banner.jpg"}
                                alt="banner-post"
                                fill
                                className="object-cover transition-transform duration-300 hover:scale-105"
                                sizes="(max-width: 1024px) 100vw, 60vw"
                                unoptimized={Boolean(typeof cardAnother.image === "string" && cardAnother.image.endsWith(".gif"))}
                            />
                        </Link>
                    </div>

                    <div className="flex-1 flex flex-col gap-5">
                        <div className="text-xs font-bold">
                            {cardAnother.category?.parent?.name ||
                                cardAnother.category?.name}
                            <span className="text-body font-normal ml-2.5">
                                {dayjs(cardAnother.updatedAt)
                                    .locale("en")
                                    .format(DATE_TIME_DISPLAY)}
                            </span>
                        </div>

                        <Link
                            href={joinSlugCategory(
                                cardAnother.category?.parent?.name,
                                cardAnother.category?.name,
                                cardAnother.slug
                            )}
                            className="text-xl md:text-2xl lg:text-3xl font-bold hover:underline"
                        >
                            {cardAnother.title}
                        </Link>

                        <p className="text-[#52525B] text-base">
                            {cardAnother.description}
                        </p>

                        <div className="flex gap-3 items-center text-xs font-bold flex-wrap mt-5">
                            <div className="avatar">
                                <div className="w-[30px] rounded">
                                    <Image
                                        alt="avatar"
                                        src={
                                            cardAnother.author.avatar ||
                                            "/images/banner-2.jpg"
                                        }
                                        width={30}
                                        height={30}
                                    />
                                </div>
                            </div>

                            <Link
                                href={`/author/${cardAnother.author.handle}`}
                                className="hover:text-blue-400 hover:underline"
                            >
                                {cardAnother.author.name}
                            </Link>

                            <span className="text-body">
                                {dayjs(cardAnother.createdAt)
                                    .locale("en")
                                    .format(DATE_TIME_DISPLAY)}
                            </span>
                        </div>

                        <div className="mt-5">
                            <Link
                                href={joinSlugCategory(
                                    cardAnother.category?.parent?.name,
                                    cardAnother.category?.name,
                                    cardAnother.slug
                                )}
                            >
                                <Button
                                    title="Read more"
                                    classNames="border border-primary bg-white text-primary"
                                />
                            </Link>
                        </div>
                    </div>

                    {cardAnother && (
                        <Modal
                            modal_id={`delete_modal_outstanding_${cardAnother.id}`}
                            title="Delete post"
                            open={openModal}
                            setOpenModal={setOpenModal}
                            onSubmit={handleDeleteCardAnother}
                            objectName="Delete"
                            loading={loading}
                        >
                            <p className="text-gray-600">
                                Are you sure you want to delete <strong>{cardAnother.title}</strong>? This action cannot be undone.
                            </p>
                        </Modal>
                    )}
                </div>
            )}

            <div className={`
                mt-16
                grid
                ${gridColsClass || "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"}
                gap-6
                gap-y-10
            `}>
                {itemCards?.map((item, key) => (
                    <ItemCardPost
                        key={item.id ?? key}
                        id={item.id}
                        title={item.title}
                        slug={item.slug}
                        description={item.description}
                        category={item.category}
                        createdAt={item.createdAt}
                        image={item.image}
                        content={item.content}
                        author={item.author}
                        excerpt={item.excerpt}
                        isLogin={isLogin}
                    />
                ))}
            </div>

            {totalItem === 6 && (
                <div className="w-full flex justify-center mt-10">
                    <Button
                        onClick={handleLoadMore}
                        title="Load more"
                        classNames="border border-primary bg-white text-primary hover:bg-white"
                    />
                </div>
            )}
        </section>
    );
};

export default PostCard;
