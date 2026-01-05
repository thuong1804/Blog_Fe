import Image from "next/image";
import Button from "../Button/Button";
import ItemCardPost from "./ItemCardPost";
import { ItemCardBlogProps } from "@/type/typeProps";
import dayjs from "dayjs";
import "dayjs/locale/en";
import { DATE_TIME_DISPLAY } from "@/constant";
import Link from "next/link";
import { joinSlugCategory } from "@/utils";

type PostCardProps = {
    title: string;
    isOutstanding?: boolean;
    itemCards: ItemCardBlogProps[];
    isViewAll?: boolean;
    isLogin?: boolean;
    actionDelete?: () => void;
    actionLoadMore?: () => void;
    totalItem?: number;
};

const PostCard: React.FC<PostCardProps> = ({
    title,
    itemCards,
    isOutstanding = false,
    isViewAll = true,
    isLogin = false,
    actionDelete,
    actionLoadMore,
    totalItem,
}) => {
    const cardAnother = itemCards?.[0];

    const handleLoadMore = () => {
        actionLoadMore?.();
    };

    return (
        <section className="max-w-desktop mx-auto px-6">
            <div className="flex items-center justify-between flex-wrap">
                <h1 className="text-black text-2xl md:text-3xl lg:text-4xl font-bold">
                    {title}
                </h1>
                {isViewAll && (
                    <Link href="/blog">
                        <Button title="View all" />
                    </Link>
                )}
            </div>
            {isOutstanding && cardAnother && (
                <div className="mt-16 flex flex-col lg:flex-row gap-12 text-black">

                    {/* Image */}
                    <div className="relative w-full lg:w-3/5 h-[260px] md:h-[360px] lg:h-[456px] overflow-hidden rounded-2xl">
                        <Link
                            href={joinSlugCategory(
                                cardAnother.category?.parent?.name,
                                cardAnother.category?.name,
                                cardAnother.slug
                            )}
                        >
                            <Image
                                src={cardAnother.image}
                                alt="banner-post"
                                fill
                                className="object-cover transition-transform duration-300 hover:scale-105"
                                sizes="(max-width: 1024px) 100vw, 60vw"
                            />
                        </Link>
                    </div>

                    <div className="flex-1 flex flex-col gap-5">
                        <div className="text-xs font-bold">
                            {cardAnother.category?.parent?.name ||
                                cardAnother.category?.name}
                            <span className="text-body font-normal ml-2.5">
                                {dayjs(cardAnother.updatedAt)
                                    .locale("en")
                                    .format(DATE_TIME_DISPLAY)}
                            </span>
                        </div>

                        <Link
                            href={joinSlugCategory(
                                cardAnother.category?.parent?.name,
                                cardAnother.category?.name,
                                cardAnother.slug
                            )}
                            className="text-xl md:text-2xl lg:text-3xl font-bold hover:underline"
                        >
                            {cardAnother.title}
                        </Link>

                        <p className="text-[#666666] text-base">
                            {cardAnother.description}
                        </p>

                        <div className="flex gap-3 items-center text-xs font-bold flex-wrap mt-5">
                            <div className="avatar">
                                <div className="w-[30px] rounded">
                                    <Image
                                        alt="avatar"
                                        src={
                                            cardAnother.author.avatar ||
                                            "/images/banner-2.jpg"
                                        }
                                        width={30}
                                        height={30}
                                    />
                                </div>
                            </div>

                            <Link
                                href={`/author/${cardAnother.author.handle}`}
                                className="hover:text-blue-400 hover:underline"
                            >
                                {cardAnother.author.name}
                            </Link>

                            <span className="text-body">
                                {dayjs(cardAnother.createdAt)
                                    .locale("en")
                                    .format(DATE_TIME_DISPLAY)}
                            </span>
                        </div>

                        <div className="mt-5">
                            <Link
                                href={joinSlugCategory(
                                    cardAnother.category?.parent?.name,
                                    cardAnother.category?.name,
                                    cardAnother.slug
                                )}
                            >
                                <Button
                                    title="Read more"
                                    classNames="border border-primary bg-white text-primary"
                                />
                            </Link>
                        </div>
                    </div>
                </div>
            )}

            <div className="
                mt-16
                grid
                grid-cols-1
                sm:grid-cols-2
                lg:grid-cols-3
                gap-6
                gap-y-10
            ">
                {itemCards?.map((item, key) => (
                    <ItemCardPost
                        key={key}
                        title={item.title}
                        slug={item.slug}
                        description={item.description}
                        category={item.category}
                        createdAt={item.createdAt}
                        image={item.image}
                        content={item.content}
                        author={item.author}
                        excerpt={item.excerpt}
                        isLogin={isLogin}
                        actionDelete={actionDelete}
                    />
                ))}
            </div>

            {totalItem === 6 && (
                <div className="w-full flex justify-center mt-10">
                    <Button
                        onClick={handleLoadMore}
                        title="Load more"
                        classNames="border border-primary bg-white text-primary hover:bg-white"
                    />
                </div>
            )}
        </section>
    );
};

export default PostCard;
