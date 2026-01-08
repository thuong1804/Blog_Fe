"use client";

import BlogContainer from "@/components/Blog/BlogContainer";
import { GET_ALL_POSTS } from "@/graphql/Query/PostQuery";
import { ItemCardBlogProps } from "@/type/typeProps";
import { useSuspenseQuery } from "@apollo/client";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
interface GetAllPostsData {
    posts: {
        items: ItemCardBlogProps[];
        meta: {
            totalPages: number,
            currentPage: number
        }
    }
}

const BlogPage = () => {
    const searchParams = useSearchParams();
    const router = useRouter();
    const pathname = usePathname();
    const page = Number(searchParams.get("page") ?? 1);
    const PAGE_SIZE = 12;
    const search = searchParams.get("search") ?? null;

    const { data } = useSuspenseQuery<GetAllPostsData>(
        GET_ALL_POSTS,
        {
            variables: {
                page,
                pageSize: PAGE_SIZE,
                search
            },
        }
    );

    const posts = data.posts.items;
    const { totalPages, currentPage } = data.posts.meta;

    const handleChangePage = (page: number) => {
        if (page === currentPage) return;
        const params = new URLSearchParams(searchParams.toString());

        params.set("page", String(page));

        router.push(`${pathname}?${params.toString()}`);
    };

    const pathBreadcrumbs = [
        {
            path: "Blog",
            slug: "/blog",
        },
    ];

    return (
        <BlogContainer
            breadcrumbItem={pathBreadcrumbs}
            totalPages={totalPages}
            currentPage={currentPage}
            handleChangePage={handleChangePage}
            dataCustom={posts}
            title="Find our all blogs from here"
            description="Our blogs are written from very research research and well known writers writers so that  we can provide you the best blogs and articles articles for you to read them all along"
        />
    );
};
export default BlogPage;