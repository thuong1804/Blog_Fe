'use client'

import { ItemCardBlogProps } from "@/type/typeProps";
import Image from "next/image";
import Link from "next/link";
import dayjs from "dayjs";
import { DATE_TIME_DISPLAY } from "@/constant";
import { joinSlugCategory, renderImage } from "@/utils";
import React, { useState, useMemo, useEffect } from "react";
import { IoIosMore } from "react-icons/io";
import { HiArrowNarrowRight } from "react-icons/hi";
import { FaHeart } from "react-icons/fa6";
import DeletePostModal from "./DeletePostModal";
import { useAuth } from "@/context/AuthContext/AuthContext";
import { useDeletePost } from "@/hooks/useDeletePost";
import { isPostAuthor } from "@/utils";
import { FALLBACK_POST_IMAGE } from "@/constant";

type ImageSize = "sm" | "md" | "lg";

type ItemCardPostProps = {
    imageSize?: ImageSize;
    isLogin?: boolean;
};

const ItemCardPost: React.FC<ItemCardBlogProps & ItemCardPostProps> = ({
    title,
    id,
    image,
    description,
    slug,
    createdAt,
    author,
    category,
    excerpt,
    readingTime,
    likesCount,
    imageSize = "lg",
    isLogin,
}) => {
    const { user: userLogin } = useAuth();
    const [imgSrc, setImgSrc] = useState(image || FALLBACK_POST_IMAGE);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        setImgSrc(image || FALLBACK_POST_IMAGE);
    }, [image]);

    const isAuthor = Boolean(
        mounted && (isLogin ?? (userLogin && isPostAuthor(userLogin, author)))
    );

    const targetHandle = author?.handle || userLogin?.handle;

    const { openModal, setOpenModal, loading, handleDeletePost } =
        useDeletePost({
            postId: id,
            authorHandle: targetHandle,
            userId: userLogin?.id,
        });

    // Tối ưu việc tính toán class bằng useMemo
    const imageClass = useMemo(() => {
        const sizes = {
            sm: "w-32 h-20",
            md: "w-64 h-40",
            lg: "w-full h-[210px] sm:h-[220px]",
        };
        return sizes[imageSize] || sizes.lg;
    }, [imageSize]);

    const postUrl = joinSlugCategory(
        category?.parent?.name,
        category?.name,
        slug
    );

    return (
        <div className="group relative flex flex-col justify-between
            bg-white rounded-2xl border border-slate-200/90 p-4 shadow-sm hover:shadow-xl
            hover:border-slate-300 transition-all duration-300 h-full"
        >
            {isAuthor && (
                <div className="absolute top-6 right-6 z-30">
                    <div className="dropdown dropdown-end">
                        <button
                            tabIndex={0}
                            aria-label="Post options"
                            className="btn btn-xs btn-circle bg-white/90 backdrop-blur-md text-slate-700 shadow-sm border border-slate-200 hover:bg-slate-900 hover:text-white transition-all"
                        >
                            <IoIosMore size={18} />
                        </button>
                        <ul
                            tabIndex={0}
                            className="dropdown-content menu bg-white text-gray-700 rounded-xl shadow-lg w-28 p-2 border border-slate-200 z-50"
                        >
                            <li>
                                <Link href={`/post/edit/${id}`} className="hover:bg-slate-100 rounded-lg px-3 py-2 transition-colors">
                                    Edit
                                </Link>
                            </li>
                            <li>
                                <button 
                                    onClick={() => setOpenModal(true)}
                                    className="hover:bg-rose-50 text-rose-600 rounded-lg px-3 py-2 transition-colors text-left"
                                >
                                    Delete
                                </button>
                            </li>
                        </ul>
                    </div>
                </div>
            )}

            <div className="flex flex-col flex-1">
                {/* Thumbnail */}
                <Link href={postUrl} className="block relative overflow-hidden rounded-xl bg-slate-100">
                    <div className={`relative ${imageClass} flex justify-center`}>
                        {category?.name && (
                            <div className="absolute top-3 left-3 z-10 pointer-events-none">
                                <span className="px-2.5 py-1 rounded-lg text-xs font-semibold tracking-wide bg-slate-950/80 backdrop-blur-md text-white border border-white/15 shadow-sm">
                                    {category.name}
                                </span>
                            </div>
                        )}
                        <Image
                            src={imgSrc}
                            fill
                            alt={title}
                            onError={() => setImgSrc(FALLBACK_POST_IMAGE)}
                            className="object-cover transition-transform duration-500 group-hover:scale-105"
                            sizes="(max-width: 768px) 100vw, 400px"
                            unoptimized={Boolean(typeof imgSrc === "string" && imgSrc.endsWith(".gif"))}
                        />
                    </div>
                </Link>

                {/* Content */}
                <Link href={postUrl} className="block mt-4 flex-1">
                    <h3 className="text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-2 leading-snug">
                        {title}
                    </h3>
                    <p className="text-slate-500 text-sm font-normal mt-2 line-clamp-2 leading-relaxed">
                        {description || excerpt || ""}
                    </p>
                </Link>
            </div>

            {/* Footer with Author & Reading Time */}
            <div className="flex items-center justify-between pt-4 mt-5 border-t border-slate-100 text-xs">
                <div className="flex items-center gap-2.5">
                    <div className="w-[30px] h-[30px] relative rounded-full overflow-hidden border border-slate-200 shrink-0">
                        {renderImage(author.avatar)}
                    </div>
                    <div className="flex flex-col">
                        <Link
                            href={`/author/${author.handle}`}
                            className="font-semibold text-slate-800 hover:text-blue-600 truncate max-w-[120px] transition-colors"
                        >
                            {author.name}
                        </Link>
                        <span className="text-[11px] text-slate-400">
                            {dayjs(Number(createdAt)).format(DATE_TIME_DISPLAY)}
                        </span>
                    </div>
                </div>

                <Link
                    href={postUrl}
                    className="flex items-center gap-1 font-semibold text-slate-500 group-hover:text-blue-600 transition-colors"
                >
                    <FaHeart className="text-xs text-rose-400" />
                    <span>{likesCount ?? 0}</span>
                    <span className="mx-0.5 text-slate-300">·</span>
                    <span>{readingTime ? `${readingTime}m` : `${Math.max(2, Math.ceil((description?.length || 100) / 100))}m`} read</span>
                    <HiArrowNarrowRight className="text-base transform transition-transform group-hover:translate-x-1" />
                </Link>
            </div>

            <DeletePostModal
                modalId={`delete_modal_${id}`}
                postTitle={title}
                open={openModal}
                setOpenModal={setOpenModal}
                onSubmit={handleDeletePost}
                loading={loading}
            />
        </div>
    );
};

export default ItemCardPost;