import { ItemCardBlogProps } from "@/type/typeProps";
import Image from "next/image";
import Link from "next/link";
import dayjs from "dayjs";
import { DATE_TIME_DISPLAY } from "@/constant";
import { joinSlugCategory } from "@/utils";

type ImageSize = 'sm' | 'md' | 'lg';

type ItemCardPostProps = {
  imageSize?: ImageSize
}

const ItemCardPost: React.FC<ItemCardBlogProps & ItemCardPostProps> = ({
  title,
  image,
  description,
  slug,
  createdAt,
  author,
  category,
  excerpt,
  imageSize = 'lg'
}) => {

  const imageClass = {
    sm: 'w-32 h-20',
    md: 'w-64 h-40',
    lg: 'w-full h-[360px]',
  }[imageSize];

  return (
    <div className={` max-w-[400px] max-h-[700px] flex flex-col ${imageSize} border-b-1 border-gray-300 pb-10`}>
      <Link href={joinSlugCategory(category?.parent?.name, category?.name, slug)} className="group">
        <div className={`relative overflow-hidden rounded-2xl cursor-pointer ${imageClass} flex justify-center`}>
          <Image src={image} fill alt="img-card" className="object-cover transition-transform duration-300 transform hover:scale-105" sizes="(max-width: 400px)" />
        </div>
        <h4 className="group-hover:underline group-hover:text-(--text-color-primary) text-2xl font-bold text-black mt-4">{title}</h4>
        <div className="text-[#999999] text-[16px] font-normal mt-2 truncate w-full">{description}</div>
        <div className="text-[#999999] text-[16px] font-normal mt-2">{excerpt}</div>
      </Link>
      <div className="flex gap-3 items-center text-black text-xs font-bold mt-10 flex-wrap">
        <div className="avatar">
          <div className="w-[30px] object-cover rounded">
            <Image alt='avatar' src={author.avatar ? author.avatar : '/public/images/banner-2.jpg'} width={30} height={30} />
          </div>
        </div>
        <Link href={`/author/${author.handle}`} className="hover:text-(--text-color-primary) hover:underline cursor-pointer">
          {author.name}
        </Link>
        <span className="text-[#999999]">
          {dayjs(createdAt).locale('en').format(DATE_TIME_DISPLAY)}
        </span>
      </div>
      <Link href={joinSlugCategory(category?.parent?.name, category?.name, slug)} className="text-[#7C4EE4] text-lg font-bold underline mt-5">Read more...</Link>
    </div>
  )
}
export default ItemCardPost;