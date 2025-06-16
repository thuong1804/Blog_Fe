'use client'

import React, { useEffect, useRef, useState } from "react";
import { IoMdArrowDropdown  } from "react-icons/io";
import { TiArrowSortedUp } from "react-icons/ti";

import { MdArrowRight } from "react-icons/md";
import { GET_ALL_POSTS } from "@/graphql/query";
import { useQuery } from "@apollo/client";
import ItemCardPost from "../Post/ItemCardPost";
import { ItemCardBlogProps } from "@/type/typeProps";
import Link from "next/link";

type CategoryProp = {
  items: {
    id?: number,
    name: string,
    description: string,
    children: {
      name: string,
      description: string,
    }[]
  }[]
}

const Category: React.FC<CategoryProp> = ({ items }) => {
   const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const { data } = useQuery(GET_ALL_POSTS);
  const categoryRefs = useRef<(HTMLDivElement | null)[]>([]);

  const handleClickOutside = (event: MouseEvent) => {
   if (activeIndex !== null && categoryRefs.current[activeIndex] && !categoryRefs.current[activeIndex]?.contains(event.target as Node)) {
      setActiveIndex(null);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [activeIndex]);

  const toggleDropdown = (key: number) => {
    setActiveIndex(prevIndex => (prevIndex === key ? null : key));
  }



  return (
    <div className="flex justify-between items-center w-full relative ">
      {items.map((itemCategory, key) => {
        const itemCardByWithCategory = data?.posts.find(
          (post: ItemCardBlogProps) => post?.category?.id === itemCategory?.id
        );
        const isCurrentlyOpen = activeIndex === key
        return (
          <React.Fragment key={key} >
            <div className="flex items-center gap-2 w-max" onClick={() => toggleDropdown(key)}   ref={el => { categoryRefs.current[key] = el; }} >
              <div className="text-xl font-bold">{itemCategory.name}</div>
              <div className="text-[25px]">
               {isCurrentlyOpen ? <TiArrowSortedUp /> :  <IoMdArrowDropdown />}
              </div>
            </div>
            {isCurrentlyOpen && (
              <div className="bg-white z-50 absolute top-full w-full mt-3 shadow rounded-2xl border-gray-300 animate-fade-in-down">
                <div className="flex justify-between ">
                  <div className="flex flex-col p-9">
                    <div className="flex items-center gap-2">
                      <Link href={''} className="text-2xl font-bold">{itemCategory.name}</Link>
                      <div><MdArrowRight /></div>
                    </div>
                    <div className="text-gray-500 pb-10">{itemCategory.description}</div>
                    <div className="grid grid-cols-2 gap-4">
                      {itemCategory.children.map((itemChildren, key) => {
                        return (
                          <div className="flex flex-col" key={key}>
                            <Link href={''} className="font-bold text-lg">{itemChildren.name}</Link>
                            <div className="text-sm text-gray-500">{itemChildren.description}</div>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                  {itemCardByWithCategory && (
                    <div className="bg-[#f6f8fa] p-9 rounded-2xl">
                      <ItemCardPost
                        title={itemCardByWithCategory.title}
                        image={itemCardByWithCategory.image}
                        content={itemCardByWithCategory.content}
                        slug={itemCardByWithCategory.slug}
                        createdAt={itemCardByWithCategory.createAt}
                        author={itemCardByWithCategory.author}
                        category={itemCardByWithCategory.category}
                        imageSize="md"
                      />
                    </div>
                    )}
                </div>
              </div>
            )}
          </React.Fragment>
        )
      })}
    </div>
  )
}
export default Category