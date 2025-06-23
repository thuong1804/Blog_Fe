'use client'

import Button from "@/components/Button/Button"
import { DATE_TIME_DISPLAY } from "@/constant"
import { ItemCardBlogProps } from "@/type/typeProps"
import { joinSlugCategory } from "@/utils"
import dayjs from "dayjs"
import 'dayjs/locale/en'
import Link from "next/link"
import { useEffect, useState } from "react"

const AnotherPost = ({ post }: { post: ItemCardBlogProps }) => {
  const [formatted, setFormatted] = useState("")

  useEffect(() => {
    setFormatted(dayjs(post?.updatedAt).locale('en').format(DATE_TIME_DISPLAY))
  }, [post?.updatedAt])

  return (
    <div>
      <div className="shadow rounded-xl w-full max-w-(--max-width-desktop) lg-max-w-(--max-width-desktop) mx-auto h-[567px] relative bg-center bg-no-repeat bg-cover"
        style={{ backgroundImage: `url(${post?.image})` }}
      >
        <div className="shadow absolute bottom-0 right-0  translate-y-1/4 max-w-[920px] bg-white pt-8 pb-11 pl-8 rounded-xl text-black w-full pr-[106px]">
          <div className="font-bold text-xs pb-6">
            {post?.category?.parent.name || post?.category?.name} <span className="font-medium text-[#999999] ml-2">{formatted}</span>
          </div>
          <h4 className="text-3xl font-bold leading-[1.2] pb-2 border-">{post?.title}</h4>
          <div className="max-w-[784px] text-[#999999] text-[16px] font-normal pb-9">{post?.description}
          </div>
          <Link href={joinSlugCategory(post?.category?.parent?.name, post?.category?.name, post?.slug)}>
            <Button title="Read more" classNames="border border-[#7C4EE4] bg-white text-[#7C4EE4]" />
          </Link>
        </div>
      </div>
      <div className="h-[100px]" />
    </div>
  )
}
export default AnotherPost