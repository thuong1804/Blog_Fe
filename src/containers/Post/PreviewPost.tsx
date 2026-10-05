"use client";

import { markdownToHtml, renderImage } from "@/utils";
import dayjs from "dayjs";
import hljs from "highlight.js";
import Image from "next/image";
import React, { useEffect, useMemo } from "react";
import { LuClock, LuEye, LuSparkles } from "react-icons/lu";
import { MdOutlineCategory } from "react-icons/md";

export type PreviewPostInfo = {
    title?: string;
    description?: string;
    excerpt?: string;
    readingTime?: number;
    image?: string;
    categoryId?: number;
    tagIds?: number[];
};

export type PreviewAuthor = {
    name?: string;
    email?: string;
    avatar?: string;
    handle?: string;
};

type PreviewPostProps = {
    content: string;
    info?: PreviewPostInfo;
    categoryName?: string;
    tagNames?: string[];
    author?: PreviewAuthor | null;
};

const PreviewPost: React.FC<PreviewPostProps> = ({
    content,
    info,
    categoryName,
    tagNames = [],
    author,
}) => {
    useEffect(() => {
        try {
            hljs.highlightAll();
        } catch {
            // ignore highlight errors on unescaped content
        }
    }, [content]);

    const processedContent = useMemo(() => {
        if (!content) return "";
        return markdownToHtml(content);
    }, [content]);

    const hasHeaderInfo = Boolean(
        info?.title || info?.image || categoryName || tagNames.length || info?.description || info?.excerpt
    );

    return (
        <div className="w-full h-full overflow-y-auto overflow-x-hidden px-4 py-6 sm:px-8">
            <div className=" mx-auto flex flex-col">
                {/* ── Draft Preview Notice ── */}
                <div className="flex items-center justify-between pb-3 mb-6 border-b border-gray-100 text-xs text-gray-400">
                    <span className="flex items-center gap-1 font-medium text-[#6D28D9]">
                        <LuSparkles className="text-sm" /> Article Preview Mode
                    </span>
                    <span>{dayjs().format("MMM D, YYYY")} · Draft</span>
                </div>

                {/* ── Post Header & Metadata ── */}
                {hasHeaderInfo && (
                    <header className="flex flex-col gap-4 mb-6">
                        {/* Category & Tags */}
                        <div className="flex flex-wrap items-center gap-2">
                            {categoryName && (
                                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-[#6D28D9]/10 text-[#6D28D9]">
                                    <MdOutlineCategory className="text-sm" />
                                    {categoryName}
                                </span>
                            )}
                            {tagNames.map((tag) => (
                                <span
                                    key={tag}
                                    className="px-2.5 py-0.5 rounded-lg text-xs font-medium bg-gray-100 text-gray-600 border border-gray-200"
                                >
                                    #{tag}
                                </span>
                            ))}
                        </div>

                        {/* Title */}
                        {info?.title && (
                            <h1 className="text-2xl sm:text-4xl font-extrabold text-[#18181B] leading-tight tracking-tight">
                                {info.title}
                            </h1>
                        )}

                        {/* Author & Reading Time Bar */}
                        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 text-sm text-gray-500 border-b border-gray-100 pb-4">
                            <div className="flex items-center gap-2.5">
                                <div className="w-9 h-9 rounded-full overflow-hidden relative bg-purple-100 shrink-0">
                                    {renderImage(author?.avatar)}
                                </div>
                                <div className="flex flex-col">
                                    <span className="font-bold text-gray-800 text-sm">
                                        {author?.name || "Author"}
                                    </span>
                                    {author?.email && (
                                        <span className="text-xs text-gray-400">{author.email}</span>
                                    )}
                                </div>
                            </div>

                            <div className="flex items-center gap-3 text-xs text-gray-500">
                                {info?.readingTime ? (
                                    <span className="flex items-center gap-1">
                                        <LuClock className="text-gray-400" />
                                        {info.readingTime} min read
                                    </span>
                                ) : null}
                                <span className="flex items-center gap-1">
                                    <LuEye className="text-gray-400" />
                                    0 views
                                </span>
                            </div>
                        </div>

                        {/* Excerpt / Description Highlight Box */}
                        {(info?.description || info?.excerpt) && (
                            <div className="p-4 rounded-xl bg-[#FAF9F7] border border-[#EDE9FE] border-l-4 border-l-[#A3E635] text-gray-700">
                                {info.description && (
                                    <p className="whitespace-pre-line text-sm sm:text-base leading-relaxed font-normal text-gray-700">
                                        {info.description}
                                    </p>
                                )}
                                {info.excerpt && info.excerpt !== info.description && (
                                    <p className="whitespace-pre-line text-xs sm:text-sm text-gray-500 mt-2 italic leading-relaxed">
                                        {info.excerpt}
                                    </p>
                                )}
                            </div>
                        )}

                        {/* Banner Image */}
                        {info?.image && (
                            <div className="w-full aspect-video sm:h-[400px] rounded-2xl overflow-hidden relative shadow-md my-2">
                                <Image
                                    src={info.image}
                                    alt={info.title || "Post thumbnail"}
                                    fill
                                    className="object-cover"
                                    priority
                                    unoptimized={Boolean(typeof info.image === "string" && info.image.endsWith(".gif"))}
                                />
                            </div>
                        )}
                    </header>
                )}

                {/* ── Article Content ── */}
                <article className="preview-content tiptap wysiwyg wysiwyg-slate w-full pb-16">
                    {processedContent ? (
                        <div
                            dangerouslySetInnerHTML={{ __html: processedContent }}
                            className="text-gray-700 leading-relaxed text-base"
                        />
                    ) : (
                        <p className="text-gray-400 italic py-8 text-center">
                            No content entered in editor yet.
                        </p>
                    )}
                </article>
            </div>
        </div>
    );
};

export default PreviewPost;
