import Breadcrumbs from "@/components/Breadcumbs/Breadcumbs";
import ItemCardPost from "@/components/Post/ItemCardPost";
import { ItemCardBlogProps } from "@/type/typeProps";
import NotFoundBlog from "../NotFoundBlog/NotFoundBlog";

type CustomItemProps = {
  dataCustom?: ItemCardBlogProps[]
}

type BlogItemProp = {
  title?: string,
  description?: string,
  itemPost?: {
    name: string,
    description: string,
    posts: ItemCardBlogProps[]
  }
  breadcrumbItem: {
    path: string,
    slug: string
  }[]
}

export default async function BlogContainer({
  itemPost,
  breadcrumbItem,
  title,
  description,
  dataCustom,
}: BlogItemProp & CustomItemProps) {
  return (
    <div className="w-full pt-16 pb-20">
      <div className="max-w-(--max-width-desktop) mx-auto">
        <div className="text-(--text-color-title)">
          <Breadcrumbs items={breadcrumbItem} />
        </div>
        <div className="flex flex-col items-center">
          <h4>OUR BLOGS</h4>
          <h1 className="mt-6">{title ? title : itemPost?.name}</h1>
          <p className="mt-6 max-w-[1010px]">{description ? description : itemPost?.description}
          </p>
        </div>
        {(dataCustom && dataCustom.length > 0) || (itemPost?.posts && itemPost.posts.length > 0) ? (
            <div className="grid grid-cols-3 gap-4 gap-y-10 mt-28">
              {(dataCustom ? dataCustom : itemPost?.posts)?.map((post: ItemCardBlogProps, key: number) => (
                <ItemCardPost
                  key={key}
                  title={post.title}
                  image={post.image}
                  description={post.description}
                  excerpt={post.excerpt}
                  slug={post.slug}
                  createdAt={post.createdAt}
                  author={post.author}
                  category={post.category}
                />
              ))}
            </div>
          ) : (
            <NotFoundBlog/>
          )}
      </div>
    </div>
  )
}