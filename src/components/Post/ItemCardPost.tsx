'use client'

import { ItemCardBlogProps } from "@/type/typeProps";
import Image from "next/image";
import Link from "next/link";
import dayjs from "dayjs";
import { DATE_TIME_DISPLAY } from "@/constant";
import { joinSlugCategory, renderImage } from "@/utils";
import React, { useState, useCallback, useMemo } from "react";
import { IoIosMore } from "react-icons/io";
import Modal from "../Modal/Modal";
import { DELETE_POST } from "@/graphql/Mutation/Post";
import { useMutation } from "@apollo/client";
import { useAuth } from "@/context/AuthContext/AuthContext";
import { toast } from "sonner";
import { GET_POST_BY_AUTHOR } from "@/graphql/Query/AuthorQuery";

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
    imageSize = "lg",
    isLogin,
}) => {
    const [openModal, setOpenModal] = useState(false);
    const { user: userLogin } = useAuth();

    const [deletePost, { loading }] = useMutation(DELETE_POST, {
        refetchQueries: [
        {
            query: GET_POST_BY_AUTHOR,
            variables: { handle: 'thuong123tvt' }
        }
    ],
        onCompleted: () => {
            toast.success("Deleted post successfully");
            setOpenModal(false);
        },
        onError: (error) => {
            toast.error(error.message);
        }
    });

    const handleDeletePost = useCallback(async () => {
        if (!id || !userLogin?.id) return;
        await deletePost({
            variables: { postId: id, authorId: userLogin.id },
        });
    }, [id, userLogin?.id, deletePost]);

    // Tối ưu việc tính toán class bằng useMemo
    const imageClass = useMemo(() => {
        const sizes = {
            sm: "w-32 h-20",
            md: "w-64 h-40",
            lg: "w-full h-[360px]",
        };
        return sizes[imageSize] || sizes.lg;
    }, [imageSize]);

    const postUrl = joinSlugCategory(
        category?.parent?.name,
        category?.name,
        slug
    );

    return (
        <div className="max-w-[400px] max-h-[700px] flex flex-col border-b border-gray-300 pb-10 relative">
            {isLogin && (
                <div className="absolute top-1 right-0 z-50">
                    <div className="dropdown dropdown-end">
                        <button
                            tabIndex={0}
                            className="btn btn-xs btn-ghost text-black rounded-full hover:bg-gray-600 hover:text-white transition-all"
                        >
                            <IoIosMore size={20} />
                        </button>
                        <ul
                            tabIndex={0}
                            className="dropdown-content menu bg-white text-gray-700 rounded-xl shadow-lg w-28 p-2 border border-gray-400"
                        >
                            <li>
                                <Link href={`/edit-post/${id}`} className="hover:bg-gray-400 hover:text-white rounded-lg px-3 py-2 transition-colors">
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

            <Link href={postUrl} className="group">
                <div className={`relative overflow-hidden rounded-2xl cursor-pointer ${imageClass} flex justify-center`}>
                    <Image
                        src={image || "/placeholder.jpg"} // Fallback image
                        fill
                        alt={title}
                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                        sizes="(max-width: 768px) 100vw, 400px"
                    />
                </div>
                <h4 className="group-hover:underline group-hover:text-[--text-color-primary] text-2xl font-bold text-black mt-4 line-clamp-2">
                    {title}
                </h4>
                <p className="text-[#999999] text-base font-normal mt-2 truncate w-full">
                    {description}
                </p>
                <p className="text-[#999999] text-base font-normal mt-2 line-clamp-3">
                    {excerpt}
                </p>
            </Link>

            <div className="flex gap-3 items-center text-black text-xs font-bold mt-10 flex-wrap">
                <div className="avatar">
                    <div className="w-[30px] h-[30px] relative rounded overflow-hidden">
                        {renderImage(author.avatar)}
                    </div>
                </div>
                <Link
                    href={`/author/${author.handle}`}
                    className="hover:text-[--text-color-primary] hover:underline cursor-pointer"
                >
                    {author.name}
                </Link>
                <span className="text-[#999999]">
                    {dayjs(Number(createdAt)).format(DATE_TIME_DISPLAY)}
                </span>
            </div>

            <Link href={postUrl} className="text-[#7C4EE4] text-lg font-bold underline mt-5 hover:text-opacity-80">
                Read more...
            </Link>

            <Modal
                modal_id={`delete_modal_${id}`}
                title="Delete post"
                open={openModal}
                setOpenModal={setOpenModal}
                onSubmit={handleDeletePost}
                objectName="Delete"
                loading={loading}
            >
                <p className="text-gray-600">Are you sure you want to delete <strong>{title}</strong>? This action cannot be undone.</p>
            </Modal>
        </div>
    );
};

export default ItemCardPost;