'use client'

import PostCard from "@/components/Post/PostCard";
import { AuthorPageProps } from "@/type/typeProps";
import Image from "next/image";
import Link from "next/link";

const AuthorPage = ({ user }: AuthorPageProps) => {

  return (
    <div className="w-full pb-20 pt-14 px-5">
      <div className="max-w-(--max-width-desktop) mx-auto">
        <div className="flex items-center justify-center gap-10 border-b-1 border-gray-300 pb-8">
          <div className="relative w-[274px] h-[274px] object-cover">
            <Image src={user.avatar} alt="banner-post" className="object-cover rounded-2xl" fill sizes='(max-width: 274px)' />
          </div>
          <div className="flex flex-col gap-3 max-w-[500px]">
            <h1>{user.handle}</h1>
            <p>{user.email}</p>
            <Link href={'/'} className="text-blue-400 underline">@{user.handle}</Link>
            <p>{user.description}</p>
          </div>
        </div>
        <div className="mt-20">
          {user.posts.length > 0 && (
            <PostCard title="Posts by this author" itemCards={user?.posts} isOutstanding={true} isViewAll={false} />
          )}
        </div>
      </div>
    </div>
  )
}
export default AuthorPage;