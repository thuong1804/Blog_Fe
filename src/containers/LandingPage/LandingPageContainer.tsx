import Button from "@/components/Button/Button";
import AnotherPost from "@/containers/LandingPage/AnotherPost/AnotherPost";
import Image from "next/image";
import Link from "next/link";
import { joinSlugCategory } from "@/utils/slug";
import PopularPost from "./PopularPost/PopularPost";
import { GET_ALL_POST_POPULAR, GET_LATEST_POSTS, GET_POST_BY_SLUG } from "@/graphql/Query/PostQuery";
import { GET_ALL_CATEGORIES } from "@/graphql/Query/CategoryQuery";
import OurRecentPost from "./OurRecentPost/OurRecentPost";
import { createApolloClient } from "@/lib/apolloClient";
import NewsTicker from "./NewsTicker/NewsTicker";
import TopicShowcase from "./TopicShowcase/TopicShowcase";
import TrendingSection from "./TrendingSection/TrendingSection";

const LANDING_REVALIDATE = 300;

export default async function LandingPage() {
    const client = createApolloClient({ isServer: true });
    const FEATURED_POST_SLUG = 'ethical-hacking-techniques'

    const fetchOptions = {
        next: { revalidate: LANDING_REVALIDATE },
    };

    const [
        { data: dataFeatured },
        { data: dataPopular },
        { data: dataLatest },
        { data: dataCategories }
    ] = await Promise.all([
        client.query({
            query: GET_POST_BY_SLUG,
            variables: { slug: FEATURED_POST_SLUG },
            context: { fetchOptions },
        }),
        client.query({
            query: GET_ALL_POST_POPULAR,
            context: { fetchOptions },
        }),
        client.query({
            query: GET_LATEST_POSTS,
            variables: { skip: 0, take: 6 },
            context: { fetchOptions },
        }),
        client.query({
            query: GET_ALL_CATEGORIES,
            context: { fetchOptions },
        }),
    ]);

    const initialPosts = dataLatest?.postsLatest || [];
    const categories = dataCategories?.categories || [];
    const blogFeatured = dataFeatured?.post;
    const postDataAnother = dataPopular?.popularPosts?.[4];

    return (
        <div className="w-full pb-24">
            {/* Live Trending News Ticker */}
            <NewsTicker posts={initialPosts} />
            <section className="relative overflow-hidden bg-gradient-to-br from-[#080D1A] via-[#0F172A] to-[#1E293B] text-white">
                {/* Decorative background glows */}
                <div className="absolute -top-32 -left-20 w-96 h-96 rounded-full bg-indigo-600/20 blur-[120px] pointer-events-none" />
                <div className="absolute top-1/2 right-0 w-[500px] h-[500px] rounded-full bg-cyan-500/15 blur-[140px] pointer-events-none" />
                <div className="absolute bottom-0 left-1/3 w-80 h-80 rounded-full bg-blue-600/10 blur-[100px] pointer-events-none" />

                {/* Subtle tech dot overlay */}
                <div
                    className="absolute inset-0 opacity-[0.03] pointer-events-none"
                    style={{
                        backgroundImage: `radial-gradient(circle at 1px 1px, #ffffff 1px, transparent 0)`,
                        backgroundSize: '28px 28px'
                    }}
                />

                <div className="max-w-desktop mx-auto px-6 py-12 lg:py-16 relative z-10">
                    {blogFeatured && (
                        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-14">
                            <div className="w-full lg:w-1/2 flex flex-col items-start">
                                {/* Cyber pill badge */}
                                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider bg-cyan-500/10 text-cyan-400 border border-cyan-500/25 backdrop-blur-md mb-6 shadow-sm">
                                    <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                                    Featured Post
                                </div>

                                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[54px] font-extrabold text-white leading-[1.2] tracking-tight pb-5">
                                    {blogFeatured.title}
                                </h1>

                                <p className="max-w-[520px] pb-8 text-slate-300 text-base md:text-lg leading-relaxed">
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
                                        classNames="bg-blue-600 hover:bg-blue-500 text-white font-semibold px-8 py-3.5 rounded-xl shadow-lg shadow-blue-600/30 border border-blue-400/30 transition-all duration-300 hover:shadow-blue-500/50 hover:scale-[1.02]"
                                    />
                                </Link>
                            </div>

                            {/* Right image with ambient cyber glow */}
                            <div className="w-full lg:w-[608px] h-[360px] sm:h-[420px] lg:h-[540px] relative group">
                                <div className="absolute -inset-2 rounded-2xl bg-gradient-to-tr from-cyan-500/25 via-indigo-500/20 to-blue-600/30 blur-2xl opacity-75 group-hover:opacity-100 transition-opacity duration-500 -z-0"></div>
                                <div className="relative w-full h-full rounded-2xl overflow-hidden border border-slate-700/60 shadow-2xl">
                                    <Image
                                        src={blogFeatured.image}
                                        alt="featured-post"
                                        width={608}
                                        priority
                                        height={576}
                                        className="w-full h-full object-cover rounded-2xl transform transition-transform duration-500 group-hover:scale-105"
                                        sizes="(max-width: 1024px) 100vw, 608px"
                                    />
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </section>
            {/* Top Trending Section (Horizontal 4-columns) */}
            <TrendingSection posts={dataPopular?.popularPosts || initialPosts} />

            {/* Explore Topics */}
            <TopicShowcase categories={categories} />

            {/* Recent Posts */}
            <section className="max-w-desktop mx-auto px-6 py-16">
                <OurRecentPost initialPosts={initialPosts} />
            </section>

            {/* Featured Highlight Banner */}
            <section className="max-w-desktop mx-auto px-6 pb-20">
                <AnotherPost post={postDataAnother} />
            </section>

            {/* Popular Posts (Full Width 3 Columns) */}
            <section className="max-w-desktop mx-auto px-6">
                <PopularPost data={dataPopular} />
            </section>
        </div>
    );
};
