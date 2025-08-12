'use client'

import BlogPage from "@/containers/Blog/BlogPage";
import { Suspense } from "react";

const Blog = () => {
  return (
    <Suspense fallback={<div>loading...</div>}>
      <BlogPage/>
    </Suspense>
  )
}
export default Blog