import { ItemCardBlogProps } from "@/type/typeProps";
import Image from "next/image";
import Link from "next/link";
import dayjs from "dayjs";
import { DATE_TIME_VALUE } from "@/constant";

type ImageSize = 'sm' | 'md' | 'lg';

type ItemCardPostProps  = {
  imageSize?: ImageSize
}

const ItemCardPost: React.FC<ItemCardBlogProps & ItemCardPostProps> = ({
  title,
  image,
  content,
  slug,
  createdAt,
  author,
  category,
  imageSize = 'lg'
}) => {
  const formatSlug = category?.name.toLowerCase().replace(/\s+/g, '-')
  const joinSlug = `${formatSlug}/${slug}`
    const imageClass = {
    sm: 'w-32 h-20',
    md: 'w-64 h-40',
    lg: 'w-full h-[360px]',
  }[imageSize];

  return (
    <div className={`max-w-[400px] max-h-[630px] flex flex-col ${imageSize}`}>
      <Link href={joinSlug}>
        <div className={`relative overflow-hidden rounded-2xl cursor-pointer ${imageClass} flex justify-center`}>
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