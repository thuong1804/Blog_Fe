"use client";

import React from "react";
import Link from "next/link";
import { ItemCardBlogProps } from "@/type/typeProps";
import { joinSlugCategory } from "@/utils/slug";
import { HiFire } from "react-icons/hi";

interface TrendingSidebarProps {
    posts: ItemCardBlogProps[];
}

const TrendingSidebar: React.FC<TrendingSidebarProps> = ({ posts }) => {
    if (!posts || posts.length === 0) return null;

    const topPosts = posts.slice(0, 5);

    return (
        <aside className="w-full bg-slate-50/80 rounded-2xl p-6 border border-slate-200/80 shadow-sm sticky top-6">
            {/* Header */}
            <div className="flex items-center gap-2 mb-6 pb-4 border-b border-slate-200">
                <div className="w-8 h-8 rounded-lg bg-rose-500/10 text-rose-500 flex items-center justify-center text-lg">
                    <HiFire />
                </div>
                <div>
                    <h3 className="font-extrabold text-lg text-slate-900 leading-tight">
                        Top Trending
                    </h3>
                    <p className="text-xs text-slate-400">Most read articles this week</p>
                </div>
            </div>

            {/* List */}
            <div className="flex flex-col divide-y divide-slate-100">
                {topPosts.map((post, index) => {
                    const rank = `0${index + 1}`;
                    const postUrl = joinSlugCategory(
                        post.category?.parent?.name,
                        post.category?.name,
                        post.slug
                    );

                    return (
                        <article key={post.slug || index} className="py-4 first:pt-0 last:pb-0 group">
                            <Link href={postUrl} className="flex gap-4 items-start">
                                <span className="text-2xl md:text-3xl font-black text-slate-300 group-hover:text-indigo-600 transition-colors shrink-0 leading-none pt-1">
                                    {rank}
                                </span>
                                <div className="flex-1">
                                    {post.category?.name && (
                                        <span className="text-[11px] font-semibold text-indigo-600 uppercase tracking-wide">
                                            {post.category.name}
                                        </span>
                                    )}
                                    <h4 className="text-sm font-bold text-slate-800 group-hover:text-indigo-600 transition-colors line-clamp-2 mt-0.5 leading-snug">
                                        {post.title}
                                    </h4>
                                    <div className="flex items-center gap-2 text-xs text-slate-400 mt-2">
                                        <span>{post.author?.name}</span>
                                        <span>•</span>
                                        <span>
                                            {post.readingTime ? `${post.readingTime}m read` : "3m read"}
                                        </span>
                                    </div>
                                </div>
                            </Link>
                        </article>
                    );
                })}
            </div>
        </aside>
    );
};

export default TrendingSidebar;
