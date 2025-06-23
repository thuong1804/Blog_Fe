'use client'

import BlogContainer from "@/components/Blog/BlogContainer";
import { GET_POST_BY_TITLE } from "@/graphql/query";
import { useQuery } from "@apollo/client";
import { useSearchParams } from "next/navigation";

const Blog = () => {
  const searchParams = useSearchParams()
  const titleParams = searchParams.get('search')
  const { data } = useQuery(GET_POST_BY_TITLE, {
    variables: { search: titleParams },
  });
  const dataPost = data?.postsByTitle

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
export default Blog