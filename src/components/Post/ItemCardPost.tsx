import { ItemCardBlogProps } from "@/type/typeProps";
import Image from "next/image";
import Link from "next/link";
import dayjs from "dayjs";
import { DATE_TIME_VALUE } from "@/constant";

const ItemCardPost: React.FC<ItemCardBlogProps> = ({
  title,
  image,
  content,
  slug,
  createdAt,
  author,
  category,
}) => {
  const formatSlug = category.toLowerCase().replace(/\s+/g, '-')
  const joinSlug = `${formatSlug}/${slug}`

  return (
    <div className=" w-[400px] h-[630px] flex flex-col">
      <Link  href={joinSlug}>
        <div className="relative w-full h-[360px] overflow-hidden rounded-2xl cursor-pointer">
          <Image src={image} fill alt="img-card" className="object-cover transition-transform duration-300 transform hover:scale-105" sizes="(max-width: 400px)" />
        </div>
        <div className="flex gap-5 items-center text-black text-xs font-bold mt-10 flex-wrap">
          <div>
            {author.name}
          </div>
          <span className="text-[#999999] ml-4">
            {dayjs(createdAt).format(DATE_TIME_VALUE)}
          </span>
        </div>
        <h4 className="text-2xl font-bold text-black mt-4">{title}</h4>
        <div className="text-[#999999] text-[16px] font-normal mt-2">{content}</div>
      </Link>
      <Link href={slug} className="text-[#7C4EE4] text-lg font-bold underline mt-5">Read more...</Link>
    </div>
  )
}
export default ItemCardPost;