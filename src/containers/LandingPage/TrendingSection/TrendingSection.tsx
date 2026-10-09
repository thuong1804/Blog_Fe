"use client";

import React from "react";
import Link from "next/link";
import { ItemCardBlogProps } from "@/type/typeProps";
import { joinSlugCategory } from "@/utils/slug";
import { IoTrendingUp } from "react-icons/io5";

interface TrendingSectionProps {
    posts: ItemCardBlogProps[];
}

const TrendingSection: React.FC<TrendingSectionProps> = ({ posts }) => {
    if (!posts || posts.length === 0) return null;

    const topPosts = posts.slice(0, 4);

    return (
        <section className="w-full py-12 bg-white">
            <div className="max-w-desktop mx-auto px-6">
                {/* Header */}
                <div className="flex items-center gap-2.5 mb-8 pb-4 border-b border-slate-100">
                    <div>
                        <h2 className="text-xl md:text-2xl font-extrabold text-red-400 leading-tight">
                            Trending This Week
                        </h2>
                    </div>
                    <div className="w-9 h-9 rounded-xl text-red-400 flex items-center justify-center text-xl">
                        <IoTrendingUp />
                    </div>
                </div>

                {/* 4-Column Horizontal Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {topPosts.map((post, index) => {
                        const rank = `0${index + 1}`;
                        const postUrl = joinSlugCategory(
                            post.category?.parent?.name,
                            post.category?.name,
                            post.slug
                        );

                        return (
                            <article
                                key={post.slug || index}
                                className="group relative p-5 rounded-2xl bg-slate-50/70 hover:bg-white border border-slate-200/80 hover:border-slate-900  hover:shadow-lg transition-all duration-300 flex flex-col justify-between"
                            >
                                <div>
                                    <div className="flex items-center justify-between mb-3">
                                        <span className="text-3xl font-black text-slate-300 transition-colors">
                                            {rank}
                                        </span>
                                        {post.category?.name && (
                                            <span className="text-[11px] font-semibold text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-100/70">
                                                {post.category.name}
                                            </span>
                                        )}
                                    </div>
                                    <Link href={postUrl}>
                                        <h3 className="font-bold text-base text-slate-900 transition-colors line-clamp-2 leading-snug">
                                            {post.title}
                                        </h3>
                                    </Link>
                                </div>
                                <div className="flex items-center gap-2 text-xs text-slate-400 mt-5 pt-3 border-t border-slate-200/50">
                                    <span className="truncate max-w-[130px] font-medium text-slate-600">{post.author?.name}</span>
                                    <span>•</span>
                                    <span className="shrink-0">{post.readingTime ? `${post.readingTime}m read` : "3m read"}</span>
                                </div>
                            </article>
                        );
                    })}
                </div>
            </div>
        </section>
    );
};

export default TrendingSection;
