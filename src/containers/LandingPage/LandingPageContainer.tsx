"use client";

import Button from "@/components/Button/Button";
import AnotherPost from "@/containers/LandingPage/AnotherPost/AnotherPost";
import Image from "next/image";
import { useQuery } from "@apollo/client";
import { ItemCardBlogProps } from "@/type/typeProps";
import Link from "next/link";
import { joinSlugCategory } from "@/utils";
import PopularPost from "./PopularPost/PopularPost";
import { GET_ALL_POSTS } from "@/graphql/Query/PostQuery";
import LoadingLandingPage from "@/components/Loading/LoadingLandingPage";
import OurRecentPost from "./OurRecentPost/OurRecentPost";

const LandingPage = () => {
    const { data } = useQuery(GET_ALL_POSTS);
    const blogFeatured = data?.posts.find(
        (item: ItemCardBlogProps) => item.isFeatured,
    );
    const postDataAnother = data?.posts[4];

    return (
        <>
            {data ? (
                <div className="h-auto w-full pb-24">
                    <div className="bg-[#7C4EE4] p-24 relative">
                        <div className="w-[600px] h-[200px] pointer-events-none overflow-hidden absolute top-0 left-0 ">
                            <Image
                                src={"/images/vector.svg"}
                                alt="vector-banner"
                                className="pointer-events-none  w-auto rounded-br-[200px] h-auto"
                                fill
                                sizes="(max-width: 608px)"
                            />
                        </div>
                        {blogFeatured && (
                            <div className="flex justify-between gap-12 max-w-(--max-width-desktop) lg-max-w-(--max-width-desktop) w-full mx-auto">
                                <div className="w-1/2">
                                    <span className="font-bold text-lg">
                                        Featured Post
                                    </span>
                                    <h1 className="text-[64px] font-bold leading-[1.5] pb-8 text-white">
                                        {blogFeatured?.title}
                                    </h1>
                                    <div className=" w-full max-w-[500px] pb-16">
                                        {blogFeatured?.description}
                                    </div>
                                    <Link
                                        href={joinSlugCategory(
                                            blogFeatured?.category?.parent
                                                ?.name,
                                            blogFeatured?.category?.name,
                                            blogFeatured?.slug,
                                        )}
                                    >
                                        <Button
                                            title="Read more"
                                            classNames="bg-white text-black"
                                        />
                                    </Link>
                                </div>
                                <div className="w-[608px] h-[576px]">
                                    <Image
                                        src={blogFeatured?.image}
                                        className="rounded-xl w-full h-full object-cover"
                                        width={610}
                                        height={576}
                                        sizes="(max-with: 608px)"
                                        alt="banner"
                                    />
                                </div>
                            </div>
                        )}
                        <div></div>
                    </div>
                    <div className="p-24">
                        <AnotherPost post={postDataAnother} />
                    </div>
                    <div className="pb-24">
                        <OurRecentPost />
                    </div>
                    <div>
                        <PopularPost />
                    </div>
                </div>
            ) : (
                <LoadingLandingPage />
            )}
        </>
    );
};
export default LandingPage;
