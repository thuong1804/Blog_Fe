import Image from "next/image"
import Button from "../Button/Button"
import ItemCardPost from "./ItemCardPost"
import { ItemCardBlogProps } from "@/type/typeProps"
import dayjs from "dayjs"
import 'dayjs/locale/en'
import { DATE_TIME_DISPLAY } from "@/constant"
import Link from "next/link"
import { joinSlugCategory } from "@/utils"

type PostCardProps = {
  title: string,
  isOutstanding?: boolean
  itemCards: ItemCardBlogProps[],
}

const PostCard: React.FC<PostCardProps> = ({ title, itemCards, isOutstanding = false}) => {
  const cardAnother = itemCards?.[0]
  return (
    <div className="max-w-(--max-width-desktop) lg-max-w-(--max-width-desktop) mx-auto">
      <div className="flex justify-between">
        <h1 className="text-black text-4xl font-bold">{title}</h1>
        <Link href={'/blog'}>
          <Button title="View all" />
        </Link>
      </div>
      {isOutstanding && (
        <div className="flex text-black gap-12 mt-20">
          <div className="relative w-3/5 h-[456px]">
            <Image src={cardAnother.image} alt="banner-post" className="object-cover rounded-2xl" fill sizes='(max-width: 768px)' />
          </div>
          <div className="flex-1">
            <div className="text-xs font-bold">
              {cardAnother.category?.parent?.name || cardAnother.category?.name}
              <span className="text-[#999999] font-normal ml-2.5">
                {dayjs(cardAnother.updatedAt).locale('en').format(DATE_TIME_DISPLAY)}
                </span>
            </div>
            <h4 className="text-3xl font-[500] leading-[1.5] pb-3.5">
              {cardAnother.title}
            </h4>
            <div className="text-[#666666] text-[16px] pb-[61px]">
              {cardAnother.description}
            </div>
            <Link href={joinSlugCategory(cardAnother.category?.parent?.name, cardAnother.category?.name, cardAnother.slug)}>
              <Button title="Read more" classNames="border border-[#7C4EE4] bg-white text-[#7C4EE4]" />
            </Link>
          </div>
        </div>
      )}
      <div className="mt-16 grid grid-cols-3 gap-4 gap-y-10">
        {itemCards?.length > 0 && (
          itemCards.map((item, key) => (
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
            />
          ))
        )}
      </div>
    </div>
  )
}
export default PostCard