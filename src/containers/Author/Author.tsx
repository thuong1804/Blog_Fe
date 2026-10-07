"use client";

import PostCard from "@/components/Post/PostCard";
import { path } from "@/constant/path";
import { useAuth } from "@/context/AuthContext/AuthContext";
import { CiEdit } from "react-icons/ci";
import Image from "next/image";
import Link from "next/link";
import Button from "@/components/Button/Button";
import { IoMdCreate } from "react-icons/io";
import { useSuspenseQuery } from "@apollo/client";
import { GET_AUTHOR_STATS, GET_POST_BY_AUTHOR } from "@/graphql/Query/AuthorQuery";
import { AuthorPageProps } from "@/type/typeProps";
import { FaBookmark, FaHeart, FaNewspaper } from "react-icons/fa6";
import { LuEye } from "react-icons/lu";

type GetPostByAuthorData = {
  userByPosts: AuthorPageProps["user"];
};

type GetAuthorStatsData = {
    authorStats: {
        totalPosts: number;
        totalViews: number;
        totalLikes: number;
        totalBookmarks: number;
    };
};

const AuthorPage = ({ handle }: { handle: string }) => {
    const { user: userLogin } = useAuth();

    const { data } = useSuspenseQuery<GetPostByAuthorData>(
        GET_POST_BY_AUTHOR,
        {
            variables: { handle },
        }
    );

    const { data: statsData } = useSuspenseQuery<GetAuthorStatsData>(
        GET_AUTHOR_STATS,
        {
            variables: { handle },
        }
    );

    const user = data?.userByPosts;
    if (!user) return null;

    const stats = statsData?.authorStats ?? {
        totalPosts: 0,
        totalViews: 0,
        totalLikes: 0,
        totalBookmarks: 0,
    };
    const statCards = [
        {
            label: "Posts",
            value: stats.totalPosts,
            icon: <FaNewspaper className="text-lg text-indigo-600" />,
        },
        {
            label: "Views",
            value: stats.totalViews,
            icon: <LuEye className="text-lg text-sky-600" />,
        },
        {
            label: "Likes",
            value: stats.totalLikes,
            icon: <FaHeart className="text-lg text-rose-500" />,
        },
        {
            label: "Saves",
            value: stats.totalBookmarks,
            icon: <FaBookmark className="text-lg text-amber-500" />,
        },
    ];

    const posts = user?.posts ?? [];
    const isUserLogin = userLogin?.email === user?.email;

    return (
        <div className="w-full pb-20 pt-14 px-5">
            <div className="max-w-(--max-width-desktop) mx-auto">
                <div
                    className=" flex flex-col md:flex-row items-center md:items-start justify-center gap-6 md:gap-10 border-b border-gray-300 pb-8
                    text-center
                    md:text-left"
                >
                    <div className="relative w-[160px] h-[160px] sm:w-[200px] sm:h-[200px] md:w-[274px] md:h-[274px] shrink-0 border rounded-2xl border-gray-200">
                        {user.avatar ? (
                            <Image
                                src={user.avatar}
                                alt="banner-post"
                                className="object-cover rounded-2xl"
                                fill
                                sizes="(max-width: 768px) 160px, 274px"
                            />
                        ) : (
                            <Image
                                src={'/avatar-default.svg'}
                                alt="banner-post"
                                className="object-cover rounded-2xl"
                                fill
                                sizes="(max-width: 768px) 160px, 274px"
                            />
                        )}
                    </div>

                    {/* User info */}
                    <div className="flex flex-col gap-3 max-w-[500px] items-center md:items-start">
                        <h1 className="text-xl md:text-2xl font-semibold">
                            {user.handle}
                        </h1>

                        <p className="text-gray-600 break-all">
                            {user.email}
                        </p>

                        <Link href="/" className="text-blue-400 underline">
                            @{user.handle}
                        </Link>

                        <p className="text-gray-700 leading-relaxed">
                            {user.description}
                        </p>

                        {isUserLogin && (
                            <Link
                                href={path.editUser}
                                className="mt-2 font-medium bg-white text-gray-700 flex items-center gap-2 px-4 py-2
                                    rounded-xl border border-gray-400 w-max"
                            >
                                Edit profile <CiEdit />
                            </Link>
                        )}
                    </div>
                </div>
                {/* Author stats */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mt-8">
                    {statCards.map((stat) => (
                        <div
                            key={stat.label}
                            className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3.5 shadow-sm"
                        >
                            <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-slate-100">
                                {stat.icon}
                            </div>
                            <div className="flex flex-col">
                                <span className="text-lg font-extrabold text-slate-900">
                                    {stat.value.toLocaleString()}
                                </span>
                                <span className="text-xs font-medium text-slate-500">
                                    {stat.label}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
                <div className="mt-20">
                    {isUserLogin ? (
                        posts.length > 0 ? (
                            <div className="relative w-full">
                                <PostCard
                                    isLogin={isUserLogin}
                                    title={
                                        isUserLogin
                                            ? "Your posts"
                                            : "Posts by this author"
                                    }
                                    itemCards={posts}
                                    isOutstanding={true}
                                    isViewAll={false}
                                />
                                <Link href={"/post/new"}>
                                    <div className="absolute top-0 right-0">
                                        <Button classNames="p-6">
                                            Create new post <IoMdCreate />
                                        </Button>
                                    </div>
                                </Link>
                            </div>
                        ) : (
                            <div className="text-black w-full h-[400px] ">
                                <h1>Your post</h1>
                                <div className="flex justify-between items-center gap-4 h-full relative">
                                    {Array.from({ length: 3 }).map((_, idx) => (
                                        <div
                                            key={idx}
                                            className="h-80 w-full bg-gray-200 rounded-xl"
                                        />
                                    ))}
                                    <Link href={"/post/new"}>
                                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                                            <Button>
                                                Create a new post <IoMdCreate />
                                            </Button>
                                        </div>
                                    </Link>
                                </div>
                            </div>
                        )
                    ) : (
                        <PostCard
                            title={
                                isUserLogin
                                    ? "Your posts"
                                    : "Posts by this author"
                            }
                            itemCards={posts}
                            isOutstanding={true}
                            isViewAll={false}
                        />
                    )}
                </div>
            </div>
        </div>
    );
};
export default AuthorPage;
