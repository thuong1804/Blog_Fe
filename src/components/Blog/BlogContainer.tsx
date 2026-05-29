'use client'

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import Breadcrumbs from "@/components/Breadcumbs/Breadcumbs";
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

const BlogContainer = ({
    itemPost,
    breadcrumbItem,
    title,
    description,
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
                <div className="flex flex-col items-center text-center mt-10">
                    <h4>OUR BLOGS</h4>

                    <h1 className="mt-6 max-w-[900px]">
                        {title ? title : itemPost?.name}
                    </h1>

                    <p className="mt-6 max-w-[1010px] text-(--text-color-body)">
                        {description ? description : itemPost?.description}
                    </p>
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
                ">
                        {(dataCustom ? dataCustom : itemPost?.posts)?.map(
                            (post: ItemCardBlogProps, key: number) => (
                                <ItemCardPost
                                    key={key}
                                    title={post.title}
                                    image={post.image}
                                    description={post.description}
                                    excerpt={post.excerpt}
                                    slug={post.slug}
                                    createdAt={post.createdAt}
                                    author={post.author}
                                    category={post.category}
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
