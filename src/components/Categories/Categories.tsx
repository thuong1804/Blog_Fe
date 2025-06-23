'use client'

import React, { useEffect, useRef, useState } from "react";
import { IoMdArrowDropdown } from "react-icons/io";
import { TiArrowSortedUp } from "react-icons/ti";

import { MdArrowRight } from "react-icons/md";
import ItemCardPost from "../Post/ItemCardPost";
import { ItemCardBlogProps } from "@/type/typeProps";
import Link from "next/link";

type CategoryProp = {
  items: {
    id?: number,
    name: string,
    description: string,
    slug: string,
    posts: ItemCardBlogProps[],
    children: {
      name: string,
      description: string,
      slug: string,
      posts: ItemCardBlogProps[]
    }[]
  }[]
}

const Category: React.FC<CategoryProp> = ({ items }) => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const wrapperRefs = useRef<Record<number, HTMLDivElement | null>>({});

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        activeIndex !== null &&
        wrapperRefs.current[activeIndex] &&
        !wrapperRefs.current[activeIndex]?.contains(event.target as Node)
      ) {
        setActiveIndex(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [activeIndex]);
  ;

  const toggleDropdown = (key: number) => {
    setActiveIndex(prevIndex => (prevIndex === key ? null : key));
  }

  const transferLink = () => {
    setTimeout(() => {
      setActiveIndex(null)
    }, 500)
  }

  return (
    <div className="flex justify-between items-center w-full relative text-[#333333]">
      {items.map((itemCategory, key) => {
        const itemCardByWithCategory = itemCategory.children[0]?.posts[0]
        const isCurrentlyOpen = activeIndex === key
        return (
          itemCategory.children.length > 0 && (
            <React.Fragment key={key}>
              <div className="flex items-center gap-2 w-max cursor-pointer" onClick={() => toggleDropdown(key)} ref={el => {
                wrapperRefs.current[key] = el;
              }} >
                <div className="text-xl font-bold">{itemCategory.name}</div>
                <div className="text-[25px]">
                  {isCurrentlyOpen ? <TiArrowSortedUp /> : <IoMdArrowDropdown />}
                </div>
              </div>
              {isCurrentlyOpen && (
                <div className="bg-white z-50 absolute top-full w-full mt-3 shadow rounded-2xl border-gray-300 animate-fade-in-down" ref={el => {
                  wrapperRefs.current[key] = el;
                }}>
                  <div className="flex justify-between ">
                    <div className="flex flex-col p-9">
                      <div className="flex items-center gap-2">
                        <Link href={`/${itemCategory.slug}`} className="text-2xl font-bold"  onClick={transferLink}>{itemCategory.name}</Link>
                        <div><MdArrowRight /></div>
                      </div>
                      <div className="text-gray-500 pb-10">{itemCategory.description}</div>
                      <div className="grid grid-cols-2 gap-4">
                        {itemCategory.children.map((itemChildren, key) => {
                          const slugJoin = `/${itemCategory.slug}/${itemChildren.slug}`
                          return (
                            <div className="flex flex-col" key={key}>
                              <Link href={slugJoin} className="font-bold text-lg" onClick={transferLink}>{itemChildren.name}</Link>
                              <div className="text-sm text-gray-500">{itemChildren.description}</div>
                            </div>
                          )
                        })}
                      </div>
                    </div>
                    {itemCardByWithCategory && (
                      <div className="bg-[#f6f8fa] p-9 rounded-r-2xl">
                        <ItemCardPost
                          title={itemCardByWithCategory.title}
                          image={itemCardByWithCategory.image}
                          description={itemCardByWithCategory.description}
                          slug={itemCardByWithCategory.slug}
                          createdAt={itemCardByWithCategory.createdAt}
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
        )
      })}
    </div>
  )
}
export default Category