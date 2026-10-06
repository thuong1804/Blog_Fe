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
                <div className="relative mt-10 overflow-hidden rounded-3xl border border-slate-200/80 bg-gradient-to-br from-indigo-50 via-white to-lime-50 px-6 py-12 text-center sm:py-16">
                    {/* decorative blobs */}
                    <div
                        aria-hidden
                        className="pointer-events-none absolute -top-24 -left-20 h-64 w-64 rounded-full bg-indigo-300/30 blur-3xl"
                    />
                    <div
                        aria-hidden
                        className="pointer-events-none absolute -right-20 -bottom-24 h-72 w-72 rounded-full bg-lime-300/40 blur-3xl"
                    />
                    {/* dot pattern */}
                    <div
                        aria-hidden
                        className="pointer-events-none absolute inset-0 opacity-60"
                        style={{
                            backgroundImage:
                                "radial-gradient(circle at 1px 1px, rgb(99 102 241 / 0.10) 1px, transparent 0)",
                            backgroundSize: "22px 22px",
                        }}
                    />

                    <div className="relative flex flex-col items-center">
                        <span className="inline-flex items-center gap-1.5 rounded-full border border-indigo-200 bg-white/80 px-4 py-1.5 text-xs font-bold tracking-[0.18em] text-indigo-700 uppercase shadow-sm backdrop-blur">
                            {VARIANT_LABEL[variant] ?? "Blog"}
                            {typeof totalCount === "number" && (
                                <span className="font-semibold tracking-normal text-slate-500 normal-case">
                                    · {totalCount}{" "}
                                    {totalCount === 1
                                        ? "article"
                                        : "articles"}
                                </span>
                            )}
                            {typeof totalViews === "number" && (
                                <span className="font-semibold tracking-normal text-slate-500 normal-case">
                                    · {totalViews.toLocaleString()} views
                                </span>
                            )}
                        </span>

                        <p className="mt-5 text-xs font-bold tracking-[0.28em] text-slate-400 uppercase">
                            Our blogs
                        </p>

                        <h1 className="mt-3 max-w-[900px] text-4xl font-extrabold text-slate-900 sm:text-5xl">
                            {title ? title : itemPost?.name}
                        </h1>

                        <p className="mt-4 max-w-[720px] text-base text-slate-500">
                            {description
                                ? description
                                : itemPost?.description}
                        </p>

                        <div className="mt-6 h-1 w-24 rounded-full bg-gradient-to-r from-indigo-500 via-violet-500 to-lime-400" />
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
                                />
                            )
                        )}
                    </div>
                ) : (
                    <div className="mt-20">
                        <NotFoundBlog />
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
