import Breadcrumbs from "@/components/Breadcumbs/Breadcumbs";
import { MarkdownExtra } from "@/components/Markdown/Markdown";
import { LuEye } from "react-icons/lu";
import PostCard from "@/components/Post/PostCard";
import { BlogCategoryProps } from "@/type/typeProps";
import dayjs from "dayjs";
import Image from "next/image";
import React from "react";
import Link from "next/link";
import { DATE_TIME_DISPLAY } from "@/constant";

const BlogCategory: React.FC<BlogCategoryProps> = ({
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
    const formatCategory = (slug: string) => {
        return slug.toLowerCase().replace(/\s+/g, "-");
    };

    if (!category || !category.parent) return null;

    const parentSlug = formatCategory(category.parent.name);
    const childrenSlug = formatCategory(category.name);

    const breadcrumbsCategories = [
        {
            path: category.parent.name,
            slug: parentSlug,
        },
        {
            path: category.name,
            slug: `${parentSlug}/${childrenSlug}`,
        },
    ];

    return (
        <div className="w-full lg:pt-14 py-6 px-6 lg:px-0">
            {/* Breadcrumbs */}
            <div className="max-w-(--max-width-desktop) mx-auto">
                <Breadcrumbs items={breadcrumbsCategories} />
            </div>

            {/* Main Content */}
            <div className="flex flex-col items-center mt-10">
                {/* Title */}
                <h1 className="w-full max-w-[1024px]">
                    {title}
                </h1>

                {/* Banner Image */}
                <div className="relative w-full max-w-(--max-width-desktop) h-[300px] sm:h-[450px] lg:h-[600px] mt-14">
                    <Image
                        src={image}
                        alt="banner-post"
                        fill
                        sizes="(max-width: 1232px)"
                        className="object-cover rounded-2xl"
                        priority
                    />
                </div>

                {/* Meta Info */}
                <div className="w-full max-w-[1024px] mt-5 flex flex-col gap-2">
                    <div className="flex justify-between flex-wrap items-center gap-4">
                        {/* Author */}
                        <div className="flex items-center gap-2 font-bold text-(--text-color-title)">
                            <div className="w-[30px] h-[30px] rounded overflow-hidden">
                                <Image
                                    src={author.avatar}
                                    alt="avatar"
                                    width={30}
                                    height={30}
                                />
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
                                <span
                                    key={index}
                                    className="px-3 py-1 border border-[#7c4ee4] rounded-xl shadow text-(--text-color-title)"
                                >
                                    {tag.name}
                                </span>
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

                    {/* Views */}
                    <div className="flex items-center gap-1 font-bold text-(--text-color-title)">
                        Views: {views}
                        <LuEye />
                    </div>
                </div>

                {/* Divider */}
                <div className="w-full max-w-(--max-width-desktop) h-px border border-[#7c4ee4] mt-5"></div>

                {/* Content */}
                <div className="w-full max-w-[1024px] mt-10 text-(--text-color-body)">
                    <MarkdownExtra content={content} />
                </div>
            </div>

            {/* Popular Post */}
            <div className="max-w-(--max-width-desktop) mx-auto mt-10">
                <PostCard title="Popular Post" itemCards={data} />
            </div>
        </div>
    );

};
export default BlogCategory;
