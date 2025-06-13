import { ItemCardProps } from "@/type/typeProps";
import Image from "next/image";
import Link from "next/link";

const ItemCardPost: React.FC<ItemCardProps> = ({
  title,
  image,
  description,
  category,
  link,
  date,
}) => {
  return (
    <div className=" w-[400px] h-[630px] flex flex-col">
      <div className="relative w-full h-[300px]">
        <Image src={image} fill alt="img-card" className="object-cover rounded-2xl" />
      </div>
      <div className="text-black text-xs font-bold mt-10">{category} <span className="text-[#999999] ml-4">{date}</span></div>
      <h4 className="text-2xl font-bold text-black mt-4">{title}</h4>
      <div className="text-[#999999] text-[16px] font-normal mt-2">{description}</div>
      <Link href={link} className="text-[#7C4EE4] text-lg font-bold underline mt-5">Read more...</Link>
    </div>
  )
}
export default ItemCardPost;