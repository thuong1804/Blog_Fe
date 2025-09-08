'use client'

import PostCard from "@/components/Post/PostCard";
import { path } from "@/constant/path";
import { useAuth } from "@/context/AuthContext/AuthContext";
import { AuthorPageProps } from "@/type/typeProps";
import { CiEdit } from "react-icons/ci";
import Image from "next/image";
import Link from "next/link";
import Button from "@/components/Button/Button";
import { IoMdCreate } from "react-icons/io";

const AuthorPage = ({ user }: AuthorPageProps) => {
  const {user: userLogin} = useAuth()

  const isUserLogin = user.email === userLogin?.email
  console.log(isUserLogin)

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
            {isUserLogin && (
              <Link href={path.editUser} className="font-medium bg-white text-gray-700 flex items-center gap-2 p-3  rounded-xl border-1 border-gray-400 w-max">Edit profile <CiEdit /></Link>
            )}
          </div>
        </div>
        <div className="mt-20">
          {user.posts.length > 0 ? (
            <PostCard title={isUserLogin ? "Your posts" : "Posts by this author"} itemCards={user?.posts} isOutstanding={true} isViewAll={false} />
          ) : (
            <div className="text-black w-full h-[400px] ">
              <h1>Your post</h1>
                <div className="flex justify-between items-center gap-4 h-full relative">
                  {Array.from({ length: 3 }).map((_, idx) => (
                    <div
                      key={idx}
                      className="h-80 w-full bg-gray-200 rounded-xl"
                    />
                  ))}
                  <Button classNames="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                    Create a new post <IoMdCreate />
                  </Button>
                </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
export default AuthorPage;