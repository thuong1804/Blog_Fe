'use client'

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import Breadcrumbs from "@/components/Breadcrumbs/Breadcrumbs";
import ItemCardPost from "@/components/Post/ItemCardPost";
import { ItemCardBlogProps } from "@/type/typeProps";
import NotFoundBlog from "../NotFoundBlog/NotFoundBlog";

type CustomItemProps = {
    dataCustom?: ItemCardBlogProps[];
    actionDelete?: () => void;
    totalPages?: number,
    currentPage?: number,
    handleChangePage?: (page: number) => void
};

type BlogItemProp = {
    title?: string;
    description?: string;
    variant?: "blog" | "category" | "tag";
    totalCount?: number;
    totalViews?: number;
    itemPost?: {
        name: string;
        description: string;
        posts: ItemCardBlogProps[];
    };
    breadcrumbItem: {
        path: string;
        slug: string;
    }[];
};

const VARIANT_LABEL: Record<string, string> = {
    blog: "Blog",
    category: "Category",
    tag: "Tag",
};

const BlogContainer = ({
    itemPost,
    breadcrumbItem,
    title,
    description,
    variant = "blog",
    totalCount,
    totalViews,
    dataCustom,
    currentPage,
    totalPages,
}: BlogItemProp & CustomItemProps) => {
    const searchParams = useSearchParams();
    const router = useRouter();
    const pathname = usePathname();

    const searchQuery = (searchParams.get("search") ?? "").trim();
    const isSearch = variant === "blog" && searchQuery.length > 0;

    const handleChangePage = (page: number) => {
        if (page === currentPage) return;
        const params = new URLSearchParams(searchParams.toString());

        params.set("page", String(page));

        router.push(`${pathname}?${params.toString()}`);
    };

    return (
        <div className="w-full lg:pt-14 py-6 px-6 lg:px-6">
            <div className="max-w-(--max-width-desktop) mx-auto">
                {/* Breadcrumbs */}
                <div className="text-(--text-color-title)">
                    <Breadcrumbs items={breadcrumbItem} />
                </div>

                {/* Header */}
                <div className="relative mt-10 overflow-hidden rounded-2xl border border-slate-200 bg-white px-6 py-12 text-center shadow-sm sm:py-16">
                    <div className="relative flex flex-col items-center">
                        <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-slate-50 px-4 py-1.5 text-xs font-semibold tracking-[0.16em] text-slate-500 uppercase">
                            {isSearch
                                ? "Search results"
                                : (VARIANT_LABEL[variant] ?? "Blog")}
                            {typeof totalCount === "number" && (
                                <span className="font-normal tracking-normal text-slate-400 normal-case">
                                    · {totalCount}{" "}
                                    {totalCount === 1
                                        ? "article"
                                        : "articles"}
                                </span>
                            )}
                            {!isSearch &&
                                typeof totalViews === "number" && (
                                    <span className="font-normal tracking-normal text-slate-400 normal-case">
                                        · {totalViews.toLocaleString()}{" "}
                                        views
                                    </span>
                                )}
                        </span>

                        {!isSearch && (
                            <p className="mt-5 text-xs font-semibold tracking-[0.24em] text-slate-400 uppercase">
                                Our blogs
                            </p>
                        )}

                        <h1 className="mt-3 max-w-[900px] text-4xl font-bold text-slate-900 sm:text-5xl break-words">
                            {isSearch
                                ? `Search results for: "${searchQuery}"`
                                : (title ? title : itemPost?.name)}
                        </h1>

                        <p className="mt-4 max-w-[640px] text-base leading-relaxed text-slate-500">
                            {isSearch
                                ? typeof totalCount === "number" &&
                                  totalCount === 0
                                    ? `No posts found for "${searchQuery}". Try a different keyword.`
                                    : `Found ${totalCount} ${totalCount === 1 ? "article" : "articles"} matching "${searchQuery}".`
                                : (description
                                      ? description
                                      : itemPost?.description)}
                        </p>

                        <div className="mt-6 h-px w-16 rounded-full bg-slate-200" />
                    </div>
                </div>

                {(dataCustom && dataCustom.length > 0) ||
                    (itemPost?.posts && itemPost.posts.length > 0) ? (
                    <div className="
                    grid
                    grid-cols-1
                    sm:grid-cols-2
                    lg:grid-cols-3
                    gap-6
                    gap-y-10
                    mt-20
                    "
                        suppressHydrationWarning
                    >
                        {(dataCustom ? dataCustom : itemPost?.posts)?.map(
                            (post: ItemCardBlogProps, key: number) => (
                                <ItemCardPost
                                    key={post.id ?? key}
                                    id={post.id}
                                    title={post.title}
                                    image={post.image}
                                    description={post.description}
                                    excerpt={post.excerpt}
                                    slug={post.slug}
                                    createdAt={post.createdAt}
                                    author={post.author}
                                    category={post.category}
                                    content={post.content}
                                    likesCount={post.likesCount}
                                />
                            )
                        )}
                    </div>
                ) : (
                    <div className="mt-20">
                        <NotFoundBlog
                            hint={
                                isSearch
                                    ? `No results for "${searchQuery}". Try a different keyword.`
                                    : undefined
                            }
                        />
                    </div>
                )}
                {(totalPages && currentPage) && totalPages > 1 && (
                    <div className="join flex justify-center mt-6">
                        <button
                            className="join-item btn"
                            disabled={currentPage === 1}
                            onClick={() => handleChangePage?.(currentPage - 1)}
                        >
                            «
                        </button>

                        {Array.from({ length: totalPages }).map((_, index) => {
                            const pageNumber = index + 1;

                            return (
                                <button
                                    key={pageNumber}
                                    className={`join-item btn ${pageNumber === currentPage ? "btn-active" : ""
                                        }`}
                                    onClick={() => handleChangePage?.(pageNumber)}
                                >
                                    {pageNumber}
                                </button>
                            );
                        })}

                        <button
                            className="join-item btn"
                            disabled={currentPage === totalPages}
                            onClick={() => handleChangePage?.(currentPage + 1)}
                        >
                            »
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};
export default BlogContainer;
