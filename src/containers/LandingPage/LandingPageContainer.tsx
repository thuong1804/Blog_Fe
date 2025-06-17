'use client'

import Button from "@/components/Button/Button"
import PostCard from "@/components/Post/PostCard"
import AnotherPost from "@/containers/LandingPage/AnotherPost/AnotherPost"
import Image from "next/image"
import { useQuery } from '@apollo/client';
import { GET_ALL_POSTS } from "@/graphql/query"
import SubscribeEmail from "./SubscribeEmail/SubscribeEmail"

const LandingPage = () => {
  const { data } = useQuery(GET_ALL_POSTS);

  return (
    <div className="h-auto w-full">
      <div className="bg-[#7C4EE4] p-24 relative">
        <div className="w-[600px] h-[200px] pointer-events-none overflow-hidden absolute top-0 left-0 ">
          <Image src={'/images/vector.svg'} alt="vector-banner" className="pointer-events-none  w-auto rounded-br-[200px] h-auto" fill sizes="(max-width: 608px)"/>
        </div>
        <div className="flex justify-between gap-12 max-w-[1232px] lg-max-w-[1232px] w-full h-auto mx-auto">
          <div className="w-1/2">
            <span className="font-bold text-lg">Featured Post</span>
            <h1 className="text-[64px] font-bold leading-[1.5] pb-8">
              How AI will <br /> Change the Future
            </h1>
            <div className=" w-full max-w-[416px] pb-16">The future of AI will see home robots having enhanced intelligence,
              increased capabilities, and becoming more personal and possibly cute.
              For example, home robots will overcome navigation, direction
            </div>
            <Button title="Read more" classNames="bg-white text-black" />
          </div>
          <div className="w-[608px] h-[576px]">
            <Image src={'/images/banner.png'} className="rounded-xl w-auto h-auto object-contain" width={610} height={576} alt="banner" />
          </div>
        </div>
        <div>
        </div>
      </div>
      <div className="mt-[88px]">
        <AnotherPost />
      </div>
      <div className="mt-[88px]">
        {data && data.posts && (
          <PostCard title="Our Recent Post" itemCards={data.posts} isOutstanding/>
        )}
      </div>
       <div className="mt-[88px]">
        {data && data.posts && (
          <PostCard title="Popular Post" itemCards={data.posts}/>
        )}
      </div>
      <div className="mt-[88px]">
        <SubscribeEmail />
      </div>
    </div>

  )
}
export default LandingPage