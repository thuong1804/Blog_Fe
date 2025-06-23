import Breadcrumbs from "@/components/Breadcumbs/Breadcumbs";
import { MarkdownExtra } from "@/components/Markdown/Markdown";
import { LuEye } from "react-icons/lu";
import PostCard from "@/components/Post/PostCard";
import { BlogCategoryProps } from "@/type/typeProps";
import dayjs from "dayjs";
import Image from "next/image";
import React from "react";

const BlogCategory: React.FC<BlogCategoryProps> = ({
  title,
  category,
  createdAt,
  updatedAt,
  content,
  tags,
  author,
  views,
  image,
  data,
}) => {
  const formattedDate = dayjs(createdAt).format("D MMMM YYYY");

  const formatCategory = (slug: string) => {
    return slug.toLowerCase().replace(/\s+/g, '-')
  }

  if (!category || !category.parent) return null;

  const parentSlug = formatCategory(category.parent.name)
  const childrenSlug = formatCategory(category.name)

  const breadcrumbsCategories = [
    {
      path: category.parent.name,
      slug: parentSlug,
    },
    {
      path: category.name,
      slug: `${parentSlug}/${childrenSlug}`,
    },
  ]

  return (
    <div className="w-full pb-20 pt-14">
      <div className="max-w-(--max-width-desktop) mx-auto">
        <Breadcrumbs items={breadcrumbsCategories}/>
      </div>
      <div className="flex flex-col items-center mt-10">
        <h1 className="max-w-[1024px]">{title}</h1>

        <div className="relative w-full h-[600px] max-w-(--max-width-desktop) mt-14">
          <Image src={image} alt="banner-post" className="object-cover rounded-2xl" fill sizes='(max-width: 1232px)' />
        </div>
        <div className="max-w-[1024px] flex flex-col w-full mt-5">
          <div className="flex justify-between flex-wrap items-center">
            <div className="text-(--text-color-title) font-bold flex items-center gap-2">
              <div className="avatar">
                <div className="w-[30px] object-cover rounded">
                  <Image alt='avatar'src={author.avatar} width={30} height={30}/>
                </div>
              </div>
              {author.name} . {author.email}
            </div>
            <div className="flex gap-2 items-center">
              {tags.map((tag, key) => (
                <span key={key} className="shadow border border-[#7c4ee4] rounded-xl text-(--text-color-title) flex items-center p-2">
                  {tag.name}
                </span>
              ))}
            </div>
          </div>
          <div className="text-(--text-color-title) flex items-center gap-4">
            <span className="text-(--text-color-body)">
              {dayjs(createdAt).format(formattedDate)}
            </span>
            -
            <span className="text-(--text-color-body)">
              Updated {dayjs(updatedAt).format(formattedDate)}
            </span>
          </div>
          <div className="text-(--text-color-title) flex items-center gap-1 mt-2 font-bold">Views: {views}<LuEye/></div>
        </div>
        <div className="h-[1px] border border-[#7c4ee4] max-w-(--max-width-desktop) w-full mt-5"></div>
        <div className="max-w-[1024px] mt-10 w-full text-(--text-color-body)">
          <MarkdownExtra content={content}/>
        </div>
      </div>
      <div className="max-w-(--max-width-desktop) mx-auto mt-10">
        <PostCard title="Popular Post" itemCards={data} />
      </div>
    </div>
  )
}
export default BlogCategory;