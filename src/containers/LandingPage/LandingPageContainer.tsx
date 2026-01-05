"use client";

import Button from "@/components/Button/Button";
import AnotherPost from "@/containers/LandingPage/AnotherPost/AnotherPost";
import Image from "next/image";
import { useQuery } from "@apollo/client";
import Link from "next/link";
import { joinSlugCategory } from "@/utils";
import PopularPost from "./PopularPost/PopularPost";
import { GET_POST_BY_SLUG } from "@/graphql/Query/PostQuery";
import LoadingLandingPage from "@/components/Loading/LoadingLandingPage";
import OurRecentPost from "./OurRecentPost/OurRecentPost";

const LandingPage = () => {
    const FEATURED_POST_SLUG = 'ethical-hacking-techniques'
    const { data } = useQuery(GET_POST_BY_SLUG, {
        variables: {
            slug: FEATURED_POST_SLUG,
        },
    });
    const blogFeatured = data?.post

    const postDataAnother = data?.posts?.[4];

    if (!data) return <LoadingLandingPage />;

    return (
        <div className="w-full pb-24">
            <section className="bg-[#7C4EE4] relative">
                <div className="max-w-desktop mx-auto px-6 py-10">
                    {blogFeatured && (
                        <div className="flex flex-col lg:flex-row gap-12 relative z-10">
                            <div className="w-full lg:w-1/2 text-white">
                                <span className="font-bold text-lg">
                                    Featured Post
                                </span>

                                <h1 className="text-4xl text-white/90 md:text-5xl lg:text-[64px] font-bold leading-[1.3] py-2">
                                    {blogFeatured.title}
                                </h1>

                                <p className="max-w-[500px] pb-16 text-white/90">
                                    {blogFeatured.description}
                                </p>

                                <Link
                                    href={joinSlugCategory(
                                        blogFeatured.category?.parent?.name,
                                        blogFeatured.category?.name,
                                        blogFeatured.slug
                                    )}
                                >
                                    <Button
                                        title="Read more"
                                        classNames="bg-white text-black"
                                    />
                                </Link>
                            </div>

                            {/* Right image */}
                            <div className="w-full lg:w-[608px] h-[360px] lg:h-[576px]">
                                <Image
                                    src={blogFeatured.image}
                                    alt="featured-post"
                                    width={608}
                                    height={576}
                                    className="w-full h-full object-cover rounded-xl"
                                    sizes="(max-width: 1024px) 100vw, 608px"
                                />
                            </div>
                        </div>
                    )}
                </div>
            </section>

            <section className="max-w-desktop mx-auto px-6 py-20">
                <AnotherPost post={postDataAnother} />
            </section>

            <section className="max-w-desktop mx-auto px-6 pb-20">
                <OurRecentPost />
            </section>

            <section className="max-w-desktop mx-auto px-6">
                <PopularPost />
            </section>
        </div>
    );
};

export default LandingPage;
