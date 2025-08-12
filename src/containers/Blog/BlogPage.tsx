'use client'

import BlogContainer from "@/components/Blog/BlogContainer";
import { GET_ALL_POSTS, GET_POST_BY_TITLE } from "@/graphql/Query/PostQuery";
import { useQuery } from "@apollo/client";
import { useSearchParams } from "next/navigation";

const BlogPage = () => {
  const searchParams = useSearchParams()
  const titleParams = searchParams.get('search')

  const { data } = useQuery(GET_POST_BY_TITLE, {
    variables: { search: titleParams },
    skip: !titleParams
  });

  const { data: dataAll,} = useQuery(GET_ALL_POSTS, {
    skip: !!titleParams,
  });

  const dataPost = titleParams ? data?.postsByTitle : dataAll?.posts;

  const pathBreadcrumbs = [
    {
      path: 'Blog',
      slug: '/blog'
    }
  ]

  return (
    <BlogContainer
      breadcrumbItem={pathBreadcrumbs}
      dataCustom={dataPost}
      title="Find our all blogs from here"
      description="Our blogs are written from very research research and well known writers writers so that  we can provide you the best blogs and articles articles for you to read them all along"
    />
  )
}
export default BlogPage