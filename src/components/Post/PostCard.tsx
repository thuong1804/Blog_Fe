import Image from "next/image"
import Button from "../Button/Button"
import ItemCardPost from "./ItemCardPost"
import { ItemCardBlogProps } from "@/type/typeProps"

type PostCardProps = {
  title: string,
  itemCards: ItemCardBlogProps[],
}

const PostCard: React.FC<PostCardProps> = ({ title, itemCards}) => {
  return (
    <div className="max-w-[1232px] lg-max-w-[1232px] mx-auto">
      <div className="flex justify-between">
        <h1 className="text-black text-4xl font-bold">{title}</h1>
        <Button title="View all" />
      </div>
      <div className="flex text-black gap-12 mt-20">
        <div className="relative w-3/5 h-[456px]">
          <Image src={'/images/banner-2.jpg'} alt="banner-post" className="object-cover rounded-2xl" fill sizes='(max-width: 768px)'/>
        </div>
        <div className="flex-1">
          <div className="text-xs font-bold">
            DEVELOPMENT <span className="text-[#999999] font-normal">16 March 2023</span>
          </div>
          <h4 className="text-3xl font-[500] leading-[1.5] pb-3.5">
            How to make a Game look more attractive with New VR & AI Technology
          </h4>
          <div className="text-[#666666] text-[16px] pb-[61px]">
            Google has been investing in AI for many years and bringing its benefits to individuals,
            businesses and communities. Whether it’s publishing state-of-the-art research,
            building helpful products or developing tools and resources that enable others,
            we’re committed to making AI accessible to everyone.
          </div>
          <Button title="Read more" classNames="border border-[#7C4EE4] bg-white text-[#7C4EE4]"/>
        </div>
      </div>
      <div className="mt-16 grid grid-cols-3 gap-4">
        {itemCards.length > 0 && (
          itemCards.map((item, key) => (
            <ItemCardPost
              key={key}
              title={item.title}
              slug={`/posts/${item.slug}`}
              category={item.category}
              createdAt={item.createdAt}
              image={item.image}
              content={item.content}
              author={item.author}
            />
          ))
        )}
      </div>
    </div>
  )
}
export default PostCard