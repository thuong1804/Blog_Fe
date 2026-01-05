"use client";

import Button from "@/components/Button/Button";
import { DATE_TIME_DISPLAY } from "@/constant";
import { ItemCardBlogProps } from "@/type/typeProps";
import { joinSlugCategory } from "@/utils";
import dayjs from "dayjs";
import "dayjs/locale/en";
import Link from "next/link";
import { useEffect, useState } from "react";

const AnotherPost = ({ post }: { post: ItemCardBlogProps }) => {
    const [formatted, setFormatted] = useState("");

    useEffect(() => {
        if (!post?.updatedAt) return;

        setFormatted(
            dayjs(post.updatedAt)
                .locale("en")
                .format(DATE_TIME_DISPLAY)
        );
    }, [post?.updatedAt]);

    if (!post) return null;

    return (
        <>
            <div className="max-w-desktop mx-auto px-6">
                <div className="relative rounded-xl  shadow">
                    <div className="h-[220px] sm:h-[320px] lg:h-[567px] bg-center bg-cover bg-no-repeat"
                        style={{ backgroundImage: `url(${post.image})` }}
                    />
                    <div className="relative w-full">
                        <div className=" bg-white p-6 sm:p-8 text-black lg:absolute lg:right-0 lg:bottom-0 lg:translate-y-1/4
                        lg:rounded-xl lg:shadow lg:pr-[106px] lg:max-w-[660px]"
                        >
                            <div className="font-bold text-xs pb-4">
                                {post.category?.parent?.name || post.category?.name}
                                <span className="font-medium text-body ml-2">
                                    {formatted}
                                </span>
                            </div>

                            <h4 className="text-lg sm:text-xl lg:text-3xl font-bold leading-[1.2] pb-4">
                                {post.title}
                            </h4>

                            <p className="text-body text-sm sm:text-base pb-6 lg:pb-9 max-w-[784px]">
                                {post.description}
                            </p>

                            <Link
                                href={joinSlugCategory(
                                    post.category?.parent?.name,
                                    post.category?.name,
                                    post.slug
                                )}
                            >
                                <Button
                                    title="Read more"
                                    classNames="
                            border
                            border-primary
                            bg-white
                            text-primary
                        "
                                />
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
            <div className="hidden lg:block h-[160px]" />
        </>

    );
};

export default AnotherPost;
