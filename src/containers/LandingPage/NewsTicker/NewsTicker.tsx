"use client";

import React from "react";
import Link from "next/link";
import { ItemCardBlogProps } from "@/type/typeProps";
import { joinSlugCategory } from "@/utils";
import { HiLightningBolt } from "react-icons/hi";

interface NewsTickerProps {
    posts: ItemCardBlogProps[];
}

const NewsTicker: React.FC<NewsTickerProps> = ({ posts }) => {
    if (!posts || posts.length === 0) return null;

    return (
        <div className="w-full bg-[#080D1A] border-b border-slate-800/60 overflow-hidden text-slate-300 py-2.5 px-4">
            <div className="max-w-desktop mx-auto flex items-center gap-4">
                {/* Badge */}
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-cyan-500/10 border border-cyan-500/25 text-cyan-400 font-bold text-xs uppercase tracking-wider shrink-0">
                    <HiLightningBolt className="text-cyan-400 animate-pulse text-sm" />
                    <span>Trending Now</span>
                </div>

                {/* Ticker Content */}
                <div className="overflow-hidden relative flex-1 whitespace-nowrap mask-fade">
                    <div className="inline-flex gap-8 animate-marquee hover:[animation-play-state:paused]">
                        {posts.concat(posts).map((post, idx) => (
                            <Link
                                key={`${post.slug}-${idx}`}
                                href={joinSlugCategory(
                                    post.category?.parent?.name,
                                    post.category?.name,
                                    post.slug
                                )}
                                className="inline-flex items-center gap-2 text-xs md:text-sm text-slate-300 hover:text-cyan-400 transition-colors"
                            >
                                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400/80 shrink-0" />
                                <span className="font-medium truncate max-w-[280px] md:max-w-[420px]">
                                    {post.title}
                                </span>
                                {post.category?.name && (
                                    <span className="text-[10px] text-slate-500 uppercase px-1.5 py-0.5 rounded bg-slate-800/80">
                                        {post.category.name}
                                    </span>
                                )}
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NewsTicker;
